import type { ChainPnl } from "@/core/types";
import { CHAIN_COLORS } from "@/core/constants";
import { formatCurrency } from "@/core/utils";

interface ChainPnlCardsProps {
  chains: ChainPnl[];
}

export function ChainPnlCards({ chains }: ChainPnlCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {chains.map((chain) => (
        <div
          key={chain.chainId}
          className="bg-bg-surface border border-border-default rounded-[8px] p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: CHAIN_COLORS[chain.chainId] }}
            />
            <span className="text-[14px] leading-[20px] text-text-secondary">
              {chain.name}
            </span>
          </div>
          <p
            className={`text-[20px] leading-[28px] font-semibold tabular-nums ${
              chain.pnl >= 0 ? "text-positive" : "text-negative"
            }`}
          >
            {chain.pnl >= 0 ? "+" : ""}{formatCurrency(chain.pnl)}
          </p>
          <p className="text-[12px] leading-[16px] text-text-muted tabular-nums mt-1">
            {chain.percentage}%
          </p>
        </div>
      ))}
    </div>
  );
}
