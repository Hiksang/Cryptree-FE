import { NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import { db } from "@/core/db";
import { users } from "@/core/db/schema";
import { eq } from "drizzle-orm";
import type { ReferralData } from "@/core/types";

function generateReferralCode(): string {
  const seg1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const seg2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HYPER-${seg1}-${seg2}`;
}

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  const user = await db.query.users.findFirst({
    where: eq(users.authId, userId),
  });

  let code = user?.referralCode || "";

  // Auto-generate referral code if missing
  if (!code && user) {
    code = generateReferralCode();
    await db
      .update(users)
      .set({ referralCode: code })
      .where(eq(users.authId, userId));
  }

  const data: ReferralData = {
    code,
    stats: {
      totalReferred: 0,
      activeReferred: 0,
      totalEarned: 0,
      pendingRewards: 0,
    },
    friends: [],
  };

  return NextResponse.json(data);
}
