"use client";

import type { PnlPeriod } from "@/core/types";

const PERIODS: { value: PnlPeriod; label: string }[] = [
  { value: "7d", label: "7일" },
  { value: "30d", label: "30일" },
  { value: "90d", label: "90일" },
  { value: "1y", label: "1년" },
  { value: "all", label: "전체" },
];

interface PeriodSelectorProps {
  selected: PnlPeriod;
  onChange: (period: PnlPeriod) => void;
}

export function PeriodSelector({ selected, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex gap-1 bg-bg-surface-2 rounded-[6px] p-1">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`px-3 py-1.5 text-[14px] leading-[20px] rounded-[4px] transition-colors cursor-pointer ${
            selected === p.value
              ? "bg-bg-surface text-text-primary font-medium"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
