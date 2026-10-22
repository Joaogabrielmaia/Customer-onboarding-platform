import { addDays, todayCivil } from "@/domain/dates";
import { NotFoundError } from "@/domain/errors";
import { assertCan } from "@/domain/permissions";
import { generatePortalToken, hashPortalToken, isPortalLinkUsable } from "@/domain/portal-token";
import { computeProgress, taskLateness } from "@/domain/progress";
import type { Actor } from "@/domain/types";
import { recordAudit } from "../audit";
import { db } from "../db";
import { getSettings } from "./settings";

async function loadDeploymentForLink(deploymentId: string) {
  const deployment = await db.deployment.findUnique({ where: { id: deploymentId } });
  if (!deployment) throw new NotFoundError("Implantação não encontrada.");
  return deployment;
}

/**
 * US-12 / RF-15: gera um novo link e revoga o anterior (RN-13).
 * O token em texto só existe neste retorno; no banco fica o hash.
 */
export async function createPortalLink(actor: Actor, deploymentId: string, now: Date = new Date()) {
  const deployment = await loadDeploymentForLink(deploymentId);
  assertCan(actor, "portal-link:manage", { deploymentImplementerId: deployment.implementerId });

  const { portalLinkDays } = await getSettings();
  const { token, tokenHash } = generatePortalToken();
  const expiresAt = addDays(now, portalLinkDays);

  await db.$transaction(async (tx) => {
    await tx.portalLink.updateMany({
      where: { deploymentId, revokedAt: null },
      data: { revokedAt: now },
    });
    await tx.portalLink.create({
      data: { deploymentId, tokenHash, expiresAt, createdById: actor.id },
    });
    await recordAudit(tx, { action: "PORTAL_LINK_CREATED", actorId: actor.id, deploymentId });
  });

  return { token, expiresAt };
}

export async function revokePortalLink(actor: Actor, deploymentId: string, now: Date = new Date()) {
  const deployment = await loadDeploymentForLink(deploymentId);
  assertCan(actor, "portal-link:manage", { deploymentImplementerId: deployment.implementerId });

  await db.$transaction(async (tx) => {
    const { count } = await tx.portalLink.updateMany({
      where: { deploymentId, revokedAt: null },
      data: { revokedAt: now },
    });
    if (count > 0) await recordAudit(tx, { action: "PORTAL_LINK_REVOKED", actorId: actor.id, deploymentId });
  });
}

/** Para a tela T08: existe link ativo e até quando vale? Nunca devolve o token. */
export async function getActivePortalLink(actor: Actor, deploymentId: string, now: Date = new Date()) {
  assertCan(actor, "deployment:read");
  const link = await db.portalLink.findFirst({
    where: { deploymentId, revokedAt: null, expiresAt: { gt: now } },
    orderBy: { createdAt: "desc" },
  });
  return link ? { expiresAt: link.expiresAt } : null;
}

export interface PortalTask {
  title: string;
  dueDate: Date;
  status: "PENDING" | "IN_PROGRESS" | "WAITING_CLIENT" | "DONE" | "NOT_APPLICABLE";
  /** A responsabilidade é do cliente. */
  withClient: boolean;
  late: boolean;
}

export interface PortalView {
  companyName: string;
  implementerName: string;
  progress: number;
  completed: boolean;
  kickoffDate: Date;
  withClient: PortalTask[];
  upcoming: PortalTask[];
  done: PortalTask[];
}

/**
 * RF-14 / RN-14: o que o cliente enxerga. Devolve null para qualquer link que não vale
 * (inexistente, expirado ou revogado), sem distinguir os casos (ADR-007).
 * Só saem daqui campos permitidos: nada de comentários, auditoria ou tarefas internas.
 */
export async function getPortalView(token: string, now: Date = new Date()): Promise<PortalView | null> {
  const link = await db.portalLink.findUnique({
    where: { tokenHash: hashPortalToken(token) },
    include: {
      deployment: {
        include: {
          client: { select: { companyName: true } },
          implementer: { select: { name: true } },
          tasks: { orderBy: [{ dueDate: "asc" }, { position: "asc" }] },
        },
      },
    },
  });
  if (!link || !isPortalLinkUsable(link, now)) return null;

  const { deployment } = link;
  const { overdueToleranceDays: tolerance } = await getSettings();
  const today = todayCivil(now);

  const visible = deployment.tasks.filter((t) => t.visibleToClient && t.status !== "NOT_APPLICABLE");
  const toPortalTask = (t: (typeof visible)[number]): PortalTask => ({
    title: t.title,
    dueDate: t.dueDate,
    status: t.status,
    withClient: t.assigneeKind === "CLIENT" || t.status === "WAITING_CLIENT",
    late: taskLateness(t, today, tolerance) !== null,
  });

  const open = visible.filter((t) => t.status !== "DONE").map(toPortalTask);
  return {
    companyName: deployment.client.companyName,
    implementerName: deployment.implementer.name,
    // O progresso considera todas as tarefas, não só as visíveis.
    progress: computeProgress(deployment.tasks),
    completed: deployment.status === "COMPLETED",
    kickoffDate: deployment.kickoffDate,
    withClient: open.filter((t) => t.withClient),
    upcoming: open.filter((t) => !t.withClient).slice(0, 6),
    done: visible.filter((t) => t.status === "DONE").map(toPortalTask),
  };
}
