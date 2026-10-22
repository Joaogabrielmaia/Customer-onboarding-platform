import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortalLinkPanel } from "@/components/portal-link-panel";
import { CommentForm, ScheduleForm, TaskStatusSelect } from "@/components/task-controls";
import { Badge, Card, PageHeader, ProgressBar } from "@/components/ui";
import { formatBR, formatCivil } from "@/domain/dates";
import { NotFoundError } from "@/domain/errors";
import { can } from "@/domain/permissions";
import { requireUser } from "@/lib/auth";
import { assigneeKindLabel, auditText, statusLabel } from "@/lib/labels";
import { getAuditLog, getDeployment } from "@/server/services/deployments";
import { getActivePortalLink } from "@/server/services/portal";
import { listAssignableUsers } from "@/server/services/users";

export const metadata: Metadata = { title: "Implantação" };

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export default async function DeploymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ aba?: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const { aba } = await searchParams;
  const tab = aba === "historico" ? "historico" : "tarefas";

  const d = await getDeployment(user, id).catch((e) => {
    if (e instanceof NotFoundError) notFound();
    throw e;
  });
  const [audit, activeLink, people] = await Promise.all([
    tab === "historico" ? getAuditLog(user, id) : Promise.resolve([]),
    getActivePortalLink(user, id),
    listAssignableUsers(),
  ]);

  const deploymentResource = { deploymentImplementerId: d.implementerId };
  const canSchedule = can(user, "task:update-schedule", deploymentResource);
  const canManageLink = can(user, "portal-link:manage", deploymentResource);

  return (
    <>
      <PageHeader
        title={d.client.companyName}
        description={
          <>
            Implantador: <strong>{d.implementer.name}</strong> · Kickoff {formatBR(d.kickoffDate)} · Modelo: {d.templateName}
          </>
        }
        actions={
          <>
            <a href={`/implantacoes/${id}/exportar`} className="rounded-md border border-slate-400 bg-white px-4 py-2 font-medium text-slate-900 hover:bg-slate-100">Exportar CSV</a>
          <Badge tone={d.status === "COMPLETED" ? "success" : d.lateness.teamLateCount > 0 ? "danger" : d.lateness.clientLateCount > 0 ? "warning" : "info"}>
            {d.status === "COMPLETED"
              ? `Concluída em ${formatBR(d.completedAt!)}`
              : d.lateness.teamLateCount > 0
                ? `${plural(d.lateness.maxTeamDaysLate, "dia", "dias")} de atraso`
                : d.lateness.clientLateCount > 0
                  ? "Aguardando cliente"
                  : "No prazo"}
          </Badge>
          </>
        }
      />

      <Card className="mb-6">
        <ProgressBar value={d.progress} label="Progresso da implantação" />
        <p className="mt-2 text-sm text-slate-800">
          {d.doneCount} de {d.countedTasks} tarefas concluídas
          {d.lateness.teamLateCount > 0 && <> · <strong className="text-red-800">{plural(d.lateness.teamLateCount, "tarefa atrasada", "tarefas atrasadas")}</strong></>}
          {d.lateness.clientLateCount > 0 && <> · <strong className="text-amber-900">{plural(d.lateness.clientLateCount, "tarefa", "tarefas")} aguardando o cliente</strong></>}
        </p>
      </Card>

      <nav aria-label="Seções da implantação" className="mb-4 flex gap-1 border-b border-slate-300">
        {[
          { key: "tarefas", label: "Tarefas", href: `/implantacoes/${id}` },
          { key: "historico", label: "Histórico", href: `/implantacoes/${id}?aba=historico` },
        ].map((t) => (
          <Link
            key={t.key}
            href={t.href}
            aria-current={tab === t.key ? "page" : undefined}
            className={`-mb-px border-b-2 px-4 py-2 font-medium ${tab === t.key ? "border-indigo-700 text-indigo-950" : "border-transparent text-slate-700 hover:text-slate-950"}`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          {tab === "tarefas" ? (
            <div className="space-y-6">
              {d.stages.map((stage) => (
                <section key={stage.id} aria-labelledby={`etapa-${stage.id}`}>
                  <h2 id={`etapa-${stage.id}`} className="mb-2 text-lg font-bold text-slate-900">{stage.name}</h2>
                  <ul className="space-y-2">
                    {stage.tasks.map((task) => {
                      const resource = { ...deploymentResource, taskAssigneeId: task.assigneeId };
                      const canStatus = can(user, "task:update-status", resource);
                      const lateness = task.lateness;
                      const moved = task.dueDate.getTime() !== task.originalDueDate.getTime();
                      return (
                        <li
                          key={task.id}
                          className={`rounded-lg border border-l-4 border-slate-300 bg-white p-3 ${
                            lateness?.kind === "TEAM" ? "border-l-red-700" : lateness?.kind === "CLIENT" ? "border-l-amber-600" : task.status === "DONE" ? "border-l-emerald-600" : "border-l-slate-400"
                          }`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className={`font-medium ${task.status === "DONE" || task.status === "NOT_APPLICABLE" ? "text-slate-600 line-through" : "text-slate-900"}`}>
                                {task.title}
                              </p>
                              <p className="text-sm text-slate-700">
                                Prazo {formatBR(task.dueDate)}
                                {moved && <> (original {formatBR(task.originalDueDate)})</>}
                                {" · "}
                                {task.assigneeKind === "CLIENT" ? "Responsável: cliente" : `Responsável: ${task.assignee?.name ?? assigneeKindLabel[task.assigneeKind]}`}
                                {!task.required && " · opcional"}
                                {task.visibleToClient ? " · visível ao cliente" : " · interna"}
                              </p>
                            </div>
                            {canStatus ? (
                              <TaskStatusSelect taskId={task.id} title={task.title} status={task.status} required={task.required} />
                            ) : (
                              <Badge>{statusLabel[task.status]}</Badge>
                            )}
                          </div>
                          {lateness && (
                            <p className={`mt-1 font-bold ${lateness.kind === "TEAM" ? "text-red-800" : "text-amber-900"}`}>
                              {plural(lateness.daysLate, "dia", "dias")} de atraso{lateness.kind === "CLIENT" && " (aguardando cliente)"}
                            </p>
                          )}

                          <details className="mt-2">
                            <summary className="cursor-pointer text-sm font-medium text-indigo-900">
                              Detalhes e comentários ({task.comments.length})
                            </summary>
                            <div className="mt-3 space-y-4">
                              {task.comments.length > 0 && (
                                <ul className="space-y-2">
                                  {task.comments.map((c) => (
                                    <li key={c.id} className="rounded-md bg-slate-100 p-2 text-sm">
                                      <p className="whitespace-pre-wrap text-slate-900">{c.body}</p>
                                      <p className="mt-1 text-xs text-slate-700">
                                        {c.author.name} · {c.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" })}
                                      </p>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              <CommentForm taskId={task.id} />
                              {canSchedule && (
                                <div className="border-t border-slate-200 pt-3">
                                  <h3 className="mb-2 text-sm font-semibold">Ajustar prazo ou responsável</h3>
                                  <ScheduleForm
                                    taskId={task.id}
                                    dueDate={formatCivil(task.dueDate)}
                                    assigneeId={task.assigneeId}
                                    canPickAssignee={task.assigneeKind !== "CLIENT"}
                                    people={people}
                                  />
                                </div>
                              )}
                            </div>
                          </details>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          ) : audit.length === 0 ? (
            <p className="text-slate-700">Ainda não há registros.</p>
          ) : (
            <ol className="space-y-2" aria-label="Histórico de alterações">
              {audit.map((entry) => (
                <li key={entry.id} className="rounded-lg border border-slate-300 bg-white p-3">
                  <p className="text-slate-900">{auditText(entry)}</p>
                  <p className="mt-1 text-xs text-slate-700">
                    {entry.actor?.name ?? "Sistema"} · {entry.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" })}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>

        <aside aria-label="Link do cliente">
          <Card>
            <h2 className="mb-2 text-lg font-bold">Link do cliente</h2>
            {canManageLink ? (
              <PortalLinkPanel
                deploymentId={d.id}
                activeUntil={activeLink ? activeLink.expiresAt.toISOString() : null}
                expiresLabel={activeLink ? formatBR(activeLink.expiresAt) : null}
              />
            ) : (
              <p className="text-sm text-slate-800">
                Só o implantador responsável ({d.implementer.name}) ou um administrador gerencia o link do cliente.
                {activeLink && ` Há um link ativo até ${formatBR(activeLink.expiresAt)}.`}
              </p>
            )}
          </Card>
        </aside>
      </div>
    </>
  );
}
