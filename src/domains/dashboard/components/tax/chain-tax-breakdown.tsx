import type { ChainTaxBreakdown as ChainTaxBreakdownType } from "@/core/types";
import { CHAIN_COLORS } from "@/core/constants";

interface ChainTaxBreakdownProps {
  chains: ChainTaxBreakdownType[];
}

export function ChainTaxBreakdown({ chains }: ChainTaxBreakdownProps) {
  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[16px] leading-[24px] font-semibold text-text-primary mb-4">
        체인별 세금 상세
      </h3>
      <div className="space-y-4">
        {chains.map((chain) => (
          <div
            key={chain.chainId}
            className="border-b border-border-subtle last:border-0 pb-4 last:pb-0"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: CHAIN_COLORS[chain.chainId] }}
                />
                <span className="text-[14px] leading-[20px] font-medium text-text-primary">
                  {chain.name}
                </span>
                <span className="text-[12px] text-text-muted">
                  {chain.events}건
                </span>
              </div>
              <span
                className={`text-[16px] font-semibold tabular-nums ${
                  chain.net >= 0 ? "text-positive" : "text-negative"
                }`}
              >
                {chain.net >= 0 ? "+" : ""}${chain.net.toLocaleString()}
              </span>
            </div>
            <div className="flex gap-4 text-[12px] leading-[16px]">
              <span className="text-positive tabular-nums">
                수익 +${chain.gains.toLocaleString()}
              </span>
              <span className="text-negative tabular-nums">
                손실 -${chain.losses.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
