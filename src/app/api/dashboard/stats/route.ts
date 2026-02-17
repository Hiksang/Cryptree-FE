import { NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import { db } from "@/core/db";
import { transactions, wallets } from "@/core/db/schema";
import { eq, sql, countDistinct } from "drizzle-orm";
import type { DashboardStats } from "@/core/types";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  let result = { activePositions: 0, totalTx: 0 };
  let walletCount = 0;
  let chainBreakdown: { chainId: string; txCount: number }[] = [];

  try {
    [result, walletCount, chainBreakdown] = await Promise.all([
      db
        .select({
          activePositions: sql<number>`count(distinct ${transactions.protocol})::int`,
          totalTx: sql<number>`count(*)::int`,
        })
        .from(transactions)
        .where(eq(transactions.userId, userId))
        .then((r) => r[0]),
      db
        .select({ count: countDistinct(wallets.id) })
        .from(wallets)
        .where(eq(wallets.userId, userId))
        .then((r) => r[0]?.count ?? 0),
      db
        .select({
          chainId: transactions.chainId,
          txCount: sql<number>`count(*)::int`,
        })
        .from(transactions)
        .where(eq(transactions.userId, userId))
        .groupBy(transactions.chainId),
    ]);
  } catch {
    // transactions 테이블이 없을 수 있음 — wallets만 조회
    try {
      walletCount = await db
        .select({ count: countDistinct(wallets.id) })
        .from(wallets)
        .where(eq(wallets.userId, userId))
        .then((r) => r[0]?.count ?? 0);
    } catch { /* ignore */ }
  }

  const stats: DashboardStats = {
    totalValue: 0,
    totalValueChange: 0,
    totalPnl: 0,
    totalPnlPercent: 0,
    activePositions: result.activePositions,
    activePositionsChange: 0,
  };

  return NextResponse.json({
    stats,
    insights: [],
    walletCount,
    chainBreakdown: chainBreakdown.map((c) => ({
      chainId: c.chainId,
      txCount: c.txCount,
    })),
  });
}
