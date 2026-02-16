"use client";

import { useEffect, useState } from "react";
import type { DnaBreakdown } from "@/core/types";
import { DNA_COLORS } from "@/core/constants";

interface DefiDnaBarProps {
  data: DnaBreakdown[];
  animate?: boolean;
}

export function DefiDnaBar({ data, animate = true }: DefiDnaBarProps) {
  const [mounted, setMounted] = useState(!animate);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setMounted(true), 100);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  return (
    <div className="space-y-3">
      <p className="text-[12px] leading-[16px] text-text-muted">DeFi DNA:</p>
      {data.map((item, i) => (
        <div key={item.category} className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-4 bg-bg-surface-3 rounded-[4px] overflow-hidden">
              <div
                className="h-full rounded-l-[4px] transition-all duration-500 ease-out"
                style={{
                  width: mounted ? `${item.percentage}%` : "0%",
                  backgroundColor: DNA_COLORS[item.category],
                  transitionDelay: animate ? `${i * 100}ms` : "0ms",
                }}
              />
            </div>
            <span className="text-[14px] font-semibold text-text-primary tabular-nums w-10 text-right">
              {item.percentage}%
            </span>
          </div>
          <p className="text-[12px] leading-[16px] text-text-secondary">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
