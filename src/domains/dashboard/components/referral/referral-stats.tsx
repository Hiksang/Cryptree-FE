"use client";

import type { ReferralStats as ReferralStatsType } from "@/core/types";
import { Users, UserCheck, DollarSign, Clock } from "lucide-react";
import { useT } from "@/core/i18n";

interface ReferralStatsProps {
  stats: ReferralStatsType;
}

export function ReferralStats({ stats }: ReferralStatsProps) {
  const t = useT();

  const items = [
    { label: t.dashboard.referral.totalReferrals, value: stats.totalReferred, icon: Users, suffix: t.common.person },
    { label: t.dashboard.referral.activeReferrals, value: stats.activeReferred, icon: UserCheck, suffix: t.common.person },
    { label: t.dashboard.referral.totalEarnings, value: stats.totalEarned, icon: DollarSign, prefix: "$" },
    { label: t.dashboard.referral.pendingRewards, value: stats.pendingRewards, icon: Clock, prefix: "$" },
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
