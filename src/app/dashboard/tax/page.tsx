"use client";

import { useCryptreeStore } from "@/shared/store";
import { useTaxReport } from "@/domains/dashboard/hooks/use-dashboard-queries";
import { CountrySelector } from "@/domains/dashboard";
import { MethodSelector } from "@/domains/dashboard";
import { TaxSummaryCard } from "@/domains/dashboard";
import { ChainTaxBreakdown } from "@/domains/dashboard";
import { ExportCta } from "@/domains/dashboard";
import { ErrorState } from "@/shared/ui";
import { EmptyState } from "@/shared/ui";
import { StatsCardSkeleton, TableCardSkeleton } from "@/shared/ui";

export default function TaxPage() {
  const { preferences, setPreferences } = useCryptreeStore();
  const { country, method } = preferences;
  const { data, isLoading, isError, refetch } = useTaxReport(country, method);

  if (isError) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">세금 보고</h1>
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px]">
      <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">
        세금 보고
      </h1>

      <div className="space-y-4">
        <div>
          <p className="text-[14px] text-text-secondary mb-2">국가</p>
          <CountrySelector
            selected={country}
            onChange={(c) => setPreferences({ country: c })}
          />
        </div>
        <div>
          <p className="text-[14px] text-text-secondary mb-2">계산 방법</p>
          <MethodSelector
            selected={method}
            onChange={(m) => setPreferences({ method: m })}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatsCardSkeleton />
          <TableCardSkeleton rows={5} />
        </div>
      ) : data && data.chainBreakdown.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TaxSummaryCard data={data} />
          <ChainTaxBreakdown chains={data.chainBreakdown} />
        </div>
      ) : (
        <EmptyState
          title="세금 데이터 준비 중"
          description="거래 내역이 수집되면 세금 보고서가 자동 생성됩니다. 지갑을 연결하고 스캔을 완료해주세요."
        />
      )}

      <ExportCta />
    </div>
  );
}
