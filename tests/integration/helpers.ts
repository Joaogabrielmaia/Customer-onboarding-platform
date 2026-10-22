import { parseCivil, todayCivil } from "@/domain/dates";
import type { Actor } from "@/domain/types";
import { db } from "@/server/db";
import { seedDemo } from "@/server/seed";

/** "Agora" fixo (quinta-feira) para os resultados dos testes não dependerem do dia em que rodam. */
export const NOW = new Date("2026-10-22T15:00:00Z");
export const TODAY = parseCivil("2026-10-22");

export interface Seeded {
  camila: Actor; // admin
  ricardo: Actor; // admin
  diego: Actor; // implantador
  larissa: Actor; // implantador
  patricia: Actor; // implantador (suporte)
  clients: Record<string, string>;
}

/** Recria o banco de testes com os dados de demonstração, relativos a TODAY. */
export async function resetWithSeed(): Promise<Seeded> {
  if (todayCivil(NOW).getTime() !== TODAY.getTime()) throw new Error("NOW e TODAY estão inconsistentes.");
  const { users, clients } = await seedDemo(db, TODAY);
  return {
    camila: { id: users.camila!, role: "ADMIN" },
    ricardo: { id: users.ricardo!, role: "ADMIN" },
    diego: { id: users.diego!, role: "IMPLEMENTER" },
    larissa: { id: users.larissa!, role: "IMPLEMENTER" },
    patricia: { id: users.patricia!, role: "IMPLEMENTER" },
    clients,
  };
}

/** Procura uma implantação do seed pelo nome da empresa. */
export async function deploymentOf(companyName: string) {
  return db.deployment.findFirstOrThrow({
    where: { client: { companyName: { contains: companyName } } },
    include: { tasks: { orderBy: [{ dueDate: "asc" }, { position: "asc" }] } },
  });
}
