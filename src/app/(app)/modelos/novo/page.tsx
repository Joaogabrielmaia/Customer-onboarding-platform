import type { Metadata } from "next";
import { TemplateEditor } from "@/components/template-editor";
import { PageHeader } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Novo modelo" };

export default async function NewTemplatePage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Novo modelo" description="Defina as etapas e as tarefas. O prazo é o número de dias depois do kickoff (D+n)." />
      <TemplateEditor templateId={null} />
    </>
  );
}
