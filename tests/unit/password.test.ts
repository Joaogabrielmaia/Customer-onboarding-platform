import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/server/password";

describe("senha com scrypt (RNF-03, ADR-002)", () => {
  it("aceita a senha correta e recusa a errada", async () => {
    const stored = await hashPassword("uma-senha-bem-longa");
    expect(await verifyPassword("uma-senha-bem-longa", stored)).toBe(true);
    expect(await verifyPassword("uma-senha-bem-longA", stored)).toBe(false);
  });

  it("nunca guarda a senha em texto e usa sal diferente a cada vez", async () => {
    const a = await hashPassword("mesma-senha-123");
    const b = await hashPassword("mesma-senha-123");
    expect(a).not.toContain("mesma-senha-123");
    expect(a).not.toBe(b);
    expect(a.startsWith("scrypt$32768$8$3$")).toBe(true);
  });

  it("recusa formatos inválidos sem lançar erro", async () => {
    expect(await verifyPassword("x", "texto-qualquer")).toBe(false);
    expect(await verifyPassword("x", "")).toBe(false);
  });
});
