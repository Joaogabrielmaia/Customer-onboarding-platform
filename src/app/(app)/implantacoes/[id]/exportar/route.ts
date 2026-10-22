import { csvResponse } from "@/lib/csv-response";
import { exportDeploymentCsv } from "@/server/services/reports";

export const dynamic = "force-dynamic";

/** v1.1: baixa o relatório de uma implantação em CSV. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return csvResponse("deployment", (user) => exportDeploymentCsv(user, id));
}
