import Link from "next/link";
import { formatBR } from "@/domain/dates";
import { categoryLabel } from "@/lib/labels";
import type { DeploymentSummary } from "@/server/services/dashboard";
import { Badge, ProgressBar, type Tone } from "./ui";

const tones: Record<DeploymentSummary["category"], { tone: Tone; border: string }> = {
  LATE: { tone: "danger", border: "border-l-red-700" },
  WAITING_CLIENT: { tone: "warning", border: "border-l-amber-600" },
  ON_TIME: { tone: "success", border: "border-l-emerald-600" },
  COMPLETED: { tone: "neutral", border: "border-l-slate-500" },
};

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Uma implantação na lista do painel e da tela de implantações. O atraso aparece grande e em vermelho. */
export function DeploymentRow({ d }: { d: DeploymentSummary }) {
  const { tone, border } = tones[d.category];
  return (
    <li className={`rounded-lg border border-l-4 border-slate-300 bg-white p-4 shadow-sm ${border}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link href={`/implantacoes/${d.id}`} className="text-lg font-semibold text-indigo-900 underline-offset-2 hover:underline">
          {d.companyName}
        </Link>
        <Badge tone={tone}>{categoryLabel[d.category]}</Badge>
      </div>

      {d.category === "LATE" && (
        <p className="mt-1 text-xl font-bold text-red-800">
          {plural(d.maxTeamDaysLate, "dia", "dias")} de atraso
          <span className="ml-2 text-sm font-medium text-red-900">
            ({plural(d.teamLateCount, "tarefa atrasada", "tarefas atrasadas")})
          </span>
        </p>
      )}
      {d.category === "WAITING_CLIENT" && (
        <p className="mt-1 font-semibold text-amber-900">
          Aguardando o cliente em {plural(d.clientLateCount, "tarefa", "tarefas")}. Não conta como atraso da equipe.
        </p>
      )}
      {d.worstTaskTitle && d.category !== "ON_TIME" && d.category !== "COMPLETED" && (
        <p className="text-sm text-slate-800">Pendência: {d.worstTaskTitle}</p>
      )}

      <div className="mt-2">
        <ProgressBar value={d.progress} label={`Progresso de ${d.companyName}`} />
      </div>
      <p className="mt-2 text-sm text-slate-700">
        Implantador: {d.implementerName} · Kickoff {formatBR(d.kickoffDate)}
        {d.status === "COMPLETED" && d.completedAt && <> · Concluída em {formatBR(d.completedAt)}</>}
        {d.status === "IN_PROGRESS" && d.nextDueDate && <> · Próximo prazo {formatBR(d.nextDueDate)}</>}
      </p>
    </li>
  );
}
