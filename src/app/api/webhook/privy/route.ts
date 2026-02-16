import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/core/db";
import { users, pointBalances, wallets } from "@/core/db/schema";
import { eq } from "drizzle-orm";

interface PrivyLinkedAccount {
  type: string;
  address?: string;
  chain_type?: string;
}

interface PrivyWebhookEvent {
  type: string;
  data: {
    user: {
      id: string;
      linked_accounts: PrivyLinkedAccount[];
    };
  };
}

export async function POST(request: Request) {
  const secret = process.env.PRIVY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 },
    );
  }

  const body = await request.text();

  let event: PrivyWebhookEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as PrivyWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = event;
  const authId = data.user.id;

  if (type === "user.created") {
    const referralCode = `HYPER-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // linked_accounts에서 지갑 주소 추출
    const walletAccount = data.user.linked_accounts.find(
      (a) => a.type === "wallet" && a.address,
    );
    const address = walletAccount?.address || null;

    await db
      .insert(users)
      .values({ authId, address, referralCode })
      .onConflictDoNothing();
    await db
      .insert(pointBalances)
      .values({ userId: authId, balance: 0, lifetimeEarned: 0, lifetimeSpent: 0 })
      .onConflictDoNothing();

    // 지갑 주소가 있으면 wallets 테이블에도 자동 등록
    if (address) {
      await db
        .insert(wallets)
        .values({
          userId: authId,
          address,
          label: "Primary",
          isPrimary: true,
        })
        .onConflictDoNothing();
    }
  } else if (type === "user.deleted") {
    await db.delete(users).where(eq(users.authId, authId));
  }

  return NextResponse.json({ success: true });
}
