"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "@/shared/ui";
import { useT } from "@/core/i18n";

interface ReferralCodeCardProps {
  code: string;
}

export function ReferralCodeCard({ code }: ReferralCodeCardProps) {
  const t = useT();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(t.dashboard.referral.referralCodeCopied);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[16px] leading-[24px] font-semibold text-text-primary mb-3">
        {t.dashboard.referral.myReferralCode}
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
