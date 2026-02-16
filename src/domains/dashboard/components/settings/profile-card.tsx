import type { UserProfile } from "@/core/types";
import { TIER_CONFIG } from "@/core/constants";
import { User } from "lucide-react";

interface ProfileCardProps {
  profile: UserProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const tier = TIER_CONFIG[profile.tier];

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[16px] leading-[24px] font-semibold text-text-primary mb-4">
        프로필
      </h3>

      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-bg-surface-2 flex items-center justify-center shrink-0">
          <User className="w-7 h-7 text-text-muted" />
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <p className="text-[18px] font-semibold text-text-primary">
              {profile.name}
            </p>
            <p className="text-[14px] text-text-secondary">{profile.email}</p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[12px] font-semibold"
              style={{
                backgroundColor: `${tier.color}20`,
                color: tier.color,
              }}
            >
              {tier.icon} {tier.label}
            </span>
            <span className="text-[12px] text-text-muted">
              가입일: {new Date(profile.joinedAt).toLocaleDateString("ko-KR")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
