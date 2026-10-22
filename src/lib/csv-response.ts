import "server-only";
import { DomainError, ForbiddenError, NotFoundError } from "@/domain/errors";
import { logEvent } from "@/server/log";
import type { CsvFile } from "@/server/services/reports";
import { getCurrentUser } from "./auth";
import type { SessionUser } from "@/server/services/auth";

const BOM = "﻿";

export async function csvResponse(kind: string, build: (user: SessionUser) => Promise<CsvFile>): Promise<Response> {
  const user = await getCurrentUser();
  if (!user) return new Response("Faça login para exportar.", { status: 401 });
  try {
    const file = await build(user);
    logEvent("info", "export_csv", { kind, userId: user.id });
    return new Response(BOM + file.content, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${file.filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof NotFoundError) return new Response("Não encontrado.", { status: 404 });
    if (error instanceof ForbiddenError) return new Response("Sem permissão.", { status: 403 });
    if (error instanceof DomainError) return new Response(error.message, { status: 400 });
    logEvent("error", "export_csv_failed", { kind });
    return new Response("Não foi possível gerar o arquivo.", { status: 500 });
  }
}
