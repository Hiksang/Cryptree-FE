import { NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import { db } from "@/core/db";
import { transactions, wallets } from "@/core/db/schema";
import { eq, desc, and, sql, inArray } from "drizzle-orm";
import type { TransactionFull } from "@/core/types";

const PAGE_SIZE = 20;

export async function GET(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const chain = searchParams.get("chain") || "all";
  const type = searchParams.get("type") || "all";
  const search = searchParams.get("q") || "";

  try {
    // 유저의 지갑 ID 목록
    const userWallets = await db
      .select({ id: wallets.id })
      .from(wallets)
      .where(eq(wallets.userId, userId));

    const walletIds = userWallets.map((w) => w.id);

    if (walletIds.length === 0) {
      return NextResponse.json({ transactions: [], total: 0, page, totalPages: 0 });
    }

    // 필터 조건 구성
    const conditions = [inArray(transactions.walletId, walletIds)];

    if (chain !== "all") {
      conditions.push(eq(transactions.chainId, chain));
    }
    if (type !== "all") {
      conditions.push(eq(transactions.type, type));
    }
    if (search) {
      conditions.push(
        sql`(${transactions.hash} ILIKE ${"%" + search + "%"} OR ${transactions.protocol} ILIKE ${"%" + search + "%"} OR ${transactions.fromToken} ILIKE ${"%" + search + "%"} OR ${transactions.toToken} ILIKE ${"%" + search + "%"})`,
      );
    }

    const where = and(...conditions);

    // 총 개수 + 데이터 조회
    const [countResult, rows] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(transactions)
        .where(where)
        .then((r) => r[0]?.count ?? 0),
      db
        .select()
        .from(transactions)
        .where(where)
        .orderBy(desc(transactions.timestamp))
        .limit(PAGE_SIZE)
        .offset((page - 1) * PAGE_SIZE),
    ]);

    const total = Number(countResult);
    const totalPages = Math.ceil(total / PAGE_SIZE);

    const data: TransactionFull[] = rows.map((tx) => ({
      id: tx.id,
      hash: tx.hash.slice(0, 10) + "...",
      timestamp: tx.timestamp.toISOString(),
      protocol: tx.protocol || "Unknown",
      chainId: tx.chainId as TransactionFull["chainId"],
      type: tx.type as TransactionFull["type"],
      typeLabel: tx.typeLabel || tx.type,
      fromToken: tx.fromToken || undefined,
      toToken: tx.toToken || undefined,
      amount: Number(tx.amount),
      fee: Number(tx.fee),
      status: tx.status as TransactionFull["status"],
    }));

    return NextResponse.json({ transactions: data, total, page, totalPages });
  } catch {
    // transactions 테이블이 없을 수 있음
    return NextResponse.json({ transactions: [], total: 0, page, totalPages: 0 });
  }
}
