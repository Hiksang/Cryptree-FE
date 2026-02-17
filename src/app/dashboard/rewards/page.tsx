"use client";

import { useRewards, useLeaderboard } from "@/domains/dashboard/hooks/use-dashboard-queries";
import { SeasonSummary } from "@/domains/dashboard";
import { PointsBreakdown } from "@/domains/dashboard";
import { ClaimCta } from "@/domains/dashboard";
import { DistributionHistory } from "@/domains/dashboard";
import { MyPosition, RankingsTable } from "@/domains/dashboard";
import { ErrorState } from "@/shared/ui";
import { StatsCardSkeleton, TableCardSkeleton } from "@/shared/ui";
import { useT } from "@/core/i18n";

export default function RewardsPage() {
  const { data, isLoading, isError, refetch } = useRewards();
  const { data: leaderboardData, isLoading: leaderboardLoading } = useLeaderboard("activity");
  const t = useT();

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
        <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">{t.dashboard.rewards.title}</h1>
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px]">
      <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">
        {t.dashboard.rewards.title}
      </h1>

      <SeasonSummary season={data.season} />

      {data.claimableAmount > 0 && (
        <ClaimCta amount={data.claimableAmount} token={data.claimableToken} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PointsBreakdown points={data.points} />
        <DistributionHistory distributions={data.distributions} />
      </div>

      {/* Leaderboard Section */}
      <div className="space-y-4">
        <h2 className="text-[20px] leading-[28px] font-semibold text-text-primary">
          {t.dashboard.rewards.leaderboard}
        </h2>

        {leaderboardLoading ? (
          <TableCardSkeleton rows={5} />
        ) : leaderboardData ? (
          <>
            {leaderboardData.myPosition && (
              <MyPosition position={leaderboardData.myPosition} tab="activity" />
            )}
            <RankingsTable entries={leaderboardData.entries} tab="activity" />
          </>
        ) : null}
      </div>
    </div>
  );
}
