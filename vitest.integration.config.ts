import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Testes de integração dos serviços contra um PostgreSQL real (tests/integration).
// Os arquivos rodam em sequência porque compartilham o mesmo banco de testes.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    include: ["tests/integration/**/*.test.ts"],
    environment: "node",
    globalSetup: ["tests/integration/global-setup.ts"],
    fileParallelism: false,
    testTimeout: 30000,
    hookTimeout: 60000,
  },
});
