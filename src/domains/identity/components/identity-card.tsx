"use client";

import { useEffect, useState } from "react";
import type { IdentityData } from "@/core/types";
import { DefiDnaBar } from "./defi-dna-bar";
import { TierBadge } from "./tier-badge";
import { formatCurrency, formatNumber } from "@/core/utils";

interface IdentityCardProps {
  data: IdentityData;
}

export function IdentityCard({ data }: IdentityCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="w-full max-w-[400px] rounded-[12px] border border-border-default p-8 transition-opacity duration-300"
      style={{
        background: "linear-gradient(180deg, #0A0A0A 0%, #1A1A2E 50%, #0D1B2A 100%)",
        opacity: visible ? 1 : 0,
      }}
    >
      <h2 className="text-[18px] leading-[28px] font-semibold text-text-primary mb-8">
        DeFi Identity 2024
      </h2>

      {/* Stats Grid */}
      <div className="space-y-2 mb-6">
        {[
          { label: "Active Chains", value: data.activeChains.toString() },
          { label: "Total Trades", value: formatNumber(data.totalTrades) },
          { label: "Total Volume", value: formatCurrency(data.totalVolume) },
        ].map((stat) => (
          <div key={stat.label} className="flex justify-between items-center h-7">
            <span className="text-[12px] leading-[16px] text-text-muted">
              {stat.label}
            </span>
            <span className="text-[16px] font-semibold text-text-primary tabular-nums">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* DNA Bars */}
      <div className="mb-6">
        <DefiDnaBar data={data.dna} animate={visible} />
      </div>

      {/* Tier Badge */}
      <div className="mb-8 animate-scale-in">
        <TierBadge
          tier={data.tier}
          percentile={data.tierPercentile}
          size="lg"
        />
      </div>

      {/* Footer */}
      <p className="text-[12px] leading-[16px] text-text-muted text-center">
        hyperview.xyz
      </p>
    </div>
  );
}
