import type { ChainActivity } from "@/core/types";
import { CHAIN_COLORS } from "@/core/constants";
import { formatCurrency, formatNumber } from "@/core/utils";

interface ChainBreakdownProps {
  chains: ChainActivity[];
}

export function ChainBreakdown({ chains }: ChainBreakdownProps) {
  const maxVolume = Math.max(...chains.map((c) => c.volume));

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[20px] leading-[28px] font-semibold text-text-primary mb-4">
        체인별 활동
      </h3>
      <div className="space-y-4">
        {chains.map((chain) => (
          <div key={chain.chainId}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: CHAIN_COLORS[chain.chainId],
                  }}
                />
                <span className="text-[14px] font-medium text-text-primary">
                  {chain.name}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[14px] text-text-muted tabular-nums">
                <span>{formatCurrency(chain.volume)}</span>
                <span>{formatNumber(chain.txCount)}tx</span>
              </div>
            </div>
            <div className="h-2 bg-bg-surface-3 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(chain.volume / maxVolume) * 100}%`,
                  backgroundColor: CHAIN_COLORS[chain.chainId],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
