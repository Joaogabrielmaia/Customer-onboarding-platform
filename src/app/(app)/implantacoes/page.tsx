import type { Metadata } from "next";
import { DeploymentRow } from "@/components/deployment-row";
import { EmptyState, LinkButton, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { listDeploymentSummaries, type DeploymentFilters } from "@/server/services/dashboard";
import { listClients } from "@/server/services/clients";
import { listAssignableUsers } from "@/server/services/users";

export const metadata: Metadata = { title: "Implantações" };

const STATUS_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: "in_progress", label: "Em andamento" },
  { value: "late", label: "Atrasadas" },
  { value: "waiting_client", label: "Aguardando cliente" },
  { value: "completed", label: "Concluídas" },
];

export default async function DeploymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ situacao?: string; implantador?: string; cliente?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const filters: DeploymentFilters = {
    status: (STATUS_OPTIONS.some((o) => o.value === params.situacao) ? params.situacao : "all") as DeploymentFilters["status"],
    implementerId: params.implantador || undefined,
    clientId: params.cliente || undefined,
  };
  const [deployments, people, clients] = await Promise.all([
    listDeploymentSummaries(user, filters),
    listAssignableUsers(),
    listClients(user, { includeArchived: true }),
  ]);
  const hasFilters = filters.status !== "all" || filters.implementerId || filters.clientId;

  return (
    <>
      <PageHeader title="Implantações" actions={<LinkButton href="/implantacoes/nova">Nova implantação</LinkButton>} />

      <form method="get" className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="situacao" className="mb-1 block text-sm font-medium">Situação</label>
          <select id="situacao" name="situacao" defaultValue={filters.status} className="rounded-md border border-slate-400 bg-white px-3 py-2">
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="implantador" className="mb-1 block text-sm font-medium">Implantador</label>
          <select id="implantador" name="implantador" defaultValue={filters.implementerId ?? ""} className="rounded-md border border-slate-400 bg-white px-3 py-2">
            <option value="">Todos</option>
            {people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="cliente" className="mb-1 block text-sm font-medium">Cliente</label>
          <select id="cliente" name="cliente" defaultValue={filters.clientId ?? ""} className="max-w-64 rounded-md border border-slate-400 bg-white px-3 py-2">
            <option value="">Todos</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.companyName}</option>)}
          </select>
        </div>
        <button type="submit" className="rounded-md border border-slate-400 bg-white px-4 py-2 font-medium hover:bg-slate-100">Filtrar</button>
      </form>

      {deployments.length === 0 ? (
        <EmptyState
          title={hasFilters ? "Nenhuma implantação com esses filtros" : "Nenhuma implantação ainda"}
          action={hasFilters ? <LinkButton href="/implantacoes" variant="secondary">Limpar filtros</LinkButton> : <LinkButton href="/implantacoes/nova">Criar implantação</LinkButton>}
        />
      ) : (
        <ul className="space-y-3">{deployments.map((d) => <DeploymentRow key={d.id} d={d} />)}</ul>
      )}
    </>
  );
}
