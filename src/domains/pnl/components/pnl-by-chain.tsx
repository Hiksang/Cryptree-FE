import type { ChainPnl } from "@/core/types";
import { CHAIN_COLORS } from "@/core/constants";

interface PnlByChainProps {
  data: ChainPnl[];
}

export function PnlByChain({ data }: PnlByChainProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((item) => (
        <div
          key={item.chainId}
          className="bg-bg-surface border border-border-default rounded-[8px] p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: CHAIN_COLORS[item.chainId] }}
            />
            <span className="text-[14px] font-medium text-text-secondary">
              {item.name}
            </span>
          </div>
          <p
            className={`text-[24px] leading-[32px] font-semibold tabular-nums ${
              item.pnl >= 0 ? "text-positive" : "text-negative"
            }`}
          >
            {item.pnl >= 0 ? "+" : ""}${item.pnl.toLocaleString()}
          </p>
          <p
            className={`text-[12px] leading-[16px] tabular-nums ${
              item.pnl >= 0 ? "text-positive" : "text-negative"
            }`}
          >
            {item.pnl >= 0 ? "▲" : "▼"} {item.percentage}%
          </p>
        </div>
      ))}
    </div>
  );
}
