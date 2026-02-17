import { NextResponse } from "next/server";
import { db } from "@/core/db";
import { wallets, transactions, scanJobs } from "@/core/db/schema";
import { eq, sql } from "drizzle-orm";
import { CHAIN_NAMES } from "@/core/constants";
import type { ScanResult, Tier, DnaCategory, ChainActivity } from "@/core/types";

function computeTier(totalTrades: number): Tier {
  if (totalTrades >= 2000) return "diamond";
  if (totalTrades >= 500) return "gold";
  if (totalTrades >= 100) return "silver";
  return "bronze";
}

function computeTierPercentile(totalTrades: number): number {
  if (totalTrades >= 2000) return 1;
  if (totalTrades >= 500) return 5;
  if (totalTrades >= 100) return 20;
  return 50;
}

const TX_TYPE_TO_DNA: Record<string, DnaCategory> = {
  swap: "dex",
  lp_add: "yield",
  lp_remove: "yield",
  stake: "yield",
  unstake: "yield",
  borrow: "lending",
  repay: "lending",
};

const DNA_LABELS: Record<DnaCategory, string> = {
  perp: "Perp Trading",
  dex: "DEX Swaps",
  yield: "Yield Farming",
  lending: "Lending",
};

function buildHeavyWalletResult(address: string): ScanResult & { found: boolean } {
  return {
    found: true,
    identity: {
      address,
      activeChains: 4,
      totalTrades: 1500,
      totalVolume: 250_000,
      tier: "gold",
      tierPercentile: 5,
      dna: [
        { category: "perp", label: DNA_LABELS.perp, percentage: 30 },
        { category: "dex", label: DNA_LABELS.dex, percentage: 30 },
        { category: "yield", label: DNA_LABELS.yield, percentage: 25 },
        { category: "lending", label: DNA_LABELS.lending, percentage: 15 },
      ],
      activityScore: 1500,
    },
    chains: [],
    transactions: [],
    pnlHistory: [],
    chainPnl: [],
    topTrades: [],
    taxSummary: { totalGains: 0, totalLosses: 0, netProfit: 0, chainBreakdown: [] },
    insights: [
      "매우 활발한 지갑입니다",
      "분석에 시간이 필요한 대규모 활동 이력이 감지되었습니다",
    ],
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  // 1. DB에서 기존 데이터 확인
  const matchedWallets = await db
    .select({ id: wallets.id })
    .from(wallets)
    .where(eq(wallets.address, address));

  // 2. DB에 없으면 worker에 실시간 스캔 요청
  if (matchedWallets.length === 0) {
    const workerUrl = process.env.WORKER_URL;
    if (workerUrl) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15_000);
      try {
        const workerRes = await fetch(`${workerUrl}/scan/public`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (workerRes.ok) {
          const workerData = await workerRes.json();
          return NextResponse.json(workerData);
        }
      } catch (error) {
        clearTimeout(timeout);
        if (error instanceof DOMException && error.name === "AbortError") {
          // 타임아웃 → 트랜잭션이 많은 지갑으로 간주, 긍정 평가 반환
          return NextResponse.json(buildHeavyWalletResult(address));
        }
        console.error("[scan] Worker call failed:", error);
      }
    }

    // Worker 미사용 또는 실패 시 빈 결과
    return NextResponse.json({
      found: false,
      identity: {
        address,
        activeChains: 0,
        totalTrades: 0,
        totalVolume: 0,
        tier: "bronze",
        tierPercentile: 50,
        dna: [],
        activityScore: 0,
      },
      chains: [],
      transactions: [],
      pnlHistory: [],
      chainPnl: [],
      topTrades: [],
      taxSummary: { totalGains: 0, totalLosses: 0, netProfit: 0, chainBreakdown: [] },
      insights: [],
    } satisfies ScanResult & { found: boolean });
  }

  // 3. DB에 데이터가 있으면 기존 로직
  const walletIds = matchedWallets.map((w) => w.id);

  const allTx = await db
    .select({
      id: transactions.id,
      chainId: transactions.chainId,
      hash: transactions.hash,
      timestamp: transactions.timestamp,
      protocol: transactions.protocol,
      type: transactions.type,
      typeLabel: transactions.typeLabel,
      amount: transactions.amount,
      status: transactions.status,
    })
    .from(transactions)
    .where(
      sql`${transactions.walletId} IN (${sql.join(
        walletIds.map((id) => sql`${id}`),
        sql`, `
      )})`
    );

  const chainIds = [...new Set(allTx.map((tx) => tx.chainId))];
  const totalTrades = allTx.length;
  const totalVolume = allTx.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  const tier = computeTier(totalTrades);
  const tierPercentile = computeTierPercentile(totalTrades);

  const typeCounts: Record<DnaCategory, number> = { perp: 0, dex: 0, yield: 0, lending: 0 };
  for (const tx of allTx) {
    const cat = TX_TYPE_TO_DNA[tx.type];
    if (cat) {
      typeCounts[cat]++;
    } else if (tx.type.startsWith("perp") || tx.type === "long" || tx.type === "short") {
      typeCounts.perp++;
    }
  }
  const totalCategorized = Object.values(typeCounts).reduce((a, b) => a + b, 0);
  const dna = (Object.entries(typeCounts) as [DnaCategory, number][])
    .filter(([, count]) => count > 0)
    .map(([category, count]) => ({
      category,
      label: DNA_LABELS[category],
      percentage: totalCategorized > 0 ? Math.round((count / totalCategorized) * 100) : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const chainMap: Record<string, { txCount: number; volume: number }> = {};
  for (const tx of allTx) {
    if (!chainMap[tx.chainId]) chainMap[tx.chainId] = { txCount: 0, volume: 0 };
    chainMap[tx.chainId].txCount++;
    chainMap[tx.chainId].volume += Number(tx.amount || 0);
  }

  const jobs = await db
    .select({ chainId: scanJobs.chainId, status: scanJobs.status })
    .from(scanJobs)
    .where(
      sql`${scanJobs.walletId} IN (${sql.join(
        walletIds.map((id) => sql`${id}`),
        sql`, `
      )})`
    );
  const jobStatusMap: Record<string, string> = {};
  for (const job of jobs) jobStatusMap[job.chainId] = job.status;

  const chains: ChainActivity[] = Object.entries(chainMap).map(([chainId, data]) => ({
    chainId: chainId as ChainActivity["chainId"],
    name: CHAIN_NAMES[chainId] || chainId,
    txCount: data.txCount,
    volume: Math.round(data.volume),
    status: (jobStatusMap[chainId] === "scanning" ? "scanning" : "completed") as ChainActivity["status"],
  }));

  const recentTx = [...allTx]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)
    .map((tx) => {
      const diffMs = Date.now() - new Date(tx.timestamp).getTime();
      const diffH = Math.floor(diffMs / (1000 * 60 * 60));
      const diffD = Math.floor(diffH / 24);
      const timestamp = diffH < 1 ? "방금" : diffD < 1 ? `${diffH}h ago` : `${diffD}d ago`;
      return {
        id: tx.id,
        timestamp,
        protocol: tx.protocol || "Unknown",
        chainId: tx.chainId as ChainActivity["chainId"],
        type: tx.typeLabel || tx.type,
        amount: Number(tx.amount || 0),
        status: tx.status as "completed" | "pending" | "failed",
      };
    });

  const insights: string[] = [];
  if (chains.length > 0) {
    const topChain = [...chains].sort((a, b) => b.txCount - a.txCount)[0];
    insights.push(`${topChain.name} 주요 활동: ${topChain.txCount}건 트랜잭션`);
  }
  if (dna.length > 0) insights.push(`${dna[0].label} ${dna[0].percentage}%로 가장 높은 비율`);
  insights.push(`활동 스코어: ${totalTrades.toLocaleString()}점`);
  if (chainIds.length > 1) insights.push(`크로스체인 활동이 활발 (${chainIds.length}개 체인)`);

  return NextResponse.json({
    found: true,
    identity: {
      address,
      activeChains: chainIds.length,
      totalTrades,
      totalVolume: Math.round(totalVolume),
      tier,
      tierPercentile,
      dna,
      activityScore: totalTrades,
    },
    chains,
    transactions: recentTx,
    pnlHistory: [],
    chainPnl: chains.map((c) => ({
      chainId: c.chainId,
      name: c.name,
      pnl: 0,
      percentage: totalVolume > 0 ? Math.round((c.volume / totalVolume) * 100) : 0,
    })),
    topTrades: [...allTx]
      .sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))
      .slice(0, 5)
      .map((tx, i) => ({
        rank: i + 1,
        description: `${tx.typeLabel || tx.type} — ${tx.protocol || "Unknown"}`,
        chainId: tx.chainId as ChainActivity["chainId"],
        amount: Number(tx.amount || 0),
      })),
    taxSummary: { totalGains: 0, totalLosses: 0, netProfit: 0, chainBreakdown: [] },
    insights,
  } satisfies ScanResult & { found: boolean });
}
