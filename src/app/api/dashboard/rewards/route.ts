import { NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import { db } from "@/core/db";
import { pointBalances, pointLedger } from "@/core/db/schema";
import { eq, sql } from "drizzle-orm";
import type { RewardsData } from "@/core/types";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  const [balance, breakdown] = await Promise.all([
    db.query.pointBalances.findFirst({
      where: eq(pointBalances.userId, userId),
    }),
    db
      .select({
        type: pointLedger.type,
        total: sql<number>`sum(${pointLedger.amount})::int`,
      })
      .from(pointLedger)
      .where(eq(pointLedger.userId, userId))
      .groupBy(pointLedger.type),
  ]);

  const CATEGORY_ICONS: Record<string, string> = {
    scan: "Search",
    referral: "Users",
    trading: "TrendingUp",
    staking: "Lock",
    ad_revenue: "Eye",
    purchase: "ShoppingCart",
    exchange: "ArrowRightLeft",
  };

  const data: RewardsData = {
    season: {
      name: "Season 1",
      startDate: "2026-02-01T00:00:00Z",
      endDate: "2026-03-31T23:59:59Z",
      rank: 0,
      totalParticipants: 0,
      totalPoints: balance?.lifetimeEarned ?? 0,
      status: "active",
    },
    points: breakdown.map((b) => ({
      category: b.type,
      icon: CATEGORY_ICONS[b.type] || "Star",
      points: b.total,
      description: `${b.type} rewards`,
    })),
    claimableAmount: 0,
    claimableToken: "HYPE",
    distributions: [],
  };

  return NextResponse.json(data);
}
