import { beforeAll, describe, expect, it } from "vitest";
import { formatCivil } from "@/domain/dates";
import { ForbiddenError, RuleError, ValidationError } from "@/domain/errors";
import { db } from "@/server/db";
import {
  addComment,
  createDeployment,
  getAuditLog,
  getDeployment,
  updateTaskSchedule,
  updateTaskStatus,
} from "@/server/services/deployments";
import { saveTemplate } from "@/server/services/templates";
import { deploymentOf, NOW, resetWithSeed, type Seeded } from "./helpers";

let s: Seeded;
beforeAll(async () => {
  s = await resetWithSeed();
});

const essentialTemplate = () => db.template.findFirstOrThrow({ where: { name: { contains: "Essencial" } } });

// TC-09 (cálculo, coberto também em unitário) e TC-10 (RF-06)
describe("criar implantação a partir de um modelo", () => {
  it("calcula as datas a partir do kickoff e copia as tarefas (US-05 CA1, CA4)", async () => {
    const template = await essentialTemplate();
    const created = await createDeployment(s.diego, {
      clientId: s.clients.costaLima, templateId: template.id, implementerId: s.diego.id, kickoffDate: "2026-03-02",
    });
    const detail = await getDeployment(s.diego, created.id, { now: NOW });
    const byTitle = Object.fromEntries(detail.stages.flatMap((st) => st.tasks).map((t) => [t.title, t]));

    expect(formatCivil(byTitle["Realizar reunião de kickoff"]!.dueDate)).toBe("2026-03-02");
    expect(formatCivil(byTitle["Receber planilha de produtos"]!.dueDate)).toBe("2026-03-09"); // D+7
    expect(formatCivil(byTitle["Importar produtos e clientes"]!.dueDate)).toBe("2026-03-12"); // D+10
    // RN-09: tarefa do cliente nasce sem usuário interno; a do implantador, com ele.
    expect(byTitle["Receber planilha de produtos"]!.assigneeId).toBeNull();
    expect(byTitle["Receber planilha de produtos"]!.assigneeKind).toBe("CLIENT");
    expect(byTitle["Importar produtos e clientes"]!.assigneeId).toBe(s.diego.id);
    expect(detail.templateName).toBe(template.name);
    expect(detail.status).toBe("IN_PROGRESS");
    expect(detail.progress).toBe(0);
  });

  it("desloca para a segunda-feira o prazo que cairia no fim de semana (US-05 CA2)", async () => {
    const template = await essentialTemplate();
    const created = await createDeployment(s.larissa, {
      clientId: s.clients.armazem, templateId: template.id, implementerId: s.larissa.id, kickoffDate: "2026-03-06", // sexta
    });
    const detail = await getDeployment(s.larissa, created.id, { now: NOW });
    const checklist = detail.stages.flatMap((st) => st.tasks).find((t) => t.title === "Enviar checklist de dados necessários")!;
    expect(formatCivil(checklist.dueDate)).toBe("2026-03-09"); // D+1 seria sábado
    expect(checklist.originalDueDate.getTime()).toBe(checklist.dueDate.getTime());
  });

  it("não é afetada por mudanças posteriores no modelo (US-05 CA3, RN-10)", async () => {
    const template = await essentialTemplate();
    const created = await createDeployment(s.diego, {
      clientId: s.clients.santaRita, templateId: template.id, implementerId: s.diego.id, kickoffDate: "2026-04-06",
    });
    const before = await db.deploymentTask.findMany({ where: { deploymentId: created.id }, orderBy: { position: "asc" } });

    await saveTemplate(s.camila, template.id, {
      name: "Essencial reescrito",
      stages: [{ name: "Nova", tasks: [{ title: "Outra tarefa", offsetDays: 99, assigneeKind: "ADMIN", required: true, visibleToClient: false }] }],
    });

    const after = await db.deploymentTask.findMany({ where: { deploymentId: created.id }, orderBy: { position: "asc" } });
    expect(after.map((t) => t.title)).toEqual(before.map((t) => t.title));
    expect(after.map((t) => formatCivil(t.dueDate))).toEqual(before.map((t) => formatCivil(t.dueDate)));
  });

  it("registra a criação no histórico e valida a entrada", async () => {
    const created = await db.deployment.findFirstOrThrow({ where: { clientId: s.clients.costaLima } });
    const log = await getAuditLog(s.diego, created.id);
    expect(log.map((l) => l.action)).toContain("DEPLOYMENT_CREATED");

    await expect(createDeployment(s.diego, { clientId: "", templateId: "x", implementerId: "y", kickoffDate: "amanhã" })).rejects.toBeInstanceOf(ValidationError);
    const template = await db.template.findFirstOrThrow();
    await expect(
      createDeployment(s.diego, { clientId: "inexistente", templateId: template.id, implementerId: s.diego.id, kickoffDate: "2026-03-02" }),
    ).rejects.toBeInstanceOf(RuleError);
  });
});

// TC-12/13 (RF-07), TC-14 (RF-08), TC-15 (RF-09), TC-16 (RF-10)
describe("tarefas, comentários e histórico", () => {
  let tasks: Awaited<ReturnType<typeof deploymentOf>>["tasks"];
  let deploymentId: string;

  beforeAll(async () => {
    const d = await deploymentOf("Pão e Prosa");
    tasks = d.tasks;
    deploymentId = d.id;
  });

  const find = (title: string) => tasks.find((t) => t.title === title)!;

  it("o responsável muda o status e a mudança é auditada com autor, antes e depois (US-06 CA1)", async () => {
    const task = find("Receber planilha de produtos");
    await updateTaskStatus(s.diego, { taskId: task.id, status: "WAITING_CLIENT" }, { now: NOW });
    const fresh = await db.deploymentTask.findUniqueOrThrow({ where: { id: task.id } });
    expect(fresh.status).toBe("WAITING_CLIENT");

    const [last] = await getAuditLog(s.diego, deploymentId);
    expect(last).toMatchObject({
      action: "TASK_STATUS_CHANGED", actorId: s.diego.id, field: task.title, oldValue: "PENDING", newValue: "WAITING_CLIENT",
    });
  });

  it("nega a quem não é responsável pela implantação nem pela tarefa (US-06 CA4)", async () => {
    const task = find("Importar produtos e clientes");
    await expect(updateTaskStatus(s.larissa, { taskId: task.id, status: "DONE" }, { now: NOW })).rejects.toBeInstanceOf(ForbiddenError);
    await expect(updateTaskStatus(s.patricia, { taskId: task.id, status: "DONE" }, { now: NOW })).rejects.toBeInstanceOf(ForbiddenError);
    expect((await db.deploymentTask.findUniqueOrThrow({ where: { id: task.id } })).status).toBe("PENDING");
  });

  it("recusa 'não aplicável' em tarefa obrigatória e aceita em opcional (US-06 CA3, RN-07)", async () => {
    await expect(
      updateTaskStatus(s.diego, { taskId: find("Parametrização fiscal básica").id, status: "NOT_APPLICABLE" }, { now: NOW }),
    ).rejects.toThrow("Tarefa obrigatória não pode ser marcada como não aplicável.");
    await expect(
      updateTaskStatus(s.diego, { taskId: find("Acompanhamento da primeira semana").id, status: "NOT_APPLICABLE" }, { now: NOW }),
    ).resolves.toBeUndefined();
  });

  it("rejeita status inválido (TC-31)", async () => {
    await expect(updateTaskStatus(s.diego, { taskId: find("Treinamento geral").id, status: "FEITO" }, { now: NOW })).rejects.toBeInstanceOf(ValidationError);
  });

  it("exige motivo para mudar o prazo e registra data anterior, nova, motivo e autor (US-07)", async () => {
    const task = find("Treinamento geral");
    const newDue = formatCivil(new Date(task.dueDate.getTime() + 4 * 86400000));
    await expect(updateTaskSchedule(s.diego, { taskId: task.id, dueDate: newDue })).rejects.toThrow("Informe o motivo");

    await updateTaskSchedule(s.diego, { taskId: task.id, dueDate: newDue, reason: "Cliente pediu para treinar na semana seguinte" });
    const fresh = await db.deploymentTask.findUniqueOrThrow({ where: { id: task.id } });
    expect(formatCivil(fresh.dueDate)).toBe(newDue);
    expect(formatCivil(fresh.originalDueDate)).toBe(formatCivil(task.dueDate)); // o original é preservado

    const entry = (await getAuditLog(s.diego, deploymentId)).find((l) => l.action === "TASK_DUE_DATE_CHANGED")!;
    expect(entry).toMatchObject({
      actorId: s.diego.id, oldValue: formatCivil(task.dueDate), newValue: newDue, reason: "Cliente pediu para treinar na semana seguinte",
    });
  });

  it("recusa o ajuste que não muda nada, em vez de dizer que salvou", async () => {
    const task = find("Treinamento geral");
    const current = await db.deploymentTask.findUniqueOrThrow({ where: { id: task.id } });
    await expect(
      updateTaskSchedule(s.diego, { taskId: task.id, dueDate: formatCivil(current.dueDate), assigneeId: current.assigneeId ?? undefined }),
    ).rejects.toThrow("Nenhuma alteração para salvar");
  });

  it("só o responsável pela implantação (ou o admin) ajusta prazo e responsável", async () => {
    const task = find("Treinamento geral");
    await expect(updateTaskSchedule(s.larissa, { taskId: task.id, assigneeId: s.larissa.id })).rejects.toBeInstanceOf(ForbiddenError);
    await expect(updateTaskSchedule(s.diego, { taskId: task.id })).rejects.toThrow("Informe o novo prazo ou o novo responsável.");
  });

  it("troca o responsável da tarefa e audita; tarefa do cliente não aceita responsável interno", async () => {
    const task = find("Treinamento geral");
    await updateTaskSchedule(s.diego, { taskId: task.id, assigneeId: s.larissa.id });
    expect((await db.deploymentTask.findUniqueOrThrow({ where: { id: task.id } })).assigneeId).toBe(s.larissa.id);
    const entry = (await getAuditLog(s.diego, deploymentId)).find((l) => l.action === "TASK_ASSIGNEE_CHANGED")!;
    expect(entry).toMatchObject({ oldValue: "Diego Ferreira", newValue: "Larissa Prado" });

    // Agora a Larissa é responsável pela tarefa e pode alterar o status dela (RN-12).
    await expect(updateTaskStatus(s.larissa, { taskId: task.id, status: "IN_PROGRESS" }, { now: NOW })).resolves.toBeUndefined();

    await expect(
      updateTaskSchedule(s.diego, { taskId: find("Receber planilha de produtos").id, assigneeId: s.diego.id }),
    ).rejects.toThrow("Tarefa do cliente não tem responsável interno.");
  });

  it("qualquer usuário interno comenta; o comentário entra no histórico (US-08 CA1, CA2)", async () => {
    const task = find("Parametrização fiscal básica");
    const comment = await addComment(s.patricia, { taskId: task.id, body: "  O cliente pediu para incluir o módulo de entregas.  " });
    expect(comment.body).toBe("O cliente pediu para incluir o módulo de entregas.");
    expect(comment.authorId).toBe(s.patricia.id);
    expect((await getAuditLog(s.diego, deploymentId))[0]).toMatchObject({ action: "COMMENT_ADDED", actorId: s.patricia.id });
    // Comentar não muda o status.
    expect((await db.deploymentTask.findUniqueOrThrow({ where: { id: task.id } })).status).toBe("PENDING");
    await expect(addComment(s.patricia, { taskId: task.id, body: "   " })).rejects.toBeInstanceOf(ValidationError);
  });

  it("mostra o histórico do mais recente ao mais antigo (US-08 CA3)", async () => {
    const log = await getAuditLog(s.diego, deploymentId);
    const times = log.map((l) => l.createdAt.getTime());
    expect(times).toEqual([...times].sort((a, b) => b - a));
  });

  it("concluir a última tarefa conclui a implantação; reabrir uma tarefa a reabre (US-06 CA2, RN-06)", async () => {
    const open = await db.deploymentTask.findMany({ where: { deploymentId, status: { notIn: ["DONE", "NOT_APPLICABLE"] } } });
    for (const task of open) await updateTaskStatus(s.camila, { taskId: task.id, status: "DONE" }, { now: NOW });

    let deployment = await db.deployment.findUniqueOrThrow({ where: { id: deploymentId } });
    expect(deployment.status).toBe("COMPLETED");
    expect(formatCivil(deployment.completedAt!)).toBe("2026-10-22");
    expect((await getAuditLog(s.diego, deploymentId)).map((l) => l.action)).toContain("DEPLOYMENT_COMPLETED");

    await updateTaskStatus(s.camila, { taskId: open[0]!.id, status: "IN_PROGRESS" }, { now: NOW });
    deployment = await db.deployment.findUniqueOrThrow({ where: { id: deploymentId } });
    expect(deployment.status).toBe("IN_PROGRESS");
    expect(deployment.completedAt).toBeNull();
    expect((await getAuditLog(s.diego, deploymentId)).map((l) => l.action)).toContain("DEPLOYMENT_REOPENED");
  });
});
