"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/action-state";
import { requireUser } from "@/lib/auth";
import { attempt, formValues } from "@/lib/run-action";
import { updateSettings } from "@/server/services/settings";
import { createUser, resetPassword, setUserActive } from "@/server/services/users";

export async function createUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const values = formValues(formData);
  const failure = await attempt(() => createUser(user, values), { name: values.name ?? "", email: values.email ?? "", role: values.role ?? "" });
  if (failure) return failure;
  revalidatePath("/usuarios");
  return { ok: true, nonce: Date.now() };
}

export async function setUserActiveAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const failure = await attempt(() => setUserActive(user, String(formData.get("userId")), formData.get("active") === "true"));
  if (failure) return failure;
  revalidatePath("/usuarios");
  return { ok: true, nonce: Date.now() };
}

export async function resetPasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const values = formValues(formData);
  const failure = await attempt(() => resetPassword(user, values));
  if (failure) return { ...failure, values: undefined };
  return { ok: true, nonce: Date.now() };
}

export async function updateSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const values = formValues(formData);
  const failure = await attempt(
    () =>
      updateSettings(user, {
        overdueToleranceDays: Number(values.overdueToleranceDays),
        portalLinkDays: Number(values.portalLinkDays),
      }),
    values,
  );
  if (failure) return failure;
  revalidatePath("/", "layout");
  return { ok: true, nonce: Date.now() };
}
