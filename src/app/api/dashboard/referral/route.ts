import { NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import { ensureUserExists } from "@/core/auth/ensure-user";
import { db } from "@/core/db";
import { users, referrals, transactions } from "@/core/db/schema";
import { eq, sql } from "drizzle-orm";
import type { ReferralData, ReferredFriend } from "@/core/types";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  // Webhook 실패 시에도 유저 레코드 보장
  const user = await ensureUserExists(userId);

  // 추천 통계 조회 (referrals 테이블 미존재 시 graceful fallback)
  let totalReferred = 0;
  let totalEarned = 0;
  let activeReferred = 0;
  const friends: ReferredFriend[] = [];

  try {
    const referralRows = await db
      .select({
        referredId: referrals.referredId,
        bonusAwarded: referrals.bonusAwarded,
        createdAt: referrals.createdAt,
      })
      .from(referrals)
      .where(eq(referrals.referrerId, userId));

    totalReferred = referralRows.length;
    totalEarned = referralRows.reduce((sum, r) => sum + (r.bonusAwarded ?? 0), 0);

    // 피추천인 정보 조회 (friends 목록)
    for (const row of referralRows) {
      const referredUser = await db.query.users.findFirst({
        where: eq(users.authId, row.referredId),
      });

      // 해당 유저의 총 트랜잭션 수로 active 판별
      const txResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(transactions)
        .where(eq(transactions.userId, row.referredId));

      const txCount = txResult[0]?.count ?? 0;

      friends.push({
        address: referredUser?.address || row.referredId.slice(0, 10) + "...",
        joinedAt: row.createdAt?.toISOString() || new Date().toISOString(),
        volume: 0,
        earned: row.bonusAwarded ?? 0,
        status: txCount > 0 ? "active" : "inactive",
      });
    }

    activeReferred = friends.filter((f) => f.status === "active").length;
  } catch {
    // referrals 테이블이 없으면 빈 데이터로 진행
  }

  // 나를 추천한 사람 조회 (피추천인 입장)
  let referredBy: ReferralData["referredBy"] = null;
  try {
    const myReferral = await db.query.referrals.findFirst({
      where: eq(referrals.referredId, userId),
    });
    if (myReferral) {
      const referrer = await db.query.users.findFirst({
        where: eq(users.authId, myReferral.referrerId),
      });
      referredBy = {
        address: referrer?.address
          ? `${referrer.address.slice(0, 6)}...${referrer.address.slice(-4)}`
          : myReferral.referrerId.slice(0, 12) + "...",
        code: referrer?.referralCode || "",
        registeredAt: myReferral.createdAt?.toISOString() || new Date().toISOString(),
      };
    }
  } catch { /* ignore */ }

  const data: ReferralData = {
    code: user?.referralCode || "",
    stats: {
      totalReferred,
      activeReferred,
      totalEarned,
      pendingRewards: 0,
    },
    friends,
    referredBy,
  };

  return NextResponse.json(data);
}
