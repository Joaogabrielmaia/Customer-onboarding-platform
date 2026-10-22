import "dotenv/config";
import { todayCivil } from "../src/domain/dates";
import { db } from "../src/server/db";
import { MIN_PASSWORD_LENGTH, hashPassword } from "../src/server/password";
import { seedDatabase } from "../src/server/seed";

// Roda a cada subida do app (veja render.yaml). Só age com o banco sem nenhum usuário:
// assim o primeiro acesso é possível sem terminal, e reinícios nunca apagam dados.
async function main() {
  if ((await db.user.count()) > 0) {
    console.log("bootstrap: já existem usuários, nada a fazer.");
    return;
  }

  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if (password !== undefined && password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`BOOTSTRAP_ADMIN_PASSWORD precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
  }

  if (process.env.SEED_EXAMPLE_DATA === "true") {
    const passwords = password ? { admin: password, user: password } : undefined;
    await seedDatabase(db, todayCivil(), passwords);
    console.log("bootstrap: dados de exemplo carregados.");
    return;
  }

  if (!email || !password) {
    console.log("bootstrap: banco vazio. Defina BOOTSTRAP_ADMIN_EMAIL e BOOTSTRAP_ADMIN_PASSWORD para criar o primeiro administrador.");
    return;
  }

  await db.setting.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
  await db.user.create({ data: { name: "Administrador", email, role: "ADMIN", passwordHash: await hashPassword(password) } });
  console.log("bootstrap: administrador criado.");
}

main()
  .then(() => db.$disconnect())
  .catch(async (error) => {
    console.error(error instanceof Error ? error.message : error);
    await db.$disconnect();
    process.exit(1);
  });
