import { NextResponse } from "next/server";
import { db } from "@/core/db";
import { sql } from "drizzle-orm";

export async function GET() {
  const now = new Date().toISOString();

  let dbStatus = "ok";
  let dbError = "";
  try {
    await db.execute(sql`SELECT 1`);
  } catch (e) {
    dbStatus = "error";
    try { dbError = JSON.stringify(e, Object.getOwnPropertyNames(e as object)); } catch { dbError = String(e); }
  }

  const authConfigured = !!process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const workerUrl = process.env.WORKER_URL;

  let workerStatus = "unknown";
  if (workerUrl) {
    try {
      const res = await fetch(`${workerUrl}/health`, { signal: AbortSignal.timeout(3000) });
      workerStatus = res.ok ? "ok" : "error";
    } catch {
      workerStatus = "unreachable";
    }
  } else {
    workerStatus = "not_configured";
  }

  const overall = dbStatus === "ok" ? "healthy" : "degraded";

  return NextResponse.json({
    status: overall,
    timestamp: now,
    services: {
      database: dbStatus,
      dbError: dbError || undefined,
      dbUrl: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ":***@") : "NOT_SET",
      auth: authConfigured ? "privy" : "dev_mode",
      worker: workerStatus,
    },
  });
}
