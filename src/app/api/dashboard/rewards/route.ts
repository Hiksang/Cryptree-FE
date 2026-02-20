import { NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import { db } from "@/core/db";
import { pointBalances, pointLedger } from "@/core/db/schema";
import { eq, sql } from "drizzle-orm";
import type { RewardsData } from "@/core/types";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  let balance: { lifetimeEarned: number; balance: number } | undefined;
  let breakdown: { type: string; total: number }[] = [];
  let rank = 0;
  let totalParticipants = 0;

  try {
    [balance, breakdown] = await Promise.all([
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

    // 전체 참여자 수 + 내 순위
    const [participantResult, rankResult] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(pointBalances)
        .then((r) => r[0]?.count ?? 0),
      balance
        ? db
            .select({ rank: sql<number>`count(*)::int + 1` })
            .from(pointBalances)
            .where(sql`${pointBalances.lifetimeEarned} > ${balance.lifetimeEarned}`)
            .then((r) => r[0]?.rank ?? 1)
        : Promise.resolve(0),
    ]);
    totalParticipants = participantResult;
    rank = rankResult;
  } catch {
    // 테이블이 없을 수 있음
  }

  const CATEGORY_ICONS: Record<string, string> = {
    signup_bonus: "Gift",
    wallet_bonus: "Wallet",
    referral_bonus: "Users",
    scan: "Search",
    referral: "Users",
    trading: "TrendingUp",
    staking: "Lock",
    ad_revenue: "Eye",
    purchase: "ShoppingCart",
    exchange: "ArrowRightLeft",
  };

  const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    signup_bonus: "회원가입 보너스",
    wallet_bonus: "지갑 추가 보너스",
    referral_bonus: "추천 보너스",
    scan: "스캔 보상",
    exchange: "포인트 교환",
    purchase: "상품 교환",
  };

  const data: RewardsData = {
    season: {
      name: "Season 1",
      startDate: "2026-02-01T00:00:00Z",
      endDate: "2026-03-31T23:59:59Z",
      rank,
      totalParticipants,
      totalPoints: balance?.lifetimeEarned ?? 0,
      status: "active",
    },
    points: breakdown.map((b) => ({
      category: b.type,
      icon: CATEGORY_ICONS[b.type] || "Star",
      points: b.total,
      description: CATEGORY_DESCRIPTIONS[b.type] || `${b.type} rewards`,
    })),
    claimableAmount: 0,
    claimableToken: "HYPE",
    distributions: [],
  };

  return NextResponse.json(data);
}
