import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { db } from "@/core/db";
import { wallets, transactions } from "@/core/db/schema";
import { eq, sql } from "drizzle-orm";

// Edge → Node runtime으로 변경 (DB 접근을 위해)

interface DnaItem {
  label: string;
  percentage: number;
  color: string;
}

const TYPE_COLORS: Record<string, string> = {
  swap: "#FF6B35",
  transfer: "#3B82F6",
  bridge: "#10B981",
  stake: "#8B5CF6",
  lp_add: "#F59E0B",
  lp_remove: "#F59E0B",
  borrow: "#EF4444",
  repay: "#EF4444",
  claim: "#06B6D4",
  approve: "#6B7280",
};

const TYPE_LABELS: Record<string, string> = {
  swap: "DEX Swaps",
  transfer: "Transfers",
  bridge: "Bridging",
  stake: "Staking",
  lp_add: "Yield Farming",
  lp_remove: "Yield Farming",
  borrow: "Lending",
  repay: "Lending",
  claim: "Claims",
  approve: "Approvals",
};

function getTierInfo(txCount: number): {
  tier: string;
  emoji: string;
  color: string;
  percentile: string;
} {
  if (txCount >= 5000)
    return {
      tier: "Diamond Explorer",
      emoji: "\u{1F48E}",
      color: "#B9F2FF",
      percentile: "Top 1%",
    };
  if (txCount >= 1000)
    return {
      tier: "Gold Explorer",
      emoji: "\u{1F947}",
      color: "#FFD700",
      percentile: "Top 5%",
    };
  if (txCount >= 500)
    return {
      tier: "Silver Explorer",
      emoji: "\u{1F948}",
      color: "#C0C0C0",
      percentile: "Top 15%",
    };
  return {
    tier: "Bronze Explorer",
    emoji: "\u{1F949}",
    color: "#CD7F32",
    percentile: "Top 50%",
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> },
) {
  const { address } = await params;
  const short = `${address.slice(0, 6)}...${address.slice(-4)}`;

  // DB에서 실제 데이터 조회
  let dna: DnaItem[] = [];
  let chainCount = 0;
  let totalTrades = 0;
  let tierInfo = getTierInfo(0);

  try {
    // 지갑 찾기
    const wallet = await db.query.wallets.findFirst({
      where: eq(wallets.address, address.toLowerCase()),
    });

    if (wallet) {
      // 트랜잭션 타입별 집계
      const typeCounts = await db
        .select({
          type: transactions.type,
          count: sql<number>`count(*)::int`,
        })
        .from(transactions)
        .where(eq(transactions.walletId, wallet.id))
        .groupBy(transactions.type)
        .orderBy(sql`count(*) DESC`);

      totalTrades = typeCounts.reduce((sum, t) => sum + (t.count ?? 0), 0);

      // 체인 수
      const chains = await db
        .select({ chainId: transactions.chainId })
        .from(transactions)
        .where(eq(transactions.walletId, wallet.id))
        .groupBy(transactions.chainId);
      chainCount = chains.length;

      // DeFi DNA 계산 (타입별 비율)
      if (totalTrades > 0) {
        const merged: Record<string, number> = {};
        for (const tc of typeCounts) {
          const label = TYPE_LABELS[tc.type] || tc.type;
          merged[label] = (merged[label] || 0) + (tc.count ?? 0);
        }
        const sorted = Object.entries(merged).sort((a, b) => b[1] - a[1]);
        dna = sorted.slice(0, 4).map(([label, count]) => ({
          label,
          percentage: Math.round((count / totalTrades) * 100),
          color:
            TYPE_COLORS[
              Object.entries(TYPE_LABELS).find(
                ([, v]) => v === label,
              )?.[0] || "approve"
            ] || "#6B7280",
        }));
      }

      tierInfo = getTierInfo(totalTrades);
    }
  } catch {
    // DB 오류 시 기본값 유지
  }

  // 데이터가 없으면 기본 DNA 표시
  if (dna.length === 0) {
    dna = [
      { label: "No Data", percentage: 100, color: "#333333" },
    ];
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          background:
            "linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 50%, #0D1B2A 100%)",
          padding: "48px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Left side (60%) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "60%",
            paddingRight: "48px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#71717A",
              marginBottom: "8px",
              fontFamily: "monospace",
              display: "flex",
            }}
          >
            {short}
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 600,
              color: "#FAFAFA",
              marginBottom: "32px",
              display: "flex",
            }}
          >
            DeFi Identity 2025
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                color: "#A1A1AA",
                fontSize: "18px",
              }}
            >
              {chainCount} Chain{chainCount !== 1 ? "s" : ""} &middot;{" "}
              {totalTrades.toLocaleString()} Trades
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: `${tierInfo.color}22`,
              padding: "16px 20px",
              borderRadius: "8px",
            }}
          >
            <span style={{ fontSize: "28px", display: "flex" }}>
              {tierInfo.emoji}
            </span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: tierInfo.color,
                  display: "flex",
                }}
              >
                {tierInfo.tier}
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#71717A",
                  display: "flex",
                }}
              >
                {tierInfo.percentile}
              </span>
            </div>
          </div>
        </div>

        {/* Right side (40%) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "40%",
            gap: "16px",
          }}
        >
          <div
            style={{ fontSize: "14px", color: "#71717A", display: "flex" }}
          >
            DeFi DNA:
          </div>
          {dna.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    height: "16px",
                    background: "#222222",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${item.percentage}%`,
                      height: "100%",
                      background: item.color,
                      borderRadius: "4px 0 0 4px",
                      display: "flex",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#FAFAFA",
                    width: "40px",
                    textAlign: "right",
                    display: "flex",
                  }}
                >
                  {item.percentage}%
                </span>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "#A1A1AA",
                  display: "flex",
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            left: "0",
            right: "0",
            textAlign: "center",
            fontSize: "14px",
            color: "#71717A",
            display: "flex",
            justifyContent: "center",
          }}
        >
          cryptree.xyz
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
