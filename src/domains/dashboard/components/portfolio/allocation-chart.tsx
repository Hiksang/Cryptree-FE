"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { ChainPortfolio } from "@/core/types";
import { CHAIN_COLORS } from "@/core/constants";
import { formatCurrency } from "@/core/utils";
import { useT } from "@/core/i18n";

interface AllocationChartProps {
  chains: ChainPortfolio[];
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-elevated border border-border-default rounded-[6px] px-3 py-2 shadow-md">
      <p className="text-[12px] text-text-muted">{payload[0].name}</p>
      <p className="text-[14px] font-semibold text-text-primary tabular-nums">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

export function AllocationChart({ chains }: AllocationChartProps) {
  const t = useT();
  const data = chains.map((c) => ({
    name: c.name,
    value: c.totalValue,
    chainId: c.chainId,
  }));

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[14px] leading-[20px] text-text-secondary mb-4">
        {t.dashboard.portfolio.assetAllocation}
      </h3>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.chainId}
                  fill={CHAIN_COLORS[entry.chainId] || "#333"}
                />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((entry) => (
          <div key={entry.chainId} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: CHAIN_COLORS[entry.chainId] }}
            />
            <span className="text-[12px] text-text-secondary">{entry.name}</span>
            <span className="text-[12px] text-text-primary tabular-nums ml-auto">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
