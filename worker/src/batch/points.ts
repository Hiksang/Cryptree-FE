import { db } from "../lib/db.js";
import { users, pointBalances, pointLedger, transactions } from "../lib/schema.js";
import { eq, sql, gte } from "drizzle-orm";

// 광고 수익 기반 포인트 분배
// 비즈니스 모델: 광고 수익의 40%를 유저에게 포인트로 분배
const REVENUE_SHARE_PERCENT = 40;
const POINTS_PER_DOLLAR = 100; // $1 = 100 포인트

export async function distributePoints() {
  console.log("[points] Starting daily points distribution");

  // 1. 오늘의 총 광고 수익 (실제로는 광고 시스템에서 가져옴)
  // TODO: 실제 광고 수익 API 연동
  const dailyAdRevenue = 0;

  if (dailyAdRevenue <= 0) {
    console.log("[points] No ad revenue available, skipping distribution");
    return;
  }

  const userPool = dailyAdRevenue * (REVENUE_SHARE_PERCENT / 100);
  const totalPointsToDistribute = userPool * POINTS_PER_DOLLAR;

  console.log(
    `[points] Daily revenue: $${dailyAdRevenue}, User pool: $${userPool}, Points: ${totalPointsToDistribute}`,
  );

  // 2. 활성 유저 목록 (최근 24시간 내 트랜잭션이 있는 유저)
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const activeUsers = await db
    .selectDistinct({ userId: transactions.userId })
    .from(transactions)
    .where(gte(transactions.timestamp, yesterday));

  if (activeUsers.length === 0) {
    console.log("[points] No active users found, skipping distribution");
    return;
  }

  // 3. 유저별 활동량 기반 분배 (트랜잭션 수 비례)
  const userActivity = await db
    .select({
      userId: transactions.userId,
      txCount: sql<number>`count(*)::int`,
    })
    .from(transactions)
    .where(gte(transactions.timestamp, yesterday))
    .groupBy(transactions.userId);

  const totalActivity = userActivity.reduce((sum, u) => sum + u.txCount, 0);

  console.log(
    `[points] Distributing to ${userActivity.length} users (total activity: ${totalActivity})`,
  );

  // 4. 유저별 포인트 적립
  for (const user of userActivity) {
    const share = user.txCount / totalActivity;
    const points = Math.floor(totalPointsToDistribute * share);

    if (points <= 0) continue;

    try {
      // 포인트 원장에 기록
      await db.insert(pointLedger).values({
        userId: user.userId,
        amount: points,
        type: "ad_revenue",
        description: `광고 수익 분배 (${new Date().toISOString().slice(0, 10)})`,
      });

      // 잔고 업데이트 (upsert)
      await db
        .insert(pointBalances)
        .values({
          userId: user.userId,
          balance: points,
          lifetimeEarned: points,
          lifetimeSpent: 0,
        })
        .onConflictDoUpdate({
          target: pointBalances.userId,
          set: {
            balance: sql`${pointBalances.balance} + ${points}`,
            lifetimeEarned: sql`${pointBalances.lifetimeEarned} + ${points}`,
            updatedAt: new Date(),
          },
        });

      console.log(
        `[points] User ${user.userId}: +${points}P (${user.txCount} txs, ${(share * 100).toFixed(1)}% share)`,
      );
    } catch (error) {
      console.error(
        `[points] Error distributing to ${user.userId}:`,
        error,
      );
    }
  }

  console.log("[points] Distribution complete");
}
