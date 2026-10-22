import { parseCivil } from "@/domain/dates";
import { NotFoundError, RuleError } from "@/domain/errors";
import { assertCan } from "@/domain/permissions";
import type { Actor } from "@/domain/types";
import { db } from "../db";
import { clientSchema, parseInput } from "../schemas";

export async function listClients(actor: Actor, opts: { includeArchived?: boolean; search?: string } = {}) {
  assertCan(actor, "client:manage");
  const search = opts.search?.trim();
  return db.client.findMany({
    where: {
      ...(opts.includeArchived ? {} : { archivedAt: null }),
      ...(search ? { companyName: { contains: search, mode: "insensitive" as const } } : {}),
    },
    orderBy: { companyName: "asc" },
  });
}

export async function getClient(actor: Actor, id: string) {
  assertCan(actor, "client:manage");
  const client = await db.client.findUnique({
    where: { id },
    include: { deployments: { orderBy: { kickoffDate: "desc" } } },
  });
  if (!client) throw new NotFoundError("Cliente não encontrado.");
  return client;
}

export async function createClient(actor: Actor, raw: unknown) {
  assertCan(actor, "client:manage");
  const input = parseInput(clientSchema, raw);
  return db.client.create({
    data: { ...input, contractDate: parseCivil(input.contractDate) },
  });
}

export async function updateClient(actor: Actor, id: string, raw: unknown) {
  assertCan(actor, "client:manage");
  const input = parseInput(clientSchema, raw);
  const existing = await db.client.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Cliente não encontrado.");
  return db.client.update({
    where: { id },
    data: { ...input, contractDate: parseCivil(input.contractDate) },
  });
}

/** RN-16: cliente com implantação em andamento não pode ser arquivado. */
export async function archiveClient(actor: Actor, id: string) {
  assertCan(actor, "client:manage");
  const client = await db.client.findUnique({ where: { id } });
  if (!client) throw new NotFoundError("Cliente não encontrado.");

  const inProgress = await db.deployment.count({ where: { clientId: id, status: "IN_PROGRESS" } });
  if (inProgress > 0) {
    throw new RuleError("Este cliente tem implantação em andamento. Conclua-a antes de arquivar.");
  }
  await db.client.update({ where: { id }, data: { archivedAt: new Date() } });
}

export async function unarchiveClient(actor: Actor, id: string) {
  assertCan(actor, "client:manage");
  await db.client.update({ where: { id }, data: { archivedAt: null } });
}
