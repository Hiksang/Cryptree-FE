import type { DashboardStats } from "@/core/types";
import { formatCurrency, formatPercent } from "@/core/utils";
import { DollarSign, TrendingUp, Layers } from "lucide-react";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "총 자산",
      value: formatCurrency(stats.totalValue),
      change: formatPercent(stats.totalValueChange),
      positive: stats.totalValueChange >= 0,
      icon: DollarSign,
    },
    {
      label: "총 수익 (PnL)",
      value: formatCurrency(stats.totalPnl),
      change: formatPercent(stats.totalPnlPercent),
      positive: stats.totalPnl >= 0,
      icon: TrendingUp,
    },
    {
      label: "활성 포지션",
      value: stats.activePositions.toString(),
      change: `+${stats.activePositionsChange}`,
      positive: true,
      icon: Layers,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-bg-surface border border-border-default rounded-[8px] p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[14px] leading-[20px] text-text-secondary">
              {card.label}
            </span>
            <card.icon className="w-4 h-4 text-text-muted" />
          </div>
          <p className="text-[24px] leading-[32px] font-semibold text-text-primary tabular-nums">
            {card.value}
          </p>
          <p
            className={`text-[12px] leading-[16px] mt-1 tabular-nums ${
              card.positive ? "text-positive" : "text-negative"
            }`}
          >
            {card.change}
          </p>
        </div>
      ))}
    </div>
  );
}
