import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import type { LeaderboardData, LeaderboardTab } from "@/core/types";

export async function GET(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  const tab = (request.nextUrl.searchParams.get("tab") || "pnl") as LeaderboardTab;

  const data: LeaderboardData = {
    tab,
    entries: [],
    myPosition: null,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(data);
}
