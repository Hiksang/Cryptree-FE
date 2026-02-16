"use client";

import { useRewards } from "@/domains/dashboard/hooks/use-dashboard-queries";
import { SeasonSummary } from "@/domains/dashboard";
import { PointsBreakdown } from "@/domains/dashboard";
import { ClaimCta } from "@/domains/dashboard";
import { DistributionHistory } from "@/domains/dashboard";
import { ErrorState } from "@/shared/ui";
import { StatsCardSkeleton, TableCardSkeleton } from "@/shared/ui";

export default function RewardsPage() {
  const { data, isLoading, isError, refetch } = useRewards();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <div className="h-8 w-24 skeleton rounded-[4px]" />
        <StatsCardSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
        <TableCardSkeleton rows={3} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">리워드</h1>
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px]">
      <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">
        리워드
      </h1>

      <SeasonSummary season={data.season} />

      {data.claimableAmount > 0 && (
        <ClaimCta amount={data.claimableAmount} token={data.claimableToken} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PointsBreakdown points={data.points} />
        <DistributionHistory distributions={data.distributions} />
      </div>
    </div>
  );
}
