"use client";

import { useExchange } from "@/domains/dashboard/hooks/use-dashboard-queries";
import { PointsBalanceHero } from "@/domains/dashboard";
import { AdRevenueBanner } from "@/domains/dashboard";
import { UsdcExchangeCard } from "@/domains/dashboard";
import { ProductGrid } from "@/domains/dashboard";
import { ExchangeHistoryTable } from "@/domains/dashboard";
import { ErrorState } from "@/shared/ui";
import { StatsCardSkeleton, TableCardSkeleton } from "@/shared/ui";

export default function ExchangePage() {
  const { data, isLoading, isError, refetch } = useExchange();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <div className="h-8 w-24 skeleton rounded-[4px]" />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
        <TableCardSkeleton rows={4} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">
          포인트샵
        </h1>
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px]">
      <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">
        포인트샵
      </h1>

      <PointsBalanceHero
        balance={data.pointsBalance}
        lifetimeEarned={data.lifetimeEarned}
        lifetimeSpent={data.lifetimeSpent}
      />

      <AdRevenueBanner
        totalAdRevenue={data.adRevenueShare.totalAdRevenue}
        yourShare={data.adRevenueShare.yourShare}
        sharePercent={data.adRevenueShare.sharePercent}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductGrid
            products={data.products}
            pointsBalance={data.pointsBalance}
          />
        </div>
        <div>
          <UsdcExchangeCard
            exchangeRate={data.exchangeRate}
            pointsBalance={data.pointsBalance}
          />
        </div>
      </div>

      <ExchangeHistoryTable history={data.history} />
    </div>
  );
}
