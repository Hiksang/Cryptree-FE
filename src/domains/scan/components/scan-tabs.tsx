"use client";

import { useState } from "react";
import type { ScanResult } from "@/core/types";
import { IdentityCard, ChainBreakdown } from "@/domains/identity";
import { PnlChart, PnlByChain } from "@/domains/pnl";
import { TaxPreview } from "@/domains/tax";
import { CHAIN_COLORS } from "@/core/constants";
import { formatCurrency } from "@/core/utils";
import { Download, Link2, Share2, Clock } from "lucide-react";

const TABS = ["활동 분석", "PnL 분석", "세금 미리보기"] as const;

interface ScanTabsProps {
  data: ScanResult;
}

export function ScanTabs({ data }: ScanTabsProps) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("활동 분석");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-4 md:gap-8 border-b border-border-default mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[13px] md:text-[14px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? "text-text-primary border-b-2 border-brand"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in-up">
        {activeTab === "활동 분석" && <ActivityTab data={data} />}
        {activeTab === "PnL 분석" && <PnlTab data={data} />}
        {activeTab === "세금 미리보기" && (
          data.taxSummary.totalGains === 0 && data.taxSummary.totalLosses === 0 ? (
            <ComingSoonCard message="세금 미리보기는 준비 중입니다." />
          ) : (
            <TaxPreview data={data.taxSummary} />
          )
        )}
      </div>
    </div>
  );
}

function ActivityTab({ data }: { data: ScanResult }) {
  return (
    <div className="space-y-6">
      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6">
        {/* Left: Identity Card */}
        <div>
          <IdentityCard data={data.identity} />
          <div className="flex gap-2 mt-4">
            <button className="h-8 px-3 bg-bg-surface-2 border border-border-default rounded-[6px] text-[14px] text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors flex items-center gap-1.5 cursor-pointer">
              <Download className="w-4 h-4" />
              이미지 저장
            </button>
            <button className="h-8 px-3 bg-bg-surface-2 border border-border-default rounded-[6px] text-[14px] text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors flex items-center gap-1.5 cursor-pointer">
              <Link2 className="w-4 h-4" />
              링크 복사
            </button>
            <button className="h-8 px-3 bg-bg-surface-2 border border-border-default rounded-[6px] text-[14px] text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors flex items-center gap-1.5 cursor-pointer">
              <Share2 className="w-4 h-4" />𝕏 공유
            </button>
          </div>
        </div>

        {/* Right: Chain breakdown + Insights */}
        <div className="space-y-6">
          <ChainBreakdown chains={data.chains} />

          {/* Insights */}
          <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
            <h3 className="text-[20px] leading-[28px] font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span>💡</span> 이 지갑의 인사이트
            </h3>
            <ul className="space-y-2">
              {data.insights.map((insight, i) => (
                <li
                  key={i}
                  className="text-[14px] text-text-secondary flex items-start gap-2"
                >
                  <span className="text-text-muted mt-0.5">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Transaction table */}
      <div className="bg-bg-surface border border-border-default rounded-[8px] p-4 md:p-6">
        <h3 className="text-[20px] leading-[28px] font-semibold text-text-primary mb-4">
          HyperEVM 최근 트랜잭션
        </h3>

        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <div className="min-w-[500px]">
            {/* Table header */}
            <div className="grid grid-cols-[60px_1fr_1fr_80px_50px] gap-3 text-[12px] font-medium text-text-muted pb-2 border-b border-border-default">
              <span>시간</span>
              <span>프로토콜</span>
              <span>유형</span>
              <span className="text-right">금액</span>
              <span className="text-right">상태</span>
            </div>

            {/* Table rows */}
            {data.transactions.map((tx) => (
              <div
                key={tx.id}
                className="grid grid-cols-[60px_1fr_1fr_80px_50px] gap-3 items-center h-12 text-[14px] hover:bg-bg-surface-2 transition-colors"
              >
                <span className="text-text-muted text-[13px]">{tx.timestamp}</span>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: CHAIN_COLORS[tx.chainId] }}
                  />
                  <span className="text-text-primary truncate">{tx.protocol}</span>
                </div>
                <span className="text-text-secondary truncate">{tx.type}</span>
                <span className="text-right text-text-primary tabular-nums">
                  {formatCurrency(tx.amount)}
                </span>
                <span className="text-right text-positive text-[12px]">완료</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border-default text-center">
          <p className="text-[14px] text-text-muted mb-2">
            전체 내역은 가입 후 확인 가능
          </p>
          <button className="text-[14px] text-brand hover:text-brand-hover transition-colors cursor-pointer">
            무료 가입하기 →
          </button>
        </div>
      </div>
    </div>
  );
}

function ComingSoonCard({ message }: { message: string }) {
  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-bg-surface-2 flex items-center justify-center mx-auto mb-4">
        <Clock className="w-6 h-6 text-text-muted" />
      </div>
      <p className="text-[16px] text-text-secondary mb-2">{message}</p>
      <p className="text-[13px] text-text-muted">
        곧 제공될 예정입니다
      </p>
    </div>
  );
}

function PnlTab({ data }: { data: ScanResult }) {
  const hasPnlData = data.pnlHistory.length > 0;

  if (!hasPnlData) {
    return (
      <div className="space-y-6">
        <ComingSoonCard message="PnL 분석 데이터를 준비 중입니다." />
      </div>
    );
  }

  const [period, setPeriod] = useState("전체");
  const periods = ["7일", "30일", "90일", "1년", "전체"];
  const totalPnl = data.pnlHistory[data.pnlHistory.length - 1]?.value ?? 0;

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex items-center gap-2">
        <span className="text-[14px] text-text-muted mr-2">기간:</span>
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`h-8 px-3 rounded-[6px] text-[14px] transition-colors cursor-pointer ${
              period === p
                ? "bg-bg-surface-3 text-text-primary"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <PnlChart data={data.pnlHistory} totalPnl={totalPnl} />

      <PnlByChain data={data.chainPnl} />

      {/* Top trades */}
      <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
        <h4 className="text-[20px] leading-[28px] font-semibold text-text-primary mb-4">
          상위 수익 거래
        </h4>
        {data.topTrades.map((trade) => (
          <div
            key={trade.rank}
            className="flex items-center justify-between h-10 text-[14px]"
          >
            <div className="flex items-center gap-3">
              <span className="text-text-muted w-6">{trade.rank}.</span>
              <span className="text-text-primary">{trade.description}</span>
            </div>
            <span className="text-positive font-semibold tabular-nums">
              +${trade.amount.toLocaleString()}
            </span>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t border-border-default text-center">
          <p className="text-[14px] text-text-muted mb-2">
            상세 분석은 가입 후 이용 가능
          </p>
          <button className="text-[14px] text-brand hover:text-brand-hover transition-colors cursor-pointer">
            무료 가입하기 →
          </button>
        </div>
      </div>
    </div>
  );
}
