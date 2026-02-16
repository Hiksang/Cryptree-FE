import type { LeaderboardEntry, LeaderboardTab } from "@/core/types";
import { TIER_CONFIG } from "@/core/constants";
import { RankBadge } from "./rank-badge";

interface RankingsTableProps {
  entries: LeaderboardEntry[];
  tab: LeaderboardTab;
}

const TAB_LABELS: Record<LeaderboardTab, string> = {
  pnl: "수익",
  volume: "거래량",
  activity: "활동점수",
  referral: "추천수",
};

const TAB_FORMAT: Record<LeaderboardTab, (v: number) => string> = {
  pnl: (v) => `$${v.toLocaleString()}`,
  volume: (v) => `$${v.toLocaleString()}`,
  activity: (v) => v.toLocaleString(),
  referral: (v) => `${v}명`,
};

export function RankingsTable({ entries, tab }: RankingsTableProps) {
  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="text-text-muted text-left">
              <th className="pb-3 font-medium w-12">순위</th>
              <th className="pb-3 font-medium">주소</th>
              <th className="pb-3 font-medium">티어</th>
              <th className="pb-3 font-medium text-right">{TAB_LABELS[tab]}</th>
              <th className="pb-3 font-medium text-right w-20">변동</th>
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
                        (나)
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
