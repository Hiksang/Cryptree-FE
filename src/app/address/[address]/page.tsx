"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/shared/layout";
import { ScanProgress } from "@/domains/scan";
import { ScanTabs } from "@/domains/scan";
import { useScan } from "@/domains/scan";
import { shortenAddress } from "@/core/utils";
import { ArrowLeft, Copy, Check, Lock, AlertCircle, Gift, Shield, TrendingUp } from "lucide-react";

const hasPrivy = !!process.env.NEXT_PUBLIC_PRIVY_APP_ID;

function usePrivyLogin() {
  if (!hasPrivy) return () => {};
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { login } = require("@privy-io/react-auth").usePrivy();
  return login;
}

export default function AddressPage() {
  const params = useParams();
  const router = useRouter();
  const address = params.address as string;
  const [copied, setCopied] = useState(false);
  const login = usePrivyLogin();

  const { data, isLoading } = useScan(address);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="pt-16">
        {isLoading ? (
          <ScanProgress address={address} />
        ) : data && !data.found ? (
          /* Empty state when no data found */
          <div className="max-w-[640px] mx-auto pt-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-bg-surface-2 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-text-muted" />
            </div>
            <h2 className="text-[24px] leading-[32px] font-semibold text-text-primary mb-2">
              이 주소의 데이터가 없습니다
            </h2>
            <p className="text-[16px] text-text-secondary mb-6">
              {shortenAddress(address, 6)} 주소에 대한 온체인 활동이 아직
              기록되지 않았습니다.
            </p>
            <button
              onClick={() => router.push("/")}
              className="h-10 px-5 bg-brand text-bg-primary font-semibold text-[14px] rounded-[6px] hover:bg-brand-hover transition-colors cursor-pointer"
            >
              다른 주소 분석하기
            </button>
          </div>
        ) : data ? (
          <div className="max-w-[960px] mx-auto px-4 py-6">
            {/* Top navigation */}
            <div className="flex items-center justify-between mb-4 gap-2">
              <button
                onClick={() => router.push("/")}
                className="text-[14px] text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                홈
              </button>
              <button
                onClick={() => router.push("/")}
                className="h-8 px-3 md:px-4 bg-brand text-bg-primary text-[13px] md:text-[14px] font-semibold rounded-[6px] hover:bg-brand-hover transition-colors cursor-pointer whitespace-nowrap"
              >
                내 지갑 분석하기
              </button>
            </div>

            {/* Address */}
            <div className="flex items-center gap-2 mb-6">
              <h1 className="font-mono text-[20px] md:text-[24px] leading-[28px] md:leading-[32px] text-text-primary break-all">
                {shortenAddress(address, 4)}
              </h1>
              <button
                onClick={handleCopy}
                className="p-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-positive" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Tabs */}
            <ScanTabs data={data} />

            {/* Signup CTA */}
            <div className="mt-8 bg-bg-surface border border-border-default rounded-[8px] overflow-hidden">
              <div className="bg-gradient-to-r from-brand/10 to-brand-hover/10 px-6 py-4 border-b border-border-default">
                <h3 className="text-[18px] font-semibold text-text-primary">
                  지금 가입하고 더 많은 기능을 이용하세요
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[14px] font-medium text-text-primary">분석 결과 저장</p>
                      <p className="text-[12px] text-text-muted">대시보드에서 언제든 확인</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[14px] font-medium text-text-primary">세금 리포트</p>
                      <p className="text-[12px] text-text-muted">PnL 분석 및 세금 미리보기</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Gift className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[14px] font-medium text-text-primary">100P 즉시 지급</p>
                      <p className="text-[12px] text-text-muted">가입만 해도 포인트 지급</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => login()}
                  className="w-full h-11 bg-brand text-bg-primary font-semibold text-[15px] rounded-[6px] hover:bg-brand-hover transition-colors cursor-pointer"
                >
                  무료로 시작하기
                </button>
                <p className="text-[12px] text-text-muted text-center">
                  Google 또는 지갑으로 10초만에 가입
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
