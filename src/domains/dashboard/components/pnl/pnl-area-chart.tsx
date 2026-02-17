"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { PnlDataPoint } from "@/core/types";
import { useT } from "@/core/i18n";

interface PnlAreaChartProps {
  data: PnlDataPoint[];
  totalPnl: number;
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

export function PnlAreaChart({ data, totalPnl }: PnlAreaChartProps) {
  const t = useT();
  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <div className="mb-6">
        <p className="text-[14px] leading-[20px] text-text-secondary mb-1">
          {t.dashboard.pnl.totalPnl}
        </p>
        <p
          className={`text-[36px] leading-[44px] font-bold tabular-nums tracking-[-0.02em] ${
            totalPnl >= 0 ? "text-positive" : "text-negative"
          }`}
        >
          {totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString()}
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="pnlAreaGrad" x1="0" y1="0" x2="0" y2="1">
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
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717A", fontSize: 12 }}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
              width={50}
            />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00D4AA"
              strokeWidth={2}
              fill="url(#pnlAreaGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
