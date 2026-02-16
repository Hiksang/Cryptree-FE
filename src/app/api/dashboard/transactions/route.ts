import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import { db } from "@/core/db";
import { transactions } from "@/core/db/schema";
import { eq, and, ilike, or, desc, sql } from "drizzle-orm";

const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);
  const chain = request.nextUrl.searchParams.get("chain") || "all";
  const type = request.nextUrl.searchParams.get("type") || "all";
  const q = request.nextUrl.searchParams.get("q") || "";

  const conditions = [eq(transactions.userId, userId)];

  if (chain !== "all") {
    conditions.push(eq(transactions.chainId, chain));
  }
  if (type !== "all") {
    conditions.push(eq(transactions.type, type));
  }
  if (q) {
    conditions.push(
      or(
        ilike(transactions.hash, `%${q}%`),
        ilike(transactions.protocol, `%${q}%`),
        ilike(transactions.fromToken, `%${q}%`),
        ilike(transactions.toToken, `%${q}%`),
      )!,
    );
  }

  const where = and(...conditions);

  const [rows, countResult] = await Promise.all([
    db
      .select()
      .from(transactions)
      .where(where)
      .orderBy(desc(transactions.timestamp))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(transactions)
      .where(where),
  ]);

  const mapped = rows.map((tx) => ({
    id: tx.id,
    hash: tx.hash,
    timestamp: tx.timestamp.toISOString(),
    protocol: tx.protocol || "",
    chainId: tx.chainId,
    type: tx.type,
    typeLabel: tx.typeLabel || tx.type,
    fromToken: tx.fromToken,
    toToken: tx.toToken,
    amount: Number(tx.amount),
    fee: Number(tx.fee),
    status: tx.status,
  }));

  return NextResponse.json({
    transactions: mapped,
    total: countResult[0].count,
  });
}
