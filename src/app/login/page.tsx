import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ActionForm, Field, SubmitButton } from "@/components/form";
import { getCurrentUser } from "@/lib/auth";
import { DEMO_ADMIN_PASSWORD, DEMO_IMPLEMENTER_PASSWORD } from "@/server/seed-data";
import { loginAction } from "../actions/auth";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/");
  const showDemo = process.env.DEMO_MODE !== "false";

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

      {showDemo && (
        <aside aria-label="Contas de demonstração" className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-semibold">Demonstração de portfólio (caso simulado)</p>
          <p className="mt-1">Empresa, pessoas e dados são fictícios. Contas públicas para testar:</p>
          <dl className="mt-2 space-y-1">
            <div>
              <dt className="font-medium">Administrador</dt>
              <dd><code>admin@rotafacil.example</code> · <code>{DEMO_ADMIN_PASSWORD}</code></dd>
            </div>
            <div>
              <dt className="font-medium">Implantador</dt>
              <dd><code>implantador@rotafacil.example</code> · <code>{DEMO_IMPLEMENTER_PASSWORD}</code></dd>
            </div>
          </dl>
        </aside>
      )}
    </main>
  );
}
