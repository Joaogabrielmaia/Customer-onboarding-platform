import { beforeAll, describe, expect, it } from "vitest";
import { db } from "@/server/db";
import { listDeploymentSummaries } from "@/server/services/dashboard";
import { NOW, resetWithSeed, type Seeded } from "./helpers";

let s: Seeded;
beforeAll(async () => {
  s = await resetWithSeed();
});

describe("seed", () => {
  it("cria cerca de 8 clientes, 3 modelos e implantações em estados variados (US-14 CA1)", async () => {
    expect(await db.client.count()).toBe(8);
    expect(await db.template.count()).toBe(3);
    const summaries = await listDeploymentSummaries(s.camila, {}, NOW);
    const categories = new Set(summaries.map((d) => d.category));
    expect(categories).toEqual(new Set(["ON_TIME", "LATE", "WAITING_CLIENT", "COMPLETED"]));
  });

  it("deixa um cliente sem implantação, para testar a criação", async () => {
    const withoutDeployment = await db.client.findMany({ where: { deployments: { none: {} } } });
    expect(withoutDeployment.map((c) => c.companyName)).toEqual(["Costa Lima Embalagens e Distribuição"]);
  });

  it("usa só dados claramente fictícios (US-14 CA2)", async () => {
    const clients = await db.client.findMany();
    expect(clients.every((c) => c.cnpj?.startsWith("00.000."))).toBe(true);
    expect(clients.every((c) => c.contactEmail.endsWith(".example"))).toBe(true);
    const users = await db.user.findMany();
    expect(users.every((u) => u.email.endsWith("@rotafacil.example"))).toBe(true);
  });

  it("não guarda senhas em texto", async () => {
    const users = await db.user.findMany();
    expect(users.every((u) => u.passwordHash.startsWith("scrypt$"))).toBe(true);
  });

  it("gera histórico e comentários de exemplo", async () => {
    expect(await db.auditLog.count()).toBeGreaterThan(10);
    expect(await db.comment.count()).toBeGreaterThan(0);
  });

  it("pode ser executado de novo sem duplicar dados", async () => {
    await resetWithSeed();
    expect(await db.client.count()).toBe(8);
    expect(await db.user.count()).toBe(5);
    expect(await db.deployment.count()).toBe(7);
  });
});
