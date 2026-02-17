"use client";

import { Inbox } from "lucide-react";
import { useT } from "@/core/i18n";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  const t = useT();
  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-8 flex flex-col items-center gap-4 text-center">
      <div className="w-12 h-12 rounded-full bg-bg-surface-2 flex items-center justify-center">
        <Inbox className="w-6 h-6 text-text-muted" />
      </div>
      <div>
        <p className="text-[16px] font-semibold text-text-primary mb-1">{title ?? t.common.noData}</p>
        <p className="text-[14px] text-text-secondary">{description ?? t.common.noDataYet}</p>
      </div>
    </div>
  );
}
