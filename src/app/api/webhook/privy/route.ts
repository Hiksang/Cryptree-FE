import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/core/db";
import { users, pointBalances, pointLedger, wallets } from "@/core/db/schema";
import { eq, sql } from "drizzle-orm";

interface PrivyLinkedAccount {
  type: string;
  address?: string;
  chain_type?: string;
}

interface PrivyWebhookEvent {
  type: string;
  user: {
    id: string;
    linked_accounts: PrivyLinkedAccount[];
  };
  account?: PrivyLinkedAccount;
  wallet?: PrivyLinkedAccount;
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

  const { type, user, account, wallet } = event;
  const authId = user.id;

  if (type === "user.created") {
    const referralCode = `HYPER-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // linked_accounts에서 지갑 주소 추출
    const walletAccount = user.linked_accounts.find(
      (a) => a.type === "wallet" && a.address,
    );
    const address = walletAccount?.address || null;

    const SIGNUP_BONUS = 100;

    await db
      .insert(users)
      .values({ authId, address, referralCode })
      .onConflictDoNothing();
    await db
      .insert(pointBalances)
      .values({
        userId: authId,
        balance: SIGNUP_BONUS,
        lifetimeEarned: SIGNUP_BONUS,
        lifetimeSpent: 0,
      })
      .onConflictDoNothing();
    await db
      .insert(pointLedger)
      .values({
        userId: authId,
        amount: SIGNUP_BONUS,
        type: "signup_bonus",
        description: "회원가입 보너스",
      });

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
  } else if (type === "user.linked_account") {
    if (account?.type === "wallet" && account.address) {
      await db
        .insert(wallets)
        .values({
          userId: authId,
          address: account.address.toLowerCase(),
          label: "",
        })
        .onConflictDoNothing();

      // 지갑 추가 보너스 50P
      const WALLET_BONUS = 50;
      await db
        .update(pointBalances)
        .set({
          balance: sql`${pointBalances.balance} + ${WALLET_BONUS}`,
          lifetimeEarned: sql`${pointBalances.lifetimeEarned} + ${WALLET_BONUS}`,
          updatedAt: new Date(),
        })
        .where(eq(pointBalances.userId, authId));
      await db
        .insert(pointLedger)
        .values({
          userId: authId,
          amount: WALLET_BONUS,
          type: "wallet_bonus",
          description: "지갑 추가 보너스",
        });

      // Worker에 스캔 요청
      const workerUrl = process.env.WORKER_URL;
      if (workerUrl) {
        fetch(`${workerUrl}/webhook/wallet-added`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: account.address.toLowerCase(), userId: authId }),
        }).catch(() => {});
      }
    }
  } else if (type === "user.wallet_created") {
    if (wallet?.address) {
      await db
        .insert(wallets)
        .values({
          userId: authId,
          address: wallet.address.toLowerCase(),
          label: "Embedded",
        })
        .onConflictDoNothing();

      // 지갑 추가 보너스 50P
      const WALLET_BONUS = 50;
      await db
        .update(pointBalances)
        .set({
          balance: sql`${pointBalances.balance} + ${WALLET_BONUS}`,
          lifetimeEarned: sql`${pointBalances.lifetimeEarned} + ${WALLET_BONUS}`,
          updatedAt: new Date(),
        })
        .where(eq(pointBalances.userId, authId));
      await db
        .insert(pointLedger)
        .values({
          userId: authId,
          amount: WALLET_BONUS,
          type: "wallet_bonus",
          description: "지갑 추가 보너스",
        });

      const workerUrl = process.env.WORKER_URL;
      if (workerUrl) {
        fetch(`${workerUrl}/webhook/wallet-added`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: wallet.address.toLowerCase(), userId: authId }),
        }).catch(() => {});
      }
    }
  }

  return NextResponse.json({ success: true });
}
