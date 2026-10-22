import "dotenv/config";
import { todayCivil } from "../src/domain/dates";
import { db } from "../src/server/db";
import { seedDatabase } from "../src/server/seed";
import { listDeploymentSummaries } from "../src/server/services/dashboard";

async function main() {
  const isLocal = /@(localhost|127.0.0.1)[:/]/.test(process.env.DATABASE_URL ?? "");
  if (!isLocal && process.env.SEED_CONFIRM_RESET !== "yes") {
    throw new Error("Este banco não é local. Defina SEED_CONFIRM_RESET=yes para apagar e recriar os dados do seed.");
  }
  const today = todayCivil();
  const { users } = await seedDatabase(db, today);

  const admin = { id: users.camila!, role: "ADMIN" as const };
  const summaries = await listDeploymentSummaries(admin, {}, new Date());
  console.log("Seed concluído. Implantações:");
  for (const s of summaries) console.log(`  ${s.category.padEnd(15)} ${String(s.progress).padStart(3)}%  ${s.companyName}`);
}

main()
  .then(() => db.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
