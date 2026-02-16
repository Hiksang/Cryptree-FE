"use client";

import { CHAIN_NAMES } from "@/core/constants";
import { shortenAddress } from "@/core/utils";
import { Search, Loader2 } from "lucide-react";

interface ScanProgressProps {
  address: string;
}

const SCAN_CHAIN_IDS = ["ethereum", "arbitrum", "base", "optimism", "polygon", "hyperevm", "bnb"];

export function ScanProgress({ address }: ScanProgressProps) {
  return (
    <div className="max-w-[640px] mx-auto pt-16 px-4">
      <p className="font-mono text-[24px] leading-[32px] text-text-muted mb-8">
        {shortenAddress(address, 4)}
      </p>

      <div className="flex items-center gap-2 mb-6">
        <Search className="w-6 h-6 text-brand" />
        <h2 className="text-[24px] leading-[32px] font-semibold text-text-primary">
          온체인 활동 분석 중...
        </h2>
      </div>

      <div className="space-y-0 mb-6">
        {SCAN_CHAIN_IDS.map((chainId) => (
          <div
            key={chainId}
            className="flex items-center h-12 gap-3 animate-fade-in-up"
          >
            <div className="flex items-center justify-center w-5">
              <Loader2 className="w-4 h-4 text-warning animate-spin" />
            </div>
            <span className="text-[16px] font-medium text-text-primary w-[120px]">
              {CHAIN_NAMES[chainId] || chainId}
            </span>
            <span className="text-[14px] text-text-secondary">
              스캔 중...
            </span>
          </div>
        ))}
      </div>

      <div className="mb-2">
        <div className="h-2 bg-bg-surface-3 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-brand to-brand-hover animate-pulse w-full" />
        </div>
      </div>
    </div>
  );
}
