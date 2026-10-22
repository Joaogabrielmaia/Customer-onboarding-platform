import "dotenv/config";
import { db } from "../src/server/db";
import { MIN_PASSWORD_LENGTH, hashPassword } from "../src/server/password";

async function main() {
  const [email, password] = process.argv.slice(2);
  if (!email || !password) throw new Error("Uso: npm run admin:reset-password -- <email> <nova-senha>");
  if (password.length < MIN_PASSWORD_LENGTH) throw new Error(`A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);

  const user = await db.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user) throw new Error("Usuário não encontrado.");

  await db.$transaction([
    db.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(password), active: true } }),
    db.session.deleteMany({ where: { userId: user.id } }),
  ]);
  console.log(`Senha redefinida para o usuário ${user.id}. Sessões encerradas.`);
}

main()
  .then(() => db.$disconnect())
  .catch(async (error) => {
    console.error(error instanceof Error ? error.message : error);
    await db.$disconnect();
    process.exit(1);
  });
