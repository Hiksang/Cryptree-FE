"use client";

import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { PnlDataPoint } from "@/core/types";
import { useT } from "@/core/i18n";

interface PnlOverviewChartProps {
  data: PnlDataPoint[];
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div className="bg-bg-elevated border border-border-default rounded-[6px] px-3 py-2 shadow-md">
      <p className="text-[12px] text-text-muted">{label}</p>
      <p className={`text-[14px] font-semibold tabular-nums ${value >= 0 ? "text-positive" : "text-negative"}`}>
        {value >= 0 ? "+" : ""}${value.toLocaleString()}
      </p>
    </div>
  );
}

export function PnlOverviewChart({ data }: PnlOverviewChartProps) {
  const t = useT();
  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[14px] leading-[20px] text-text-secondary mb-4">
        {t.dashboard.overview.pnlTrend7d}
      </h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="pnlOverviewGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00D4AA" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#00D4AA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1E1E1E" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717A", fontSize: 12 }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00D4AA"
              strokeWidth={2}
              fill="url(#pnlOverviewGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
