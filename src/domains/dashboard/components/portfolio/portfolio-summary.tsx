import type { PortfolioData } from "@/core/types";
import { formatCurrency, formatPercent } from "@/core/utils";

interface PortfolioSummaryProps {
  data: PortfolioData;
}

export function PortfolioSummary({ data }: PortfolioSummaryProps) {
  const isPositive = data.change24h >= 0;

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <p className="text-[14px] leading-[20px] text-text-secondary mb-2">
        총 자산
      </p>
      <p className="text-[36px] leading-[44px] font-bold text-text-primary tabular-nums tracking-[-0.02em]">
        {formatCurrency(data.totalValue)}
      </p>
      <div className="flex items-center gap-2 mt-2">
        <span
          className={`text-[14px] leading-[20px] font-medium tabular-nums ${
            isPositive ? "text-positive" : "text-negative"
          }`}
        >
          {isPositive ? "+" : ""}{formatCurrency(data.change24h)}
        </span>
        <span
          className={`text-[12px] leading-[16px] px-1.5 py-0.5 rounded-[4px] tabular-nums ${
            isPositive ? "bg-positive-bg text-positive" : "bg-negative-bg text-negative"
          }`}
        >
          {formatPercent(data.change24hPercent)}
        </span>
        <span className="text-[12px] text-text-muted">24h</span>
      </div>
    </div>
  );
}
