import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Uma única instância do cliente por processo. Em desenvolvimento o Next recarrega
// os módulos a cada alteração, então guardo a instância em globalThis.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL não está definida.");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export const db = globalForPrisma.prisma ?? createClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/** Tipo do cliente dentro de `db.$transaction(async (tx) => ...)`. */
export type Tx = Parameters<Parameters<typeof db.$transaction>[0]>[0];
