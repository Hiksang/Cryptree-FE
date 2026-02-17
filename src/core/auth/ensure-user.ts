import { db } from "@/core/db";
import { users, pointBalances, pointLedger } from "@/core/db/schema";
import { eq } from "drizzle-orm";

const SIGNUP_BONUS = 500;

function generateReferralCode(): string {
  const seg1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const seg2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HYPER-${seg1}-${seg2}`;
}

/**
 * Webhook이 실패했거나 미설정인 경우에도
 * 인증된 유저의 DB 레코드가 반드시 존재하도록 보장합니다.
 */
export async function ensureUserExists(authId: string) {
  const existing = await db.query.users.findFirst({
    where: eq(users.authId, authId),
  });

  if (existing) return existing;

  // Webhook이 유저를 생성하지 못한 경우 — 여기서 보완
  const referralCode = generateReferralCode();

  await db
    .insert(users)
    .values({ authId, referralCode })
    .onConflictDoNothing();

  await db
    .insert(pointBalances)
    .values({
      userId: authId,
      balance: SIGNUP_BONUS,
      lifetimeEarned: SIGNUP_BONUS,
      lifetimeSpent: 0,
    })
    .onConflictDoNothing();

  await db.insert(pointLedger).values({
    userId: authId,
    amount: SIGNUP_BONUS,
    type: "signup_bonus",
    description: "회원가입 보너스",
  });

  return db.query.users.findFirst({
    where: eq(users.authId, authId),
  });
}
