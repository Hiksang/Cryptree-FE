import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import { db } from "@/core/db";
import { users, transactions, pointBalances } from "@/core/db/schema";
import { eq, sql } from "drizzle-orm";
import type {
  LeaderboardData,
  LeaderboardEntry,
  LeaderboardTab,
  Tier,
} from "@/core/types";

export async function GET(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  const tab = (request.nextUrl.searchParams.get("tab") || "points") as LeaderboardTab;
  const limit = 50;

  let entries: LeaderboardEntry[] = [];

  try {
    if (tab === "activity") {
      // 트랜잭션 수 기준 랭킹
      const rows = await db
        .select({
          userId: transactions.userId,
          value: sql<number>`count(*)::int`,
        })
        .from(transactions)
        .groupBy(transactions.userId)
        .orderBy(sql`count(*) DESC`)
        .limit(limit);

      entries = await buildEntries(rows);
    } else if (tab === "volume") {
      // 거래량 기준 랭킹
      const rows = await db
        .select({
          userId: transactions.userId,
          value: sql<number>`coalesce(sum(${transactions.amount}::numeric), 0)::float8`,
        })
        .from(transactions)
        .groupBy(transactions.userId)
        .orderBy(sql`sum(${transactions.amount}::numeric) DESC`)
        .limit(limit);

      entries = await buildEntries(rows);
    } else {
      // 포인트 기준 랭킹 (default)
      const rows = await db
        .select({
          userId: pointBalances.userId,
          value: sql<number>`${pointBalances.lifetimeEarned}`,
        })
        .from(pointBalances)
        .orderBy(sql`${pointBalances.lifetimeEarned} DESC`)
        .limit(limit);

      entries = await buildEntries(rows);
    }
  } catch {
    // 테이블 미존재 등 오류 시 빈 배열 반환
  }

  // 내 포지션 찾기
  const myEntry = entries.find((e) => e.isMe) || null;

  const data: LeaderboardData = {
    tab,
    entries,
    myPosition: myEntry,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(data);

  async function buildEntries(
    rows: { userId: string; value: number }[],
  ): Promise<LeaderboardEntry[]> {
    const result: LeaderboardEntry[] = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const user = await db.query.users.findFirst({
        where: eq(users.authId, row.userId),
      });
      result.push({
        rank: i + 1,
        address: user?.address || row.userId.slice(0, 10) + "...",
        tier: (user?.tier as Tier) || "bronze",
        value: Number(row.value) || 0,
        isMe: row.userId === userId,
      });
    }
    return result;
  }
}
