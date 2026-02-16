import type { DistributionEvent } from "@/core/types";

interface DistributionHistoryProps {
  distributions: DistributionEvent[];
}

export function DistributionHistory({ distributions }: DistributionHistoryProps) {
  const statusColors = {
    claimed: "text-text-muted bg-bg-surface-3",
    claimable: "text-brand bg-brand-muted",
    pending: "text-warning bg-warning/10",
  };

  const statusLabels = {
    claimed: "수령 완료",
    claimable: "수령 가능",
    pending: "대기중",
  };

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[16px] leading-[24px] font-semibold text-text-primary mb-4">
        배분 내역
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="text-text-muted text-left">
              <th className="pb-3 font-medium">날짜</th>
              <th className="pb-3 font-medium">시즌</th>
              <th className="pb-3 font-medium text-right">수량</th>
              <th className="pb-3 font-medium text-right">상태</th>
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
