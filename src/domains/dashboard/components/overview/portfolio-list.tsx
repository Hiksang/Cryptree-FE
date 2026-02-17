"use client";

import type { PortfolioData } from "@/core/types";
import { CHAIN_COLORS } from "@/core/constants";
import { formatCurrency, formatPercent } from "@/core/utils";
import { useT } from "@/core/i18n";

interface PortfolioListProps {
  data: PortfolioData;
}

export function PortfolioList({ data }: PortfolioListProps) {
  const t = useT();
  const topTokens = data.chains
    .flatMap((c) => c.tokens)
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[14px] leading-[20px] text-text-secondary mb-4">
        {t.dashboard.overview.topAssets}
      </h3>
      <div className="space-y-3">
        {topTokens.map((token, i) => (
          <div key={`${token.chainId}-${token.symbol}-${i}`} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: CHAIN_COLORS[token.chainId] }}
              />
              <div>
                <span className="text-[14px] leading-[20px] text-text-primary font-medium">
                  {token.symbol}
                </span>
                <span className="text-[12px] text-text-muted ml-2">
                  {token.amount.toLocaleString()}
                </span>
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
  );
}
