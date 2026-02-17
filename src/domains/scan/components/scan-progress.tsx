"use client";

import { useState, useEffect } from "react";
import { CHAIN_NAMES } from "@/core/constants";
import { shortenAddress } from "@/core/utils";
import { Search, Loader2, Check } from "lucide-react";

interface ScanProgressProps {
  address: string;
  /** Set to true when the scan data has arrived */
  isComplete?: boolean;
}

const SCAN_CHAIN_IDS = [
  "ethereum",
  "arbitrum",
  "base",
  "optimism",
  "polygon",
  "hyperevm",
];

const TIP_MESSAGES = [
  "6개 체인의 트랜잭션을 분석하고 있습니다",
  "DeFi 활동 패턴을 분류 중입니다",
  "스왑, 스테이킹, 렌딩 내역을 수집 중입니다",
  "온체인 활동 점수를 계산하고 있습니다",
  "체인별 거래량을 합산 중입니다",
];

/**
 * Exponential progress: fast early, slows down asymptotically
 * 0→60% in ~3s, →85% in ~8s, →95% in ~15s
 */
function computeProgress(elapsedMs: number): number {
  const t = elapsedMs / 1000;
  // 1 - e^(-0.3t) gives ~60% at 3s, ~91% at 8s — scale to cap at 95%
  return Math.min(95, 95 * (1 - Math.exp(-0.3 * t)));
}

export function ScanProgress({ address, isComplete = false }: ScanProgressProps) {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [tipKey, setTipKey] = useState(0);

  // Time-based progress bar
  useEffect(() => {
    if (isComplete) {
      setProgress(100);
      return;
    }

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(computeProgress(elapsed));
    }, 50);

    return () => clearInterval(interval);
  }, [isComplete]);

  // Rotating tip messages
  useEffect(() => {
    if (isComplete) return;

    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIP_MESSAGES.length);
      setTipKey((prev) => prev + 1);
    }, 2500);

    return () => clearInterval(interval);
  }, [isComplete]);

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

      {/* Chain list — all chains scan simultaneously, complete together */}
      <div className="space-y-0 mb-6">
        {SCAN_CHAIN_IDS.map((chainId) => (
            <div
              key={chainId}
              className="flex items-center h-12 gap-3 animate-fade-in-up"
            >
              <div className="flex items-center justify-center w-5">
                {isComplete ? (
                  <Check className="w-4 h-4 text-positive animate-scale-in" />
                ) : (
                  <Loader2 className="w-4 h-4 text-warning animate-spin" />
                )}
              </div>
              <span className="text-[16px] font-medium text-text-primary w-[120px]">
                {CHAIN_NAMES[chainId] || chainId}
              </span>
              <span
                className={`text-[14px] transition-colors duration-300 ${
                  isComplete ? "text-positive" : "text-text-secondary"
                }`}
              >
                {isComplete ? "완료" : "스캔 중..."}
              </span>
            </div>
        ))}
      </div>

      {/* Time-based progress bar */}
      <div className="mb-4">
        <div className="h-2 bg-bg-surface-3 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand to-brand-hover transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Rotating tip message */}
      <div className="h-6">
        <p
          key={tipKey}
          className="text-[14px] text-text-muted animate-tip-fade"
        >
          {TIP_MESSAGES[tipIndex]}
        </p>
      </div>
    </div>
  );
}
