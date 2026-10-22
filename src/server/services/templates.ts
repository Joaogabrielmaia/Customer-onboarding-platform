import { NotFoundError } from "@/domain/errors";
import { assertCan } from "@/domain/permissions";
import type { Actor } from "@/domain/types";
import { db } from "../db";
import { parseInput, templateSchema } from "../schemas";

const withStructure = {
  stages: { orderBy: { position: "asc" as const }, include: { tasks: { orderBy: { position: "asc" as const } } } },
};

export async function listTemplates(actor: Actor, opts: { includeArchived?: boolean } = {}) {
  assertCan(actor, "template:read");
  return db.template.findMany({
    where: opts.includeArchived ? {} : { archivedAt: null },
    include: { stages: { include: { _count: { select: { tasks: true } } } } },
    orderBy: { name: "asc" },
  });
}

export async function getTemplate(actor: Actor, id: string) {
  assertCan(actor, "template:read");
  const template = await db.template.findUnique({ where: { id }, include: withStructure });
  if (!template) throw new NotFoundError("Modelo não encontrado.");
  return template;
}

export async function saveTemplate(actor: Actor, id: string | null, raw: unknown) {
  assertCan(actor, "template:manage");
  const input = parseInput(templateSchema, raw);

  return db.$transaction(async (tx) => {
    let templateId = id;
    if (templateId) {
      const existing = await tx.template.findUnique({ where: { id: templateId } });
      if (!existing) throw new NotFoundError("Modelo não encontrado.");
      await tx.template.update({
        where: { id: templateId },
        data: { name: input.name, description: input.description ?? null },
      });
      await tx.templateStage.deleteMany({ where: { templateId } });
    } else {
      const created = await tx.template.create({
        data: { name: input.name, description: input.description ?? null },
      });
      templateId = created.id;
    }

    for (const [stageIndex, stage] of input.stages.entries()) {
      await tx.templateStage.create({
        data: {
          templateId,
          name: stage.name,
          position: stageIndex,
          tasks: {
            create: stage.tasks.map((task, taskIndex) => ({
              title: task.title,
              description: task.description ?? null,
              offsetDays: task.offsetDays,
              assigneeKind: task.assigneeKind,
              required: task.required,
              visibleToClient: task.visibleToClient,
              position: taskIndex,
            })),
          },
        },
      });
    }
    return tx.template.findUniqueOrThrow({ where: { id: templateId }, include: withStructure });
  });
}

export async function archiveTemplate(actor: Actor, id: string) {
  assertCan(actor, "template:manage");
  await db.template.update({ where: { id }, data: { archivedAt: new Date() } });
}
