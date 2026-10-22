import { beforeAll, describe, expect, it } from "vitest";
import { ForbiddenError, RuleError, ValidationError } from "@/domain/errors";
import { db } from "@/server/db";
import { SEED_USER_PASSWORD } from "@/server/seed-data";
import { login } from "@/server/services/auth";
import { archiveClient, createClient, listClients, updateClient } from "@/server/services/clients";
import { createUser, listUsers, resetPassword, setUserActive } from "@/server/services/users";
import { resetWithSeed, type Seeded } from "./helpers";

let s: Seeded;
beforeAll(async () => {
  s = await resetWithSeed();
});

const newClient = {
  companyName: "Distribuidora Teste Alfa",
  contactName: "Contato Teste",
  contactEmail: "contato@alfa.example",
  plan: "ESSENTIAL",
  contractDate: "2026-10-01",
};

describe("usuários", () => {
  it("o admin cria um usuário que consegue entrar", async () => {
    const user = await createUser(s.camila, {
      name: "Novo Implantador", email: "Novo@RotaFacil.example", role: "IMPLEMENTER", password: "senha-bem-longa-1",
    });
    expect(user.email).toBe("novo@rotafacil.example");
    expect(user).not.toHaveProperty("passwordHash");
    const session = await login({ email: "novo@rotafacil.example", password: "senha-bem-longa-1" });
    expect(session.user.role).toBe("IMPLEMENTER");
  });

  it("guarda a senha com hash, nunca em texto (RNF-03)", async () => {
    const row = await db.user.findUniqueOrThrow({ where: { email: "novo@rotafacil.example" } });
    expect(row.passwordHash.startsWith("scrypt$")).toBe(true);
    expect(row.passwordHash).not.toContain("senha-bem-longa-1");
  });

  it("recusa senha curta (RN-17) e e-mail repetido", async () => {
    await expect(
      createUser(s.camila, { name: "X Y", email: "curta@rotafacil.example", role: "IMPLEMENTER", password: "curta" }),
    ).rejects.toBeInstanceOf(ValidationError);
    await expect(
      createUser(s.camila, { name: "Repetido", email: "implantador@rotafacil.example", role: "IMPLEMENTER", password: "senha-bem-longa-1" }),
    ).rejects.toThrow("Já existe um usuário com este e-mail.");
  });

  it("o implantador não gerencia usuários", async () => {
    await expect(listUsers(s.diego)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(
      createUser(s.diego, { name: "Invasor", email: "invasor@rotafacil.example", role: "ADMIN", password: "senha-bem-longa-1" }),
    ).rejects.toBeInstanceOf(ForbiddenError);
    await expect(setUserActive(s.diego, s.larissa.id, false)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(resetPassword(s.diego, { userId: s.larissa.id, password: "outra-senha-longa-1" })).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("o admin não pode desativar o próprio usuário", async () => {
    await expect(setUserActive(s.camila, s.camila.id, false)).rejects.toBeInstanceOf(RuleError);
  });

  it("redefinir a senha troca o acesso e encerra sessões", async () => {
    await resetPassword(s.camila, { userId: s.diego.id, password: "senha-nova-muito-longa" });
    await expect(login({ email: "implantador@rotafacil.example", password: SEED_USER_PASSWORD })).rejects.toBeInstanceOf(RuleError);
    await expect(login({ email: "implantador@rotafacil.example", password: "senha-nova-muito-longa" })).resolves.toBeDefined();
  });
});

describe("clientes", () => {
  it("cadastra e edita um cliente (US-02 CA1)", async () => {
    const created = await createClient(s.diego, newClient);
    expect(created.companyName).toBe("Distribuidora Teste Alfa");
    expect(created.cnpj).toBeNull();
    const updated = await updateClient(s.diego, created.id, { ...newClient, companyName: "Distribuidora Teste Beta", cnpj: "00.000.099/0001-00" });
    expect(updated.companyName).toBe("Distribuidora Teste Beta");
    expect(updated.cnpj).toBe("00.000.099/0001-00");
  });

  it("devolve a mensagem de cada campo inválido sem gravar nada (US-02 CA2)", async () => {
    const before = await db.client.count();
    const error = await createClient(s.diego, { ...newClient, companyName: "", contactEmail: "x", contractDate: "2026-02-31" }).catch((e) => e);
    expect(error).toBeInstanceOf(ValidationError);
    expect(Object.keys(error.fieldErrors).sort()).toEqual(["companyName", "contactEmail", "contractDate"]);
    expect(await db.client.count()).toBe(before);
  });

  it("não arquiva cliente com implantação em andamento (US-02 CA3, RN-16)", async () => {
    await expect(archiveClient(s.diego, s.clients.santaRita!)).rejects.toThrow(/implantação em andamento/);
  });

  it("arquiva cliente sem implantação em andamento e o esconde da lista", async () => {
    await archiveClient(s.diego, s.clients.costaLima!);
    const names = (await listClients(s.diego)).map((c) => c.companyName);
    expect(names).not.toContain("Costa Lima Embalagens e Distribuição");
    const all = (await listClients(s.diego, { includeArchived: true })).map((c) => c.companyName);
    expect(all).toContain("Costa Lima Embalagens e Distribuição");
  });

  it("arquiva cliente cuja implantação já foi concluída", async () => {
    await expect(archiveClient(s.diego, s.clients.boaMesa!)).resolves.toBeUndefined();
  });
});
