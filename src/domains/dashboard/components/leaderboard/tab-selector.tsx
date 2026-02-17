"use client";

import type { LeaderboardTab } from "@/core/types";
import { useT } from "@/core/i18n";

interface TabSelectorProps {
  selected: LeaderboardTab;
  onChange: (tab: LeaderboardTab) => void;
}

export function TabSelector({ selected, onChange }: TabSelectorProps) {
  const t = useT();

  const TABS: { value: LeaderboardTab; label: string }[] = [
    { value: "pnl", label: t.dashboard.leaderboard.pnl },
    { value: "volume", label: t.dashboard.leaderboard.volume },
    { value: "activity", label: t.dashboard.leaderboard.activity },
    { value: "referral", label: t.dashboard.leaderboard.referral },
  ];
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
