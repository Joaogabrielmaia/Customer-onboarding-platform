import type { Metadata } from "next";
import Link from "next/link";
import { archiveTemplateAction } from "@/app/actions/templates";
import { ActionForm, SubmitButton } from "@/components/form";
import { Card, EmptyState, LinkButton, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { listTemplates } from "@/server/services/templates";

export const metadata: Metadata = { title: "Modelos" };

export default async function TemplatesPage() {
  const user = await requireUser();
  const templates = await listTemplates(user);
  const isAdmin = user.role === "ADMIN";

  return (
    <>
      <PageHeader
        title="Modelos de implantação"
        description="Cada implantação nasce de um modelo: etapas e tarefas com prazo relativo ao kickoff (D+n)."
        actions={isAdmin && <LinkButton href="/modelos/novo">Novo modelo</LinkButton>}
      />
      {templates.length === 0 ? (
        <EmptyState title="Nenhum modelo cadastrado" action={isAdmin ? <LinkButton href="/modelos/novo">Criar modelo</LinkButton> : undefined}>
          Sem modelo não dá para criar implantações.
        </EmptyState>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {templates.map((t) => {
            const taskCount = t.stages.reduce((n, s) => n + s._count.tasks, 0);
            return (
              <li key={t.id}>
                <Card className="h-full">
                  <h2 className="text-lg font-bold">
                    <Link href={`/modelos/${t.id}`} className="text-indigo-900 hover:underline">{t.name}</Link>
                  </h2>
                  {t.description && <p className="mt-1 text-slate-800">{t.description}</p>}
                  <p className="mt-2 text-sm text-slate-700">{t.stages.length} etapas · {taskCount} tarefas</p>
                  {isAdmin && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <LinkButton href={`/modelos/${t.id}`} variant="secondary">Editar</LinkButton>
                      <ActionForm action={archiveTemplateAction} className="inline" submit={<SubmitButton variant="secondary" pendingLabel="Arquivando...">Arquivar</SubmitButton>}>
                        <input type="hidden" name="id" value={t.id} />
                      </ActionForm>
                    </div>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
