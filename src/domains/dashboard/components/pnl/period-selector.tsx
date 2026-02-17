"use client";

import type { PnlPeriod } from "@/core/types";
import { useT } from "@/core/i18n";

const PERIOD_VALUES: PnlPeriod[] = ["7d", "30d", "90d", "1y", "all"];

interface PeriodSelectorProps {
  selected: PnlPeriod;
  onChange: (period: PnlPeriod) => void;
}

export function PeriodSelector({ selected, onChange }: PeriodSelectorProps) {
  const t = useT();
  const periodLabels: Record<PnlPeriod, string> = {
    "7d": t.dashboard.pnl.period7d,
    "30d": t.dashboard.pnl.period30d,
    "90d": t.dashboard.pnl.period90d,
    "1y": t.dashboard.pnl.period1y,
    "all": t.dashboard.pnl.periodAll,
  };
  return (
    <div className="flex gap-1 bg-bg-surface-2 rounded-[6px] p-1">
      {PERIOD_VALUES.map((value) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-3 py-1.5 text-[14px] leading-[20px] rounded-[4px] transition-colors cursor-pointer ${
            selected === value
              ? "bg-bg-surface text-text-primary font-medium"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          {periodLabels[value]}
        </button>
      ))}
    </div>
  );
}
