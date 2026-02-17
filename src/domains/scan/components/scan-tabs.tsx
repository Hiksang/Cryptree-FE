"use client";

import { useState } from "react";
import type { ScanResult } from "@/core/types";
import { IdentityCard, ChainBreakdown } from "@/domains/identity";
import { PnlChart, PnlByChain } from "@/domains/pnl";
import { TaxPreview } from "@/domains/tax";
import { CHAIN_COLORS } from "@/core/constants";
import { formatCurrency } from "@/core/utils";
import { useT } from "@/core/i18n";
import { Download, Link2, Share2, Clock, Lock } from "lucide-react";

interface ScanTabsProps {
  data: ScanResult;
  onSignup?: () => void;
}

export function ScanTabs({ data, onSignup }: ScanTabsProps) {
  const t = useT();
  const [activeTab, setActiveTab] = useState(0);
  const TABS = [t.scan.tabs.activity, t.scan.tabs.pnl, t.scan.tabs.taxPreview];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-4 md:gap-8 border-b border-border-default mb-6 overflow-x-auto">
        {TABS.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`pb-3 text-[13px] md:text-[14px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === index
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
        {activeTab === 0 && <ActivityTab data={data} onSignup={onSignup} />}
        {activeTab === 1 && <LockedContent onSignup={onSignup} />}
        {activeTab === 2 && <LockedContent onSignup={onSignup} />}
      </div>
    </div>
  );
}

function LockedContent({ onSignup }: { onSignup?: () => void }) {
  const t = useT();

  return (
    <div className="relative">
      {/* Blurred placeholder content */}
      <div className="blur-sm pointer-events-none select-none opacity-50">
        <div className="space-y-6">
          <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
            <div className="h-6 w-32 bg-bg-surface-2 rounded mb-4" />
            <div className="h-[200px] bg-bg-surface-2 rounded" />
          </div>
          <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
            <div className="h-6 w-40 bg-bg-surface-2 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-10 bg-bg-surface-2 rounded" />
              <div className="h-10 bg-bg-surface-2 rounded" />
              <div className="h-10 bg-bg-surface-2 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay CTA */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-bg-surface/95 backdrop-blur-sm border border-border-default rounded-[12px] p-8 max-w-[400px] text-center shadow-lg">
          <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-brand" />
          </div>
          <h3 className="text-[20px] font-bold text-text-primary mb-2">
            {t.scan.tabs.lockedTitle}
          </h3>
          <p className="text-[14px] text-text-secondary mb-6">
            {t.scan.tabs.lockedDesc}<br />
            {t.scan.tabs.lockedDesc2}
          </p>
          <button
            onClick={() => onSignup?.()}
            className="w-full h-12 bg-brand text-bg-primary font-semibold text-[15px] rounded-[8px] hover:bg-brand-hover transition-colors cursor-pointer mb-3"
          >
            {t.common.freeStart}
          </button>
          <p className="text-[12px] text-text-muted">
            {t.common.signupGoogle}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActivityTab({ data, onSignup }: { data: ScanResult; onSignup?: () => void }) {
  const t = useT();

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
              {t.scan.tabs.saveImage}
            </button>
            <button className="h-8 px-3 bg-bg-surface-2 border border-border-default rounded-[6px] text-[14px] text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors flex items-center gap-1.5 cursor-pointer">
              <Link2 className="w-4 h-4" />
              {t.scan.tabs.copyLink}
            </button>
            <button className="h-8 px-3 bg-bg-surface-2 border border-border-default rounded-[6px] text-[14px] text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors flex items-center gap-1.5 cursor-pointer">
              <Share2 className="w-4 h-4" />{t.scan.tabs.shareX}
            </button>
          </div>
        </div>

        {/* Right: Chain breakdown + Insights */}
        <div className="space-y-6">
          <ChainBreakdown chains={data.chains} />

          {/* Insights */}
          <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
            <h3 className="text-[20px] leading-[28px] font-semibold text-text-primary mb-3 flex items-center gap-2">
              <span>💡</span> {t.scan.tabs.walletInsights}
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
          {t.scan.tabs.recentTx}
        </h3>

        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <div className="min-w-[500px]">
            {/* Table header */}
            <div className="grid grid-cols-[60px_1fr_1fr_80px_50px] gap-3 text-[12px] font-medium text-text-muted pb-2 border-b border-border-default">
              <span>{t.scan.tabs.colTime}</span>
              <span>{t.scan.tabs.colProtocol}</span>
              <span>{t.scan.tabs.colType}</span>
              <span className="text-right">{t.scan.tabs.colAmount}</span>
              <span className="text-right">{t.scan.tabs.colStatus}</span>
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
                <span className="text-right text-positive text-[12px]">{t.scan.progress.complete}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border-default text-center">
          <p className="text-[14px] text-text-muted mb-3">
            {t.scan.tabs.fullHistoryLocked}
          </p>
          <button
            onClick={() => onSignup?.()}
            className="h-10 px-6 bg-brand text-bg-primary font-semibold text-[14px] rounded-[6px] hover:bg-brand-hover transition-colors cursor-pointer"
          >
            {t.scan.tabs.signupFull}
          </button>
        </div>
      </div>
    </div>
  );
}

function ComingSoonCard({ message }: { message: string }) {
  const t = useT();

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-bg-surface-2 flex items-center justify-center mx-auto mb-4">
        <Clock className="w-6 h-6 text-text-muted" />
      </div>
      <p className="text-[16px] text-text-secondary mb-2">{message}</p>
      <p className="text-[13px] text-text-muted">
        {t.scan.tabs.comingSoonMsg}
      </p>
    </div>
  );
}

function PnlTab({ data }: { data: ScanResult }) {
  const t = useT();
  const hasPnlData = data.pnlHistory.length > 0;

  if (!hasPnlData) {
    return (
      <div className="space-y-6">
        <ComingSoonCard message={t.scan.tabs.pnlPreparing} />
      </div>
    );
  }

  const [period, setPeriod] = useState(4);
  const periods = [
    t.scan.tabs.period7d,
    t.scan.tabs.period30d,
    t.scan.tabs.period90d,
    t.scan.tabs.period1y,
    t.scan.tabs.periodAll,
  ];
  const totalPnl = data.pnlHistory[data.pnlHistory.length - 1]?.value ?? 0;

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex items-center gap-2">
        <span className="text-[14px] text-text-muted mr-2">{t.scan.tabs.period}</span>
        {periods.map((p, index) => (
          <button
            key={index}
            onClick={() => setPeriod(index)}
            className={`h-8 px-3 rounded-[6px] text-[14px] transition-colors cursor-pointer ${
              period === index
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
          {t.scan.tabs.topTrades}
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
            {t.scan.tabs.detailAfterSignup}
          </p>
          <button className="text-[14px] text-brand hover:text-brand-hover transition-colors cursor-pointer">
            {t.scan.tabs.freeSignup}
          </button>
        </div>
      </div>
    </div>
  );
}
