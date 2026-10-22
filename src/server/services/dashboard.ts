import { todayCivil } from "@/domain/dates";
import { assertCan } from "@/domain/permissions";
import {
  averageDeploymentDays,
  computeProgress,
  deploymentLateness,
  sortPendingQueue,
  taskLateness,
} from "@/domain/progress";
import type { Actor } from "@/domain/types";
import { db } from "../db";
import { getSettings } from "./settings";

export type DeploymentCategory = "COMPLETED" | "LATE" | "WAITING_CLIENT" | "ON_TIME";

export interface DeploymentSummary {
  id: string;
  clientId: string;
  companyName: string;
  implementerId: string;
  implementerName: string;
  status: "IN_PROGRESS" | "COMPLETED";
  category: DeploymentCategory;
  kickoffDate: Date;
  completedAt: Date | null;
  progress: number;
  teamLateCount: number;
  clientLateCount: number;
  maxTeamDaysLate: number;
  /** Título da tarefa da equipe mais atrasada (ou da espera do cliente, se não houver atraso da equipe). */
  worstTaskTitle: string | null;
  nextDueDate: Date | null;
}

export interface DeploymentFilters {
  status?: "all" | "in_progress" | "late" | "waiting_client" | "completed";
  implementerId?: string;
  clientId?: string;
}

/** Resumo de cada implantação com atraso e progresso calculados (RF-11, RF-18). */
export async function listDeploymentSummaries(
  actor: Actor,
  filters: DeploymentFilters = {},
  now: Date = new Date(),
): Promise<DeploymentSummary[]> {
  assertCan(actor, "deployment:read");
  const { overdueToleranceDays: tolerance } = await getSettings();
  const today = todayCivil(now);

  const rows = await db.deployment.findMany({
    where: {
      ...(filters.implementerId ? { implementerId: filters.implementerId } : {}),
      ...(filters.clientId ? { clientId: filters.clientId } : {}),
    },
    include: {
      client: { select: { companyName: true } },
      implementer: { select: { name: true } },
      tasks: { select: { title: true, status: true, assigneeKind: true, dueDate: true } },
    },
    orderBy: { kickoffDate: "desc" },
  });

  const summaries = rows.map((row): DeploymentSummary => {
    const lateness = deploymentLateness(row.tasks, today, tolerance);
    const category: DeploymentCategory =
      row.status === "COMPLETED"
        ? "COMPLETED"
        : lateness.teamLateCount > 0
          ? "LATE"
          : lateness.clientLateCount > 0
            ? "WAITING_CLIENT"
            : "ON_TIME";

    const kindToHighlight = lateness.teamLateCount > 0 ? "TEAM" : "CLIENT";
    const worst = row.tasks
      .map((t) => ({ t, l: taskLateness(t, today, tolerance) }))
      .filter((x) => x.l && x.l.kind === kindToHighlight)
      .sort((a, b) => b.l!.daysLate - a.l!.daysLate)[0];

    const openDue = row.tasks
      .filter((t) => t.status !== "DONE" && t.status !== "NOT_APPLICABLE")
      .map((t) => t.dueDate.getTime());

    return {
      id: row.id,
      clientId: row.clientId,
      companyName: row.client.companyName,
      implementerId: row.implementerId,
      implementerName: row.implementer.name,
      status: row.status,
      category,
      kickoffDate: row.kickoffDate,
      completedAt: row.completedAt,
      progress: computeProgress(row.tasks),
      teamLateCount: lateness.teamLateCount,
      clientLateCount: lateness.clientLateCount,
      maxTeamDaysLate: lateness.maxTeamDaysLate,
      worstTaskTitle: worst?.t.title ?? null,
      nextDueDate: openDue.length ? new Date(Math.min(...openDue)) : null,
    };
  });

  return summaries.filter((s) => {
    switch (filters.status) {
      case "in_progress":
        return s.status === "IN_PROGRESS";
      case "late":
        return s.category === "LATE";
      case "waiting_client":
        return s.category === "WAITING_CLIENT";
      case "completed":
        return s.status === "COMPLETED";
      default:
        return true;
    }
  });
}

/** US-09 / RF-11: números do painel. O tempo médio vem só dos dados existentes (RN-08). */
export async function getDashboard(
  actor: Actor,
  filters: { implementerId?: string } = {},
  now: Date = new Date(),
) {
  const summaries = await listDeploymentSummaries(actor, filters, now);
  const inProgress = summaries.filter((s) => s.status === "IN_PROGRESS");
  const late = inProgress.filter((s) => s.category === "LATE").sort((a, b) => b.maxTeamDaysLate - a.maxTeamDaysLate);
  const waiting = inProgress.filter((s) => s.category === "WAITING_CLIENT");
  const onTime = inProgress.filter((s) => s.category === "ON_TIME");
  const completed = summaries.filter((s) => s.status === "COMPLETED");

  const averageDays = averageDeploymentDays(
    completed.flatMap((s) => (s.completedAt ? [{ kickoffDate: s.kickoffDate, completedAt: s.completedAt }] : [])),
  );

  return {
    counts: { inProgress: inProgress.length, late: late.length, waitingClient: waiting.length, completed: completed.length },
    averageDays,
    attention: [...late, ...waiting],
    onTime,
    queueByImplementer: await queueByImplementer(actor, filters.implementerId, now),
  };
}

/** RF-12: quantas pendências cada implantador tem, e quantas estão atrasadas. */
async function queueByImplementer(actor: Actor, implementerId: string | undefined, now: Date) {
  assertCan(actor, "deployment:read");
  const { overdueToleranceDays: tolerance } = await getSettings();
  const today = todayCivil(now);
  const tasks = await db.deploymentTask.findMany({
    where: {
      assigneeId: implementerId ?? { not: null },
      status: { notIn: ["DONE", "NOT_APPLICABLE"] },
      deployment: { status: "IN_PROGRESS" },
    },
    select: { assigneeId: true, status: true, assigneeKind: true, dueDate: true, assignee: { select: { name: true } } },
  });

  const byUser = new Map<string, { userId: string; name: string; open: number; late: number }>();
  for (const task of tasks) {
    const id = task.assigneeId!;
    const entry = byUser.get(id) ?? { userId: id, name: task.assignee?.name ?? "—", open: 0, late: 0 };
    entry.open += 1;
    if (taskLateness(task, today, tolerance)?.kind === "TEAM") entry.late += 1;
    byUser.set(id, entry);
  }
  return [...byUser.values()].sort((a, b) => b.late - a.late || b.open - a.open);
}

/** US-10 / RF-12: as tarefas abertas do próprio usuário, as mais atrasadas primeiro. */
export async function getMyQueue(actor: Actor, now: Date = new Date()) {
  assertCan(actor, "deployment:read");
  const { overdueToleranceDays: tolerance } = await getSettings();
  const today = todayCivil(now);

  const tasks = await db.deploymentTask.findMany({
    where: {
      assigneeId: actor.id,
      status: { notIn: ["DONE", "NOT_APPLICABLE"] },
      deployment: { status: "IN_PROGRESS" },
    },
    include: { deployment: { select: { id: true, client: { select: { companyName: true } } } } },
  });

  return sortPendingQueue(tasks, today, tolerance).map((task) => ({
    id: task.id,
    title: task.title,
    status: task.status,
    dueDate: task.dueDate,
    deploymentId: task.deployment.id,
    companyName: task.deployment.client.companyName,
    lateness: taskLateness(task, today, tolerance),
  }));
}
