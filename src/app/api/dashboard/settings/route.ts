import { NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import { db } from "@/core/db";
import { users, wallets } from "@/core/db/schema";
import { eq } from "drizzle-orm";
import type { SettingsData, Tier, TaxCountry, TaxMethod } from "@/core/types";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  const user = await db.query.users.findFirst({
    where: eq(users.authId, userId),
  });

  const userWallets = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, userId));

  const data: SettingsData = {
    profile: {
      name: user?.address
        ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}`
        : "User",
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
 * Body: { country?: TaxCountry, method?: TaxMethod }
 */
export async function PUT(request: Request) {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  const body = await request.json();
  const { country, method } = body as {
    country?: string;
    method?: string;
  };

  if (country && !VALID_COUNTRIES.has(country)) {
    return NextResponse.json({ error: "Invalid country" }, { status: 400 });
  }
  if (method && !VALID_METHODS.has(method)) {
    return NextResponse.json({ error: "Invalid method" }, { status: 400 });
  }

  if (!country && !method) {
    return NextResponse.json(
      { error: "Nothing to update" },
      { status: 400 },
    );
  }

  const updates: Record<string, string> = {};
  if (country) updates.taxCountry = country;
  if (method) updates.taxMethod = method;

  await db
    .update(users)
    .set(updates)
    .where(eq(users.authId, userId));

  return NextResponse.json({ success: true, ...updates });
}
