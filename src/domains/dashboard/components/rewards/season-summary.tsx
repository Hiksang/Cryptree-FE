"use client";

import type { SeasonSummary as SeasonSummaryType } from "@/core/types";
import { Calendar, Trophy } from "lucide-react";
import { useT } from "@/core/i18n";

interface SeasonSummaryProps {
  season: SeasonSummaryType;
}

export function SeasonSummary({ season }: SeasonSummaryProps) {
  const t = useT();

  const statusColors = {
    active: "text-positive bg-positive-bg",
    ended: "text-text-muted bg-bg-surface-3",
    upcoming: "text-warning bg-warning/10",
  };

  const statusLabels = {
    active: t.dashboard.rewards.seasonStatusActive,
    ended: t.dashboard.rewards.seasonStatusEnded,
    upcoming: t.dashboard.rewards.seasonStatusUpcoming,
  };

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[18px] font-semibold text-text-primary">
            {season.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-[13px] text-text-muted">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {new Date(season.startDate).toLocaleDateString("ko-KR")} —{" "}
              {new Date(season.endDate).toLocaleDateString("ko-KR")}
            </span>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-[12px] font-medium ${statusColors[season.status]}`}
        >
          {statusLabels[season.status]}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-[12px] text-text-muted mb-1">{t.dashboard.rewards.rank}</p>
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-warning" />
            <span className="text-[20px] font-bold text-text-primary tabular-nums">
              #{season.rank}
            </span>
          </div>
          <p className="text-[12px] text-text-muted">
            / {season.totalParticipants.toLocaleString()}{t.dashboard.rewards.personSuffix}
          </p>
        </div>
        <div>
          <p className="text-[12px] text-text-muted mb-1">{t.dashboard.rewards.totalPoints}</p>
          <p className="text-[20px] font-bold text-text-primary tabular-nums">
            {season.totalPoints.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[12px] text-text-muted mb-1">{t.dashboard.rewards.topPercent}</p>
          <p className="text-[20px] font-bold text-brand tabular-nums">
            {((season.rank / season.totalParticipants) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
