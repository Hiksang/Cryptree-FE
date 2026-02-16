import type { ChainPortfolio } from "@/core/types";
import { CHAIN_COLORS } from "@/core/constants";
import { formatCurrency, formatPercent } from "@/core/utils";

interface ChainAssetListProps {
  chains: ChainPortfolio[];
}

export function ChainAssetList({ chains }: ChainAssetListProps) {
  return (
    <div className="space-y-4">
      {chains.map((chain) => (
        <div
          key={chain.chainId}
          className="bg-bg-surface border border-border-default rounded-[8px] p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: CHAIN_COLORS[chain.chainId] }}
            />
            <h3 className="text-[16px] leading-[24px] font-semibold text-text-primary">
              {chain.name}
            </h3>
            <span className="text-[14px] text-text-secondary tabular-nums ml-auto">
              {formatCurrency(chain.totalValue)}
            </span>
          </div>

          <div className="space-y-2">
            {chain.tokens.map((token) => (
              <div
                key={`${chain.chainId}-${token.symbol}`}
                className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-bg-surface-2 flex items-center justify-center text-[12px] font-semibold text-text-primary">
                    {token.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-[14px] leading-[20px] text-text-primary font-medium">
                      {token.symbol}
                    </p>
                    <p className="text-[12px] leading-[16px] text-text-muted">
                      {token.amount.toLocaleString()} · ${token.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[14px] leading-[20px] text-text-primary tabular-nums font-medium">
                    {formatCurrency(token.value)}
                  </p>
                  <p
                    className={`text-[12px] leading-[16px] tabular-nums ${
                      token.change24h >= 0 ? "text-positive" : "text-negative"
                    }`}
                  >
                    {formatPercent(token.change24h)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
