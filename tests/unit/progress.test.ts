import { describe, expect, it } from "vitest";
import { parseCivil } from "@/domain/dates";
import {
  averageDeploymentDays,
  computeProgress,
  deploymentLateness,
  isDeploymentComplete,
  sortPendingQueue,
  taskLateness,
} from "@/domain/progress";
import type { AssigneeKind, TaskStatus } from "@/domain/types";

const d = parseCivil;
const task = (
  due: string,
  status: TaskStatus = "PENDING",
  assigneeKind: AssigneeKind = "IMPLEMENTER",
) => ({ dueDate: d(due), status, assigneeKind });

describe("taskLateness (RN-02, RN-03)", () => {
  const today = d("2026-03-10");

  it("não é atraso no próprio dia do prazo", () => {
    expect(taskLateness(task("2026-03-10"), today, 0)).toBeNull();
  });

  it("é atraso da equipe um dia depois do prazo", () => {
    expect(taskLateness(task("2026-03-09"), today, 0)).toEqual({ kind: "TEAM", daysLate: 1 });
  });

  it("respeita a tolerância: só atrasa quando passa dela (US-11 CA1)", () => {
    // prazo 05/03, tolerância 2 dias
    expect(taskLateness(task("2026-03-05"), d("2026-03-06"), 2)).toBeNull(); // 1 dia
    expect(taskLateness(task("2026-03-05"), d("2026-03-07"), 2)).toBeNull(); // 2 dias
    expect(taskLateness(task("2026-03-05"), d("2026-03-08"), 2)).toEqual({ kind: "TEAM", daysLate: 3 });
  });

  it("separa o atraso do cliente: aguardando cliente (RN-03)", () => {
    expect(taskLateness(task("2026-03-05", "WAITING_CLIENT"), today, 0)).toEqual({
      kind: "CLIENT",
      daysLate: 5,
    });
  });

  it("separa o atraso do cliente: tarefa de responsabilidade do cliente", () => {
    expect(taskLateness(task("2026-03-05", "PENDING", "CLIENT"), today, 0)?.kind).toBe("CLIENT");
  });

  it("tarefas concluídas ou não aplicáveis nunca atrasam", () => {
    expect(taskLateness(task("2026-01-01", "DONE"), today, 0)).toBeNull();
    expect(taskLateness(task("2026-01-01", "NOT_APPLICABLE"), today, 0)).toBeNull();
  });
});

describe("computeProgress (RN-05)", () => {
  const s = (status: TaskStatus) => ({ status });

  it("é 0 sem tarefas", () => {
    expect(computeProgress([])).toBe(0);
  });

  it("arredonda para inteiro", () => {
    expect(computeProgress([s("DONE"), s("PENDING"), s("PENDING")])).toBe(33);
    expect(computeProgress([s("DONE"), s("DONE"), s("PENDING")])).toBe(67);
  });

  it("não conta tarefas não aplicáveis", () => {
    expect(computeProgress([s("DONE"), s("PENDING"), s("NOT_APPLICABLE")])).toBe(50);
  });

  it("chega a 100", () => {
    expect(computeProgress([s("DONE"), s("DONE")])).toBe(100);
  });
});

describe("isDeploymentComplete (RN-06)", () => {
  const s = (status: TaskStatus) => ({ status });

  it("conclui quando todas, exceto não aplicáveis, estão concluídas", () => {
    expect(isDeploymentComplete([s("DONE"), s("NOT_APPLICABLE"), s("DONE")])).toBe(true);
  });

  it("não conclui com tarefa em aberto", () => {
    expect(isDeploymentComplete([s("DONE"), s("IN_PROGRESS")])).toBe(false);
  });

  it("não conclui sem tarefas", () => {
    expect(isDeploymentComplete([])).toBe(false);
  });
});

describe("deploymentLateness (RN-04)", () => {
  it("conta separado atraso da equipe e do cliente", () => {
    const today = d("2026-03-10");
    const result = deploymentLateness(
      [
        task("2026-03-05"), // equipe, 5 dias
        task("2026-03-08"), // equipe, 2 dias
        task("2026-03-01", "WAITING_CLIENT"), // cliente
        task("2026-03-20"), // no prazo
        task("2026-03-01", "DONE"), // concluída
      ],
      today,
      0,
    );
    expect(result).toEqual({ teamLateCount: 2, clientLateCount: 1, maxTeamDaysLate: 5 });
  });

  it("não marca como atrasada uma implantação só com espera do cliente", () => {
    const result = deploymentLateness([task("2026-03-01", "WAITING_CLIENT")], d("2026-03-10"), 0);
    expect(result.teamLateCount).toBe(0);
  });
});

describe("averageDeploymentDays (RN-08)", () => {
  it("devolve null sem implantações concluídas", () => {
    expect(averageDeploymentDays([])).toBeNull();
  });

  it("calcula a média em dias, arredondada", () => {
    const avg = averageDeploymentDays([
      { kickoffDate: d("2026-01-05"), completedAt: d("2026-02-04") }, // 30
      { kickoffDate: d("2026-01-12"), completedAt: d("2026-02-26") }, // 45
    ]);
    expect(avg).toBe(38); // 37,5 arredonda para 38
  });
});

describe("sortPendingQueue (RF-12)", () => {
  it("coloca as mais atrasadas primeiro, depois as que vencem antes", () => {
    const today = d("2026-03-10");
    const a = { ...task("2026-03-08"), id: "a" }; // 2 dias de atraso
    const b = { ...task("2026-03-02"), id: "b" }; // 8 dias de atraso
    const c = { ...task("2026-03-12"), id: "c" }; // vence em 2 dias
    const e = { ...task("2026-03-11"), id: "e" }; // vence em 1 dia
    const done = { ...task("2026-03-01", "DONE"), id: "x" };
    const ordered = sortPendingQueue([c, a, done, e, b], today, 0).map((t) => t.id);
    expect(ordered).toEqual(["b", "a", "e", "c"]);
  });
});
