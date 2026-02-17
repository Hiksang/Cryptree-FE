"use client";

import type { DistributionEvent } from "@/core/types";
import { useT } from "@/core/i18n";

interface DistributionHistoryProps {
  distributions: DistributionEvent[];
}

export function DistributionHistory({ distributions }: DistributionHistoryProps) {
  const t = useT();

  const statusColors = {
    claimed: "text-text-muted bg-bg-surface-3",
    claimable: "text-brand bg-brand-muted",
    pending: "text-warning bg-warning/10",
  };

  const statusLabels = {
    claimed: t.dashboard.rewards.statusClaimed,
    claimable: t.dashboard.rewards.statusClaimable,
    pending: t.dashboard.rewards.statusPending,
  };

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[16px] leading-[24px] font-semibold text-text-primary mb-4">
        {t.dashboard.rewards.distributionHistory}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="text-text-muted text-left">
              <th className="pb-3 font-medium">{t.dashboard.rewards.colDate}</th>
              <th className="pb-3 font-medium">{t.dashboard.rewards.colSeason}</th>
              <th className="pb-3 font-medium text-right">{t.dashboard.rewards.colQuantity}</th>
              <th className="pb-3 font-medium text-right">{t.dashboard.rewards.colStatus}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {distributions.map((dist) => (
              <tr key={dist.id}>
                <td className="py-3 text-text-secondary">
                  {new Date(dist.date).toLocaleDateString("ko-KR")}
                </td>
                <td className="py-3 text-text-primary">{dist.season}</td>
                <td className="py-3 text-right text-text-primary tabular-nums font-medium">
                  {dist.amount.toLocaleString()} {dist.token}
                </td>
                <td className="py-3 text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[12px] font-medium ${statusColors[dist.status]}`}
                  >
                    {statusLabels[dist.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
