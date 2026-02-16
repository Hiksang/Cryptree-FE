"use client";

import { useDashboardStats, usePortfolio, usePnl, useTransactions } from "@/domains/dashboard/hooks/use-dashboard-queries";
import { StatsCards } from "@/domains/dashboard";
import { PnlOverviewChart } from "@/domains/dashboard";
import { PortfolioList } from "@/domains/dashboard";
import { InsightsCards } from "@/domains/dashboard";
import { RecentTrades } from "@/domains/dashboard";
import { ErrorState } from "@/shared/ui";
import {
  StatsCardSkeleton,
  ChartCardSkeleton,
  TableCardSkeleton,
} from "@/shared/ui";

export default function DashboardPage() {
  const { data: statsData, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useDashboardStats();
  const { data: portfolioData, isLoading: portfolioLoading } = usePortfolio();
  const { data: pnlData, isLoading: pnlLoading } = usePnl("7d");
  const { data: txData, isLoading: txLoading } = useTransactions({ page: "1" });

  if (statsError) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">대시보드</h1>
        <ErrorState onRetry={() => refetchStats()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px]">
      <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">
        대시보드
      </h1>

      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        statsData && <StatsCards stats={statsData.stats} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          {pnlLoading ? (
            <ChartCardSkeleton />
          ) : (
            <PnlOverviewChart data={pnlData?.history ?? []} />
          )}
        </div>
        <div className="lg:col-span-2">
          {portfolioLoading ? (
            <TableCardSkeleton rows={5} />
          ) : (
            portfolioData && <PortfolioList data={portfolioData} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          {statsLoading ? (
            <TableCardSkeleton rows={4} />
          ) : (
            statsData && <InsightsCards insights={statsData.insights} />
          )}
        </div>
        <div className="lg:col-span-3">
          {txLoading ? (
            <TableCardSkeleton rows={5} />
          ) : (
            <RecentTrades transactions={txData?.transactions ?? []} />
          )}
        </div>
      </div>
    </div>
  );
}
