"use client";

import { useT } from "@/core/i18n";

interface StatusBadgeProps {
  status: "completed" | "pending" | "failed";
}

const STATUS_CLASS = {
  completed: "bg-positive-bg text-positive",
  pending: "bg-[rgba(245,158,11,0.1)] text-warning",
  failed: "bg-negative-bg text-negative",
} as const;

export function StatusBadge({ status }: StatusBadgeProps) {
  const t = useT();

  const statusLabels = {
    completed: t.dashboard.transactions.statusCompleted,
    pending: t.dashboard.transactions.statusPending,
    failed: t.dashboard.transactions.statusFailed,
  } as const;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[12px] leading-[16px] font-medium rounded-[4px] ${STATUS_CLASS[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
