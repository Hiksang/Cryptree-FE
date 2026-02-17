import { NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import { db } from "@/core/db";
import {
  users,
  referrals,
  pointBalances,
  pointLedger,
} from "@/core/db/schema";
import { eq, sql } from "drizzle-orm";

const REFERRAL_BONUS = 200;

export async function POST(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  const { code } = await request.json();
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Missing referral code" }, { status: 400 });
  }

  // 자기 자신의 코드인지 확인
  const self = await db.query.users.findFirst({
    where: eq(users.authId, userId),
  });
  if (self?.referralCode === code) {
    return NextResponse.json({ error: "Cannot use own referral code" }, { status: 400 });
  }

  // 추천인 찾기
  const referrer = await db.query.users.findFirst({
    where: eq(users.referralCode, code),
  });
  if (!referrer) {
    return NextResponse.json({ error: "Invalid referral code" }, { status: 404 });
  }

  // 이미 추천 관계가 있는지 확인 (이 유저가 이미 누군가에게 추천받은 경우)
  const existing = await db.query.referrals.findFirst({
    where: eq(referrals.referredId, userId),
  });
  if (existing) {
    return NextResponse.json({ error: "Already referred" }, { status: 409 });
  }

  // 추천 관계 기록 + 보너스 지급
  await db.insert(referrals).values({
    referrerId: referrer.authId,
    referredId: userId,
    bonusAwarded: REFERRAL_BONUS,
  });

  // 추천인에게 보너스 포인트 지급
  await db
    .update(pointBalances)
    .set({
      balance: sql`${pointBalances.balance} + ${REFERRAL_BONUS}`,
      lifetimeEarned: sql`${pointBalances.lifetimeEarned} + ${REFERRAL_BONUS}`,
      updatedAt: new Date(),
    })
    .where(eq(pointBalances.userId, referrer.authId));

  await db.insert(pointLedger).values({
    userId: referrer.authId,
    amount: REFERRAL_BONUS,
    type: "referral_bonus",
    description: `추천 보너스 (${userId.slice(0, 8)}...)`,
    referenceId: userId,
  });

  return NextResponse.json({ success: true, bonus: REFERRAL_BONUS });
}
