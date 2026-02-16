"use client";

import { Gift } from "lucide-react";

interface ClaimCtaProps {
  amount: number;
  token: string;
}

export function ClaimCta({ amount, token }: ClaimCtaProps) {
  return (
    <div className="bg-gradient-to-r from-brand/10 to-brand/5 border border-brand/20 rounded-[8px] p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
            <Gift className="w-6 h-6 text-brand" />
          </div>
          <div>
            <p className="text-[14px] text-text-secondary">클레임 가능</p>
            <p className="text-[24px] font-bold text-text-primary tabular-nums">
              {amount.toLocaleString()} {token}
            </p>
          </div>
        </div>
        <button
          disabled
          className="h-10 px-6 bg-bg-surface-2 text-text-muted text-[14px] font-semibold rounded-[6px] cursor-not-allowed"
        >
          준비 중
        </button>
      </div>
    </div>
  );
}
