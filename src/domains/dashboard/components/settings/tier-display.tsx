import type { UserProfile } from "@/core/types";
import { TIER_CONFIG } from "@/core/constants";

interface TierDisplayProps {
  profile: UserProfile;
}

const TIER_ORDER = ["bronze", "silver", "gold", "diamond"] as const;

export function TierDisplay({ profile }: TierDisplayProps) {
  const currentTier = TIER_CONFIG[profile.tier];
  const currentIndex = TIER_ORDER.indexOf(profile.tier);
  const nextTierKey = TIER_ORDER[currentIndex + 1];
  const nextTier = nextTierKey ? TIER_CONFIG[nextTierKey] : null;
  const progress =
    nextTier && profile.nextTierPoints > 0
      ? (profile.tierPoints / profile.nextTierPoints) * 100
      : 100;

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[16px] leading-[24px] font-semibold text-text-primary mb-4">
        티어
      </h3>

      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-[28px]"
          style={{ backgroundColor: `${currentTier.color}20` }}
        >
          {currentTier.icon}
        </div>
        <div>
          <p
            className="text-[20px] font-bold"
            style={{ color: currentTier.color }}
          >
            {currentTier.label}
          </p>
          <p className="text-[14px] text-text-secondary">
            {profile.tierPoints.toLocaleString()}건 트랜잭션
          </p>
        </div>
      </div>

      {nextTier && (
        <div>
          <div className="flex items-center justify-between text-[12px] mb-2">
            <span className="text-text-muted">
              다음 티어: {nextTier.icon} {nextTier.label}
            </span>
            <span className="text-text-secondary tabular-nums">
              {profile.tierPoints.toLocaleString()} /{" "}
              {profile.nextTierPoints.toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-bg-surface-3 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: currentTier.color,
              }}
            />
          </div>
        </div>
      )}

      {!nextTier && (
        <p className="text-[14px] text-brand font-medium">
          최고 티어에 도달했습니다!
        </p>
      )}
    </div>
  );
}
