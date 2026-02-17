import { NextResponse } from "next/server";
import { getAuthUserId, unauthorizedResponse } from "@/core/auth";
import { ensureUserExists } from "@/core/auth/ensure-user";
import { db } from "@/core/db";
import { users, wallets, scanJobs, transactions } from "@/core/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import type { SettingsData, Tier, TaxCountry, TaxMethod, WalletScanStatus, ChainId } from "@/core/types";

export async function GET() {
  const userId = await getAuthUserId();
  if (!userId) return unauthorizedResponse();

  // Webhook 실패 시에도 유저 레코드 보장
  const user = await ensureUserExists(userId);

  const userWallets = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, userId));

  // 지갑별 스캔 상태 조회 (scan_jobs 테이블이 없을 수 있으므로 graceful fallback)
  const walletIds = userWallets.map((w) => w.id);
  const scanStatusMap = new Map<string, { completed: number; total: number; failed: number; txCount: number }>();

  if (walletIds.length > 0) {
    try {
      const jobStats = await db
        .select({
          walletId: scanJobs.walletId,
          status: scanJobs.status,
          txCount: sql<number>`COALESCE(SUM(${scanJobs.txCount}), 0)`.as("tx_count_sum"),
          jobCount: sql<number>`COUNT(*)`.as("job_count"),
        })
        .from(scanJobs)
        .where(inArray(scanJobs.walletId, walletIds))
        .groupBy(scanJobs.walletId, scanJobs.status);

      for (const row of jobStats) {
        const existing = scanStatusMap.get(row.walletId) || { completed: 0, total: 0, failed: 0, txCount: 0 };
        existing.total += Number(row.jobCount);
        existing.txCount += Number(row.txCount);
        if (row.status === "completed") existing.completed += Number(row.jobCount);
        if (row.status === "failed") existing.failed += Number(row.jobCount);
        scanStatusMap.set(row.walletId, existing);
      }
    } catch {
      // scan_jobs 테이블이 없거나 쿼리 실패 시 무시 — 스캔 상태 없이 진행
    }
  }

  // 트랜잭션 수 기반 티어 계산
  let txTotal = 0;
  try {
    const [{ txCount }] = await db
      .select({ txCount: sql<number>`count(*)::int` })
      .from(transactions)
      .where(eq(transactions.userId, userId));
    txTotal = txCount;
  } catch { /* ignore */ }

  // 트랜잭션 수로 티어 재계산 (DB 값이 오래됐을 수 있으므로)
  const computedTier: Tier = txTotal >= 2000 ? "diamond" : txTotal >= 500 ? "gold" : txTotal >= 100 ? "silver" : "bronze";
  const dbTier = (user?.tier as Tier) || "bronze";

  // DB tier가 실제와 다르면 업데이트
  if (computedTier !== dbTier) {
    try {
      await db.update(users).set({ tier: computedTier }).where(eq(users.authId, userId));
    } catch { /* ignore */ }
  }

  const currentTier = computedTier;

  // 티어 임계값 (트랜잭션 수 기준)
  const TIER_THRESHOLDS: Record<string, number> = {
    bronze: 100,
    silver: 500,
    gold: 2000,
    diamond: Infinity,
  };
  const tierOrder: Tier[] = ["bronze", "silver", "gold", "diamond"];
  const currentIdx = tierOrder.indexOf(currentTier);
  const nextTier = currentIdx < tierOrder.length - 1 ? tierOrder[currentIdx + 1] : currentTier;
  const nextTierPoints = TIER_THRESHOLDS[nextTier] ?? TIER_THRESHOLDS.diamond;

  // 지갑별 주요 체인 조회
  const walletChainMap = new Map<string, ChainId>();
  if (walletIds.length > 0) {
    try {
      const chainRows = await db
        .select({
          walletId: transactions.walletId,
          chainId: transactions.chainId,
          count: sql<number>`count(*)::int`,
        })
        .from(transactions)
        .where(sql`${transactions.walletId} IN (${sql.join(walletIds.map((id) => sql`${id}`), sql`, `)})`)
        .groupBy(transactions.walletId, transactions.chainId)
        .orderBy(sql`count(*) DESC`);

      for (const row of chainRows) {
        if (!walletChainMap.has(row.walletId)) {
          walletChainMap.set(row.walletId, row.chainId as ChainId);
        }
      }
    } catch { /* ignore */ }
  }

  const displayName = user?.name
    || (user?.address
      ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}`
      : "User");

  const data: SettingsData = {
    profile: {
      name: displayName,
      email: "",
      tier: currentTier,
      tierPoints: txTotal,
      nextTierPoints,
      joinedAt: user?.createdAt?.toISOString() || new Date().toISOString(),
    },
    wallets: userWallets.map((w) => {
      const scan = scanStatusMap.get(w.id);
      let scanStatus: WalletScanStatus = "idle";
      if (scan) {
        if (scan.completed + scan.failed >= scan.total) {
          scanStatus = scan.failed > 0 && scan.completed === 0 ? "failed" : "completed";
        } else {
          scanStatus = "scanning";
        }
      }

      return {
        id: w.id,
        address: w.address,
        label: w.label || "",
        chainId: walletChainMap.get(w.id) || ("hyperevm" as const),
        isPrimary: w.isPrimary || false,
        connectedAt: w.createdAt?.toISOString() || new Date().toISOString(),
        scanStatus,
        scanProgress: scan ? { completed: scan.completed, total: scan.total } : undefined,
        txCount: scan?.txCount ?? 0,
      };
    }),
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
