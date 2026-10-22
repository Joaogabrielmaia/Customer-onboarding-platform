import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ActionForm, Field, SubmitButton } from "@/components/form";
import { getCurrentUser } from "@/lib/auth";
import { loginAction } from "../actions/auth";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/");

  return (
    <main id="conteudo" className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-10">
      <h1 className="text-3xl font-bold text-indigo-900">Trilha</h1>
      <p className="mt-1 text-slate-700">Acompanhamento de implantação de clientes</p>

      <div className="mt-6 rounded-lg border border-slate-300 bg-white p-5 shadow-sm">
        <ActionForm action={loginAction} submit={<SubmitButton pendingLabel="Entrando...">Entrar</SubmitButton>}>
          <Field name="email" label="E-mail" type="email" autoComplete="username" required />
          <Field name="password" label="Senha" type="password" autoComplete="current-password" required />
        </ActionForm>
      </div>

    </main>
  );
}
