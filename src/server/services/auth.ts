import { createHash, randomBytes } from "node:crypto";
import { RuleError } from "@/domain/errors";
import { db } from "../db";
import { hashPassword, verifyPassword } from "../password";
import { loginSchema, parseInput } from "../schemas";

// ADR-002: sessão própria. O token vai no cookie; no banco fica só o hash.
export const SESSION_DAYS = 7;
const INVALID_LOGIN = "E-mail ou senha incorretos.";

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

// Hash de uma senha qualquer, usado para gastar o mesmo tempo quando o e-mail não existe.
// Assim a resposta não revela, pelo tempo, se o e-mail está cadastrado.
let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= hashPassword("senha-descartavel-para-igualar-tempo"));

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "IMPLEMENTER";
}

/** US-01: confere e-mail e senha (RN-17, RN-18) e abre uma sessão. */
export async function login(
  raw: unknown,
  now: Date = new Date(),
): Promise<{ token: string; expiresAt: Date; user: SessionUser }> {
  const { email, password } = parseInput(loginSchema, raw);
  const user = await db.user.findUnique({ where: { email } });

  const passwordOk = await verifyPassword(password, user?.passwordHash ?? (await getDummyHash()));
  // A mesma mensagem para e-mail inexistente, senha errada e usuário desativado.
  if (!user || !passwordOk || !user.active) throw new RuleError(INVALID_LOGIN);

  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(now.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db.session.create({ data: { userId: user.id, tokenHash: hashToken(token), expiresAt } });

  return { token, expiresAt, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

/** Devolve o usuário da sessão, ou null se o token não vale (inexistente, expirado ou usuário desativado). */
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
