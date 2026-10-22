import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { archiveClientAction, unarchiveClientAction } from "@/app/actions/clients";
import { ClientForm } from "@/components/client-form";
import { ActionForm, SubmitButton } from "@/components/form";
import { Badge, Card, LinkButton, Notice, PageHeader } from "@/components/ui";
import { formatBR } from "@/domain/dates";
import { NotFoundError } from "@/domain/errors";
import { requireUser } from "@/lib/auth";
import { getClient } from "@/server/services/clients";

export const metadata: Metadata = { title: "Cliente" };

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const client = await getClient(user, id).catch((e) => {
    if (e instanceof NotFoundError) notFound();
    throw e;
  });

  return (
    <>
      <PageHeader
        title={client.companyName}
        description={client.archivedAt ? "Cliente arquivado." : undefined}
        actions={!client.archivedAt && <LinkButton href={`/implantacoes/nova?cliente=${client.id}`}>Iniciar implantação</LinkButton>}
      />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <h2 className="mb-4 text-lg font-bold">Dados do cliente</h2>
          <ClientForm client={client} />
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-3 text-lg font-bold">Implantações</h2>
            {client.deployments.length === 0 ? (
              <p className="text-slate-700">Este cliente ainda não tem implantação.</p>
            ) : (
              <ul className="space-y-2">
                {client.deployments.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-2">
                    <Link href={`/implantacoes/${d.id}`} className="text-indigo-900 hover:underline">
                      Kickoff {formatBR(d.kickoffDate)}
                    </Link>
                    <Badge tone={d.status === "COMPLETED" ? "success" : "info"}>
                      {d.status === "COMPLETED" ? "Concluída" : "Em andamento"}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 text-lg font-bold">Arquivar</h2>
            {client.archivedAt ? (
              <form action={unarchiveClientAction}>
                <input type="hidden" name="id" value={client.id} />
                <button type="submit" className="rounded-md border border-slate-400 px-4 py-2 font-medium hover:bg-slate-100">Reativar cliente</button>
              </form>
            ) : (
              <ActionForm action={archiveClientAction} submit={<SubmitButton variant="danger" pendingLabel="Arquivando...">Arquivar cliente</SubmitButton>}>
                <input type="hidden" name="id" value={client.id} />
                <Notice tone="neutral">O cliente some das listas, mas o histórico das implantações é mantido. Não é possível arquivar com implantação em andamento.</Notice>
              </ActionForm>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
