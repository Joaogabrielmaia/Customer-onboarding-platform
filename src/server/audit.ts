import type { AuditAction } from "@/generated/prisma/enums";
import type { Tx } from "./db";

export interface AuditEntry {
  action: AuditAction;
  actorId: string | null;
  deploymentId?: string | null;
  taskId?: string | null;
  field?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  reason?: string | null;
}

// sempre chamada com o tx da própria alteração, pra não existir mudança sem registro

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
