import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgressBar } from "@/components/ui";
import { formatBR } from "@/domain/dates";
import { getPortalView, type PortalTask } from "@/server/services/portal";

// O link é um segredo: não indexar e não guardar em cache.
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Acompanhe sua implantação",
  robots: { index: false, follow: false },
};

function TaskItem({ task }: { task: PortalTask }) {
  return (
    <li className="flex items-start justify-between gap-3 rounded-lg border border-slate-300 bg-white p-3">
      <span className="text-slate-900">{task.title}</span>
      <span className={`shrink-0 text-sm font-semibold ${task.late ? "text-red-800" : "text-slate-800"}`}>
        {task.status === "DONE" ? "Concluída" : `até ${formatBR(task.dueDate)}`}
        {task.late && " (atrasada)"}
      </span>
    </li>
  );
}

export default async function PortalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const view = await getPortalView(token);
  if (!view) notFound();

  return (
    <main id="conteudo" className="mx-auto max-w-xl px-4 py-6">
      <p className="text-sm font-medium text-slate-700">Rota Fácil Software</p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">Implantação de {view.companyName}</h1>
      <p className="mt-1 text-slate-700">Início em {formatBR(view.kickoffDate)} · seu implantador: {view.implementerName}</p>

      <section aria-labelledby="progresso" className="mt-5 rounded-lg border border-slate-300 bg-white p-4">
        <h2 id="progresso" className="mb-2 font-bold">Andamento</h2>
        <ProgressBar value={view.progress} label="Progresso da implantação" />
        {view.completed && <p className="mt-2 font-semibold text-emerald-900">Implantação concluída. Obrigado!</p>}
      </section>

      {view.withClient.length > 0 && (
        <section aria-labelledby="com-voce" className="mt-6">
          <h2 id="com-voce" className="mb-1 text-lg font-bold text-amber-900">O que depende de você</h2>
          <p className="mb-2 text-sm text-slate-700">Estas etapas aguardam a sua equipe.</p>
          <ul className="space-y-2">{view.withClient.map((t, i) => <TaskItem key={i} task={t} />)}</ul>
        </section>
      )}

      {view.upcoming.length > 0 && (
        <section aria-labelledby="proximas" className="mt-6">
          <h2 id="proximas" className="mb-2 text-lg font-bold">Próximas etapas</h2>
          <ul className="space-y-2">{view.upcoming.map((t, i) => <TaskItem key={i} task={t} />)}</ul>
        </section>
      )}

      {view.done.length > 0 && (
        <details className="mt-6">
          <summary className="cursor-pointer text-lg font-bold">Já concluído ({view.done.length})</summary>
          <ul className="mt-2 space-y-2">{view.done.map((t, i) => <TaskItem key={i} task={t} />)}</ul>
        </details>
      )}

      <p className="mt-8 border-t border-slate-300 pt-4 text-sm text-slate-700">
        Esta página é somente para consulta. Para qualquer dúvida ou para avisar que algo foi enviado, fale com {view.implementerName}.
      </p>
      <p className="mt-2 text-xs text-slate-600">Demonstração de portfólio (caso simulado): empresa, pessoas e dados são fictícios.</p>
    </main>
  );
}
