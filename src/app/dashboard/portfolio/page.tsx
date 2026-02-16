"use client";

import { usePortfolio } from "@/domains/dashboard/hooks/use-dashboard-queries";
import { PortfolioSummary } from "@/domains/dashboard";
import { ChainAssetList } from "@/domains/dashboard";
import { AllocationChart } from "@/domains/dashboard";
import { ErrorState } from "@/shared/ui";
import { EmptyState } from "@/shared/ui";
import {
  StatsCardSkeleton,
  ChartCardSkeleton,
  TableCardSkeleton,
} from "@/shared/ui";

export default function PortfolioPage() {
  const { data, isLoading, isError, refetch } = usePortfolio();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <div className="h-8 w-28 skeleton rounded-[4px]" />
        <StatsCardSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TableCardSkeleton rows={8} />
          </div>
          <div className="lg:col-span-1">
            <ChartCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">포트폴리오</h1>
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px]">
      <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">
        포트폴리오
      </h1>

      {data.chains.length === 0 ? (
        <EmptyState
          title="포트폴리오 데이터 준비 중"
          description="지갑을 연결하고 스캔이 완료되면 체인별 자산 현황이 표시됩니다. 설정에서 지갑을 추가해주세요."
        />
      ) : (
        <>
          <PortfolioSummary data={data} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChainAssetList chains={data.chains} />
            </div>
            <div className="lg:col-span-1">
              <AllocationChart chains={data.chains} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
