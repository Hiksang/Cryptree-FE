import { NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import type { PortfolioData } from "@/core/types";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  const data: PortfolioData = {
    totalValue: 0,
    change24h: 0,
    change24hPercent: 0,
    chains: [],
  };

  return NextResponse.json(data);
}
