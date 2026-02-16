import type { TopTrade } from "@/core/types";
import { CHAIN_COLORS } from "@/core/constants";
import { formatCurrency } from "@/core/utils";

interface TopTradesTableProps {
  trades: TopTrade[];
  title: string;
}

export function TopTradesTable({ trades, title }: TopTradesTableProps) {
  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[14px] leading-[20px] text-text-secondary mb-4">
        {title}
      </h3>
      <div className="space-y-3">
        {trades.map((trade) => (
          <div key={trade.rank} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[14px] text-text-muted w-6 tabular-nums">
                #{trade.rank}
              </span>
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: CHAIN_COLORS[trade.chainId] }}
              />
              <span className="text-[14px] leading-[20px] text-text-primary">
                {trade.description}
              </span>
            </div>
            <span
              className={`text-[14px] leading-[20px] font-semibold tabular-nums ${
                trade.amount >= 0 ? "text-positive" : "text-negative"
              }`}
            >
              {trade.amount >= 0 ? "+" : ""}{formatCurrency(trade.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
