import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { logEvent } from "@/server/log";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", database: "ok", time: new Date().toISOString() });
  } catch {
    logEvent("error", "healthcheck_database_failed");
    return NextResponse.json({ status: "degraded", database: "unavailable", time: new Date().toISOString() }, { status: 503 });
  }
}
