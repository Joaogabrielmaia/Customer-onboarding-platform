// Banco usado só pelos testes de integração. Em CI, TEST_DATABASE_URL aponta para o serviço do Postgres.
export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? "postgresql://trilha:trilha@localhost:5433/trilha_test?schema=public";
