"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { requireUser } from "@/lib/auth";
import { attempt, formValues } from "@/lib/run-action";
import { archiveClient, createClient, unarchiveClient, updateClient } from "@/server/services/clients";

/** Cria (sem `id`) ou edita o cliente. */
export async function saveClientAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const { id, ...values } = formValues(formData);
  const failure = await attempt(() => (id ? updateClient(user, id, values) : createClient(user, values)), values);
  if (failure) return failure;
  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function archiveClientAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const failure = await attempt(() => archiveClient(user, id));
  if (failure) return failure;
  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function unarchiveClientAction(formData: FormData) {
  const user = await requireUser();
  await unarchiveClient(user, String(formData.get("id") ?? ""));
  revalidatePath("/clientes");
}
