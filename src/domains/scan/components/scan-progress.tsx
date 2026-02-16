"use client";

import { useEffect, useState } from "react";
import type { ChainActivity } from "@/core/types";
import { CHAIN_COLORS } from "@/core/constants";
import { formatCurrency, formatNumber, shortenAddress } from "@/core/utils";
import { Search, Check, Loader2 } from "lucide-react";

interface ScanProgressProps {
  address: string;
  onComplete: () => void;
}

const SCAN_CHAINS: ChainActivity[] = [
  { chainId: "hyperevm", name: "HyperEVM", txCount: 320, volume: 120_000, status: "pending" },
  { chainId: "hyperliquid", name: "Hyperliquid", txCount: 1200, volume: 500_000, status: "pending" },
  { chainId: "arbitrum", name: "Arbitrum", txCount: 847, volume: 420_000, status: "pending" },
  { chainId: "base", name: "Base", txCount: 280, volume: 110_000, status: "pending" },
];

export function ScanProgress({ address, onComplete }: ScanProgressProps) {
  const [chains, setChains] = useState<ChainActivity[]>(SCAN_CHAINS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= SCAN_CHAINS.length) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }

    // Start scanning current chain
    setChains((prev) =>
      prev.map((c, i) =>
        i === currentIndex ? { ...c, status: "scanning" } : c
      )
    );

    // Complete after delay
    const timer = setTimeout(() => {
      setChains((prev) =>
        prev.map((c, i) =>
          i === currentIndex ? { ...c, status: "completed" } : c
        )
      );
      setCurrentIndex((prev) => prev + 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [currentIndex, onComplete]);

  const completedCount = chains.filter((c) => c.status === "completed").length;
  const progress = (completedCount / chains.length) * 100;

  return (
    <div className="max-w-[640px] mx-auto pt-16 px-4">
      <p className="font-mono text-[24px] leading-[32px] text-text-muted mb-8">
        {shortenAddress(address, 4)}
      </p>

      <div className="flex items-center gap-2 mb-6">
        <Search className="w-6 h-6 text-brand" />
        <h2 className="text-[24px] leading-[32px] font-semibold text-text-primary">
          HyperEVM 온체인 활동 분석 중...
        </h2>
      </div>

      <div className="space-y-0 mb-6">
        {chains.map((chain) => (
          <div
            key={chain.chainId}
            className="flex items-center h-12 gap-3 animate-fade-in-up"
          >
            <div className="flex items-center justify-center w-5">
              {chain.status === "completed" ? (
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: CHAIN_COLORS[chain.chainId] }}
                />
              ) : chain.status === "scanning" ? (
                <Loader2 className="w-4 h-4 text-warning animate-spin" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-text-muted" />
              )}
            </div>
            <span className="text-[16px] font-medium text-text-primary w-[120px]">
              {chain.name}
            </span>
            <span className="text-[14px] text-text-secondary">
              {chain.status === "completed" ? (
                <span className="flex items-center gap-2 tabular-nums">
                  <Check className="w-4 h-4 text-positive" />
                  {formatNumber(chain.txCount)} tx &middot;{" "}
                  {formatCurrency(chain.volume)}
                </span>
              ) : chain.status === "scanning" ? (
                "스캔 중..."
              ) : (
                <span className="text-text-muted">대기 중</span>
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-2">
        <div className="h-2 bg-bg-surface-3 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand to-brand-hover transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <p className="text-[12px] leading-[16px] text-text-muted">
        {completedCount}/{chains.length} 체인 완료
      </p>

      {completedCount >= 1 && completedCount < chains.length && (
        <button
          onClick={onComplete}
          className="mt-6 text-[14px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          결과 먼저 보기 →
        </button>
      )}
    </div>
  );
}
