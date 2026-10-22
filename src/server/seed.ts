import { addDays, formatCivil } from "@/domain/dates";
import { computeDueDate } from "@/domain/deadlines";
import { hashPortalToken } from "@/domain/portal-token";
import type { PrismaClient } from "@/generated/prisma/client";
import { hashPassword } from "./password";
import {
  DEMO_ADMIN_PASSWORD,
  DEMO_IMPLEMENTER_PASSWORD,
  demoClients,
  demoScenarios,
  demoTemplates,
  demoUsers,
} from "./seed-data";

const HOUR_MS = 60 * 60 * 1000;
const isWeekend = (d: Date) => d.getUTCDay() === 0 || d.getUTCDay() === 6;

/**
 * Apaga tudo e recria os dados de demonstração. As datas são relativas a `today`,
 * então a demo sempre tem implantações no prazo, atrasadas e concluídas.
 * Usado por `npm run db:seed` e pelo teste de integração do seed (TC-27).
 */
export async function seedDemo(db: PrismaClient, today: Date) {
  // Ordem de exclusão respeita as chaves estrangeiras.
  await db.auditLog.deleteMany();
  await db.comment.deleteMany();
  await db.portalLink.deleteMany();
  await db.deploymentTask.deleteMany();
  await db.deploymentStage.deleteMany();
  await db.deployment.deleteMany();
  await db.templateTask.deleteMany();
  await db.templateStage.deleteMany();
  await db.template.deleteMany();
  await db.client.deleteMany();
  await db.session.deleteMany();
  await db.user.deleteMany();
  await db.setting.deleteMany();

  await db.setting.create({ data: { id: 1, overdueToleranceDays: 0, portalLinkDays: 60 } });

  const adminHash = await hashPassword(DEMO_ADMIN_PASSWORD);
  const implementerHash = await hashPassword(DEMO_IMPLEMENTER_PASSWORD);
  const users: Record<string, string> = {};
  for (const u of demoUsers) {
    const created = await db.user.create({
      data: { name: u.name, email: u.email, role: u.role, passwordHash: u.admin ? adminHash : implementerHash },
    });
    users[u.key] = created.id;
  }

  const clients: Record<string, string> = {};
  for (const c of demoClients) {
    const created = await db.client.create({
      data: {
        companyName: c.companyName,
        cnpj: c.cnpj,
        contactName: c.contactName,
        contactEmail: c.contactEmail,
        contactPhone: c.contactPhone,
        plan: c.plan,
        contractDate: addDays(today, -c.contractDaysAgo),
      },
    });
    clients[c.key] = created.id;
  }

  const templates: Record<string, { id: string; name: string; tasks: TemplateTaskRow[] }> = {};
  for (const t of demoTemplates) {
    const created = await db.template.create({ data: { name: t.name, description: t.description } });
    const tasks: TemplateTaskRow[] = [];
    for (const [stageIndex, stage] of t.stages.entries()) {
      const createdStage = await db.templateStage.create({
        data: { templateId: created.id, name: stage.name, position: stageIndex },
      });
      for (const [taskIndex, [title, offsetDays, assigneeKind, required, visibleToClient]] of stage.tasks.entries()) {
        await db.templateTask.create({
          data: { stageId: createdStage.id, title, offsetDays, assigneeKind, required, visibleToClient, position: taskIndex },
        });
        tasks.push({ stageIndex, stageName: stage.name, position: taskIndex, title, offsetDays, assigneeKind, required, visibleToClient });
      }
    }
    templates[t.key] = { id: created.id, name: created.name, tasks };
  }

  for (const scenario of demoScenarios) {
    const template = templates[scenario.template]!;
    const implementerId = users[scenario.implementer]!;
    const tasks = template.tasks;
    const pivotIndex = scenario.pivotTitle ? tasks.findIndex((t) => t.title === scenario.pivotTitle) : -1;
    if (scenario.pivotTitle && pivotIndex < 0) throw new Error(`Pivô não encontrado: ${scenario.pivotTitle}`);

    // Kickoff: em dia útil, escolhido para o prazo do pivô cair onde o cenário pede.
    let kickoff: Date;
    if (pivotIndex >= 0) {
      const pivot = tasks[pivotIndex]!;
      const target = addDays(today, -(scenario.pivotDaysAgo ?? 0));
      kickoff = addDays(today, -((scenario.pivotDaysAgo ?? 0) + pivot.offsetDays));
      while (computeDueDate(kickoff, pivot.offsetDays) > target || isWeekend(kickoff)) kickoff = addDays(kickoff, -1);
    } else {
      const last = Math.max(...tasks.map((t) => t.offsetDays));
      kickoff = addDays(today, -(last + (scenario.finishDelayDays ?? 0) + 25));
      while (isWeekend(kickoff)) kickoff = addDays(kickoff, -1);
    }

    const dueOf = (t: TemplateTaskRow) => computeDueDate(kickoff, t.offsetDays);
    const lastDue = new Date(Math.max(...tasks.map((t) => dueOf(t).getTime())));
    const completedAt = pivotIndex < 0 ? addDays(lastDue, scenario.finishDelayDays ?? 0) : null;

    const deployment = await db.deployment.create({
      data: {
        clientId: clients[scenario.client]!,
        templateId: template.id,
        templateName: template.name,
        implementerId,
        kickoffDate: kickoff,
        status: completedAt ? "COMPLETED" : "IN_PROGRESS",
        completedAt,
        createdAt: new Date(kickoff.getTime() - 24 * HOUR_MS + 12 * HOUR_MS),
      },
    });

    const stageIds: Record<number, string> = {};
    for (const [index, task] of tasks.entries()) {
      if (!(task.stageIndex in stageIds)) {
        const stage = await db.deploymentStage.create({
          data: { deploymentId: deployment.id, name: task.stageName, position: task.stageIndex },
        });
        stageIds[task.stageIndex] = stage.id;
      }

      const due = dueOf(task);
      const isPivot = index === pivotIndex;
      const status = isPivot ? scenario.pivotStatus! : pivotIndex < 0 || index < pivotIndex ? "DONE" : "PENDING";
      const postponed = isPivot && scenario.pivotPostponedByDays ? scenario.pivotPostponedByDays : 0;
      const isLast = due.getTime() === lastDue.getTime();

      const created = await db.deploymentTask.create({
        data: {
          deploymentId: deployment.id,
          stageId: stageIds[task.stageIndex]!,
          title: task.title,
          dueDate: due,
          originalDueDate: addDays(due, -postponed),
          assigneeKind: task.assigneeKind,
          assigneeId: task.assigneeKind === "IMPLEMENTER" ? implementerId : task.assigneeKind === "ADMIN" ? users.camila! : null,
          required: task.required,
          visibleToClient: task.visibleToClient,
          status,
          completedAt: status === "DONE" ? (completedAt && isLast ? completedAt : due) : null,
          position: task.position,
        },
      });

      if (isPivot) {
        const at = (daysFromDue: number) => new Date(due.getTime() + daysFromDue * 24 * HOUR_MS + 14 * HOUR_MS);
        await db.auditLog.create({
          data: {
            deploymentId: deployment.id, taskId: created.id, actorId: implementerId, action: "TASK_STATUS_CHANGED",
            field: task.title, oldValue: "PENDING", newValue: status, createdAt: at(-4),
          },
        });
        if (postponed > 0) {
          await db.auditLog.create({
            data: {
              deploymentId: deployment.id, taskId: created.id, actorId: implementerId, action: "TASK_DUE_DATE_CHANGED",
              field: task.title, oldValue: formatCivil(addDays(due, -postponed)), newValue: formatCivil(due),
              reason: scenario.pivotPostponeReason, createdAt: at(-postponed),
            },
          });
        }
        if (scenario.pivotComment) {
          const author = users[scenario.pivotComment.author]!;
          await db.comment.create({
            data: { taskId: created.id, authorId: author, body: scenario.pivotComment.body, createdAt: at(-1) },
          });
          await db.auditLog.create({
            data: {
              deploymentId: deployment.id, taskId: created.id, actorId: author, action: "COMMENT_ADDED",
              field: task.title, newValue: scenario.pivotComment.body.slice(0, 120), createdAt: at(-1),
            },
          });
        }
      }
    }

    await db.auditLog.create({
      data: {
        deploymentId: deployment.id, actorId: implementerId, action: "DEPLOYMENT_CREATED",
        field: demoClients.find((c) => c.key === scenario.client)!.companyName, newValue: template.name,
        createdAt: new Date(kickoff.getTime() - 12 * HOUR_MS),
      },
    });
    if (completedAt) {
      await db.auditLog.create({
        data: {
          deploymentId: deployment.id, actorId: implementerId, action: "DEPLOYMENT_COMPLETED",
          createdAt: new Date(completedAt.getTime() + 15 * HOUR_MS),
        },
      });
    }
    if (scenario.portalToken) {
      await db.portalLink.create({
        data: {
          deploymentId: deployment.id,
          tokenHash: hashPortalToken(scenario.portalToken),
          expiresAt: addDays(today, 365),
          createdById: implementerId,
        },
      });
      await db.auditLog.create({
        data: { deploymentId: deployment.id, actorId: implementerId, action: "PORTAL_LINK_CREATED", createdAt: new Date(today.getTime() - 20 * HOUR_MS) },
      });
    }
  }

  return { users, clients };
}

interface TemplateTaskRow {
  stageIndex: number;
  stageName: string;
  position: number;
  title: string;
  offsetDays: number;
  assigneeKind: "IMPLEMENTER" | "CLIENT" | "ADMIN";
  required: boolean;
  visibleToClient: boolean;
}



