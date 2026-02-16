"use client";

import type { LeaderboardTab } from "@/core/types";

interface TabSelectorProps {
  selected: LeaderboardTab;
  onChange: (tab: LeaderboardTab) => void;
}

const TABS: { value: LeaderboardTab; label: string }[] = [
  { value: "pnl", label: "수익" },
  { value: "volume", label: "거래량" },
  { value: "activity", label: "활동" },
  { value: "referral", label: "추천" },
];

export function TabSelector({ selected, onChange }: TabSelectorProps) {
  return (
    <div className="flex gap-1 bg-bg-surface-2 rounded-[8px] p-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex-1 h-9 px-4 text-[14px] font-medium rounded-[6px] transition-colors cursor-pointer ${
            selected === tab.value
              ? "bg-bg-surface text-text-primary shadow-sm"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
