"use client";

import { History, DollarSign, ShoppingBag } from "lucide-react";
import type { ExchangeHistoryItem } from "@/core/types";

const STATUS_STYLES = {
  completed: "bg-positive/10 text-positive",
  processing: "bg-warning/10 text-warning",
  failed: "bg-negative/10 text-negative",
} as const;

const STATUS_LABELS = {
  completed: "완료",
  processing: "처리중",
  failed: "실패",
} as const;

interface ExchangeHistoryTableProps {
  history: ExchangeHistoryItem[];
}

export function ExchangeHistoryTable({ history }: ExchangeHistoryTableProps) {
  return (
    <div className="rounded-[12px] bg-bg-surface border border-border-default p-5">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-brand" />
        <h3 className="text-[16px] font-semibold text-text-primary">
          교환 내역
        </h3>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="text-left text-[12px] font-medium text-text-muted pb-3 pr-4">
                날짜
              </th>
              <th className="text-left text-[12px] font-medium text-text-muted pb-3 pr-4">
                유형
              </th>
              <th className="text-left text-[12px] font-medium text-text-muted pb-3 pr-4">
                설명
              </th>
              <th className="text-right text-[12px] font-medium text-text-muted pb-3 pr-4">
                사용 포인트
              </th>
              <th className="text-left text-[12px] font-medium text-text-muted pb-3 pr-4">
                수령
              </th>
              <th className="text-left text-[12px] font-medium text-text-muted pb-3">
                상태
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border-subtle last:border-0"
              >
                <td className="py-3 pr-4 text-[13px] text-text-secondary font-mono tabular-nums">
                  {item.date}
                </td>
                <td className="py-3 pr-4">
                  <div className="w-7 h-7 rounded-[6px] bg-bg-surface-2 flex items-center justify-center">
                    {item.type === "usdc" ? (
                      <DollarSign className="w-3.5 h-3.5 text-brand" />
                    ) : (
                      <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
                    )}
                  </div>
                </td>
                <td className="py-3 pr-4 text-[13px] text-text-primary">
                  {item.description}
                </td>
                <td className="py-3 pr-4 text-[13px] text-negative text-right font-mono tabular-nums">
                  -{item.pointsSpent.toLocaleString()}P
                </td>
                <td className="py-3 pr-4 text-[13px] text-text-secondary">
                  {item.received}
                </td>
                <td className="py-3">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[item.status]}`}
                  >
                    {STATUS_LABELS[item.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-[8px] bg-bg-surface-2 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[6px] bg-bg-surface-3 flex items-center justify-center">
                  {item.type === "usdc" ? (
                    <DollarSign className="w-3.5 h-3.5 text-brand" />
                  ) : (
                    <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
                  )}
                </div>
                <span className="text-[13px] text-text-primary font-medium">
                  {item.description}
                </span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[item.status]}`}
              >
                {STATUS_LABELS[item.status]}
              </span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-text-muted font-mono">{item.date}</span>
              <div className="flex gap-3">
                <span className="text-negative font-mono tabular-nums">
                  -{item.pointsSpent.toLocaleString()}P
                </span>
                <span className="text-text-secondary">{item.received}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {history.length === 0 && (
        <div className="py-12 text-center text-text-muted text-[14px]">
          교환 내역이 없습니다
        </div>
      )}
    </div>
  );
}
