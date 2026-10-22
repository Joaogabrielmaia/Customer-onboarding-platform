import { createHash, randomBytes } from "node:crypto";

/** RN-13: 32 bytes aleatórios em base64url. Só o hash vai para o banco (ADR-007). */
export function generatePortalToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashPortalToken(token) };
}

export function hashPortalToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** O link vale se não foi revogado e ainda não expirou. */
export function isPortalLinkUsable(
  link: { expiresAt: Date; revokedAt: Date | null },
  now: Date,
): boolean {
  return link.revokedAt === null && link.expiresAt.getTime() > now.getTime();
}
