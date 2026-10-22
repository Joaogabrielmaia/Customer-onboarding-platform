import { csvResponse } from "@/lib/csv-response";
import type { DeploymentFilters } from "@/server/services/dashboard";
import { exportDeploymentsCsv } from "@/server/services/reports";

export const dynamic = "force-dynamic";

const STATUSES = ["all", "in_progress", "late", "waiting_client", "completed"];

/** v1.1: baixa a lista de implantações em CSV, com os mesmos filtros da tela. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const situacao = params.get("situacao") ?? "all";
  const filters: DeploymentFilters = {
    status: (STATUSES.includes(situacao) ? situacao : "all") as DeploymentFilters["status"],
    implementerId: params.get("implantador") || undefined,
    clientId: params.get("cliente") || undefined,
  };
  return csvResponse("deployments", (user) => exportDeploymentsCsv(user, filters));
}
