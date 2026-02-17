"use client";

import type { LeaderboardEntry, LeaderboardTab } from "@/core/types";
import { TIER_CONFIG } from "@/core/constants";
import { RankBadge } from "./rank-badge";
import { useT } from "@/core/i18n";

interface RankingsTableProps {
  entries: LeaderboardEntry[];
  tab: LeaderboardTab;
}

export function RankingsTable({ entries, tab }: RankingsTableProps) {
  const t = useT();

  const TAB_LABELS: Record<LeaderboardTab, string> = {
    pnl: t.dashboard.leaderboard.pnl,
    volume: t.dashboard.leaderboard.volume,
    activity: t.dashboard.leaderboard.activityScore,
    referral: t.dashboard.leaderboard.referralCount,
  };

  const TAB_FORMAT: Record<LeaderboardTab, (v: number) => string> = {
    pnl: (v) => `$${v.toLocaleString()}`,
    volume: (v) => `$${v.toLocaleString()}`,
    activity: (v) => v.toLocaleString(),
    referral: (v) => `${v}${t.common.person}`,
  };
  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="text-text-muted text-left">
              <th className="pb-3 font-medium w-12">{t.dashboard.leaderboard.colRank}</th>
              <th className="pb-3 font-medium">{t.dashboard.leaderboard.colAddress}</th>
              <th className="pb-3 font-medium">{t.dashboard.leaderboard.colTier}</th>
              <th className="pb-3 font-medium text-right">{TAB_LABELS[tab]}</th>
              <th className="pb-3 font-medium text-right w-20">{t.dashboard.leaderboard.colChange}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {entries.map((entry) => {
              const tier = TIER_CONFIG[entry.tier];
              return (
                <tr
                  key={entry.rank}
                  className={
                    entry.isMe
                      ? "bg-brand-muted/50"
                      : ""
                  }
                >
                  <td className="py-3">
                    <RankBadge rank={entry.rank} />
                  </td>
                  <td className="py-3 font-mono text-text-primary">
                    {entry.address}
                    {entry.isMe && (
                      <span className="ml-2 text-[12px] text-brand font-sans font-medium">
                        {t.dashboard.leaderboard.me}
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    <span
                      className="text-[12px] font-medium"
                      style={{ color: tier.color }}
                    >
                      {tier.icon} {tier.label}
                    </span>
                  </td>
                  <td className="py-3 text-right font-semibold text-text-primary tabular-nums">
                    {TAB_FORMAT[tab](entry.value)}
                  </td>
                  <td className="py-3 text-right tabular-nums">
                    {entry.change !== undefined && (
                      <span
                        className={
                          entry.change >= 0 ? "text-positive" : "text-negative"
                        }
                      >
                        {entry.change >= 0 ? "+" : ""}
                        {entry.change}%
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
