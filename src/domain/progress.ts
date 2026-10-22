import { daysBetween } from "./dates";
import type { TaskLike } from "./types";

const isOpen = (t: Pick<TaskLike, "status">) => t.status !== "DONE" && t.status !== "NOT_APPLICABLE";

export type Lateness = { kind: "TEAM" | "CLIENT"; daysLate: number } | null;

export function taskLateness(task: TaskLike, today: Date, toleranceDays: number): Lateness {
  if (!isOpen(task)) return null;
  const daysPastDue = daysBetween(task.dueDate, today);
  if (daysPastDue <= toleranceDays) return null;
  // espera do cliente não conta como atraso da equipe
  const fromClient = task.status === "WAITING_CLIENT" || task.assigneeKind === "CLIENT";
  return { kind: fromClient ? "CLIENT" : "TEAM", daysLate: daysPastDue };
}

export function computeProgress(tasks: Pick<TaskLike, "status">[]): number {
  const counted = tasks.filter((t) => t.status !== "NOT_APPLICABLE");
  if (counted.length === 0) return 0;
  const done = counted.filter((t) => t.status === "DONE").length;
  return Math.round((done / counted.length) * 100);
}

export function isDeploymentComplete(tasks: Pick<TaskLike, "status">[]): boolean {
  const counted = tasks.filter((t) => t.status !== "NOT_APPLICABLE");
  return counted.length > 0 && counted.every((t) => t.status === "DONE");
}

export interface DeploymentLateness {
  teamLateCount: number;
  clientLateCount: number;
  maxTeamDaysLate: number;
}

export function deploymentLateness(
  tasks: TaskLike[],
  today: Date,
  toleranceDays: number,
): DeploymentLateness {
  let teamLateCount = 0;
  let clientLateCount = 0;
  let maxTeamDaysLate = 0;
  for (const task of tasks) {
    const lateness = taskLateness(task, today, toleranceDays);
    if (!lateness) continue;
    if (lateness.kind === "TEAM") {
      teamLateCount += 1;
      maxTeamDaysLate = Math.max(maxTeamDaysLate, lateness.daysLate);
    } else {
      clientLateCount += 1;
    }
  }
  return { teamLateCount, clientLateCount, maxTeamDaysLate };
}

export function averageDeploymentDays(
  completed: { kickoffDate: Date; completedAt: Date }[],
): number | null {
  if (completed.length === 0) return null;
  const total = completed.reduce((sum, d) => sum + daysBetween(d.kickoffDate, d.completedAt), 0);
  return Math.round(total / completed.length);
}

export function sortPendingQueue<T extends TaskLike>(
  tasks: T[],
  today: Date,
  toleranceDays: number,
): T[] {
  const daysPastDue = (t: T) => daysBetween(t.dueDate, today);
  const isLate = (t: T) => daysPastDue(t) > toleranceDays;
  return tasks.filter(isOpen).sort((a, b) => {
    const lateA = isLate(a);
    const lateB = isLate(b);
    if (lateA !== lateB) return lateA ? -1 : 1;
    if (lateA) return daysPastDue(b) - daysPastDue(a);
    return a.dueDate.getTime() - b.dueDate.getTime();
  });
}
