"use client";

import { useState } from "react";
import { DollarSign, ArrowRightLeft, Info, Loader2 } from "lucide-react";
import { toast } from "@/shared/ui";
import { api } from "@/domains/dashboard/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import type { ExchangeRate } from "@/core/types";

interface UsdcExchangeCardProps {
  exchangeRate: ExchangeRate;
  pointsBalance: number;
}

export function UsdcExchangeCard({
  exchangeRate,
  pointsBalance,
}: UsdcExchangeCardProps) {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { pointsPerUsdc, minPoints, maxPoints, dailyLimit, dailyUsed, fee } =
    exchangeRate;

  const remainingDaily = dailyLimit - dailyUsed;
  const effectiveMax = Math.min(pointsBalance, maxPoints, remainingDaily);
  const usdc = points / pointsPerUsdc;
  const feeAmount = usdc * (fee / 100);
  const netUsdc = usdc - feeAmount;
  const canExchange = points >= minPoints && points <= effectiveMax && !loading;

  const quickButtons = [25, 50, 75, 100];

  function handleQuick(pct: number) {
    const val = Math.floor((effectiveMax * pct) / 100);
    setPoints(val);
  }

  async function handleExchange() {
    if (!canExchange) return;
    setLoading(true);
    try {
      const result = await api.exchangeUsdc(points);
      toast.success("교환이 완료되었습니다!");
      setPoints(0);
      queryClient.invalidateQueries({ queryKey: ["exchange"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "교환에 실패했습니다");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[12px] bg-bg-surface border border-border-default p-5">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-brand" />
        <h3 className="text-[16px] font-semibold text-text-primary">
          USDC 교환
        </h3>
        <span className="ml-auto text-[12px] text-text-muted font-mono">
          {pointsPerUsdc}P = 1 USDC
        </span>
      </div>

      {/* Points input */}
      <div className="space-y-3">
        <div>
          <label className="text-[12px] text-text-muted mb-1 block">
            교환할 포인트
          </label>
          <input
            type="number"
            value={points || ""}
            onChange={(e) => setPoints(Math.max(0, Number(e.target.value)))}
            placeholder="0"
            min={0}
            max={effectiveMax}
            className="w-full h-11 px-4 rounded-[8px] bg-bg-surface-2 border border-border-default text-text-primary text-[16px] font-mono tabular-nums placeholder:text-text-disabled focus:outline-none focus:border-brand/50 transition-colors"
          />
        </div>

        {/* Slider */}
        <input
          type="range"
          min={0}
          max={effectiveMax}
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          className="w-full h-1.5 bg-bg-surface-3 rounded-full appearance-none cursor-pointer accent-brand"
        />

        {/* Quick buttons */}
        <div className="flex gap-2">
          {quickButtons.map((pct) => (
            <button
              key={pct}
              onClick={() => handleQuick(pct)}
              className="flex-1 h-8 rounded-[6px] bg-bg-surface-2 border border-border-default text-[12px] font-medium text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors cursor-pointer"
            >
              {pct}%
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      {points > 0 && (
        <div className="mt-4 p-3 rounded-[8px] bg-bg-surface-2 space-y-2">
          <div className="flex justify-between text-[13px]">
            <span className="text-text-muted">받을 USDC</span>
            <span className="text-text-primary font-mono tabular-nums">
              {usdc.toFixed(2)} USDC
            </span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-text-muted flex items-center gap-1">
              수수료 ({fee}%)
              <Info className="w-3 h-3" />
            </span>
            <span className="text-negative font-mono tabular-nums">
              -{feeAmount.toFixed(2)} USDC
            </span>
          </div>
          <div className="border-t border-border-subtle pt-2 flex justify-between text-[14px]">
            <span className="text-text-secondary font-medium">실수령</span>
            <span className="text-brand font-semibold font-mono tabular-nums">
              {netUsdc.toFixed(2)} USDC
            </span>
          </div>
        </div>
      )}

      {/* Daily limit progress */}
      <div className="mt-4 space-y-1.5">
        <div className="flex justify-between text-[12px]">
          <span className="text-text-muted">일일 한도</span>
          <span className="text-text-secondary font-mono tabular-nums">
            {dailyUsed.toLocaleString()} / {dailyLimit.toLocaleString()}P
          </span>
        </div>
        <div className="h-1.5 bg-bg-surface-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all"
            style={{ width: `${(dailyUsed / dailyLimit) * 100}%` }}
          />
        </div>
      </div>

      {/* Exchange button */}
      <button
        onClick={handleExchange}
        disabled={!canExchange}
        className="mt-4 w-full h-11 rounded-[8px] bg-brand hover:bg-brand-hover disabled:bg-bg-surface-3 disabled:text-text-disabled text-bg-primary font-semibold text-[14px] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ArrowRightLeft className="w-4 h-4" />
        )}
        {loading ? "교환 중..." : "교환하기"}
      </button>
    </div>
  );
}
