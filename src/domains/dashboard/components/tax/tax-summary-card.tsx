"use client";

import type { TaxReportData } from "@/core/types";
import { useT } from "@/core/i18n";

interface TaxSummaryCardProps {
  data: TaxReportData;
}

export function TaxSummaryCard({ data }: TaxSummaryCardProps) {
  const t = useT();

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[16px] leading-[24px] font-semibold text-text-primary mb-6">
        {t.dashboard.tax.taxSummary(data.year)}
      </h3>
      <div className="space-y-0">
        <div className="flex justify-between items-center h-12">
          <span className="text-[14px] text-text-secondary">{t.dashboard.tax.totalRealizedGains}</span>
          <span className="text-[16px] font-semibold text-positive tabular-nums">
            +${data.totalGains.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center h-12">
          <span className="text-[14px] text-text-secondary">{t.dashboard.tax.totalRealizedLosses}</span>
          <span className="text-[16px] font-semibold text-negative tabular-nums">
            -${data.totalLosses.toLocaleString()}
          </span>
        </div>
        <div className="border-t border-dashed border-border-default my-2" />
        <div className="flex justify-between items-center h-12">
          <span className="text-[14px] text-text-secondary">{t.dashboard.tax.netIncome}</span>
          <span className="text-[24px] leading-[32px] font-bold text-text-primary tabular-nums">
            ${data.netIncome.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
