import { formatCivil, parseCivil, todayCivil } from "@/domain/dates";
import { computeDueDate } from "@/domain/deadlines";
import { NotFoundError, RuleError } from "@/domain/errors";
import { assertCan } from "@/domain/permissions";
import { computeProgress, deploymentLateness, isDeploymentComplete, taskLateness } from "@/domain/progress";
import type { Actor } from "@/domain/types";
import { recordAudit } from "../audit";
import { db } from "../db";
import {
  commentSchema,
  deploymentCreateSchema,
  parseInput,
  taskScheduleSchema,
  taskStatusSchema,
} from "../schemas";
import { getSettings } from "./settings";

type Options = { now?: Date };

export async function createDeployment(actor: Actor, raw: unknown) {
  assertCan(actor, "deployment:create");
  const input = parseInput(deploymentCreateSchema, raw);
  const kickoff = parseCivil(input.kickoffDate);

  const [client, template, implementer] = await Promise.all([
    db.client.findUnique({ where: { id: input.clientId } }),
    db.template.findUnique({
      where: { id: input.templateId },
      include: { stages: { orderBy: { position: "asc" }, include: { tasks: { orderBy: { position: "asc" } } } } },
    }),
    db.user.findUnique({ where: { id: input.implementerId } }),
  ]);
  if (!client || client.archivedAt) throw new RuleError("Escolha um cliente ativo.");
  if (!template || template.archivedAt) throw new RuleError("Escolha um modelo ativo.");
  if (!implementer || !implementer.active) throw new RuleError("Escolha um implantador ativo.");
  if (template.stages.every((s) => s.tasks.length === 0)) throw new RuleError("O modelo não tem tarefas.");

  const adminAssignee =
    actor.role === "ADMIN"
      ? actor.id
      : ((await db.user.findFirst({ where: { role: "ADMIN", active: true }, orderBy: { createdAt: "asc" } }))?.id ?? null);

  return db.$transaction(async (tx) => {
    const deployment = await tx.deployment.create({
      data: {
        clientId: client.id,
        templateId: template.id,
        templateName: template.name,
        implementerId: implementer.id,
        kickoffDate: kickoff,
      },
    });

    for (const stage of template.stages) {
      const createdStage = await tx.deploymentStage.create({
        data: { deploymentId: deployment.id, name: stage.name, position: stage.position },
      });
      await tx.deploymentTask.createMany({
        data: stage.tasks.map((task) => {
          const dueDate = computeDueDate(kickoff, task.offsetDays);
          return {
            deploymentId: deployment.id,
            stageId: createdStage.id,
            title: task.title,
            description: task.description,
            dueDate,
            originalDueDate: dueDate,
            assigneeKind: task.assigneeKind,
            assigneeId:
              task.assigneeKind === "IMPLEMENTER" ? implementer.id : task.assigneeKind === "ADMIN" ? adminAssignee : null,
            required: task.required,
            visibleToClient: task.visibleToClient,
            position: task.position,
          };
        }),
      });
    }

    await recordAudit(tx, {
      action: "DEPLOYMENT_CREATED",
      actorId: actor.id,
      deploymentId: deployment.id,
      field: client.companyName,
      newValue: template.name,
    });
    return deployment;
  });
}

async function loadTaskWithDeployment(taskId: string) {
  const task = await db.deploymentTask.findUnique({
    where: { id: taskId },
    include: { deployment: true },
  });
  if (!task) throw new NotFoundError("Tarefa não encontrada.");
  return task;
}

export async function updateTaskStatus(actor: Actor, raw: unknown, { now = new Date() }: Options = {}) {
  const input = parseInput(taskStatusSchema, raw);
  const task = await loadTaskWithDeployment(input.taskId);
  assertCan(actor, "task:update-status", {
    deploymentImplementerId: task.deployment.implementerId,
    taskAssigneeId: task.assigneeId,
  });

  if (input.status === "NOT_APPLICABLE" && task.required) {
    throw new RuleError("Tarefa obrigatória não pode ser marcada como não aplicável.");
  }
  if (input.status === task.status) return;

  const today = todayCivil(now);
  await db.$transaction(async (tx) => {
    await tx.deploymentTask.update({
      where: { id: task.id },
      data: { status: input.status, completedAt: input.status === "DONE" ? today : null },
    });
    await recordAudit(tx, {
      action: "TASK_STATUS_CHANGED",
      actorId: actor.id,
      deploymentId: task.deploymentId,
      taskId: task.id,
      field: task.title,
      oldValue: task.status,
      newValue: input.status,
    });

    // a conclusão da implantação acompanha o estado das tarefas
    const all = await tx.deploymentTask.findMany({ where: { deploymentId: task.deploymentId }, select: { status: true } });
    const complete = isDeploymentComplete(all);
    if (complete && task.deployment.status === "IN_PROGRESS") {
      await tx.deployment.update({ where: { id: task.deploymentId }, data: { status: "COMPLETED", completedAt: today } });
      await recordAudit(tx, { action: "DEPLOYMENT_COMPLETED", actorId: actor.id, deploymentId: task.deploymentId });
    } else if (!complete && task.deployment.status === "COMPLETED") {
      await tx.deployment.update({ where: { id: task.deploymentId }, data: { status: "IN_PROGRESS", completedAt: null } });
      await recordAudit(tx, { action: "DEPLOYMENT_REOPENED", actorId: actor.id, deploymentId: task.deploymentId });
    }
  });
}

export async function updateTaskSchedule(actor: Actor, raw: unknown) {
  const input = parseInput(taskScheduleSchema, raw);
  const task = await loadTaskWithDeployment(input.taskId);
  assertCan(actor, "task:update-schedule", { deploymentImplementerId: task.deployment.implementerId });

  const newDue = input.dueDate ? parseCivil(input.dueDate) : undefined;
  const dueChanged = newDue !== undefined && newDue.getTime() !== task.dueDate.getTime();
  const assigneeChanged = input.assigneeId !== undefined && input.assigneeId !== task.assigneeId;

  if (input.dueDate === undefined && input.assigneeId === undefined) {
    throw new RuleError("Informe o novo prazo ou o novo responsável.");
  }
  if (!dueChanged && !assigneeChanged) {
    throw new RuleError("Nenhuma alteração para salvar: o prazo e o responsável são os mesmos.");
  }
  if (dueChanged && !input.reason) throw new RuleError("Informe o motivo da alteração do prazo.");

  let newAssigneeName: string | null = null;
  if (assigneeChanged) {
    if (task.assigneeKind === "CLIENT") throw new RuleError("Tarefa do cliente não tem responsável interno.");
    const user = await db.user.findUnique({ where: { id: input.assigneeId! } });
    if (!user || !user.active) throw new RuleError("Escolha um responsável ativo.");
    newAssigneeName = user.name;
  }
  const oldAssigneeName = task.assigneeId
    ? ((await db.user.findUnique({ where: { id: task.assigneeId } }))?.name ?? "—")
    : "—";

  await db.$transaction(async (tx) => {
    if (dueChanged) {
      await tx.deploymentTask.update({ where: { id: task.id }, data: { dueDate: newDue } });
      await recordAudit(tx, {
        action: "TASK_DUE_DATE_CHANGED",
        actorId: actor.id,
        deploymentId: task.deploymentId,
        taskId: task.id,
        field: task.title,
        oldValue: formatCivil(task.dueDate),
        newValue: formatCivil(newDue!),
        reason: input.reason,
      });
    }
    if (assigneeChanged) {
      await tx.deploymentTask.update({ where: { id: task.id }, data: { assigneeId: input.assigneeId } });
      await recordAudit(tx, {
        action: "TASK_ASSIGNEE_CHANGED",
        actorId: actor.id,
        deploymentId: task.deploymentId,
        taskId: task.id,
        field: task.title,
        oldValue: oldAssigneeName,
        newValue: newAssigneeName,
        reason: input.reason,
      });
    }
  });
}

export async function addComment(actor: Actor, raw: unknown) {
  assertCan(actor, "comment:create");
  const input = parseInput(commentSchema, raw);
  const task = await loadTaskWithDeployment(input.taskId);

  return db.$transaction(async (tx) => {
    const comment = await tx.comment.create({
      data: { taskId: task.id, authorId: actor.id, body: input.body },
    });
    await recordAudit(tx, {
      action: "COMMENT_ADDED",
      actorId: actor.id,
      deploymentId: task.deploymentId,
      taskId: task.id,
      field: task.title,
      newValue: input.body.length > 120 ? `${input.body.slice(0, 117)}...` : input.body,
    });
    return comment;
  });
}

export async function getAuditLog(actor: Actor, deploymentId: string) {
  assertCan(actor, "deployment:read");
  return db.auditLog.findMany({
    where: { deploymentId },
    include: { actor: { select: { name: true } } },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
}

export async function getDeployment(actor: Actor, id: string, { now = new Date() }: Options = {}) {
  assertCan(actor, "deployment:read");
  const deployment = await db.deployment.findUnique({
    where: { id },
    include: {
      client: true,
      implementer: { select: { id: true, name: true } },
      stages: {
        orderBy: { position: "asc" },
        include: {
          tasks: {
            orderBy: { position: "asc" },
            include: {
              assignee: { select: { id: true, name: true } },
              comments: { orderBy: { createdAt: "asc" }, include: { author: { select: { name: true } } } },
            },
          },
        },
      },
    },
  });
  if (!deployment) throw new NotFoundError("Implantação não encontrada.");

  const { overdueToleranceDays } = await getSettings();
  const today = todayCivil(now);
  const allTasks = deployment.stages.flatMap((s) => s.tasks);

  return {
    ...deployment,
    today,
    toleranceDays: overdueToleranceDays,
    progress: computeProgress(allTasks),
    doneCount: allTasks.filter((t) => t.status === "DONE").length,
    countedTasks: allTasks.filter((t) => t.status !== "NOT_APPLICABLE").length,
    lateness: deploymentLateness(allTasks, today, overdueToleranceDays),
    stages: deployment.stages.map((stage) => ({
      ...stage,
      tasks: stage.tasks.map((task) => ({ ...task, lateness: taskLateness(task, today, overdueToleranceDays) })),
    })),
  };
}
