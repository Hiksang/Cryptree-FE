import type { LeaderboardEntry, LeaderboardTab } from "@/core/types";
import { TIER_CONFIG } from "@/core/constants";
import { Medal } from "lucide-react";

interface MyPositionProps {
  position: LeaderboardEntry;
  tab: LeaderboardTab;
}

const TAB_FORMAT: Record<LeaderboardTab, (v: number) => string> = {
  pnl: (v) => `$${v.toLocaleString()}`,
  volume: (v) => `$${v.toLocaleString()}`,
  activity: (v) => v.toLocaleString(),
  referral: (v) => `${v}명`,
};

export function MyPosition({ position, tab }: MyPositionProps) {
  const tier = TIER_CONFIG[position.tier];

  return (
    <div className="bg-gradient-to-r from-brand/10 to-brand/5 border border-brand/20 rounded-[8px] p-6">
      <div className="flex items-center gap-3 mb-3">
        <Medal className="w-5 h-5 text-brand" />
        <h3 className="text-[16px] font-semibold text-text-primary">내 순위</h3>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-[12px] text-text-muted mb-1">순위</p>
          <p className="text-[24px] font-bold text-brand tabular-nums">
            #{position.rank}
          </p>
        </div>
        <div>
          <p className="text-[12px] text-text-muted mb-1">티어</p>
          <p className="text-[16px] font-semibold" style={{ color: tier.color }}>
            {tier.icon} {tier.label}
          </p>
        </div>
        <div>
          <p className="text-[12px] text-text-muted mb-1">값</p>
          <p className="text-[18px] font-bold text-text-primary tabular-nums">
            {TAB_FORMAT[tab](position.value)}
          </p>
        </div>
      </div>
    </div>
  );
}
