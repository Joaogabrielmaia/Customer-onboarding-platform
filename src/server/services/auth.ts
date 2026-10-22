import { createHash, randomBytes } from "node:crypto";
import { RuleError } from "@/domain/errors";
import { db } from "../db";
import { hashPassword, verifyPassword } from "../password";
import { loginSchema, parseInput } from "../schemas";

export const SESSION_DAYS = 7;
const INVALID_LOGIN = "E-mail ou senha incorretos.";

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

// hash descartável: gasta o mesmo tempo quando o e-mail não existe, pra não dar pra descobrir quem está cadastrado pelo tempo de resposta
let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= hashPassword("senha-descartavel-para-igualar-tempo"));

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "IMPLEMENTER";
}

export async function login(
  raw: unknown,
  now: Date = new Date(),
): Promise<{ token: string; expiresAt: Date; user: SessionUser }> {
  const { email, password } = parseInput(loginSchema, raw);
  const user = await db.user.findUnique({ where: { email } });

  const passwordOk = await verifyPassword(password, user?.passwordHash ?? (await getDummyHash()));
  if (!user || !passwordOk || !user.active) throw new RuleError(INVALID_LOGIN);

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(now.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.session.create({ data: { userId: user.id, tokenHash: hashToken(token), expiresAt } });

  return { token, expiresAt, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

export async function getSessionUser(token: string, now: Date = new Date()): Promise<SessionUser | null> {
  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt.getTime() <= now.getTime()) {
    await db.session.delete({ where: { id: session.id } });
    return null;
  }
  if (!session.user.active) return null;
  const { id, name, email, role } = session.user;
  return { id, name, email, role };
}

export async function logout(token: string): Promise<void> {
  await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
}
