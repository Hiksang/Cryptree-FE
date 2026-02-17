"use client";

import { useState, useEffect } from "react";
import { Ticket, Loader2, CheckCircle } from "lucide-react";
import { toast } from "@/shared/ui";
import { api } from "@/domains/dashboard/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import type { ReferralData } from "@/core/types";
import { useT } from "@/core/i18n";
import { useHyperViewStore } from "@/shared/store";

interface ReferralClaimCardProps {
  referredBy: ReferralData["referredBy"];
}

export function ReferralClaimCard({ referredBy }: ReferralClaimCardProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const queryClient = useQueryClient();
  const t = useT();
  const locale = useHyperViewStore((s) => s.locale);

  // ?ref= 파라미터로 저장된 pendingReferral 자동 입력
  useEffect(() => {
    if (referredBy) return; // 이미 등록된 경우 무시
    const pending = localStorage.getItem("pendingReferral");
    if (pending) {
      setCode(pending);
      localStorage.removeItem("pendingReferral");
    }
  }, [referredBy]);

  async function handleClaim() {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      toast.error(t.dashboard.referral.enterCode);
      return;
    }

    setLoading(true);
    try {
      await api.claimReferral(trimmed);
      setClaimed(true);
      toast.success(t.dashboard.referral.codeRegistered);
      queryClient.invalidateQueries({ queryKey: ["dashboard", "referral"] });
    } catch (err) {
      const msg = err instanceof Error ? err.message : t.dashboard.referral.registerFailed;
      if (msg.includes("Already referred")) {
        toast.error(t.dashboard.referral.alreadyRegistered);
        setClaimed(true);
      } else if (msg.includes("own referral")) {
        toast.error(t.dashboard.referral.cannotUseOwn);
      } else if (msg.includes("Invalid")) {
        toast.error(t.dashboard.referral.invalidCode);
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  // 이미 추천 코드를 등록한 상태
  if (referredBy || claimed) {
    return (
      <div className="bg-bg-surface border border-positive/30 rounded-[8px] p-6">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-positive" />
          <h3 className="text-[16px] font-semibold text-text-primary">{t.dashboard.referral.claimComplete}</h3>
        </div>
        {referredBy ? (
          <div className="flex items-center gap-4 text-[14px] text-text-secondary">
            <span>{t.dashboard.referral.claimReferrer} <span className="font-mono text-text-primary">{referredBy.code || referredBy.address}</span></span>
            <span className="text-text-muted">
              {new Date(referredBy.registeredAt).toLocaleDateString(locale === "en" ? "en-US" : "ko-KR")}
            </span>
          </div>
        ) : (
          <p className="text-[14px] text-text-secondary">
            {t.dashboard.referral.claimSuccess}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <div className="flex items-center gap-2 mb-2">
        <Ticket className="w-5 h-5 text-text-muted" />
        <h3 className="text-[16px] font-semibold text-text-primary">{t.dashboard.referral.claimTitle}</h3>
      </div>
      <p className="text-[14px] text-text-secondary mb-4">
        {t.dashboard.referral.claimDesc}
      </p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="HYPER-XXXX-XXXX"
          className="flex-1 h-10 px-3 bg-bg-surface-2 border border-border-default rounded-[6px] text-[14px] font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand transition-colors"
          onKeyDown={(e) => e.key === "Enter" && handleClaim()}
          disabled={loading}
        />
        <button
          onClick={handleClaim}
          disabled={loading || !code.trim()}
          className="h-10 px-4 bg-brand text-bg-primary text-[13px] font-semibold rounded-[6px] hover:bg-brand-hover transition-colors cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? t.dashboard.referral.claimRegistering : t.dashboard.referral.claimRegister}
        </button>
      </div>
    </div>
  );
}
