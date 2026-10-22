import { execSync } from "node:child_process";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { todayCivil } from "../../src/domain/dates";
import { seedDatabase } from "../../src/server/seed";
import { E2E_DATABASE_URL } from "./e2e-env";

export default async function setup() {
  const dbName = new URL(E2E_DATABASE_URL).pathname.slice(1);
  const adminUrl = new URL(E2E_DATABASE_URL);
  adminUrl.pathname = "/postgres";
  adminUrl.search = "";

  const admin = new pg.Client({ connectionString: adminUrl.toString() });
  await admin.connect();
  try {
    const exists = await admin.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
    if (exists.rowCount === 0) await admin.query(`CREATE DATABASE "${dbName}"`);
  } finally {
    await admin.end();
  }

  execSync("npx prisma migrate deploy", { stdio: "pipe", env: { ...process.env, DATABASE_URL: E2E_DATABASE_URL } });

  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: E2E_DATABASE_URL }) });
  try {
    await seedDatabase(db, todayCivil());
  } finally {
    await db.$disconnect();
  }
}
