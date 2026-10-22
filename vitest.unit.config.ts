import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Testes unitários: regras puras, sem banco (tests/unit).
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { include: ["tests/unit/**/*.test.ts"], environment: "node" },
});
