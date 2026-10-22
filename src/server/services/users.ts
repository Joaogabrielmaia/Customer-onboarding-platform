import { RuleError, NotFoundError } from "@/domain/errors";
import { assertCan } from "@/domain/permissions";
import type { Actor } from "@/domain/types";
import { db } from "../db";
import { hashPassword } from "../password";
import { parseInput, passwordResetSchema, userCreateSchema } from "../schemas";

const publicFields = { id: true, name: true, email: true, role: true, active: true, createdAt: true } as const;

/** Lista de usuários internos (US-03). Nunca devolve o hash da senha. */
export async function listUsers(actor: Actor) {
  assertCan(actor, "user:manage");
  return db.user.findMany({ select: publicFields, orderBy: { name: "asc" } });
}

/** Usuários ativos, para escolher o implantador. Qualquer usuário interno pode ver. */
export async function listAssignableUsers() {
  return db.user.findMany({
    where: { active: true },
    select: { id: true, name: true, role: true },
    orderBy: { name: "asc" },
  });
}

export async function createUser(actor: Actor, raw: unknown) {
  assertCan(actor, "user:manage");
  const input = parseInput(userCreateSchema, raw);

  const existing = await db.user.findUnique({ where: { email: input.email } });
  if (existing) throw new RuleError("Já existe um usuário com este e-mail.");

  return db.user.create({
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
      passwordHash: await hashPassword(input.password),
    },
    select: publicFields,
  });
}

/** RN-18: desativar impede o login e derruba as sessões abertas; o histórico fica. */
export async function setUserActive(actor: Actor, userId: string, active: boolean) {
  assertCan(actor, "user:manage");
  if (userId === actor.id && !active) throw new RuleError("Você não pode desativar o próprio usuário.");

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError("Usuário não encontrado.");

  await db.$transaction(async (tx) => {
    await tx.user.update({ where: { id: userId }, data: { active } });
    if (!active) await tx.session.deleteMany({ where: { userId } });
  });
}

/** O admin redefine a senha (não há recuperação por e-mail no MVP). */
export async function resetPassword(actor: Actor, raw: unknown) {
  assertCan(actor, "user:manage");
  const input = parseInput(passwordResetSchema, raw);
  const user = await db.user.findUnique({ where: { id: input.userId } });
  if (!user) throw new NotFoundError("Usuário não encontrado.");

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: input.userId },
      data: { passwordHash: await hashPassword(input.password) },
    });
    await tx.session.deleteMany({ where: { userId: input.userId } });
  });
}
