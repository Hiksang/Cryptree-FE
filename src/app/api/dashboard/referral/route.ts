import { NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import { db } from "@/core/db";
import { users } from "@/core/db/schema";
import { eq } from "drizzle-orm";
import type { ReferralData } from "@/core/types";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  const user = await db.query.users.findFirst({
    where: eq(users.authId, userId),
  });

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
