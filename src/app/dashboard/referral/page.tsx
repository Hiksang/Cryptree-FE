"use client";

import { useReferral } from "@/domains/dashboard/hooks/use-dashboard-queries";
import { ReferralCodeCard, ReferralClaimCard } from "@/domains/dashboard";
import { ErrorState } from "@/shared/ui";
import { StatsCardSkeleton } from "@/shared/ui";
import { Link2, Users, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "@/shared/ui";
import { useT } from "@/core/i18n";

function LinkShareCard({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const referralUrl = `https://cryptree.xyz?ref=${code}`;
  const t = useT();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      toast.success(t.common.linkCopied);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t.common.copyFailed);
    }
  }

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <div className="flex items-center gap-2 mb-4">
        <Link2 className="w-5 h-5 text-text-muted" />
        <h3 className="text-[16px] font-semibold text-text-primary">{t.dashboard.referral.linkShare}</h3>
      </div>
      <p className="text-[14px] text-text-secondary mb-4">
        {t.dashboard.referral.linkShareDesc}
      </p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-10 px-3 bg-bg-surface-2 border border-border-default rounded-[6px] flex items-center">
          <span className="text-[13px] text-text-secondary font-mono truncate">
            {referralUrl}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="h-10 px-4 bg-brand text-bg-primary text-[13px] font-semibold rounded-[6px] hover:bg-brand-hover transition-colors cursor-pointer flex items-center gap-2 shrink-0"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? t.common.copied : t.dashboard.referral.linkCopy}
        </button>
      </div>
    </div>
  );
}

export default function ReferralPage() {
  const { data, isLoading, isError, refetch } = useReferral();
  const t = useT();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <div className="h-8 w-16 skeleton rounded-[4px]" />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">{t.dashboard.referral.title}</h1>
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px]">
      <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">
        {t.dashboard.referral.title}
      </h1>

      {/* 추천 코드 등록 */}
      <ReferralClaimCard referredBy={data.referredBy} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReferralCodeCard code={data.code} />
        <LinkShareCard code={data.code} />
      </div>

      {/* Total referrals stat */}
      <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand-muted flex items-center justify-center">
            <Users className="w-6 h-6 text-brand" />
          </div>
          <div>
            <p className="text-[12px] text-text-muted">{t.dashboard.referral.totalReferred}</p>
            <p className="text-[24px] font-bold text-text-primary tabular-nums">
              {data.stats?.totalReferred ?? 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
