import type { Metadata } from "next";
import { updateSettingsAction } from "@/app/actions/admin";
import { ActionForm, Field, FormSuccess, SubmitButton } from "@/components/form";
import { Card, PageHeader } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/server/services/settings";

export const metadata: Metadata = { title: "Configurações" };

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSettings();

  return (
    <>
      <PageHeader title="Configurações" />
      <Card className="max-w-xl">
        <h2 className="mb-1 text-lg font-bold">Regra de atraso</h2>
        <p className="mb-4 text-slate-800">
          Uma tarefa só conta como atrasada quando passa do prazo mais a tolerância. Tarefas aguardando o cliente nunca contam como atraso da equipe.
        </p>
        <ActionForm action={updateSettingsAction} submit={<SubmitButton>Salvar configurações</SubmitButton>}>
          <Field name="overdueToleranceDays" label="Tolerância de atraso (dias)" type="number" required defaultValue={String(settings.overdueToleranceDays)} hint="0 = atrasa no dia seguinte ao prazo." />
          <Field name="portalLinkDays" label="Validade do link do cliente (dias)" type="number" required defaultValue={String(settings.portalLinkDays)} />
          <FormSuccess>Configurações salvas.</FormSuccess>
        </ActionForm>
      </Card>
    </>
  );
}
