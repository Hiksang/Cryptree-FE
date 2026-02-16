import { NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import { db } from "@/core/db";
import { transactions } from "@/core/db/schema";
import { eq, sql } from "drizzle-orm";
import type { DashboardStats } from "@/core/types";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  const [result] = await db
    .select({
      activePositions: sql<number>`count(distinct ${transactions.protocol})::int`,
    })
    .from(transactions)
    .where(eq(transactions.userId, userId));

  const stats: DashboardStats = {
    totalValue: 0,
    totalValueChange: 0,
    totalPnl: 0,
    totalPnlPercent: 0,
    activePositions: result.activePositions,
    activePositionsChange: 0,
  };

  return NextResponse.json({ stats, insights: [] });
}
