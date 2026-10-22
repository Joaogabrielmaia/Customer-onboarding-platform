export const E2E_PORT = 3100;
export const E2E_DATABASE_URL =
  process.env.E2E_DATABASE_URL ?? "postgresql://trilha:trilha@localhost:5433/trilha_e2e?schema=public";
