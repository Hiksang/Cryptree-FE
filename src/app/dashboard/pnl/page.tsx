"use client";

import { useState } from "react";
import type { PnlPeriod, ChainId } from "@/core/types";
import { usePnl } from "@/domains/dashboard/hooks/use-dashboard-queries";
import { PeriodSelector } from "@/domains/dashboard";
import { ChainFilter } from "@/domains/dashboard";
import { PnlAreaChart } from "@/domains/dashboard";
import { ChainPnlCards } from "@/domains/dashboard";
import { TopTradesTable } from "@/domains/dashboard";
import { ErrorState } from "@/shared/ui";
import { EmptyState } from "@/shared/ui";
import { ChartCardSkeleton, StatsCardSkeleton, TableCardSkeleton } from "@/shared/ui";

export default function PnlPage() {
  const [period, setPeriod] = useState<PnlPeriod>("7d");
  const [chainFilter, setChainFilter] = useState<ChainId | "all">("all");
  const { data, isLoading, isError, refetch } = usePnl(period);

  if (isError) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">PnL 분석</h1>
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  const filteredChainPnl =
    data && chainFilter === "all"
      ? data.chainPnl
      : data?.chainPnl.filter((c) => c.chainId === chainFilter) ?? [];

  return (
    <div className="space-y-6 max-w-[1200px]">
      <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">
        PnL 분석
      </h1>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <PeriodSelector selected={period} onChange={setPeriod} />
        <ChainFilter selected={chainFilter} onChange={setChainFilter} />
      </div>

      {isLoading ? (
        <>
          <ChartCardSkeleton />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TableCardSkeleton rows={5} />
            <TableCardSkeleton rows={5} />
          </div>
        </>
      ) : data && data.history.length > 0 ? (
        <>
          <PnlAreaChart data={data.history} totalPnl={15_247} />
          <ChainPnlCards chains={filteredChainPnl} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopTradesTable trades={data.topTrades} title="Best 거래" />
            <TopTradesTable
              trades={data.topTrades.map((t) => ({
                ...t,
                amount: -t.amount * 0.3,
                description: t.description.replace("Long", "Short"),
              }))}
              title="Worst 거래"
            />
          </div>
        </>
      ) : (
        <EmptyState
          title="PnL 데이터 준비 중"
          description="거래 내역이 수집되면 손익 분석이 표시됩니다. 지갑을 연결하고 스캔을 완료해주세요."
        />
      )}
    </div>
  );
}
