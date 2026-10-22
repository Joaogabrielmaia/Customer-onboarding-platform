import type { Metadata } from "next";
import Link from "next/link";
import { Badge, EmptyState, PageHeader } from "@/components/ui";
import { formatBR } from "@/domain/dates";
import { requireUser } from "@/lib/auth";
import { statusLabel } from "@/lib/labels";
import { getMyQueue } from "@/server/services/dashboard";

export const metadata: Metadata = { title: "Minhas pendências" };

export default async function MyQueuePage() {
  const user = await requireUser();
  const queue = await getMyQueue(user);

  return (
    <>
      <PageHeader title="Minhas pendências" description="Suas tarefas em aberto. As mais atrasadas aparecem primeiro." />
      {queue.length === 0 ? (
        <EmptyState title="Nenhuma pendência">Você não tem tarefas em aberto no momento.</EmptyState>
      ) : (
        <ul className="space-y-3">
          {queue.map((item) => (
            <li
              key={item.id}
              className={`rounded-lg border border-l-4 border-slate-300 bg-white p-4 shadow-sm ${
                item.lateness?.kind === "TEAM" ? "border-l-red-700" : item.lateness ? "border-l-amber-600" : "border-l-emerald-600"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <Badge tone={item.lateness?.kind === "TEAM" ? "danger" : item.lateness ? "warning" : "neutral"}>
                  {statusLabel[item.status]}
                </Badge>
              </div>
              <p className="text-sm text-slate-700">
                <Link href={`/implantacoes/${item.deploymentId}`} className="font-medium text-indigo-900 hover:underline">{item.companyName}</Link>
                {" · "}Prazo {formatBR(item.dueDate)}
              </p>
              {item.lateness && (
                <p className={`mt-1 font-bold ${item.lateness.kind === "TEAM" ? "text-red-800" : "text-amber-900"}`}>
                  {item.lateness.daysLate} {item.lateness.daysLate === 1 ? "dia" : "dias"} de atraso
                  {item.lateness.kind === "CLIENT" && " (do cliente)"}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
