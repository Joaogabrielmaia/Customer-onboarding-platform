// Tipos mínimos que o domínio precisa. Não dependem do Prisma, só dos enums.
import type { AssigneeKind, Role, TaskStatus } from "@/generated/prisma/enums";

export type { AssigneeKind, Role, TaskStatus };

export interface TaskLike {
  status: TaskStatus;
  assigneeKind: AssigneeKind;
  dueDate: Date;
}

export interface Actor {
  id: string;
  role: Role;
}
