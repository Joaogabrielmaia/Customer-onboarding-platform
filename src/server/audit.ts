import type { AuditAction } from "@/generated/prisma/enums";
import type { Tx } from "./db";

export interface AuditEntry {
  action: AuditAction;
  actorId: string | null;
  deploymentId?: string | null;
  taskId?: string | null;
  /** Campo ou título da tarefa afetada, em texto legível. */
  field?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  reason?: string | null;
}

/**
 * RN-15 / ADR-005. Sempre chamado com o `tx` da mesma transação da alteração,
 * para que não exista mudança sem registro nem registro sem mudança (RNF-12).
 * A aplicação só insere; não há função de edição nem de exclusão.
 */
export async function recordAudit(tx: Tx, entry: AuditEntry): Promise<void> {
  await tx.auditLog.create({
    data: {
      action: entry.action,
      actorId: entry.actorId,
      deploymentId: entry.deploymentId ?? null,
      taskId: entry.taskId ?? null,
      field: entry.field ?? null,
      oldValue: entry.oldValue ?? null,
      newValue: entry.newValue ?? null,
      reason: entry.reason ?? null,
    },
  });
}
