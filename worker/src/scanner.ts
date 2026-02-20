/**
 * 지갑 트랜잭션 스캐너
 *
 * Etherscan V2 API (primary) + Blockscout (fallback)을 사용하여
 * 지갑의 트랜잭션 히스토리를 수집한다.
 *
 * 전략:
 * 1. Etherscan V2로 일반 TX + 토큰 전송을 조회
 * 2. Etherscan이 실패하면 Blockscout으로 fallback
 * 3. 전역 rate limiter가 여러 유저의 병렬 요청을 조절
 *
 * 동시성 제어:
 * - 전역 rate limiter: API 호출 속도 제한 (Etherscan 4/sec, Blockscout 10/sec)
 * - 체인별 병렬 스캔: 한 지갑의 여러 체인을 동시에 스캔
 * - 유저별 직렬화: 같은 지갑은 중복 스캔 방지 (scan_jobs 테이블)
 */

import { db } from "./lib/db.js";
import { wallets, transactions, scanJobs, users } from "./lib/schema.js";
import { eq, sql } from "drizzle-orm";
import {
  getEtherscanClient,
  type EtherscanTransaction,
  type EtherscanTokenTransfer,
} from "./lib/etherscan.js";
import { getBlockscoutClient } from "./lib/blockscout.js";
import { SUPPORTED_CHAINS, getChainIds, type ChainConfig } from "./lib/chains.js";

// ========== 트랜잭션 분류 ==========

function classifyTransaction(tx: EtherscanTransaction): {
  type: string;
  typeLabel: string;
} {
  // 컨트랙트 호출인 경우 (functionName이 있으면)
  if (tx.functionName && tx.functionName.length > 0) {
    const fn = tx.functionName.toLowerCase();
    if (fn.includes("swap")) return { type: "swap", typeLabel: "스왑" };
    if (fn.includes("approve")) return { type: "approve", typeLabel: "승인" };
    if (fn.includes("stake") || fn.includes("deposit"))
      return { type: "stake", typeLabel: "스테이킹" };
    if (fn.includes("withdraw") || fn.includes("unstake"))
      return { type: "unstake", typeLabel: "언스테이킹" };
    if (fn.includes("claim")) return { type: "claim", typeLabel: "클레임" };
    if (fn.includes("mint")) return { type: "mint", typeLabel: "민트" };
    if (fn.includes("bridge")) return { type: "bridge", typeLabel: "브릿지" };
    return { type: "contract_call", typeLabel: "컨트랙트" };
  }

  // 단순 전송
  return { type: "transfer", typeLabel: "전송" };
}

function classifyTokenTransfer(tx: EtherscanTokenTransfer): {
  type: string;
  typeLabel: string;
} {
  return { type: "token_transfer", typeLabel: `${tx.tokenSymbol} 전송` };
}

// ========== 스팸 토큰 필터 ==========

const SPAM_PATTERNS = [
  /\.com/i, /\.net/i, /\.org/i, /\.io/i, /\.xyz/i, /\.cfd/i, /\.link/i, /\.so/i,
  /https?:\/\//i, /www\./i,
  /visit/i, /claim reward/i, /voucher/i, /airdrop/i,
];

function isSpamToken(tx: EtherscanTokenTransfer): boolean {
  const name = `${tx.tokenName} ${tx.tokenSymbol}`;
  return SPAM_PATTERNS.some((p) => p.test(name));
}

// ========== 체인별 데이터 소스 선택 ==========

interface TransactionData {
  normalTxs: EtherscanTransaction[];
  tokenTxs: EtherscanTokenTransfer[];
}

async function fetchChainData(
  chainId: string,
  chain: ChainConfig,
  address: string,
  fromBlock?: number,
): Promise<TransactionData> {
  const etherscan = getEtherscanClient();

  try {
    // 1차: Etherscan V2 시도
    const [normalTxs, tokenTxs] = await Promise.all([
      etherscan.getTransactions(chain.etherscanChainId, {
        address,
        startBlock: fromBlock,
        sort: "asc",
      }),
      etherscan.getTokenTransfers(chain.etherscanChainId, {
        address,
        startBlock: fromBlock,
        sort: "asc",
      }),
    ]);

    console.log(
      `[scanner] Etherscan ${chainId}: ${normalTxs.length} txs, ${tokenTxs.length} transfers`,
    );
    return { normalTxs, tokenTxs };
  } catch (error) {
    console.warn(
      `[scanner] Etherscan failed for ${chainId}, trying Blockscout:`,
      error instanceof Error ? error.message : error,
    );
  }

  // 2차: Blockscout fallback
  if (chain.blockscoutApiUrl) {
    try {
      const blockscout = getBlockscoutClient(chain.blockscoutApiUrl);
      const [normalTxs, tokenTxs] = await Promise.all([
        blockscout.getTransactions({ address, startBlock: fromBlock, sort: "asc" }),
        blockscout.getTokenTransfers({ address, startBlock: fromBlock, sort: "asc" }),
      ]);

      console.log(
        `[scanner] Blockscout ${chainId}: ${normalTxs.length} txs, ${tokenTxs.length} transfers`,
      );
      return {
        normalTxs: normalTxs as EtherscanTransaction[],
        tokenTxs: tokenTxs as EtherscanTokenTransfer[],
      };
    } catch (error) {
      console.error(
        `[scanner] Blockscout also failed for ${chainId}:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  return { normalTxs: [], tokenTxs: [] };
}

// ========== 스캔 로직 ==========

/**
 * 단일 지갑의 특정 체인 스캔
 */
export async function scanWalletChain(
  walletId: string,
  address: string,
  userId: string,
  chainId: string,
  fromBlock?: number,
): Promise<number> {
  const chain = SUPPORTED_CHAINS[chainId];
  if (!chain) {
    console.log(`[scanner] Skipping unknown chain: ${chainId}`);
    return 0;
  }

  // 스캔 작업 생성
  const [job] = await db
    .insert(scanJobs)
    .values({
      walletId,
      chainId,
      status: "running",
      scanType: fromBlock ? "incremental" : "full",
      fromBlock: fromBlock || 0,
      startedAt: new Date(),
    })
    .returning();

  try {
    console.log(
      `[scanner] Scanning ${chainId} for ${address.slice(0, 10)}... from block ${fromBlock || 0}`,
    );

    // 데이터 소스에서 트랜잭션 가져오기
    const { normalTxs, tokenTxs } = await fetchChainData(
      chainId,
      chain,
      address,
      fromBlock,
    );

    if (normalTxs.length === 0 && tokenTxs.length === 0) {
      await db
        .update(scanJobs)
        .set({ status: "completed", txCount: 0, completedAt: new Date() })
        .where(eq(scanJobs.id, job.id));
      return 0;
    }

    // 일반 TX → DB rows
    const normalRows = normalTxs.map((tx) => {
      const { type, typeLabel } = classifyTransaction(tx);
      return {
        walletId,
        userId,
        chainId,
        hash: tx.hash,
        blockNumber: parseInt(tx.blockNumber, 10),
        timestamp: new Date(parseInt(tx.timeStamp, 10) * 1000),
        protocol: null as string | null,
        type,
        typeLabel,
        fromToken: chain.nativeSymbol,
        toToken: null as string | null,
        amount: tx.value,
        fee: String(
          (BigInt(tx.gasUsed || "0") * BigInt(tx.gasPrice || "0")) /
            BigInt(1e18),
        ),
        status: tx.isError === "0" ? "completed" : "failed",
        rawData: tx as unknown as Record<string, unknown>,
      };
    });

    // 토큰 TX → DB rows (스팸 필터링)
    const filteredTokenTxs = tokenTxs.filter((tx) => {
      if (isSpamToken(tx)) return false;
      if (tx.from.toLowerCase() !== address.toLowerCase() && parseFloat(tx.value) === 0) return false;
      return true;
    });
    const tokenRows = filteredTokenTxs.map((tx) => {
      const { type, typeLabel } = classifyTokenTransfer(tx);
      return {
        walletId,
        userId,
        chainId,
        hash: tx.hash,
        blockNumber: parseInt(tx.blockNumber, 10),
        timestamp: new Date(parseInt(tx.timeStamp, 10) * 1000),
        protocol: null as string | null,
        type,
        typeLabel,
        fromToken: tx.tokenSymbol || tx.contractAddress,
        toToken: null as string | null,
        amount: tx.value,
        fee: "0",
        status: "completed",
        rawData: tx as unknown as Record<string, unknown>,
      };
    });

    const allRows = [...normalRows, ...tokenRows];

    // 중복 무시하고 INSERT
    let insertedCount = 0;
    for (const row of allRows) {
      try {
        await db.insert(transactions).values(row).onConflictDoNothing();
        insertedCount++;
      } catch {
        // 중복 해시 무시
      }
    }

    // 마지막 블록 번호 업데이트
    const maxBlock = Math.max(...allRows.map((r) => r.blockNumber || 0));
    const currentBlocks =
      (await db.query.wallets.findFirst({
        where: eq(wallets.id, walletId),
        columns: { lastScannedBlock: true },
      })) || {};

    const updatedBlocks = {
      ...((currentBlocks as { lastScannedBlock?: Record<string, number> })
        .lastScannedBlock || {}),
      [chainId]: maxBlock,
    };

    await db
      .update(wallets)
      .set({ lastScannedBlock: updatedBlocks, lastScannedAt: new Date() })
      .where(eq(wallets.id, walletId));

    // 스캔 작업 완료
    await db
      .update(scanJobs)
      .set({
        status: "completed",
        txCount: insertedCount,
        toBlock: maxBlock,
        completedAt: new Date(),
      })
      .where(eq(scanJobs.id, job.id));

    console.log(
      `[scanner] ${chainId}: ${insertedCount} transactions imported`,
    );
    return insertedCount;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[scanner] Error scanning ${chainId}:`, errorMsg);

    await db
      .update(scanJobs)
      .set({ status: "failed", error: errorMsg, completedAt: new Date() })
      .where(eq(scanJobs.id, job.id));

    return 0;
  }
}

/**
 * 지갑의 모든 지원 체인 풀스캔
 */
export async function fullScanWallet(
  walletId: string,
  address: string,
  userId: string,
): Promise<number> {
  console.log(`[scanner] Starting full scan for wallet ${address}`);

  const chains = getChainIds();
  let total = 0;

  // 체인별 병렬 스캔
  // rate limiter가 전역적으로 API 호출 속도를 제한하므로 안전하게 병렬 실행 가능
  const results = await Promise.allSettled(
    chains.map((chainId) =>
      scanWalletChain(walletId, address, userId, chainId),
    ),
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      total += result.value;
    }
  }

  // 스캔 완료 후 티어 자동 업데이트
  try {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(transactions)
      .where(eq(transactions.userId, userId));

    const tier = count >= 2000 ? "diamond" : count >= 500 ? "gold" : count >= 100 ? "silver" : "bronze";
    await db.update(users).set({ tier }).where(eq(users.authId, userId));
    console.log(`[scanner] User ${userId} tier updated to ${tier} (${count} txs)`);
  } catch (error) {
    console.error(`[scanner] Failed to update tier:`, error instanceof Error ? error.message : error);
  }

  console.log(`[scanner] Full scan complete: ${total} total transactions`);
  return total;
}

/**
 * 공개 스캔 — DB 저장 없이 주소의 온체인 활동을 조회하여 결과 반환
 */
export async function publicScanAddress(address: string) {
  console.log(`[scanner] Public scan for ${address}`);

  const chainIds = getChainIds();

  const chainResults = await Promise.allSettled(
    chainIds.map(async (chainId) => {
      const chain = SUPPORTED_CHAINS[chainId];
      if (!chain) return null;
      const data = await fetchChainData(chainId, chain, address);
      return { chainId, chain, data };
    }),
  );

  // 트랜잭션 수집 + 분류
  const allTxs: Array<{
    chainId: string;
    chainName: string;
    hash: string;
    timestamp: number;
    type: string;
    typeLabel: string;
    amount: number;
    status: string;
    fromToken: string;
  }> = [];

  const chainBreakdown: Record<string, { txCount: number; volume: number }> = {};

  for (const result of chainResults) {
    if (result.status !== "fulfilled" || !result.value) continue;
    const { chainId, chain, data } = result.value;

    let chainTxCount = 0;
    let chainVolume = 0;

    for (const tx of data.normalTxs) {
      const { type, typeLabel } = classifyTransaction(tx);
      const amount = parseFloat(tx.value) / 1e18;
      allTxs.push({
        chainId,
        chainName: chain.name,
        hash: tx.hash,
        timestamp: parseInt(tx.timeStamp, 10),
        type,
        typeLabel,
        amount,
        status: tx.isError === "0" ? "completed" : "failed",
        fromToken: chain.nativeSymbol,
      });
      chainTxCount++;
      chainVolume += amount;
    }

    for (const tx of data.tokenTxs) {
      if (isSpamToken(tx)) continue;
      // 유저가 보낸 것이 아닌 0-value 토큰 에어드롭 무시
      if (tx.from.toLowerCase() !== address.toLowerCase() && parseFloat(tx.value) === 0) continue;

      const { type, typeLabel } = classifyTokenTransfer(tx);
      const decimals = parseInt(tx.tokenDecimal, 10) || 18;
      const amount = parseFloat(tx.value) / Math.pow(10, decimals);
      allTxs.push({
        chainId,
        chainName: chain.name,
        hash: tx.hash,
        timestamp: parseInt(tx.timeStamp, 10),
        type,
        typeLabel,
        amount,
        status: "completed",
        fromToken: tx.tokenSymbol || "TOKEN",
      });
      chainTxCount++;
      chainVolume += amount;
    }

    if (chainTxCount > 0) {
      chainBreakdown[chainId] = { txCount: chainTxCount, volume: chainVolume };
    }
  }

  if (allTxs.length === 0) {
    return { found: false };
  }

  // Identity 계산
  const activeChains = Object.keys(chainBreakdown).length;
  const totalTrades = allTxs.length;
  const totalVolume = Object.values(chainBreakdown).reduce((s, c) => s + c.volume, 0);
  const tier = totalTrades >= 2000 ? "diamond" : totalTrades >= 500 ? "gold" : totalTrades >= 100 ? "silver" : "bronze";
  const tierPercentile = totalTrades >= 2000 ? 1 : totalTrades >= 500 ? 5 : totalTrades >= 100 ? 20 : 50;

  // DNA 계산
  const DNA_MAP: Record<string, string> = {
    swap: "dex", lp_add: "yield", lp_remove: "yield",
    stake: "yield", unstake: "yield", borrow: "lending", repay: "lending",
  };
  const DNA_LABEL: Record<string, string> = {
    perp: "Perp Trading", dex: "DEX Swaps", yield: "Yield Farming", lending: "Lending",
  };
  const typeCounts: Record<string, number> = { perp: 0, dex: 0, yield: 0, lending: 0 };
  for (const tx of allTxs) {
    const cat = DNA_MAP[tx.type];
    if (cat) typeCounts[cat]++;
  }
  const totalCat = Object.values(typeCounts).reduce((a, b) => a + b, 0);
  const dna = Object.entries(typeCounts)
    .filter(([, c]) => c > 0)
    .map(([cat, c]) => ({
      category: cat,
      label: DNA_LABEL[cat] || cat,
      percentage: totalCat > 0 ? Math.round((c / totalCat) * 100) : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // 체인 목록
  const chains = Object.entries(chainBreakdown).map(([id, d]) => ({
    chainId: id,
    name: SUPPORTED_CHAINS[id]?.name || id,
    txCount: d.txCount,
    volume: Math.round(d.volume),
    status: "completed",
  }));

  // 최근 5건
  const now = Date.now() / 1000;
  const recentTxs = allTxs
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5)
    .map((tx, i) => {
      const diffS = now - tx.timestamp;
      const diffH = Math.floor(diffS / 3600);
      const diffD = Math.floor(diffH / 24);
      const ts = diffH < 1 ? "방금" : diffD < 1 ? `${diffH}h ago` : `${diffD}d ago`;
      return {
        id: `${tx.hash.slice(0, 10)}-${i}`,
        timestamp: ts,
        protocol: tx.chainName,
        chainId: tx.chainId,
        type: tx.typeLabel,
        amount: Math.round(tx.amount * 100) / 100,
        status: tx.status,
      };
    });

  // 인사이트
  const insights: string[] = [];
  const topChain = [...chains].sort((a, b) => b.txCount - a.txCount)[0];
  if (topChain) insights.push(`${topChain.name} 주요 활동: ${topChain.txCount}건 트랜잭션`);
  if (dna.length > 0) insights.push(`${dna[0].label} ${dna[0].percentage}%로 가장 높은 비율`);
  insights.push(`활동 스코어: ${totalTrades.toLocaleString()}점`);
  if (activeChains > 1) insights.push(`크로스체인 활동이 활발 (${activeChains}개 체인)`);

  console.log(`[scanner] Public scan complete: ${totalTrades} txs across ${activeChains} chains`);

  return {
    found: true,
    identity: {
      address,
      activeChains,
      totalTrades,
      totalVolume: Math.round(totalVolume),
      tier,
      tierPercentile,
      dna,
      activityScore: totalTrades,
    },
    chains,
    transactions: recentTxs,
    pnlHistory: [],
    chainPnl: [],
    topTrades: [],
    taxSummary: { totalGains: 0, totalLosses: 0, netProfit: 0, chainBreakdown: [] },
    insights,
  };
}

/**
 * 증분 스캔 (마지막 블록 이후)
 */
export async function incrementalScanWallet(
  walletId: string,
  address: string,
  userId: string,
  lastScannedBlock: Record<string, number>,
): Promise<number> {
  console.log(`[scanner] Starting incremental scan for wallet ${address}`);

  const chains = getChainIds();
  let total = 0;

  const results = await Promise.allSettled(
    chains.map((chainId) => {
      const fromBlock = lastScannedBlock[chainId]
        ? lastScannedBlock[chainId] + 1
        : undefined;
      return scanWalletChain(walletId, address, userId, chainId, fromBlock);
    }),
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      total += result.value;
    }
  }

  console.log(
    `[scanner] Incremental scan complete: ${total} new transactions`,
  );
  return total;
}
