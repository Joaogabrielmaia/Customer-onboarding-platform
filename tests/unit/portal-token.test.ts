import { describe, expect, it } from "vitest";
import { generatePortalToken, hashPortalToken, isPortalLinkUsable } from "@/domain/portal-token";

describe("token do portal (RN-13)", () => {
  it("gera token em base64url com 32 bytes (43 caracteres) e hash correspondente", () => {
    const { token, tokenHash } = generatePortalToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(tokenHash).toBe(hashPortalToken(token));
    expect(tokenHash).toMatch(/^[0-9a-f]{64}$/);
    expect(tokenHash).not.toContain(token);
  });

  it("gera tokens diferentes a cada chamada", () => {
    const tokens = new Set(Array.from({ length: 50 }, () => generatePortalToken().token));
    expect(tokens.size).toBe(50);
  });

  it("o hash é determinístico e diferente para tokens diferentes", () => {
    expect(hashPortalToken("abc")).toBe(hashPortalToken("abc"));
    expect(hashPortalToken("abc")).not.toBe(hashPortalToken("abd"));
  });
});

describe("isPortalLinkUsable", () => {
  const now = new Date("2026-03-10T12:00:00Z");
  const future = new Date("2026-04-10T12:00:00Z");
  const past = new Date("2026-03-01T12:00:00Z");

  it("vale quando não expirou e não foi revogado", () => {
    expect(isPortalLinkUsable({ expiresAt: future, revokedAt: null }, now)).toBe(true);
  });

  it("não vale quando expirou", () => {
    expect(isPortalLinkUsable({ expiresAt: past, revokedAt: null }, now)).toBe(false);
  });

  it("não vale quando foi revogado", () => {
    expect(isPortalLinkUsable({ expiresAt: future, revokedAt: past }, now)).toBe(false);
  });
});
