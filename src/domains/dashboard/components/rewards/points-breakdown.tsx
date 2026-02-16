import type { PointsBreakdown as PointsBreakdownType } from "@/core/types";
import {
  TrendingUp,
  Droplets,
  Lock,
  Users,
  Activity,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  Droplets,
  Lock,
  Users,
  Activity,
};

interface PointsBreakdownProps {
  points: PointsBreakdownType[];
}

export function PointsBreakdown({ points }: PointsBreakdownProps) {
  const total = points.reduce((sum, p) => sum + p.points, 0);

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[16px] leading-[24px] font-semibold text-text-primary mb-4">
        포인트 분류
      </h3>

      <div className="space-y-3">
        {points.map((point) => {
          const Icon = ICON_MAP[point.icon] || Activity;
          const percentage = total > 0 ? (point.points / total) * 100 : 0;

          return (
            <div key={point.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-text-muted" />
                  <span className="text-[14px] font-medium text-text-primary">
                    {point.category}
                  </span>
                </div>
                <span className="text-[14px] font-semibold text-text-primary tabular-nums">
                  {point.points.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 bg-bg-surface-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-[12px] text-text-muted">{point.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
