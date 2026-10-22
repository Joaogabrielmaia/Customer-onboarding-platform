"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { requireUser } from "@/lib/auth";
import { buildShareMessage } from "@/lib/labels";
import { attempt, formValues } from "@/lib/run-action";
import { db } from "@/server/db";
import { addComment, createDeployment, updateTaskSchedule, updateTaskStatus } from "@/server/services/deployments";
import { createPortalLink, revokePortalLink } from "@/server/services/portal";

function appBaseUrl(): string {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export async function createDeploymentAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const values = formValues(formData);
  let createdId = "";
  const failure = await attempt(async () => {
    createdId = (await createDeployment(user, values)).id;
  }, values);
  if (failure) return failure;
  revalidatePath("/", "layout");
  redirect(`/implantacoes/${createdId}`);
}

export async function updateTaskStatusAction(formData: FormData) {
  const user = await requireUser();
  await updateTaskStatus(user, { taskId: formData.get("taskId"), status: formData.get("status") });
  revalidatePath("/", "layout");
}

export async function updateTaskScheduleAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const values = formValues(formData);
  const input = {
    taskId: values.taskId,
    // Campos vazios significam "não alterar".
    dueDate: values.dueDate || undefined,
    assigneeId: values.assigneeId || undefined,
    reason: values.reason,
  };
  const failure = await attempt(() => updateTaskSchedule(user, input), values);
  if (failure) return failure;
  revalidatePath("/", "layout");
  return { ok: true, nonce: Date.now() };
}

export async function addCommentAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const values = formValues(formData);
  const failure = await attempt(() => addComment(user, values), values);
  if (failure) return failure;
  revalidatePath("/", "layout");
  return { ok: true, nonce: Date.now() };
}

/** Gera o link do cliente. O endereço completo só existe nesta resposta (ADR-007). */
export async function createPortalLinkAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const deploymentId = String(formData.get("deploymentId") ?? "");
  let result: { url: string; message: string; expiresAt: string } | undefined;
  const failure = await attempt(async () => {
    const { token, expiresAt } = await createPortalLink(user, deploymentId);
    const deployment = await db.deployment.findUniqueOrThrow({ where: { id: deploymentId }, include: { client: true } });
    const url = `${appBaseUrl()}/p/${token}`;
    result = { url, message: buildShareMessage(deployment.client.companyName, url), expiresAt: expiresAt.toISOString() };
  });
  if (failure || !result) return failure ?? { error: "Não foi possível gerar o link.", nonce: Date.now() };
  revalidatePath(`/implantacoes/${deploymentId}`);
  return { ok: true, data: result, nonce: Date.now() };
}

export async function revokePortalLinkAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const deploymentId = String(formData.get("deploymentId") ?? "");
  const failure = await attempt(() => revokePortalLink(user, deploymentId));
  if (failure) return failure;
  revalidatePath(`/implantacoes/${deploymentId}`);
  return { ok: true, nonce: Date.now() };
}
