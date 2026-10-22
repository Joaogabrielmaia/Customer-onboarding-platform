import { toCsv } from "@/domain/csv";
import { formatBR, formatCivil } from "@/domain/dates";
import { assertCan } from "@/domain/permissions";
import type { Actor } from "@/domain/types";
import { assigneeKindLabel, categoryLabel, statusLabel } from "@/lib/labels";
import { listDeploymentSummaries, type DeploymentFilters } from "./dashboard";
import { getDeployment } from "./deployments";

export interface CsvFile {
  filename: string;
  content: string;
}

const yesNo = (value: boolean) => (value ? "Sim" : "Não");
const slug = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** v1.1: relatório de uma implantação, uma linha por tarefa. Qualquer usuário interno pode exportar (RN-12). */
export async function exportDeploymentCsv(actor: Actor, id: string, now: Date = new Date()): Promise<CsvFile> {
  assertCan(actor, "deployment:read");
  const d = await getDeployment(actor, id, { now });

  const rows: (string | number | null)[][] = [
    ["Etapa", "Tarefa", "Responsável", "Prazo", "Prazo original", "Status", "Obrigatória", "Visível ao cliente", "Concluída em", "Situação do prazo", "Dias de atraso"],
  ];
  for (const stage of d.stages) {
    for (const task of stage.tasks) {
      const lateness = task.lateness;
      rows.push([
        stage.name,
        task.title,
        task.assigneeKind === "CLIENT" ? assigneeKindLabel.CLIENT : (task.assignee?.name ?? assigneeKindLabel[task.assigneeKind]),
        formatBR(task.dueDate),
        formatBR(task.originalDueDate),
        statusLabel[task.status],
        yesNo(task.required),
        yesNo(task.visibleToClient),
        task.completedAt ? formatBR(task.completedAt) : null,
        lateness ? (lateness.kind === "TEAM" ? "Atrasada (equipe)" : "Atrasada (cliente)") : task.status === "DONE" || task.status === "NOT_APPLICABLE" ? "—" : "No prazo",
        lateness ? lateness.daysLate : 0,
      ]);
    }
  }
  return {
    filename: `implantacao-${slug(d.client.companyName)}-${formatCivil(d.today)}.csv`,
    content: toCsv(rows),
  };
}

/** v1.1: a lista de implantações (respeita os filtros da tela), uma linha por implantação. */
export async function exportDeploymentsCsv(
  actor: Actor,
  filters: DeploymentFilters = {},
  now: Date = new Date(),
): Promise<CsvFile> {
  assertCan(actor, "deployment:read");
  const summaries = await listDeploymentSummaries(actor, filters, now);

  const rows: (string | number | null)[][] = [
    ["Empresa", "Implantador", "Situação", "Progresso (%)", "Kickoff", "Concluída em", "Maior atraso da equipe (dias)", "Tarefas atrasadas (equipe)", "Tarefas atrasadas (cliente)", "Próximo prazo"],
  ];
  for (const s of summaries) {
    rows.push([
      s.companyName,
      s.implementerName,
      categoryLabel[s.category],
      s.progress,
      formatBR(s.kickoffDate),
      s.completedAt ? formatBR(s.completedAt) : null,
      s.maxTeamDaysLate,
      s.teamLateCount,
      s.clientLateCount,
      s.nextDueDate ? formatBR(s.nextDueDate) : null,
    ]);
  }
  return { filename: `implantacoes-${formatCivil(new Date(now))}.csv`, content: toCsv(rows) };
}
