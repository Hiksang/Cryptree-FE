"use client";

import { useState } from "react";
import type { LeaderboardTab } from "@/core/types";
import { useLeaderboard } from "@/domains/dashboard/hooks/use-dashboard-queries";
import { TabSelector } from "@/domains/dashboard";
import { RankingsTable } from "@/domains/dashboard";
import { MyPosition } from "@/domains/dashboard";
import { ErrorState } from "@/shared/ui";
import { EmptyState } from "@/shared/ui";
import { TableCardSkeleton, StatsCardSkeleton } from "@/shared/ui";

export default function LeaderboardPage() {
  const [tab, setTab] = useState<LeaderboardTab>("pnl");
  const { data, isLoading, isError, refetch } = useLeaderboard(tab);

  return (
    <div className="space-y-6 max-w-[1200px]">
      <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">
        리더보드
      </h1>

      <TabSelector selected={tab} onChange={setTab} />

      {isLoading && (
        <>
          <StatsCardSkeleton />
          <TableCardSkeleton rows={10} />
        </>
      )}

      {isError && <ErrorState onRetry={() => refetch()} />}

      {data && !isLoading && (
        data.entries.length > 0 ? (
          <>
            {data.myPosition && (
              <MyPosition position={data.myPosition} tab={tab} />
            )}
            <RankingsTable entries={data.entries} tab={tab} />
            <p className="text-[12px] text-text-muted text-right">
              마지막 업데이트:{" "}
              {new Date(data.updatedAt).toLocaleString("ko-KR")}
            </p>
          </>
        ) : (
          <EmptyState
            title="리더보드 준비 중"
            description="참여자가 충분히 모이면 리더보드가 활성화됩니다."
          />
        )
      )}
    </div>
  );
}
