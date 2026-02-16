import { NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import { db } from "@/core/db";
import {
  pointBalances,
  pointLedger,
  shopProducts,
  exchangeHistory,
} from "@/core/db/schema";
import { eq, sql } from "drizzle-orm";
import type { ExchangeData, ShopCategory } from "@/core/types";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  const [balance, products, history] = await Promise.all([
    db.query.pointBalances.findFirst({
      where: eq(pointBalances.userId, userId),
    }),
    db.select().from(shopProducts).where(eq(shopProducts.isActive, true)),
    db
      .select()
      .from(exchangeHistory)
      .where(eq(exchangeHistory.userId, userId)),
  ]);

  const data: ExchangeData = {
    pointsBalance: balance?.balance ?? 0,
    lifetimeEarned: balance?.lifetimeEarned ?? 0,
    lifetimeSpent: balance?.lifetimeSpent ?? 0,
    adRevenueShare: {
      totalAdRevenue: 0,
      yourShare: 0,
      sharePercent: 0,
    },
    exchangeRate: {
      pointsPerUsdc: 100,
      minPoints: 100,
      maxPoints: 10000,
      dailyLimit: 5000,
      dailyUsed: 0,
      fee: 0,
    },
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description || "",
      category: p.category as ShopCategory,
      pointsCost: p.pointsCost,
      stock: p.stock,
      tag: (p.tag as "hot" | "new" | "limited" | "soldout") || undefined,
      badgeLabel: p.badgeLabel || undefined,
    })),
    history: history.map((h) => ({
      id: h.id,
      date: h.createdAt?.toISOString() || new Date().toISOString(),
      type: h.type as "usdc" | "product",
      description: h.received,
      pointsSpent: h.pointsSpent,
      received: h.received,
      status: h.status as "completed" | "processing" | "failed",
      txHash: h.txHash || undefined,
    })),
  };

  return NextResponse.json(data);
}

/**
 * POST /api/dashboard/exchange
 *
 * Body (USDC 교환):
 *   { type: "usdc", points: number }
 *
 * Body (상품 교환):
 *   { type: "product", productId: string }
 */
export async function POST(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  const body = await request.json();
  const { type } = body as { type: string };

  if (type === "usdc") {
    return handleUsdcExchange(userId, body);
  } else if (type === "product") {
    return handleProductExchange(userId, body);
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

async function handleUsdcExchange(
  userId: string,
  body: { points?: number },
) {
  const { points } = body;
  if (!points || points <= 0) {
    return NextResponse.json({ error: "Invalid points" }, { status: 400 });
  }

  const RATE = 100; // 100P = 1 USDC
  const MIN = 100;
  const MAX = 10000;

  if (points < MIN || points > MAX) {
    return NextResponse.json(
      { error: `Points must be between ${MIN} and ${MAX}` },
      { status: 400 },
    );
  }

  const usdcAmount = (points / RATE).toFixed(2);
  const received = `${usdcAmount} USDC`;

  // 잔고 확인 + 차감 + 기록 (atomic, SELECT FOR UPDATE로 TOCTOU 방지)
  try {
    await db.transaction(async (tx) => {
      const [balance] = await tx
        .select()
        .from(pointBalances)
        .where(eq(pointBalances.userId, userId))
        .for("update");

      if (!balance || balance.balance < points) {
        throw new Error("INSUFFICIENT_BALANCE");
      }

      await tx
        .update(pointBalances)
        .set({
          balance: sql`${pointBalances.balance} - ${points}`,
          lifetimeSpent: sql`${pointBalances.lifetimeSpent} + ${points}`,
          updatedAt: new Date(),
        })
        .where(eq(pointBalances.userId, userId));

      await tx.insert(pointLedger).values({
        userId,
        amount: -points,
        type: "exchange",
        description: `USDC 교환 (${points.toLocaleString()}P → ${received})`,
      });

      await tx.insert(exchangeHistory).values({
        userId,
        type: "usdc",
        pointsSpent: points,
        received,
        status: "completed",
      });
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INSUFFICIENT_BALANCE") {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 },
      );
    }
    throw error;
  }

  return NextResponse.json({ success: true, received }, { status: 201 });
}

async function handleProductExchange(
  userId: string,
  body: { productId?: string },
) {
  const { productId } = body;
  if (!productId) {
    return NextResponse.json(
      { error: "productId is required" },
      { status: 400 },
    );
  }

  // 상품 조회
  const product = await db.query.shopProducts.findFirst({
    where: eq(shopProducts.id, productId),
  });

  if (!product || !product.isActive) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 },
    );
  }

  if (product.stock !== null && product.stock <= 0) {
    return NextResponse.json({ error: "Out of stock" }, { status: 400 });
  }

  const points = product.pointsCost;

  // 잔고 확인 + 차감 + 재고 감소 + 기록 (atomic, SELECT FOR UPDATE로 TOCTOU 방지)
  try {
    await db.transaction(async (tx) => {
      const [balance] = await tx
        .select()
        .from(pointBalances)
        .where(eq(pointBalances.userId, userId))
        .for("update");

      if (!balance || balance.balance < points) {
        throw new Error("INSUFFICIENT_BALANCE");
      }

      await tx
        .update(pointBalances)
        .set({
          balance: sql`${pointBalances.balance} - ${points}`,
          lifetimeSpent: sql`${pointBalances.lifetimeSpent} + ${points}`,
          updatedAt: new Date(),
        })
        .where(eq(pointBalances.userId, userId));

      if (product.stock !== null) {
        await tx
          .update(shopProducts)
          .set({ stock: sql`${shopProducts.stock} - 1` })
          .where(eq(shopProducts.id, productId));
      }

      await tx.insert(pointLedger).values({
        userId,
        amount: -points,
        type: "purchase",
        description: `${product.name} 교환`,
      });

      await tx.insert(exchangeHistory).values({
        userId,
        type: "product",
        productId,
        pointsSpent: points,
        received: product.name,
        status: "processing",
      });
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INSUFFICIENT_BALANCE") {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 },
      );
    }
    throw error;
  }

  return NextResponse.json(
    { success: true, received: product.name },
    { status: 201 },
  );
}
