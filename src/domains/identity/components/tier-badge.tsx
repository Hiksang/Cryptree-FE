import type { Tier } from "@/core/types";
import { TIER_CONFIG } from "@/core/constants";
import { cn } from "@/core/utils";

interface TierBadgeProps {
  tier: Tier;
  percentile?: number;
  size?: "sm" | "lg";
  className?: string;
}

export function TierBadge({
  tier,
  percentile,
  size = "sm",
  className,
}: TierBadgeProps) {
  const config = TIER_CONFIG[tier];

  if (size === "lg") {
    return (
      <div
        className={cn(
          "rounded-[8px] p-4",
          className
        )}
        style={{ backgroundColor: `${config.color}15` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{config.icon}</span>
          <span
            className="text-[20px] leading-[28px] font-semibold"
            style={{ color: config.color }}
          >
            {config.label} DeFi Explorer
          </span>
        </div>
        {percentile && (
          <p className="text-[12px] leading-[16px] text-text-muted mt-1">
            Top {percentile}% across all chains
          </p>
        )}
      </div>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 h-6 px-2 rounded-[4px] text-[12px] leading-[16px] font-medium",
        className
      )}
      style={{
        backgroundColor: `${config.color}15`,
        color: config.color,
      }}
    >
      {config.icon} {config.label}
    </span>
  );
}
