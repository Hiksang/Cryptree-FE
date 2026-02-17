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
 * Privy API에서 유저 이름을 가져옵니다.
 * Google 계정 이름 → 이메일 @ 앞부분 순으로 fallback합니다.
 */
async function fetchPrivyUserName(authId: string): Promise<string | null> {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const privyAppSecret = process.env.PRIVY_APP_SECRET;
  if (!privyAppId || !privyAppSecret) return null;

  try {
    const { PrivyClient } = await import("@privy-io/server-auth");
    const client = new PrivyClient(privyAppId, privyAppSecret);
    const user = await client.getUser(authId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accounts = user.linkedAccounts as any[];

    // Google 계정 이름 우선
    const google = accounts.find(
      (a) => a.type === "google_oauth" && a.name,
    );
    if (google?.name) return google.name;

    // 이메일 주소 @ 앞부분 fallback
    const email = accounts.find(
      (a) =>
        (a.type === "google_oauth" && a.email) ||
        (a.type === "email" && a.address),
    );
    const emailAddr = email?.email || email?.address;
    if (emailAddr) return emailAddr.split("@")[0];

    return null;
  } catch {
    return null;
  }
}

/**
 * Webhook이 실패했거나 미설정인 경우에도
 * 인증된 유저의 DB 레코드가 반드시 존재하도록 보장합니다.
 * Privy에서 Google/이메일 이름을 자동으로 가져옵니다.
 */
export async function ensureUserExists(authId: string) {
  const existing = await db.query.users.findFirst({
    where: eq(users.authId, authId),
  });

  if (existing) return existing;

  // Webhook이 유저를 생성하지 못한 경우 — 여기서 보완
  const [name, referralCode] = await Promise.all([
    fetchPrivyUserName(authId),
    Promise.resolve(generateReferralCode()),
  ]);

  await db
    .insert(users)
    .values({ authId, referralCode, name })
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
