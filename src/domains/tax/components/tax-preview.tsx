"use client";

import type { TaxSummary } from "@/core/types";
import { CHAIN_COLORS } from "@/core/constants";
import { Check, AlertTriangle } from "lucide-react";
import { useT } from "@/core/i18n";

interface TaxPreviewProps {
  data: TaxSummary;
}

export function TaxPreview({ data }: TaxPreviewProps) {
  const t = useT();

  const ctaItems = [
    t.scan.taxPreview.ctaItem1,
    t.scan.taxPreview.ctaItem2,
    t.scan.taxPreview.ctaItem3,
    t.scan.taxPreview.ctaItem4,
  ];

  return (
    <div className="space-y-6">
      {/* Tax Summary Card */}
      <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-[24px] leading-[32px] font-semibold text-text-primary">
            {t.scan.taxPreview.yearSummary}
          </h3>
          <span className="text-[12px] px-2 py-0.5 rounded-[4px] bg-bg-surface-2 text-text-muted">
            {t.scan.taxPreview.preview}
          </span>
        </div>

        <div className="space-y-0">
          <div className="flex justify-between items-center h-12">
            <span className="text-[16px] text-text-secondary">{t.scan.taxPreview.totalGains}</span>
            <span className="text-[16px] font-semibold text-positive tabular-nums">
              ${data.totalGains.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center h-12">
            <span className="text-[16px] text-text-secondary">{t.scan.taxPreview.totalLosses}</span>
            <span className="text-[16px] font-semibold text-negative tabular-nums">
              -${data.totalLosses.toLocaleString()}
            </span>
          </div>
          <div className="border-t border-dashed border-border-default my-2" />
          <div className="flex justify-between items-center h-12">
            <span className="text-[16px] text-text-secondary">{t.scan.taxPreview.netProfit}</span>
            <span className="text-[24px] leading-[32px] font-semibold text-text-primary tabular-nums">
              ${data.netProfit.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Chain breakdown */}
        <div className="mt-6">
          <h4 className="text-[20px] leading-[28px] font-semibold text-text-primary mb-3">
            {t.scan.taxPreview.chainBreakdown}
          </h4>
          <div className="space-y-0">
            {data.chainBreakdown.map((chain, i) => (
              <div
                key={chain.chainId}
                className="flex items-center gap-3 h-9 text-[14px]"
              >
                <span className="text-text-muted w-3">
                  {i < data.chainBreakdown.length - 1 ? "├──" : "└──"}
                </span>
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: CHAIN_COLORS[chain.chainId] }}
                />
                <span className="text-text-primary w-24">{chain.name}</span>
                <span className="text-positive font-semibold tabular-nums">
                  +${chain.amount.toLocaleString()}
                </span>
                <span className="text-text-muted">({chain.categories})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-warning text-[12px]">
          <AlertTriangle className="w-4 h-4" />
          {t.scan.taxPreview.estimateWarning}
        </div>
      </div>

      {/* CTA Card */}
      <div className="bg-bg-surface border border-border-default border-l-[3px] border-l-brand rounded-[8px] p-6">
        <h4 className="text-[20px] leading-[28px] font-semibold text-text-primary mb-4">
          {t.scan.taxPreview.ctaTitle}
        </h4>
        <div className="space-y-2 mb-6">
          {ctaItems.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 text-[14px] text-text-secondary"
            >
              <Check className="w-4 h-4 text-positive shrink-0" />
              {item}
            </div>
          ))}
        </div>

        <button className="h-12 px-6 bg-brand text-bg-primary font-semibold text-[18px] rounded-[6px] hover:bg-brand-hover hover:shadow-glow transition-all cursor-pointer">
          {t.scan.taxPreview.ctaButton}
        </button>

        <p className="text-[12px] leading-[16px] text-text-muted mt-3">
          {t.scan.taxPreview.ctaNote}
        </p>
      </div>
    </div>
  );
}
