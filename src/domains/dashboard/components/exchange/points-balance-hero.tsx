"use client";

import { Sparkles, TrendingUp, ArrowDownCircle, Coins } from "lucide-react";
import { useT } from "@/core/i18n";

interface PointsBalanceHeroProps {
  balance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
}

export function PointsBalanceHero({
  balance,
  lifetimeEarned,
  lifetimeSpent,
}: PointsBalanceHeroProps) {
  const t = useT();
  return (
    <div className="relative overflow-hidden rounded-[12px] bg-gradient-to-br from-brand/15 via-brand/5 to-transparent border border-brand/20 p-6 animate-glow-pulse">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative">
        {/* Label */}
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-brand" />
          <span className="text-[14px] font-medium text-text-secondary">
            {t.dashboard.exchange.myPointsBalance}
          </span>
        </div>

        {/* Big number */}
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-[48px] font-bold text-brand tabular-nums leading-none">
            {balance.toLocaleString()}
          </span>
          <span className="text-[18px] font-medium text-brand/60">P</span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[6px] bg-positive/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-positive" />
            </div>
            <div>
              <p className="text-[11px] text-text-muted">{t.dashboard.exchange.totalEarned}</p>
              <p className="text-[14px] font-semibold text-text-primary tabular-nums">
                {lifetimeEarned.toLocaleString()}P
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[6px] bg-negative/10 flex items-center justify-center">
              <ArrowDownCircle className="w-4 h-4 text-negative" />
            </div>
            <div>
              <p className="text-[11px] text-text-muted">{t.dashboard.exchange.totalSpent}</p>
              <p className="text-[14px] font-semibold text-text-primary tabular-nums">
                {lifetimeSpent.toLocaleString()}P
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[6px] bg-brand/10 flex items-center justify-center">
              <Coins className="w-4 h-4 text-brand" />
            </div>
            <div>
              <p className="text-[11px] text-text-muted">{t.dashboard.exchange.currentBalance}</p>
              <p className="text-[14px] font-semibold text-brand tabular-nums">
                {balance.toLocaleString()}P
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
