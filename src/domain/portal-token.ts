import { createHash, randomBytes } from "node:crypto";

export function generatePortalToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashPortalToken(token) };
}

export function hashPortalToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function isPortalLinkUsable(
  link: { expiresAt: Date; revokedAt: Date | null },
  now: Date,
): boolean {
  return link.revokedAt === null && link.expiresAt.getTime() > now.getTime();
}
