"use client";

import { useDashboardStats, useSettings } from "@/domains/dashboard/hooks/use-dashboard-queries";
import { TIER_CONFIG } from "@/core/constants";
import { ErrorState } from "@/shared/ui";
import { StatsCardSkeleton } from "@/shared/ui";
import { Wallet, Plus, Activity, Link2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: statsData, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useDashboardStats();
  const { data: settingsData, isLoading: settingsLoading } = useSettings();

  if (statsError) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">대시보드</h1>
        <ErrorState onRetry={() => refetchStats()} />
      </div>
    );
  }

  const isLoading = statsLoading || settingsLoading;
  const walletCount = settingsData?.wallets?.length ?? 0;
  const tier = settingsData?.profile?.tier ?? "bronze";
  const tierConfig = TIER_CONFIG[tier];
  const profileName = settingsData?.profile?.name ?? "User";

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">대시보드</h1>
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
        대시보드
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
              안녕하세요, {profileName}님
            </h2>
            <div className="flex items-center gap-3 mt-1">
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-semibold"
                style={{ backgroundColor: `${tierConfig.color}20`, color: tierConfig.color }}
              >
                {tierConfig.icon} {tierConfig.label}
              </span>
              <span className="text-[14px] text-text-secondary">
                연결된 지갑: {walletCount}개
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet CTA Card */}
      {walletCount === 0 ? (
        <Link href="/dashboard/settings" className="block">
          <div className="bg-brand-muted border border-brand/30 rounded-[8px] p-6 hover:border-brand/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
                <Plus className="w-6 h-6 text-brand" />
              </div>
              <div>
                <h3 className="text-[18px] font-semibold text-text-primary mb-1">
                  지갑을 추가해 주세요
                </h3>
                <p className="text-[14px] text-text-secondary">
                  온체인 활동 분석을 시작하려면 지갑 주소를 연결해야 합니다. 설정에서 지갑을 추가해 보세요.
                </p>
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <Link href="/dashboard/settings" className="block">
          <div className="bg-bg-surface border border-border-default rounded-[8px] p-6 hover:border-brand/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-bg-surface-2 flex items-center justify-center shrink-0">
                <Wallet className="w-6 h-6 text-brand" />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold text-text-primary mb-1">
                  지갑 관리
                </h3>
                <p className="text-[14px] text-text-secondary">
                  {walletCount}개의 지갑이 연결되어 있습니다. 추가 지갑을 연결하거나 스캔 상태를 확인하세요.
                </p>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Activity Grade & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Activity Grade Card */}
        <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-text-muted" />
            <h3 className="text-[16px] font-semibold text-text-primary">활동 등급</h3>
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
                총 트랜잭션: {statsData?.stats?.activePositions ?? 0}개 프로토콜
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="w-5 h-5 text-text-muted" />
            <h3 className="text-[16px] font-semibold text-text-primary">활동 요약</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-text-secondary">활성 프로토콜</span>
              <span className="text-[16px] font-semibold text-text-primary">
                {statsData?.stats?.activePositions ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-text-secondary">연결된 지갑</span>
              <span className="text-[16px] font-semibold text-text-primary">
                {walletCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-text-secondary">현재 등급</span>
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
