"use client";

import { useMemo, useState } from "react";
import { useDashboardStats, useSettings } from "@/domains/dashboard/hooks/use-dashboard-queries";
import { TIER_CONFIG } from "@/core/constants";
import { ErrorState } from "@/shared/ui";
import { StatsCardSkeleton } from "@/shared/ui";
import { Wallet, Plus, Activity, Link2 } from "lucide-react";
import Link from "next/link";
import { AddWalletModal } from "@/domains/dashboard/components/add-wallet-modal";
import { useT } from "@/core/i18n";

function getGreeting(name: string, t: ReturnType<typeof useT>): string {
  const hour = new Date().getHours();
  if (hour < 6) return t.dashboard.overview.greetingNight(name);
  if (hour < 12) return t.dashboard.overview.greetingMorning(name);
  if (hour < 18) return t.dashboard.overview.greetingAfternoon(name);
  return t.dashboard.overview.greetingEvening(name);
}

export default function DashboardPage() {
  const { data: statsData, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useDashboardStats();
  const { data: settingsData, isLoading: settingsLoading } = useSettings();
  const t = useT();

  if (statsError) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">{t.dashboard.overview.title}</h1>
        <ErrorState onRetry={() => refetchStats()} />
      </div>
    );
  }

  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const isLoading = statsLoading || settingsLoading;
  const walletCount = settingsData?.wallets?.length ?? 0;
  const tier = settingsData?.profile?.tier ?? "bronze";
  const tierConfig = TIER_CONFIG[tier];
  const profileName = settingsData?.profile?.name ?? "User";
  const greeting = useMemo(() => getGreeting(profileName, t), [profileName, t]);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">{t.dashboard.overview.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px]">
      <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">
        {t.dashboard.overview.title}
      </h1>

      {/* Welcome Card */}
      <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-[24px] shrink-0"
            style={{ backgroundColor: `${tierConfig.color}20` }}
          >
            {tierConfig.icon}
          </div>
          <div>
            <h2 className="text-[20px] font-semibold text-text-primary">
              {greeting}
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-semibold"
                style={{ backgroundColor: `${tierConfig.color}20`, color: tierConfig.color }}
              >
                {tierConfig.icon} {tierConfig.label}
              </span>
              <span className="text-[14px] text-text-secondary">
                {t.dashboard.overview.connectedWallets} {walletCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet CTA Card */}
      {walletCount === 0 ? (
        <button onClick={() => setWalletModalOpen(true)} className="w-full text-left cursor-pointer">
          <div className="bg-brand-muted border border-brand/30 rounded-[8px] p-6 hover:border-brand/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
                <Plus className="w-6 h-6 text-brand" />
              </div>
              <div>
                <h3 className="text-[18px] font-semibold text-text-primary mb-1">
                  {t.dashboard.overview.addWalletTitle}
                </h3>
                <p className="text-[14px] text-text-secondary">
                  {t.dashboard.overview.addWalletDesc}
                </p>
              </div>
            </div>
          </div>
        </button>
      ) : (
        <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-bg-surface-2 flex items-center justify-center shrink-0">
              <Wallet className="w-6 h-6 text-brand" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-semibold text-text-primary mb-1">
                {t.dashboard.overview.walletManage}
              </h3>
              <p className="text-[14px] text-text-secondary">
                {t.dashboard.overview.walletConnected(walletCount)}
              </p>
            </div>
            <button
              onClick={() => setWalletModalOpen(true)}
              className="flex items-center gap-1.5 h-9 px-3.5 text-[13px] font-medium text-brand border border-brand/30 rounded-[6px] hover:bg-brand-muted transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              {t.dashboard.overview.addWallet}
            </button>
          </div>
        </div>
      )}

      <AddWalletModal
        open={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />

      {/* Activity Grade & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Activity Grade Card */}
        <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-text-muted" />
            <h3 className="text-[16px] font-semibold text-text-primary">{t.dashboard.overview.activityGrade}</h3>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-[32px]"
              style={{ backgroundColor: `${tierConfig.color}20` }}
            >
              {tierConfig.icon}
            </div>
            <div>
              <p
                className="text-[24px] font-bold"
                style={{ color: tierConfig.color }}
              >
                {tierConfig.label}
              </p>
              <p className="text-[14px] text-text-secondary">
                {t.dashboard.overview.totalTx} {statsData?.stats?.activePositions ?? 0}{t.dashboard.overview.protocols}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="w-5 h-5 text-text-muted" />
            <h3 className="text-[16px] font-semibold text-text-primary">{t.dashboard.overview.activitySummary}</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-text-secondary">{t.dashboard.overview.activeProtocols}</span>
              <span className="text-[16px] font-semibold text-text-primary">
                {statsData?.stats?.activePositions ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-text-secondary">{t.dashboard.overview.connectedWalletLabel}</span>
              <span className="text-[16px] font-semibold text-text-primary">
                {walletCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-text-secondary">{t.dashboard.overview.currentGrade}</span>
              <span
                className="text-[16px] font-semibold"
                style={{ color: tierConfig.color }}
              >
                {tierConfig.icon} {tierConfig.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
