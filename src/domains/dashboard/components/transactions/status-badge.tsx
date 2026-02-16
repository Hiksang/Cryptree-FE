interface StatusBadgeProps {
  status: "completed" | "pending" | "failed";
}

const STATUS_CONFIG = {
  completed: { label: "완료", className: "bg-positive-bg text-positive" },
  pending: { label: "대기", className: "bg-[rgba(245,158,11,0.1)] text-warning" },
  failed: { label: "실패", className: "bg-negative-bg text-negative" },
} as const;

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[12px] leading-[16px] font-medium rounded-[4px] ${config.className}`}
    >
      {config.label}
    </span>
  );
}
