import type { Metadata } from "next";
import Link from "next/link";
import { DeploymentRow } from "@/components/deployment-row";
import { EmptyState, LinkButton, PageHeader, StatCard } from "@/components/ui";
import { formatBR, todayCivil } from "@/domain/dates";
import { requireUser } from "@/lib/auth";
import { getDashboard } from "@/server/services/dashboard";
import { listAssignableUsers } from "@/server/services/users";

export const metadata: Metadata = { title: "Painel" };

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ implantador?: string }> }) {
  const user = await requireUser();
  const { implantador } = await searchParams;
  const [dash, people] = await Promise.all([
    getDashboard(user, { implementerId: implantador || undefined }),
    listAssignableUsers(),
  ]);
  const total = dash.counts.inProgress + dash.counts.completed;

  return (
    <>
      <PageHeader
        title="Painel"
        description={`O que está atrasado, de quem e há quanto tempo. Calculado para hoje, ${formatBR(todayCivil())}.`}
        actions={<LinkButton href="/implantacoes/nova">Nova implantação</LinkButton>}
      />

      <form method="get" className="mb-6 flex flex-wrap items-end gap-2">
        <div>
          <label htmlFor="implantador" className="mb-1 block text-sm font-medium text-slate-900">Implantador</label>
          <select id="implantador" name="implantador" defaultValue={implantador ?? ""} className="rounded-md border border-slate-400 bg-white px-3 py-2">
            <option value="">Todos</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="rounded-md border border-slate-400 bg-white px-4 py-2 font-medium hover:bg-slate-100">Filtrar</button>
      </form>

      {total === 0 ? (
        <EmptyState
          title="Nenhuma implantação ainda"
          action={<LinkButton href="/implantacoes/nova">Criar a primeira implantação</LinkButton>}
        >
          Quando você criar uma implantação a partir de um modelo, ela aparece aqui com o progresso e os prazos.
        </EmptyState>
      ) : (
        <>
          <section aria-label="Indicadores" className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <StatCard label="Em andamento" value={dash.counts.inProgress} tone="info" />
            <StatCard label="Atrasadas (equipe)" value={dash.counts.late} tone="danger" />
            <StatCard label="Aguardando cliente" value={dash.counts.waitingClient} tone="warning" />
            <StatCard label="Concluídas" value={dash.counts.completed} tone="success" />
            <StatCard
              label="Tempo médio de implantação"
              value={dash.averageDays === null ? "—" : `${dash.averageDays} dias`}
              note="Só sobre as concluídas dos dados de demonstração"
            />
          </section>

          <section className="mt-8" aria-labelledby="atencao">
            <h2 id="atencao" className="mb-3 text-lg font-bold text-slate-900">Atenção primeiro</h2>
            {dash.attention.length === 0 ? (
              <p className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-900">
                Nada atrasado nem aguardando cliente neste momento.
              </p>
            ) : (
              <ul className="space-y-3">{dash.attention.map((d) => <DeploymentRow key={d.id} d={d} />)}</ul>
            )}
          </section>

          {dash.onTime.length > 0 && (
            <section className="mt-8" aria-labelledby="no-prazo">
              <h2 id="no-prazo" className="mb-3 text-lg font-bold text-slate-900">Em andamento no prazo</h2>
              <ul className="space-y-3">{dash.onTime.map((d) => <DeploymentRow key={d.id} d={d} />)}</ul>
            </section>
          )}

          <section className="mt-8" aria-labelledby="fila">
            <h2 id="fila" className="mb-3 text-lg font-bold text-slate-900">Pendências por implantador</h2>
            {dash.queueByImplementer.length === 0 ? (
              <p className="text-slate-700">Nenhuma pendência aberta.</p>
            ) : (
              <div className="relative overflow-x-auto rounded-lg border border-slate-300 bg-white">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Tarefas abertas e atrasadas por implantador</caption>
                  <thead className="bg-slate-100 text-slate-900">
                    <tr>
                      <th scope="col" className="px-4 py-2">Implantador</th>
                      <th scope="col" className="px-4 py-2">Abertas</th>
                      <th scope="col" className="px-4 py-2">Atrasadas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dash.queueByImplementer.map((q) => (
                      <tr key={q.userId} className="border-t border-slate-200">
                        <td className="px-4 py-2">
                          <Link href={`/?implantador=${q.userId}`} className="font-medium text-indigo-900 hover:underline">{q.name}</Link>
                        </td>
                        <td className="px-4 py-2">{q.open}</td>
                        <td className={`px-4 py-2 ${q.late > 0 ? "font-bold text-red-800" : ""}`}>{q.late}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}
