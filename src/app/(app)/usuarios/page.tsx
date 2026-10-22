import type { Metadata } from "next";
import { createUserAction, resetPasswordAction, setUserActiveAction } from "@/app/actions/admin";
import { ActionForm, Field, FormSuccess, SelectField, SubmitButton } from "@/components/form";
import { Badge, Card, PageHeader } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { roleLabel } from "@/lib/labels";
import { listUsers } from "@/server/services/users";

export const metadata: Metadata = { title: "Usuários" };

export default async function UsersPage() {
  const admin = await requireAdmin();
  const users = await listUsers(admin);

  return (
    <>
      <PageHeader title="Usuários" description="Quem acessa a Trilha. Desativar impede o login na hora e mantém o histórico." />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="relative overflow-x-auto rounded-lg border border-slate-300 bg-white">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Usuários internos</caption>
            <thead className="bg-slate-100">
              <tr>
                <th scope="col" className="px-4 py-2">Nome</th>
                <th scope="col" className="px-4 py-2">Papel</th>
                <th scope="col" className="px-4 py-2">Situação</th>
                <th scope="col" className="px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-slate-200 align-top">
                  <td className="px-4 py-2">
                    <p className="font-medium">{u.name}</p>
                    <p className="text-slate-700">{u.email}</p>
                  </td>
                  <td className="px-4 py-2">{roleLabel[u.role]}</td>
                  <td className="px-4 py-2"><Badge tone={u.active ? "success" : "neutral"}>{u.active ? "Ativo" : "Desativado"}</Badge></td>
                  <td className="space-y-2 px-4 py-2">
                    {u.id !== admin.id && (
                      <ActionForm action={setUserActiveAction} className="inline" submit={<SubmitButton variant="secondary" pendingLabel="...">{u.active ? "Desativar" : "Reativar"}</SubmitButton>}>
                        <input type="hidden" name="userId" value={u.id} />
                        <input type="hidden" name="active" value={String(!u.active)} />
                      </ActionForm>
                    )}
                    <details>
                      <summary className="cursor-pointer text-indigo-900">Redefinir senha</summary>
                      <ActionForm action={resetPasswordAction} className="mt-2 space-y-2" submit={<SubmitButton variant="secondary">Salvar nova senha</SubmitButton>}>
                        <input type="hidden" name="userId" value={u.id} />
                        <Field name="password" label="Nova senha" type="password" autoComplete="new-password" hint="Mínimo de 10 caracteres." />
                        <FormSuccess>Senha alterada e sessões encerradas.</FormSuccess>
                      </ActionForm>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Card>
          <h2 className="mb-3 text-lg font-bold">Novo usuário</h2>
          <ActionForm action={createUserAction} resetOnSuccess submit={<SubmitButton>Criar usuário</SubmitButton>}>
            <Field name="name" label="Nome" required />
            <Field name="email" label="E-mail" type="email" required />
            <SelectField name="role" label="Papel" required defaultValue="IMPLEMENTER" options={Object.entries(roleLabel).map(([value, label]) => ({ value, label }))} />
            <Field name="password" label="Senha inicial" type="password" autoComplete="new-password" required hint="Mínimo de 10 caracteres." />
            <FormSuccess>Usuário criado.</FormSuccess>
          </ActionForm>
        </Card>
      </div>
    </>
  );
}
