"use client";

import type { ChainId } from "@/core/types";
import { CHAIN_COLORS, CHAIN_NAMES } from "@/core/constants";
import { useT } from "@/core/i18n";

const CHAINS: ChainId[] = ["hyperliquid", "hyperevm", "arbitrum", "base", "ethereum"];

interface ChainFilterProps {
  selected: ChainId | "all";
  onChange: (chain: ChainId | "all") => void;
}

export function ChainFilter({ selected, onChange }: ChainFilterProps) {
  const t = useT();
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("all")}
        className={`px-3 py-1.5 text-[14px] leading-[20px] rounded-[6px] border transition-colors cursor-pointer ${
          selected === "all"
            ? "border-brand text-brand bg-brand-muted"
            : "border-border-default text-text-muted hover:text-text-secondary"
        }`}
      >
        {t.common.all}
      </button>
      {CHAINS.map((chain) => (
        <button
          key={chain}
          onClick={() => onChange(chain)}
          className={`flex items-center gap-2 px-3 py-1.5 text-[14px] leading-[20px] rounded-[6px] border transition-colors cursor-pointer ${
            selected === chain
              ? "border-brand text-brand bg-brand-muted"
              : "border-border-default text-text-muted hover:text-text-secondary"
          }`}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: CHAIN_COLORS[chain] }}
          />
          {CHAIN_NAMES[chain]}
        </button>
      ))}
    </div>
  );
}
