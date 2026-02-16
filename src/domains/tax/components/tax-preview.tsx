import type { TaxSummary } from "@/core/types";
import { CHAIN_COLORS } from "@/core/constants";
import { Check, AlertTriangle } from "lucide-react";

interface TaxPreviewProps {
  data: TaxSummary;
}

export function TaxPreview({ data }: TaxPreviewProps) {
  return (
    <div className="space-y-6">
      {/* Tax Summary Card */}
      <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-[24px] leading-[32px] font-semibold text-text-primary">
            2024 세금 요약
          </h3>
          <span className="text-[12px] px-2 py-0.5 rounded-[4px] bg-bg-surface-2 text-text-muted">
            미리보기
          </span>
        </div>

        <div className="space-y-0">
          <div className="flex justify-between items-center h-12">
            <span className="text-[16px] text-text-secondary">총 실현 수익</span>
            <span className="text-[16px] font-semibold text-positive tabular-nums">
              ${data.totalGains.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center h-12">
            <span className="text-[16px] text-text-secondary">총 실현 손실</span>
            <span className="text-[16px] font-semibold text-negative tabular-nums">
              -${data.totalLosses.toLocaleString()}
            </span>
          </div>
          <div className="border-t border-dashed border-border-default my-2" />
          <div className="flex justify-between items-center h-12">
            <span className="text-[16px] text-text-secondary">순 이익</span>
            <span className="text-[24px] leading-[32px] font-semibold text-text-primary tabular-nums">
              ${data.netProfit.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Chain breakdown */}
        <div className="mt-6">
          <h4 className="text-[20px] leading-[28px] font-semibold text-text-primary mb-3">
            체인별 내역:
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
          이 금액은 추정치입니다.
        </div>
      </div>

      {/* CTA Card */}
      <div className="bg-bg-surface border border-border-default border-l-[3px] border-l-brand rounded-[8px] p-6">
        <h4 className="text-[20px] leading-[28px] font-semibold text-text-primary mb-4">
          가입하면 무료로 받을 수 있는 것:
        </h4>
        <div className="space-y-2 mb-6">
          {[
            "정확한 원가 계산 (FIFO/LIFO/HIFO/이동평균)",
            "국가별 세금 계산 (한국, 미국, 일본 등 7개국)",
            "CSV/PDF 리포트 다운로드",
            "AI 세금 요약 리포트",
          ].map((item) => (
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
          무료 가입하고 전체 세금 리포트 받기 →
        </button>

        <p className="text-[12px] leading-[16px] text-text-muted mt-3">
          Koinly에서는 $49/년. HyperView에서는 무료.
        </p>
      </div>
    </div>
  );
}
