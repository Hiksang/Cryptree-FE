"use client";

import type { InsightCard } from "@/core/types";
import { useT } from "@/core/i18n";
import { AlertTriangle, TrendingUp, Zap, FileText } from "lucide-react";

const ICON_MAP = {
  AlertTriangle,
  TrendingUp,
  Zap,
  FileText,
} as const;

const TYPE_STYLES = {
  info: "border-l-info",
  warning: "border-l-warning",
  positive: "border-l-positive",
  negative: "border-l-negative",
} as const;

interface InsightsCardsProps {
  insights: InsightCard[];
}

export function InsightsCards({ insights }: InsightsCardsProps) {
  const t = useT();
  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[14px] leading-[20px] text-text-secondary mb-4">
        {t.dashboard.overview.insights}
      </h3>
      <div className="space-y-3">
        {insights.map((insight) => {
          const Icon = ICON_MAP[insight.icon as keyof typeof ICON_MAP] || Zap;
          return (
            <div
              key={insight.id}
              className={`border-l-[3px] ${TYPE_STYLES[insight.type]} bg-bg-surface-2 rounded-r-[6px] p-3`}
            >
              <div className="flex items-start gap-2">
                <Icon className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
                <div>
                  <p className="text-[14px] leading-[20px] font-medium text-text-primary">
                    {insight.title}
                  </p>
                  <p className="text-[12px] leading-[16px] text-text-secondary mt-1">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
