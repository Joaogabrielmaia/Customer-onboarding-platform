import { defineConfig, devices } from "@playwright/test";
import { E2E_DATABASE_URL, E2E_PORT } from "./tests/e2e/e2e-env";

export default defineConfig({
  testDir: "./tests/screenshots",
  testMatch: /.*\.shot\.ts/,
  workers: 1,
  reporter: "list",
  globalSetup: "./tests/e2e/global-setup.ts",
  use: { baseURL: `http://localhost:${E2E_PORT}`, locale: "pt-BR", timezoneId: "America/Sao_Paulo" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npx next start -p ${E2E_PORT}`,
    // /login não consulta o banco; o webServer sobe antes do globalSetup, que cria o banco.
    url: `http://localhost:${E2E_PORT}/login`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: { DATABASE_URL: E2E_DATABASE_URL, APP_URL: `http://localhost:${E2E_PORT}`, NODE_ENV: "production" },
  },
});
