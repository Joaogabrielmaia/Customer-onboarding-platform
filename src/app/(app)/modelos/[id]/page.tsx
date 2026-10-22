import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TemplateEditor, type TemplateDraft } from "@/components/template-editor";
import { Badge, Card, Notice, PageHeader } from "@/components/ui";
import { NotFoundError } from "@/domain/errors";
import { requireUser } from "@/lib/auth";
import { assigneeKindLabel } from "@/lib/labels";
import { getTemplate } from "@/server/services/templates";

export const metadata: Metadata = { title: "Modelo" };

export default async function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const template = await getTemplate(user, id).catch((e) => {
    if (e instanceof NotFoundError) notFound();
    throw e;
  });

  if (user.role === "ADMIN") {
    const draft: TemplateDraft = {
      name: template.name,
      description: template.description ?? "",
      stages: template.stages.map((s) => ({
        name: s.name,
        tasks: s.tasks.map((t) => ({
          title: t.title,
          offsetDays: String(t.offsetDays),
          assigneeKind: t.assigneeKind,
          required: t.required,
          visibleToClient: t.visibleToClient,
        })),
      })),
    };
    return (
      <>
        <PageHeader title={template.name} description="Alterar o modelo não muda as implantações que já foram criadas a partir dele." />
        <TemplateEditor templateId={template.id} initial={draft} />
      </>
    );
  }

  return (
    <>
      <PageHeader title={template.name} description={template.description ?? undefined} />
      <Notice tone="neutral">Somente administradores editam modelos.</Notice>
      <div className="mt-4 space-y-4">
        {template.stages.map((stage) => (
          <Card key={stage.id}>
            <h2 className="mb-2 text-lg font-bold">{stage.name}</h2>
            <ul className="space-y-1 text-sm">
              {stage.tasks.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center justify-between gap-2">
                  <span>{t.title}</span>
                  <span className="flex gap-1">
                    <Badge>D+{t.offsetDays}</Badge>
                    <Badge>{assigneeKindLabel[t.assigneeKind]}</Badge>
                    {!t.required && <Badge>opcional</Badge>}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
