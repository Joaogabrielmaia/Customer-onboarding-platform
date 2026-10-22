import type { Metadata } from "next";
import { NewDeploymentForm } from "@/components/new-deployment-form";
import { Card, EmptyState, LinkButton, PageHeader } from "@/components/ui";
import { formatCivil, todayCivil } from "@/domain/dates";
import { requireUser } from "@/lib/auth";
import { listClients } from "@/server/services/clients";
import { getTemplate, listTemplates } from "@/server/services/templates";
import { listAssignableUsers } from "@/server/services/users";

export const metadata: Metadata = { title: "Nova implantação" };

export default async function NewDeploymentPage({ searchParams }: { searchParams: Promise<{ cliente?: string }> }) {
  const user = await requireUser();
  const { cliente } = await searchParams;
  const [clients, templateList, people] = await Promise.all([listClients(user), listTemplates(user), listAssignableUsers()]);
  const templates = await Promise.all(
    templateList.map(async (t) => {
      const full = await getTemplate(user, t.id);
      return {
        id: full.id,
        name: full.name,
        tasks: full.stages.flatMap((s) => s.tasks.map((task) => ({ title: task.title, offsetDays: task.offsetDays, stageName: s.name }))),
      };
    }),
  );

  if (clients.length === 0 || templates.length === 0) {
    return (
      <>
        <PageHeader title="Nova implantação" />
        <EmptyState
          title={clients.length === 0 ? "Cadastre um cliente primeiro" : "Nenhum modelo disponível"}
          action={
            clients.length === 0 ? (
              <LinkButton href="/clientes/novo">Cadastrar cliente</LinkButton>
            ) : user.role === "ADMIN" ? (
              <LinkButton href="/modelos/novo">Criar modelo</LinkButton>
            ) : undefined
          }
        >
          {clients.length === 0
            ? "Uma implantação precisa de um cliente."
            : "Peça a um administrador para criar um modelo de implantação."}
        </EmptyState>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Nova implantação" description="As tarefas e os prazos nascem do modelo escolhido. Depois de criada, a implantação não muda se o modelo mudar." />
      <Card className="max-w-3xl">
        <NewDeploymentForm
          clients={clients}
          templates={templates}
          people={people}
          defaultClientId={cliente}
          defaultImplementerId={user.id}
          defaultKickoff={formatCivil(todayCivil())}
        />
      </Card>
    </>
  );
}
