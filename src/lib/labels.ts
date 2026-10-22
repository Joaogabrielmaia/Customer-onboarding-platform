import { formatBR } from "@/domain/dates";
import type { AssigneeKind, AuditAction, Plan, Role, TaskStatus } from "@/generated/prisma/enums";

export const roleLabel: Record<Role, string> = { ADMIN: "Administrador", IMPLEMENTER: "Implantador" };

export const planLabel: Record<Plan, string> = {
  ESSENTIAL: "Essencial",
  PROFESSIONAL: "Profissional",
  NETWORK: "Rede",
};

export const statusLabel: Record<TaskStatus, string> = {
  PENDING: "Pendente",
  IN_PROGRESS: "Em andamento",
  WAITING_CLIENT: "Aguardando cliente",
  DONE: "Concluída",
  NOT_APPLICABLE: "Não aplicável",
};

export const assigneeKindLabel: Record<AssigneeKind, string> = {
  IMPLEMENTER: "Implantador",
  CLIENT: "Cliente",
  ADMIN: "Administrador",
};

export const categoryLabel = {
  COMPLETED: "Concluída",
  LATE: "Atrasada",
  WAITING_CLIENT: "Aguardando cliente",
  ON_TIME: "No prazo",
} as const;

const dateOrRaw = (value: string | null) => {
  if (!value) return "—";
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? formatBR(new Date(`${value}T00:00:00Z`)) : value;
};
const statusOrRaw = (value: string | null) => (value && value in statusLabel ? statusLabel[value as TaskStatus] : (value ?? "—"));

export function auditText(entry: {
  action: AuditAction;
  field: string | null;
  oldValue: string | null;
  newValue: string | null;
  reason: string | null;
}): string {
  const { action, field, oldValue, newValue, reason } = entry;
  switch (action) {
    case "DEPLOYMENT_CREATED":
      return `Implantação criada a partir do modelo "${newValue}".`;
    case "DEPLOYMENT_COMPLETED":
      return "Implantação concluída: todas as tarefas foram finalizadas.";
    case "DEPLOYMENT_REOPENED":
      return "Implantação reaberta porque uma tarefa voltou a ficar em aberto.";
    case "TASK_STATUS_CHANGED":
      return `"${field}": status de ${statusOrRaw(oldValue)} para ${statusOrRaw(newValue)}.`;
    case "TASK_DUE_DATE_CHANGED":
      return `"${field}": prazo de ${dateOrRaw(oldValue)} para ${dateOrRaw(newValue)}.${reason ? ` Motivo: ${reason}` : ""}`;
    case "TASK_ASSIGNEE_CHANGED":
      return `"${field}": responsável de ${oldValue ?? "—"} para ${newValue ?? "—"}.`;
    case "COMMENT_ADDED":
      return `Comentário em "${field}": ${newValue}`;
    case "PORTAL_LINK_CREATED":
      return "Link do cliente gerado (o anterior, se havia, foi revogado).";
    case "PORTAL_LINK_REVOKED":
      return "Link do cliente revogado.";
    case "SETTINGS_CHANGED":
      return `Configuração "${field}" alterada de ${oldValue} para ${newValue}.`;
  }
}

export function buildShareMessage(companyName: string, url: string): string {
  return `Olá! Segue o link para acompanhar a implantação do sistema na ${companyName}. Nele você vê o que já foi feito e o que falta, inclusive o que depende de vocês: ${url}`;
}
