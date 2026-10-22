import "dotenv/config";
import { todayCivil } from "../src/domain/dates";
import { db } from "../src/server/db";
import { seedDemo } from "../src/server/seed";
import { listDeploymentSummaries } from "../src/server/services/dashboard";

// Carrega os dados de demonstração (todos fictícios). ATENÇÃO: apaga os dados existentes.
async function main() {
  if (process.env.SEED_CONFIRM_RESET !== "yes" && process.env.NODE_ENV === "production") {
    throw new Error("Defina SEED_CONFIRM_RESET=yes para apagar e recriar os dados de demonstração.");
  }
  const today = todayCivil();
  const { users } = await seedDemo(db, today);

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
