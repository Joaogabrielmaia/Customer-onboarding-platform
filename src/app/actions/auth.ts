"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { ActionState } from "@/lib/action-state";
import { clearSessionCookie, SESSION_COOKIE, setSessionCookie } from "@/lib/auth";
import { attempt, formValues } from "@/lib/run-action";
import { logEvent } from "@/server/log";
import { login, logout } from "@/server/services/auth";

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const values = formValues(formData);
  let session: Awaited<ReturnType<typeof login>> | undefined;
  const failure = await attempt(async () => {
    session = await login({ email: values.email, password: values.password });
  }, { email: values.email ?? "" }); // a senha nunca volta para a tela

  if (failure || !session) {
    logEvent("warn", "login_failed"); // sem e-mail no log (dado pessoal)
    return failure ?? { error: "Não foi possível entrar.", nonce: Date.now() };
  }
  await setSessionCookie(session.token, session.expiresAt);
  logEvent("info", "login_ok", { userId: session.user.id });
  redirect("/");
}

export async function logoutAction() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) await logout(token);
  await clearSessionCookie();
  redirect("/login");
}
