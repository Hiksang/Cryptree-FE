"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "@/shared/ui";

interface ReferralCodeCardProps {
  code: string;
}

export function ReferralCodeCard({ code }: ReferralCodeCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("추천 코드가 복사되었습니다");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[16px] leading-[24px] font-semibold text-text-primary mb-3">
        내 추천 코드
      </h3>

      <div className="flex items-center gap-3">
        <div className="flex-1 bg-bg-surface-2 border border-border-default rounded-[6px] px-4 py-3">
          <span className="text-[18px] font-mono font-bold text-brand tracking-wider">
            {code}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="h-12 w-12 flex items-center justify-center border border-border-default rounded-[6px] hover:bg-bg-surface-2 transition-colors cursor-pointer shrink-0"
        >
          {copied ? (
            <Check className="w-5 h-5 text-positive" />
          ) : (
            <Copy className="w-5 h-5 text-text-secondary" />
          )}
        </button>
      </div>
    </div>
  );
}
