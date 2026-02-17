"use client";

import type { ChainId, TransactionType } from "@/core/types";
import { CHAIN_NAMES, CHAIN_COLORS } from "@/core/constants";
import { useT } from "@/core/i18n";

const CHAINS: ChainId[] = ["hyperliquid", "hyperevm", "arbitrum", "base", "ethereum"];
const TYPES: TransactionType[] = ["swap", "transfer", "bridge", "stake", "lp_add", "claim"];

interface TransactionFiltersProps {
  chainFilter: ChainId | "all";
  typeFilter: TransactionType | "all";
  onChainChange: (chain: ChainId | "all") => void;
  onTypeChange: (type: TransactionType | "all") => void;
}

export function TransactionFilters({
  chainFilter,
  typeFilter,
  onChainChange,
  onTypeChange,
}: TransactionFiltersProps) {
  const t = useT();

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div>
        <p className="text-[12px] text-text-muted mb-1.5">{t.dashboard.transactions.chain}</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onChainChange("all")}
            className={`px-2.5 py-1 text-[12px] rounded-[4px] border transition-colors cursor-pointer ${
              chainFilter === "all"
                ? "border-brand text-brand bg-brand-muted"
                : "border-border-default text-text-muted hover:text-text-secondary"
            }`}
          >
            {t.common.all}
          </button>
          {CHAINS.map((chain) => (
            <button
              key={chain}
              onClick={() => onChainChange(chain)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-[12px] rounded-[4px] border transition-colors cursor-pointer ${
                chainFilter === chain
                  ? "border-brand text-brand bg-brand-muted"
                  : "border-border-default text-text-muted hover:text-text-secondary"
              }`}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: CHAIN_COLORS[chain] }}
              />
              {CHAIN_NAMES[chain]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[12px] text-text-muted mb-1.5">{t.dashboard.transactions.type}</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onTypeChange("all")}
            className={`px-2.5 py-1 text-[12px] rounded-[4px] border transition-colors cursor-pointer ${
              typeFilter === "all"
                ? "border-brand text-brand bg-brand-muted"
                : "border-border-default text-text-muted hover:text-text-secondary"
            }`}
          >
            {t.common.all}
          </button>
          {TYPES.map((type) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`px-2.5 py-1 text-[12px] rounded-[4px] border transition-colors cursor-pointer ${
                typeFilter === type
                  ? "border-brand text-brand bg-brand-muted"
                  : "border-border-default text-text-muted hover:text-text-secondary"
              }`}
            >
              {t.transactionTypes[type as keyof typeof t.transactionTypes]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
