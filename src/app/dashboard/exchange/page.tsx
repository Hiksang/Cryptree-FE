"use client";

import { useExchange } from "@/domains/dashboard/hooks/use-dashboard-queries";
import { PointsBalanceHero } from "@/domains/dashboard";
import { ProductGrid } from "@/domains/dashboard";
import { ExchangeHistoryTable } from "@/domains/dashboard";
import { ErrorState } from "@/shared/ui";
import { StatsCardSkeleton, TableCardSkeleton } from "@/shared/ui";
import { useT } from "@/core/i18n";

export default function ExchangePage() {
  const { data, isLoading, isError, refetch } = useExchange();
  const t = useT();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <div className="h-8 w-24 skeleton rounded-[4px]" />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <TableCardSkeleton rows={4} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">
          {t.dashboard.exchange.title}
        </h1>
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px]">
      <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">
        {t.dashboard.exchange.title}
      </h1>

      <PointsBalanceHero
        balance={data.pointsBalance}
        lifetimeEarned={data.lifetimeEarned}
        lifetimeSpent={data.lifetimeSpent}
      />

      <ProductGrid
        products={data.products}
        pointsBalance={data.pointsBalance}
      />

      <ExchangeHistoryTable history={data.history} />
    </div>
  );
}
