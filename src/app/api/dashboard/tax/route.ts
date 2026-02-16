import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import type { TaxReportData, TaxMethod, TaxCountry } from "@/core/types";

export async function GET(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  const country = (request.nextUrl.searchParams.get("country") || "kr") as TaxCountry;
  const method = (request.nextUrl.searchParams.get("method") || "fifo") as TaxMethod;

  const data: TaxReportData = {
    year: new Date().getFullYear(),
    totalGains: 0,
    totalLosses: 0,
    netIncome: 0,
    method,
    country,
    chainBreakdown: [],
    events: [],
  };

  return NextResponse.json(data);
}
