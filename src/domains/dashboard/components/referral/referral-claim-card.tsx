"use client";

import { useState, useEffect } from "react";
import { Ticket, Loader2 } from "lucide-react";
import { toast } from "@/shared/ui";
import { api } from "@/domains/dashboard/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";

export function ReferralClaimCard() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const queryClient = useQueryClient();

  // ?ref= 파라미터로 저장된 pendingReferral 자동 입력
  useEffect(() => {
    const pending = localStorage.getItem("pendingReferral");
    if (pending) {
      setCode(pending);
      localStorage.removeItem("pendingReferral");
    }
  }, []);

  async function handleClaim() {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      toast.error("추천 코드를 입력해주세요");
      return;
    }

    setLoading(true);
    try {
      await api.claimReferral(trimmed);
      setClaimed(true);
      toast.success("추천 코드가 등록되었습니다!");
      queryClient.invalidateQueries({ queryKey: ["dashboard", "referral"] });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "등록에 실패했습니다";
      if (msg.includes("Already referred")) {
        toast.error("이미 추천 코드를 등록했습니다");
        setClaimed(true);
      } else if (msg.includes("own referral")) {
        toast.error("자신의 추천 코드는 사용할 수 없습니다");
      } else if (msg.includes("Invalid")) {
        toast.error("존재하지 않는 추천 코드입니다");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  if (claimed) {
    return (
      <div className="bg-bg-surface border border-positive/30 rounded-[8px] p-6">
        <div className="flex items-center gap-2 mb-2">
          <Ticket className="w-5 h-5 text-positive" />
          <h3 className="text-[16px] font-semibold text-text-primary">추천 코드 등록 완료</h3>
        </div>
        <p className="text-[14px] text-text-secondary">
          추천 코드가 성공적으로 등록되었습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <div className="flex items-center gap-2 mb-2">
        <Ticket className="w-5 h-5 text-text-muted" />
        <h3 className="text-[16px] font-semibold text-text-primary">추천 코드 등록</h3>
      </div>
      <p className="text-[14px] text-text-secondary mb-4">
        친구의 추천 코드를 입력하면 보너스 포인트가 지급됩니다.
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
          {loading ? "등록 중..." : "등록"}
        </button>
      </div>
    </div>
  );
}
