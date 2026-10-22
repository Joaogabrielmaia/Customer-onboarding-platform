import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // Migrations precisam de conexão direta (sem pooler). Em produção, defina DIRECT_URL.
  datasource: { url: process.env.DIRECT_URL ?? process.env.DATABASE_URL },
});
