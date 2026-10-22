import { beforeAll, describe, expect, it } from "vitest";
import { addDays } from "@/domain/dates";
import { ForbiddenError } from "@/domain/errors";
import { computeProgress } from "@/domain/progress";
import { db } from "@/server/db";
import { SEED_PORTAL_TOKEN } from "@/server/seed-data";
import { getAuditLog } from "@/server/services/deployments";
import { createPortalLink, getActivePortalLink, getPortalView, revokePortalLink } from "@/server/services/portal";
import { deploymentOf, NOW, resetWithSeed, type Seeded } from "./helpers";

let s: Seeded;
let santaRitaId: string;
beforeAll(async () => {
  s = await resetWithSeed();
  santaRitaId = (await deploymentOf("Santa Rita")).id;
});

describe("portal do cliente: o que aparece", () => {
  it("mostra empresa, progresso e as próximas pendências (US-13 CA1)", async () => {
    const view = (await getPortalView(SEED_PORTAL_TOKEN, NOW))!;
    const tasks = await db.deploymentTask.findMany({ where: { deploymentId: santaRitaId } });
    expect(view.companyName).toBe("Distribuidora Santa Rita Alimentos");
    expect(view.progress).toBe(computeProgress(tasks));
    expect(view.upcoming.map((t) => t.title)).toContain("Parametrização fiscal");
    expect(view.done.length).toBeGreaterThan(0);
  });

  it("não expõe comentários, histórico nem tarefas internas (US-13 CA2, RN-14)", async () => {
    const view = await getPortalView(SEED_PORTAL_TOKEN, NOW);
    const json = JSON.stringify(view);
    expect(json).not.toContain("Configurar contas a receber");
    expect(json).not.toContain("Revisão interna");
    expect(json).not.toContain("módulo de entregas");
    expect(json).not.toContain("férias");
    expect(json).not.toMatch(/"id"|deploymentId|assigneeId|tokenHash/);
  });

  it("não vaza dados de outros clientes", async () => {
    const json = JSON.stringify(await getPortalView(SEED_PORTAL_TOKEN, NOW));
    for (const other of ["Vale Verde", "Serra Azul", "Horizonte", "Boa Mesa"]) expect(json).not.toContain(other);
  });
});

describe("portal do cliente: link", () => {
  it("responde null, do mesmo jeito, para token inexistente, vazio ou malformado (US-13 CA3)", async () => {
    expect(await getPortalView("token-que-nao-existe", NOW)).toBeNull();
    expect(await getPortalView("", NOW)).toBeNull();
    expect(await getPortalView("../../etc/passwd", NOW)).toBeNull();
  });

  it("deixa de valer depois de expirar", async () => {
    expect(await getPortalView(SEED_PORTAL_TOKEN, addDays(NOW, 364))).not.toBeNull();
    expect(await getPortalView(SEED_PORTAL_TOKEN, addDays(NOW, 366))).toBeNull();
  });

  it("gerar outro link revoga o anterior e guarda só o hash (US-12 CA1, CA2)", async () => {
    const { token, expiresAt } = await createPortalLink(s.diego, santaRitaId, NOW);
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(expiresAt.getTime()).toBe(addDays(NOW, 60).getTime());

    expect(await getPortalView(token, NOW)).not.toBeNull();
    expect(await getPortalView(SEED_PORTAL_TOKEN, NOW)).toBeNull();

    const stored = await db.portalLink.findMany({ where: { deploymentId: santaRitaId } });
    expect(stored.some((l) => l.tokenHash === token)).toBe(false);
    expect(stored.filter((l) => l.revokedAt === null)).toHaveLength(1);
  });

  it("revogar derruba o acesso e a ação fica no histórico (US-12 CA3)", async () => {
    const { token } = await createPortalLink(s.diego, santaRitaId, NOW);
    expect(await getActivePortalLink(s.diego, santaRitaId, NOW)).not.toBeNull();
    await revokePortalLink(s.diego, santaRitaId, NOW);
    expect(await getPortalView(token, NOW)).toBeNull();
    expect(await getActivePortalLink(s.diego, santaRitaId, NOW)).toBeNull();
    const actions = (await getAuditLog(s.diego, santaRitaId)).map((l) => l.action);
    expect(actions).toContain("PORTAL_LINK_CREATED");
    expect(actions).toContain("PORTAL_LINK_REVOKED");
  });

  it("só o responsável pela implantação (ou o admin) gerencia o link", async () => {
    await expect(createPortalLink(s.larissa, santaRitaId, NOW)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(revokePortalLink(s.patricia, santaRitaId, NOW)).rejects.toBeInstanceOf(ForbiddenError);
    await expect(createPortalLink(s.camila, santaRitaId, NOW)).resolves.toBeDefined();
  });
});
