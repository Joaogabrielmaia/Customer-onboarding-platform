import { ForbiddenError } from "./errors";
import type { Actor } from "./types";

// Matriz da RN-12 (docs/02-definicao/03-regras-de-negocio.md).
export type Action =
  | "user:manage"
  | "settings:update"
  | "template:manage"
  | "template:read"
  | "client:manage"
  | "deployment:create"
  | "deployment:read"
  | "task:update-status"
  | "task:update-schedule"
  | "comment:create"
  | "portal-link:manage";

export interface Resource {
  /** Implantador responsável pela implantação. */
  deploymentImplementerId?: string;
  /** Usuário a quem a tarefa está atribuída (pode ser nulo). */
  taskAssigneeId?: string | null;
}

const ADMIN_ONLY: Action[] = ["user:manage", "settings:update", "template:manage"];
const ANY_INTERNAL_USER: Action[] = [
  "template:read",
  "client:manage",
  "deployment:create",
  "deployment:read",
  "comment:create",
];

/** Decide se o ator pode executar a ação. Função pura, sem banco. */
export function can(actor: Actor, action: Action, resource: Resource = {}): boolean {
  if (actor.role === "ADMIN") return true;

  if (ADMIN_ONLY.includes(action)) return false;
  if (ANY_INTERNAL_USER.includes(action)) return true;

  const isDeploymentImplementer = resource.deploymentImplementerId === actor.id;
  switch (action) {
    case "task:update-status":
      // Responsável pela implantação ou pela tarefa.
      return isDeploymentImplementer || resource.taskAssigneeId === actor.id;
    case "task:update-schedule":
    case "portal-link:manage":
      return isDeploymentImplementer;
    default:
      return false;
  }
}

/** Lança ForbiddenError se não puder. Todo serviço chama isto primeiro (ADR-006). */
export function assertCan(actor: Actor, action: Action, resource: Resource = {}): void {
  if (!can(actor, action, resource)) {
    throw new ForbiddenError("Você não tem permissão para esta ação.");
  }
}
