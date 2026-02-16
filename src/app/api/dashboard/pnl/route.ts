import { NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  return NextResponse.json({
    history: [],
    chainPnl: [],
    topTrades: [],
  });
}
