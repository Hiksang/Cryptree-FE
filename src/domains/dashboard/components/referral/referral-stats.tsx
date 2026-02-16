import type { ReferralStats as ReferralStatsType } from "@/core/types";
import { Users, UserCheck, DollarSign, Clock } from "lucide-react";

interface ReferralStatsProps {
  stats: ReferralStatsType;
}

export function ReferralStats({ stats }: ReferralStatsProps) {
  const items = [
    { label: "총 추천", value: stats.totalReferred, icon: Users, suffix: "명" },
    { label: "활성 추천", value: stats.activeReferred, icon: UserCheck, suffix: "명" },
    { label: "총 수익", value: stats.totalEarned, icon: DollarSign, prefix: "$" },
    { label: "대기 보상", value: stats.pendingRewards, icon: Clock, prefix: "$" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-bg-surface border border-border-default rounded-[8px] p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <item.icon className="w-4 h-4 text-text-muted" />
            <span className="text-[12px] text-text-muted">{item.label}</span>
          </div>
          <p className="text-[20px] font-bold text-text-primary tabular-nums">
            {item.prefix}
            {item.value.toLocaleString()}
            {item.suffix}
          </p>
        </div>
      ))}
    </div>
  );
}
