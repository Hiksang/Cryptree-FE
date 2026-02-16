"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/shared/layout";
import { ScanProgress } from "@/domains/scan";
import { ScanTabs } from "@/domains/scan";
import { mockScanResult } from "@/core/mock";
import { shortenAddress } from "@/core/utils";
import { ArrowLeft, Copy, Check, Lock } from "lucide-react";

export default function AddressPage() {
  const params = useParams();
  const router = useRouter();
  const address = params.address as string;
  const [scanning, setScanning] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="pt-16">
        {scanning ? (
          <ScanProgress
            address={address}
            onComplete={() => setScanning(false)}
          />
        ) : (
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
            <ScanTabs data={mockScanResult} />

            {/* Signup banner */}
            <div className="mt-8 bg-bg-surface border border-border-default border-t-2 border-t-brand rounded-[8px] p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4 text-brand" />
                    <span className="text-[16px] font-medium text-text-primary">
                      결과를 저장하고 더 자세한 분석을 받아보세요
                    </span>
                  </div>
                  <p className="text-[12px] text-text-muted">
                    무료 가입 · 이메일 또는 Google로 10초만에
                  </p>
                </div>
                <button className="h-10 px-5 bg-brand text-bg-primary font-semibold text-[14px] rounded-[6px] hover:bg-brand-hover transition-colors whitespace-nowrap cursor-pointer">
                  무료 가입하기
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
