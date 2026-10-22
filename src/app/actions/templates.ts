"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/action-state";
import { requireUser } from "@/lib/auth";
import { attempt } from "@/lib/run-action";
import { archiveTemplate, saveTemplate } from "@/server/services/templates";

/** O editor de modelos envia a estrutura inteira como objeto (não é um formulário simples). */
export async function saveTemplateAction(id: string | null, payload: unknown): Promise<ActionState & { id?: string }> {
  const user = await requireUser();
  let savedId = id ?? undefined;
  const failure = await attempt(async () => {
    savedId = (await saveTemplate(user, id, payload)).id;
  });
  if (failure) return failure;
  revalidatePath("/modelos");
  return { ok: true, id: savedId, nonce: Date.now() };
}

export async function archiveTemplateAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const failure = await attempt(() => archiveTemplate(user, String(formData.get("id") ?? "")));
  if (failure) return failure;
  revalidatePath("/modelos");
  return { ok: true, nonce: Date.now() };
}
