import { NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import { ensureUserExists } from "@/core/auth/ensure-user";
import type { ReferralData } from "@/core/types";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  // Webhook 실패 시에도 유저 레코드 보장
  const user = await ensureUserExists(userId);

  const data: ReferralData = {
    code: user?.referralCode || "",
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
