import { beforeAll, describe, expect, it } from "vitest";
import { daysBetween } from "@/domain/dates";
import { ForbiddenError, ValidationError } from "@/domain/errors";
import { db } from "@/server/db";
import { getDashboard, getMyQueue, listDeploymentSummaries } from "@/server/services/dashboard";
import { updateSettings } from "@/server/services/settings";
import { NOW, resetWithSeed, type Seeded } from "./helpers";

let s: Seeded;
beforeAll(async () => {
  s = await resetWithSeed();
});

// TC-17 a TC-22, TC-29 (RF-11, RF-12, RF-13, RF-18)
describe("painel", () => {
  it("conta em andamento, atrasadas, aguardando cliente e concluídas (US-09 CA1)", async () => {
    const dash = await getDashboard(s.camila, {}, NOW);
    expect(dash.counts).toEqual({ inProgress: 5, late: 2, waitingClient: 1, completed: 2 });
  });

  it("destaca as atrasadas da equipe, a mais atrasada primeiro, depois a espera do cliente (US-09 CA2, CA3)", async () => {
    const dash = await getDashboard(s.camila, {}, NOW);
    expect(dash.attention.map((d) => d.companyName)).toEqual([
      "Atacado Serra Azul",
      "Distribuidora Santa Rita Alimentos",
      "Bebidas Vale Verde",
    ]);
    const [serraAzul, santaRita, valeVerde] = dash.attention;
    expect(serraAzul!.maxTeamDaysLate).toBeGreaterThan(santaRita!.maxTeamDaysLate);
    expect(santaRita!.maxTeamDaysLate).toBeGreaterThanOrEqual(5);
    expect(santaRita!.worstTaskTitle).toBe("Parametrização fiscal");
    expect(santaRita!.implementerName).toBe("Diego Ferreira");
    // Espera do cliente não conta como atraso da equipe (RN-03).
    expect(valeVerde).toMatchObject({ category: "WAITING_CLIENT", teamLateCount: 0 });
    expect(valeVerde!.clientLateCount).toBeGreaterThan(0);
  });

  it("calcula o tempo médio sobre as concluídas existentes (US-09 CA4, RN-08)", async () => {
    const completed = await db.deployment.findMany({ where: { status: "COMPLETED" } });
    const expected = Math.round(completed.reduce((sum, d) => sum + daysBetween(d.kickoffDate, d.completedAt!), 0) / completed.length);
    const dash = await getDashboard(s.camila, {}, NOW);
    expect(dash.averageDays).toBe(expected);
    expect(dash.averageDays).toBeGreaterThan(0);
  });

  it("filtra por implantador (RF-18)", async () => {
    const dash = await getDashboard(s.camila, { implementerId: s.larissa.id }, NOW);
    expect(dash.counts).toEqual({ inProgress: 2, late: 1, waitingClient: 1, completed: 1 });
    expect(dash.queueByImplementer.map((q) => q.name)).toEqual(["Larissa Prado"]);
  });

  it("filtra a lista por situação e por cliente (TC-29)", async () => {
    const late = await listDeploymentSummaries(s.diego, { status: "late" }, NOW);
    expect(late.map((d) => d.category)).toEqual(["LATE", "LATE"]);
    expect(await listDeploymentSummaries(s.diego, { status: "completed" }, NOW)).toHaveLength(2);
    expect(await listDeploymentSummaries(s.diego, { status: "waiting_client" }, NOW)).toHaveLength(1);
    expect(await listDeploymentSummaries(s.diego, { clientId: s.clients.horizonte }, NOW)).toHaveLength(1);
  });

  it("mostra a fila de pendências por implantador, com as atrasadas contadas", async () => {
    const { queueByImplementer } = await getDashboard(s.camila, {}, NOW);
    const diego = queueByImplementer.find((q) => q.name === "Diego Ferreira")!;
    expect(diego.open).toBeGreaterThan(diego.late);
    expect(diego.late).toBeGreaterThan(0);
  });

  it("monta a fila do usuário com as mais atrasadas primeiro (TC-20, US-10 CA1)", async () => {
    const queue = await getMyQueue(s.diego, NOW);
    expect(queue.length).toBeGreaterThan(0);
    expect(queue[0]!.lateness).not.toBeNull();
    const lateDays = queue.filter((q) => q.lateness).map((q) => q.lateness!.daysLate);
    expect(lateDays).toEqual([...lateDays].sort((a, b) => b - a));
    // Depois das atrasadas, vêm as que vencem em seguida, em ordem de prazo.
    const notLate = queue.filter((q) => !q.lateness).map((q) => q.dueDate.getTime());
    expect(notLate).toEqual([...notLate].sort((a, b) => a - b));
    // Só tarefas abertas e só as do próprio usuário.
    const rows = await db.deploymentTask.findMany({ where: { id: { in: queue.map((q) => q.id) } } });
    expect(rows.every((r) => r.assigneeId === s.diego.id && r.status !== "DONE")).toBe(true);
  });
});

// TC-21 e TC-22 (RF-13)
describe("regra de atraso configurável", () => {
  it("a tolerância muda o que é atraso (US-11 CA1)", async () => {
    const [santaRita] = (await listDeploymentSummaries(s.camila, {}, NOW)).filter((d) => d.companyName.includes("Santa Rita"));
    const days = santaRita!.maxTeamDaysLate;

    await updateSettings(s.camila, { overdueToleranceDays: days, portalLinkDays: 60 });
    const atTolerance = await listDeploymentSummaries(s.camila, {}, NOW);
    expect(atTolerance.find((d) => d.companyName.includes("Santa Rita"))!.category).not.toBe("LATE");

    await updateSettings(s.camila, { overdueToleranceDays: days - 1, portalLinkDays: 60 });
    const belowTolerance = await listDeploymentSummaries(s.camila, {}, NOW);
    expect(belowTolerance.find((d) => d.companyName.includes("Santa Rita"))!.category).toBe("LATE");

    await updateSettings(s.camila, { overdueToleranceDays: 0, portalLinkDays: 60 });
  });

  it("só o admin altera a configuração e a mudança é auditada (US-11 CA2)", async () => {
    await expect(updateSettings(s.diego, { overdueToleranceDays: 3, portalLinkDays: 60 })).rejects.toBeInstanceOf(ForbiddenError);
    await updateSettings(s.camila, { overdueToleranceDays: 2, portalLinkDays: 45 });
    const entries = await db.auditLog.findMany({ where: { action: "SETTINGS_CHANGED" }, orderBy: { createdAt: "desc" }, take: 2 });
    expect(entries.map((e) => `${e.field}:${e.oldValue}>${e.newValue}`).sort()).toEqual([
      "overdueToleranceDays:0>2",
      "portalLinkDays:60>45",
    ]);
    await updateSettings(s.camila, { overdueToleranceDays: 0, portalLinkDays: 60 });
  });

  it("recusa valores fora do limite", async () => {
    await expect(updateSettings(s.camila, { overdueToleranceDays: -1, portalLinkDays: 60 })).rejects.toBeInstanceOf(ValidationError);
    await expect(updateSettings(s.camila, { overdueToleranceDays: 1, portalLinkDays: 0 })).rejects.toBeInstanceOf(ValidationError);
  });
});
