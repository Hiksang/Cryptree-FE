import { NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import { db } from "@/core/db";
import { wallets } from "@/core/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function POST(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  const body = await request.json();
  const { address, label } = body as { address: string; label?: string };

  if (!address || typeof address !== "string") {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  const [wallet] = await db
    .insert(wallets)
    .values({
      userId,
      address: address.toLowerCase(),
      label: label || "",
    })
    .onConflictDoUpdate({
      target: [wallets.userId, wallets.address],
      set: { label: sql`COALESCE(NULLIF(${label || ""}, ''), ${wallets.label})` },
    })
    .returning();

  // Worker에 스캔 요청 (best-effort)
  const workerUrl = process.env.WORKER_URL;
  if (workerUrl) {
    fetch(`${workerUrl}/webhook/wallet-added`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        walletId: wallet.id,
        address: wallet.address,
        userId,
      }),
    }).catch(() => {});
  }

  return NextResponse.json(wallet, { status: 201 });
}

export async function PUT(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  const body = await request.json();
  const { walletId, label, isPrimary } = body as {
    walletId: string;
    label?: string;
    isPrimary?: boolean;
  };

  if (!walletId || typeof walletId !== "string") {
    return NextResponse.json(
      { error: "walletId is required" },
      { status: 400 },
    );
  }

  // Verify ownership
  const [existing] = await db
    .select()
    .from(wallets)
    .where(and(eq(wallets.id, walletId), eq(wallets.userId, userId)));

  if (!existing) {
    return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
  }

  const updates: Partial<{ label: string; isPrimary: boolean }> = {};
  if (label !== undefined) updates.label = label;
  if (isPrimary !== undefined) updates.isPrimary = isPrimary;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 },
    );
  }

  // If setting as primary, unset other wallets first
  if (isPrimary) {
    await db
      .update(wallets)
      .set({ isPrimary: false })
      .where(and(eq(wallets.userId, userId), eq(wallets.isPrimary, true)));
  }

  const [updated] = await db
    .update(wallets)
    .set(updates)
    .where(and(eq(wallets.id, walletId), eq(wallets.userId, userId)))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  const body = await request.json();
  const { walletId } = body as { walletId: string };

  if (!walletId || typeof walletId !== "string") {
    return NextResponse.json(
      { error: "walletId is required" },
      { status: 400 },
    );
  }

  const result = await db
    .delete(wallets)
    .where(and(eq(wallets.id, walletId), eq(wallets.userId, userId)))
    .returning();

  if (result.length === 0) {
    return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
