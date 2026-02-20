import { NextResponse } from "next/server";
import { db } from "@/core/db";
import { sql } from "drizzle-orm";

export async function GET() {
  const now = new Date().toISOString();

  let dbStatus = "ok";
  try {
    await db.execute(sql`SELECT 1`);
  } catch {
    dbStatus = "error";
  }

  // 각 테이블 존재 여부 확인
  const tableNames = [
    "users",
    "wallets",
    "transactions",
    "scan_jobs",
    "point_balances",
    "point_ledger",
    "shop_products",
    "exchange_history",
    "referrals",
  ];
  const tables: Record<string, boolean> = {};

  if (dbStatus === "ok") {
    for (const t of tableNames) {
      try {
        const result = await db.execute(
          sql.raw(
            `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '${t}') AS "exists"`,
          ),
        );
        const row = (result as unknown as { exists: boolean }[])[0];
        tables[t] = row?.exists === true;
      } catch {
        tables[t] = false;
      }
    }
  }

  const authConfigured = !!process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const workerUrl = process.env.WORKER_URL;

  let workerStatus = "unknown";
  let workerDetails: Record<string, unknown> | null = null;
  if (workerUrl) {
    try {
      const res = await fetch(`${workerUrl}/health`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        workerStatus = "ok";
        try {
          workerDetails = await res.json();
        } catch {
          // Worker health returned non-JSON — that's fine
        }
      } else {
        workerStatus = "error";
      }
    } catch {
      workerStatus = "unreachable";
    }
  } else {
    workerStatus = "not_configured";
  }

  const overall =
    dbStatus === "ok" && workerStatus !== "not_configured"
      ? "healthy"
      : dbStatus === "ok"
        ? "degraded"
        : "unhealthy";

  return NextResponse.json({
    status: overall,
    timestamp: now,
    services: {
      database: dbStatus,
      auth: authConfigured ? "privy" : "dev_mode",
      worker: workerStatus,
      ...(workerDetails ? { workerDetails } : {}),
    },
    tables,
  });
}
