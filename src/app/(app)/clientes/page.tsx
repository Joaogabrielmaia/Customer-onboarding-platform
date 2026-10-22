import type { Metadata } from "next";
import Link from "next/link";
import { Badge, EmptyState, LinkButton, PageHeader } from "@/components/ui";
import { formatBR } from "@/domain/dates";
import { requireUser } from "@/lib/auth";
import { planLabel } from "@/lib/labels";
import { listClients } from "@/server/services/clients";

export const metadata: Metadata = { title: "Clientes" };

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ busca?: string; arquivados?: string }> }) {
  const user = await requireUser();
  const { busca, arquivados } = await searchParams;
  const clients = await listClients(user, { includeArchived: arquivados === "1", search: busca });

  return (
    <>
      <PageHeader title="Clientes" actions={<LinkButton href="/clientes/novo">Novo cliente</LinkButton>} />

      <form method="get" className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="busca" className="mb-1 block text-sm font-medium">Buscar por empresa</label>
          <input id="busca" name="busca" defaultValue={busca ?? ""} className="rounded-md border border-slate-400 bg-white px-3 py-2" />
        </div>
        <label className="flex items-center gap-2 pb-2 text-sm">
          <input type="checkbox" name="arquivados" value="1" defaultChecked={arquivados === "1"} className="size-4" />
          Mostrar arquivados
        </label>
        <button type="submit" className="rounded-md border border-slate-400 bg-white px-4 py-2 font-medium hover:bg-slate-100">Buscar</button>
      </form>

      {clients.length === 0 ? (
        <EmptyState title={busca ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"} action={<LinkButton href="/clientes/novo">Cadastrar cliente</LinkButton>}>
          {busca ? "Tente outro termo de busca." : "Cadastre o primeiro cliente para poder iniciar uma implantação."}
        </EmptyState>
      ) : (
        <div className="relative overflow-x-auto rounded-lg border border-slate-300 bg-white">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Lista de clientes</caption>
            <thead className="bg-slate-100 text-slate-900">
              <tr>
                <th scope="col" className="px-4 py-2">Empresa</th>
                <th scope="col" className="px-4 py-2">Contato</th>
                <th scope="col" className="px-4 py-2">Plano</th>
                <th scope="col" className="px-4 py-2">Contrato</th>
                <th scope="col" className="px-4 py-2"><span className="sr-only">Situação</span></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-t border-slate-200">
                  <td className="px-4 py-2">
                    <Link href={`/clientes/${c.id}`} className="font-medium text-indigo-900 hover:underline">{c.companyName}</Link>
                  </td>
                  <td className="px-4 py-2">{c.contactName}</td>
                  <td className="px-4 py-2">{planLabel[c.plan]}</td>
                  <td className="px-4 py-2">{formatBR(c.contractDate)}</td>
                  <td className="px-4 py-2">{c.archivedAt && <Badge>Arquivado</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
