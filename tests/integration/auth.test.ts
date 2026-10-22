import { beforeAll, describe, expect, it } from "vitest";
import { RuleError, ValidationError } from "@/domain/errors";
import { db } from "@/server/db";
import { getSessionUser, login, logout } from "@/server/services/auth";
import { setUserActive } from "@/server/services/users";
import { DEMO_ADMIN_PASSWORD, DEMO_IMPLEMENTER_PASSWORD } from "@/server/seed-data";
import { resetWithSeed, type Seeded } from "./helpers";

let s: Seeded;
beforeAll(async () => {
  s = await resetWithSeed();
});

// TC-01 (RF-01, RN-17, RN-18)
describe("login e sessão", () => {
  it("entra com e-mail e senha corretos e a sessão identifica o usuário", async () => {
    const { token, user } = await login({ email: "admin@rotafacil.example", password: DEMO_ADMIN_PASSWORD });
    expect(user.role).toBe("ADMIN");
    const sessionUser = await getSessionUser(token);
    expect(sessionUser?.email).toBe("admin@rotafacil.example");
  });

  it("aceita e-mail com maiúsculas e espaços", async () => {
    const { user } = await login({ email: "  Implantador@RotaFacil.example ", password: DEMO_IMPLEMENTER_PASSWORD });
    expect(user.name).toBe("Diego Ferreira");
  });

  it("guarda só o hash do token da sessão", async () => {
    const { token } = await login({ email: "admin@rotafacil.example", password: DEMO_ADMIN_PASSWORD });
    const rows = await db.session.findMany();
    expect(rows.some((r) => r.tokenHash === token)).toBe(false);
  });

  it("dá a mesma mensagem para senha errada e e-mail inexistente (US-01 CA2)", async () => {
    const wrongPassword = await login({ email: "admin@rotafacil.example", password: "senha-errada-123" }).catch((e) => e);
    const unknownEmail = await login({ email: "ninguem@rotafacil.example", password: "qualquer-senha-123" }).catch((e) => e);
    expect(wrongPassword).toBeInstanceOf(RuleError);
    expect(unknownEmail).toBeInstanceOf(RuleError);
    expect(wrongPassword.message).toBe(unknownEmail.message);
    expect(wrongPassword.message).toBe("E-mail ou senha incorretos.");
  });

  it("recusa usuário desativado com a mesma mensagem (US-01 CA3)", async () => {
    await setUserActive(s.camila, s.larissa.id, false);
    const error = await login({ email: "larissa@rotafacil.example", password: DEMO_IMPLEMENTER_PASSWORD }).catch((e) => e);
    expect(error).toBeInstanceOf(RuleError);
    expect(error.message).toBe("E-mail ou senha incorretos.");
    await setUserActive(s.camila, s.larissa.id, true);
  });

  it("desativar o usuário derruba a sessão que já estava aberta (RN-18)", async () => {
    const { token } = await login({ email: "suporte@rotafacil.example", password: DEMO_IMPLEMENTER_PASSWORD });
    expect(await getSessionUser(token)).not.toBeNull();
    await setUserActive(s.camila, s.patricia.id, false);
    expect(await getSessionUser(token)).toBeNull();
    await setUserActive(s.camila, s.patricia.id, true);
  });

  it("não reconhece sessão expirada nem token inventado", async () => {
    const { token, expiresAt } = await login({ email: "admin@rotafacil.example", password: DEMO_ADMIN_PASSWORD });
    expect(await getSessionUser(token, new Date(expiresAt.getTime() + 1000))).toBeNull();
    expect(await getSessionUser("token-inventado")).toBeNull();
  });

  it("o logout encerra a sessão", async () => {
    const { token } = await login({ email: "admin@rotafacil.example", password: DEMO_ADMIN_PASSWORD });
    await logout(token);
    expect(await getSessionUser(token)).toBeNull();
  });

  it("valida a entrada (TC-31)", async () => {
    await expect(login({ email: "não-é-email", password: "x" })).rejects.toBeInstanceOf(ValidationError);
    await expect(login({ email: "a@b.example", password: "" })).rejects.toBeInstanceOf(ValidationError);
    await expect(login(null)).rejects.toBeInstanceOf(ValidationError);
  });
});
