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

interface PnlChartProps {
  data: PnlDataPoint[];
  totalPnl: number;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div className="bg-bg-elevated border border-border-default rounded-[6px] px-3 py-2 shadow-md">
      <p className="text-[12px] text-text-muted">{label}</p>
      <p
        className={`text-[14px] font-semibold tabular-nums ${
          value >= 0 ? "text-positive" : "text-negative"
        }`}
      >
        {value >= 0 ? "+" : ""}${value.toLocaleString()}
      </p>
    </div>
  );
}

export function PnlChart({ data, totalPnl }: PnlChartProps) {
  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <div className="mb-4">
        <p
          className={`text-[48px] leading-[56px] font-bold tabular-nums tracking-[-0.02em] ${
            totalPnl >= 0 ? "text-positive" : "text-negative"
          }`}
        >
          {totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString()}
        </p>
        <p className="text-[12px] leading-[16px] text-text-muted mt-1">
          전체 기간 기준
        </p>
      </div>

      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00D4AA" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#00D4AA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#1E1E1E"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717A", fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00D4AA"
              strokeWidth={2}
              fill="url(#pnlGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
