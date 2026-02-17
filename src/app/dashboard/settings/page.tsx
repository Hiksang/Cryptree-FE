"use client";

import { useSettings } from "@/domains/dashboard/hooks/use-dashboard-queries";
import { ProfileCard } from "@/domains/dashboard";
import { ConnectedWallets } from "@/domains/dashboard";
import { TierDisplay } from "@/domains/dashboard";
import { ErrorState } from "@/shared/ui";
import { StatsCardSkeleton, TableCardSkeleton } from "@/shared/ui";
import { useT } from "@/core/i18n";

export default function SettingsPage() {
  const { data, isLoading, isError, refetch } = useSettings();
  const t = useT();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <div className="h-8 w-20 skeleton rounded-[4px]" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>
        <TableCardSkeleton rows={3} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">{t.dashboard.settings.title}</h1>
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px]">
      <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">
        {t.dashboard.settings.title}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileCard profile={data.profile} />
        <TierDisplay profile={data.profile} />
      </div>

      <ConnectedWallets wallets={data.wallets} />
    </div>
  );
}
