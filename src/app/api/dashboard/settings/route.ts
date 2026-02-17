import { NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import { ensureUserExists } from "@/core/auth/ensure-user";
import { db } from "@/core/db";
import { users, wallets } from "@/core/db/schema";
import { eq } from "drizzle-orm";
import type { SettingsData, Tier, TaxCountry, TaxMethod } from "@/core/types";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  // Webhook 실패 시에도 유저 레코드 보장
  const user = await ensureUserExists(userId);

  const userWallets = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, userId));

  const displayName = user?.name
    || (user?.address
      ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}`
      : "User");

  const data: SettingsData = {
    profile: {
      name: displayName,
      email: "",
      tier: (user?.tier as Tier) || "bronze",
      tierPoints: 0,
      nextTierPoints: 1000,
      joinedAt: user?.createdAt?.toISOString() || new Date().toISOString(),
    },
    wallets: userWallets.map((w) => ({
      id: w.id,
      address: w.address,
      label: w.label || "",
      chainId: "hyperevm" as const,
      isPrimary: w.isPrimary || false,
      connectedAt: w.createdAt?.toISOString() || new Date().toISOString(),
    })),
    preferences: {
      country: (user?.taxCountry as TaxCountry) || "kr",
      method: (user?.taxMethod as TaxMethod) || "fifo",
    },
  };

  return NextResponse.json(data);
}

const VALID_COUNTRIES = new Set(["kr", "us", "jp", "de", "uk", "au", "ca"]);
const VALID_METHODS = new Set(["fifo", "lifo", "hifo", "avg"]);

/**
 * PUT /api/dashboard/settings
 *
 * Body: { country?: TaxCountry, method?: TaxMethod, name?: string }
 */
export async function PUT(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  // Webhook 미작동 시에도 유저 레코드 보장
  await ensureUserExists(userId);

  const body = await request.json();
  const { country, method, name } = body as {
    country?: string;
    method?: string;
    name?: string;
  };

  if (country && !VALID_COUNTRIES.has(country)) {
    return NextResponse.json({ error: "Invalid country" }, { status: 400 });
  }
  if (method && !VALID_METHODS.has(method)) {
    return NextResponse.json({ error: "Invalid method" }, { status: 400 });
  }

  // Trim and validate name
  const trimmedName = typeof name === "string" ? name.trim() : undefined;
  if (trimmedName !== undefined && trimmedName.length === 0) {
    return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
  }
  if (trimmedName !== undefined && trimmedName.length > 50) {
    return NextResponse.json({ error: "Name too long (max 50 chars)" }, { status: 400 });
  }

  if (!country && !method && trimmedName === undefined) {
    return NextResponse.json(
      { error: "Nothing to update" },
      { status: 400 },
    );
  }

  const updates: Partial<{ taxCountry: string; taxMethod: string; name: string }> = {};
  if (country) updates.taxCountry = country;
  if (method) updates.taxMethod = method;
  if (trimmedName !== undefined) updates.name = trimmedName;

  await db
    .update(users)
    .set(updates)
    .where(eq(users.authId, userId));

  return NextResponse.json({ success: true, ...updates });
}
