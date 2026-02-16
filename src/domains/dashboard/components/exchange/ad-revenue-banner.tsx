"use client";

import { Megaphone, ArrowRight } from "lucide-react";

interface AdRevenueBannerProps {
  totalAdRevenue: number;
  yourShare: number;
  sharePercent: number;
}

export function AdRevenueBanner({
  totalAdRevenue,
  yourShare,
  sharePercent,
}: AdRevenueBannerProps) {
  return (
    <div className="rounded-[12px] bg-gradient-to-r from-bg-surface-2 via-bg-surface to-bg-surface-2 border border-border-default p-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-[8px] bg-warning/10 flex items-center justify-center shrink-0">
          <Megaphone className="w-5 h-5 text-warning" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-semibold text-text-primary mb-2">
            광고 수익 환원 모델
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-surface-3 text-text-secondary">
              <span>기업 광고비</span>
              <span className="text-text-muted font-mono">
                ${totalAdRevenue.toLocaleString()}
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-surface-3 text-text-secondary">
              <span>Cryptree 수익</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-text-muted shrink-0" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand/10 text-brand font-medium">
              <span>유저 포인트</span>
              <span className="font-mono">
                ${yourShare.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-brand/10 text-brand text-[12px] font-semibold">
              수익의 {sharePercent}%를 유저에게 환원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
