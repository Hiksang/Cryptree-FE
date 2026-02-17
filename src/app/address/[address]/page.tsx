"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/shared/layout";
import { ScanProgress, ScanResultSkeleton, ScanTabs, useScan } from "@/domains/scan";
import { shortenAddress } from "@/core/utils";
import { useT } from "@/core/i18n";
import { track } from "@vercel/analytics";
import { ArrowLeft, Copy, Check, AlertCircle, Gift, Shield, TrendingUp, X, Sparkles } from "lucide-react";

const hasPrivy = !!process.env.NEXT_PUBLIC_PRIVY_APP_ID;

function usePrivyLogin() {
  if (!hasPrivy) return () => {};
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { login } = require("@privy-io/react-auth").usePrivy();
  return login;
}

type ViewPhase = "scanning" | "skeleton" | "results" | "empty";

const SKELETON_DELAY_MS = 2500;
const POPUP_DELAY_MS = 8000;

export default function AddressPage() {
  const t = useT();
  const params = useParams();
  const router = useRouter();
  const address = params.address as string;
  const [copied, setCopied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const login = usePrivyLogin();

  const { data, isLoading } = useScan(address);

  const [phase, setPhase] = useState<ViewPhase>("scanning");
  const [fadeClass, setFadeClass] = useState("animate-fade-in");
  const dataArrivedRef = useRef(false);

  // Track when data arrives
  useEffect(() => {
    if (!isLoading && data) {
      dataArrivedRef.current = true;
    }
  }, [isLoading, data]);

  // Phase transitions
  useEffect(() => {
    if (isLoading && !data) {
      setPhase("scanning");
      setFadeClass("animate-fade-in");

      const skeletonTimer = setTimeout(() => {
        if (!dataArrivedRef.current) {
          setFadeClass("animate-fade-out");
          setTimeout(() => {
            setPhase("skeleton");
            setFadeClass("animate-fade-in");
          }, 300);
        }
      }, SKELETON_DELAY_MS);

      return () => clearTimeout(skeletonTimer);
    }

    if (!isLoading && data) {
      setFadeClass("animate-fade-out");

      const timer = setTimeout(() => {
        setPhase(data.found ? "results" : "empty");
        setFadeClass("animate-fade-in");
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isLoading, data]);

  // Show popup after delay when results are displayed
  useEffect(() => {
    if (phase !== "results") return;
    const timer = setTimeout(() => {
      setShowPopup(true);
      track("cta_popup_shown", { page: "scan_result" });
    }, POPUP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  function handleSignup(source: string) {
    track("signup_click", { source, page: "scan_result" });
    login();
  }

  const scanComplete = !isLoading && !!data;

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      <main className="pt-16">
        <div className={fadeClass}>
          {phase === "scanning" ? (
            <ScanProgress address={address} isComplete={scanComplete} />
          ) : phase === "skeleton" ? (
            <ScanResultSkeleton />
          ) : phase === "empty" ? (
            <div className="max-w-[640px] mx-auto pt-16 px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-bg-surface-2 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-text-muted" />
              </div>
              <h2 className="text-[24px] leading-[32px] font-semibold text-text-primary mb-2">
                {t.scan.result.noData}
              </h2>
              <p className="text-[16px] text-text-secondary mb-6">
                {shortenAddress(address, 6)} {t.scan.result.noDataDesc}
                {t.scan.result.noDataDesc2}
              </p>
              <button
                onClick={() => router.push("/")}
                className="h-10 px-5 bg-brand text-bg-primary font-semibold text-[14px] rounded-[6px] hover:bg-brand-hover transition-colors cursor-pointer"
              >
                {t.scan.result.analyzeOther}
              </button>
            </div>
          ) : phase === "results" && data ? (
            <>
            <div className="max-w-[960px] mx-auto px-4 py-6">
              {/* Top navigation */}
              <div className="flex items-center justify-between mb-4 gap-2">
                <button
                  onClick={() => router.push("/")}
                  className="text-[14px] text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t.common.home}
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="h-8 px-3 md:px-4 bg-brand text-bg-primary text-[13px] md:text-[14px] font-semibold rounded-[6px] hover:bg-brand-hover transition-colors cursor-pointer whitespace-nowrap"
                >
                  {t.scan.result.analyzeMyWallet}
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
              <ScanTabs data={data} onSignup={() => handleSignup("tab_lock")} />

              {/* Signup CTA inline */}
              <div className="mt-8 mb-24 bg-bg-surface border border-border-default rounded-[8px] overflow-hidden">
                <div className="bg-gradient-to-r from-brand/10 to-brand-hover/10 px-6 py-4 border-b border-border-default">
                  <h3 className="text-[18px] font-semibold text-text-primary">
                    {t.scan.result.signupCta}
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[14px] font-medium text-text-primary">{t.scan.result.saveResults}</p>
                        <p className="text-[12px] text-text-muted">{t.scan.result.saveResultsDesc}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[14px] font-medium text-text-primary">{t.scan.result.taxReport}</p>
                        <p className="text-[12px] text-text-muted">{t.scan.result.taxReportDesc}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Gift className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[14px] font-medium text-text-primary">{t.scan.result.instantPoints}</p>
                        <p className="text-[12px] text-text-muted">{t.scan.result.instantPointsDesc}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSignup("inline_card")}
                    className="w-full h-11 bg-brand text-bg-primary font-semibold text-[15px] rounded-[6px] hover:bg-brand-hover transition-colors cursor-pointer"
                  >
                    {t.common.freeStart}
                  </button>
                  <p className="text-[12px] text-text-muted text-center">
                    {t.common.signupGoogle}
                  </p>
                </div>
              </div>
            </div>

            {/* Sticky bottom CTA bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-bg-surface/95 backdrop-blur-md border-t border-border-default">
              <div className="max-w-[960px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
                <div className="hidden sm:block">
                  <p className="text-[14px] font-medium text-text-primary">
                    {t.scan.result.stickyTitle}
                  </p>
                  <p className="text-[12px] text-text-muted">
                    {t.scan.result.stickySubtitle}
                  </p>
                </div>
                <p className="sm:hidden text-[13px] font-medium text-text-primary">
                  {t.scan.result.stickyMobile}
                </p>
                <button
                  onClick={() => handleSignup("sticky_bar")}
                  className="h-10 px-6 bg-brand text-bg-primary font-semibold text-[14px] rounded-[8px] hover:bg-brand-hover transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  {t.common.freeStart}
                </button>
              </div>
            </div>

            {/* Signup popup modal */}
            {showPopup && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={() => {
                    setShowPopup(false);
                    track("cta_popup_dismissed", { page: "scan_result" });
                  }}
                />
                <div className="relative bg-bg-surface border border-border-default rounded-[16px] p-8 max-w-[420px] w-full text-center animate-fade-in-up shadow-2xl">
                  <button
                    onClick={() => {
                      setShowPopup(false);
                      track("cta_popup_dismissed", { page: "scan_result" });
                    }}
                    className="absolute top-4 right-4 p-1 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-5">
                    <Sparkles className="w-8 h-8 text-brand" />
                  </div>

                  <h3 className="text-[22px] font-bold text-text-primary mb-2">
                    {t.scan.result.popupTitle}
                  </h3>
                  <p className="text-[14px] text-text-secondary mb-6">
                    {t.scan.result.popupDesc}<br />
                    {t.scan.result.popupDesc2}
                  </p>

                  <div className="flex flex-col gap-2 mb-5">
                    <div className="flex items-center gap-2 text-[13px] text-text-secondary">
                      <Check className="w-4 h-4 text-brand shrink-0" />
                      {t.scan.result.popupFeature1}
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-text-secondary">
                      <Check className="w-4 h-4 text-brand shrink-0" />
                      {t.scan.result.popupFeature2}
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-text-secondary">
                      <Check className="w-4 h-4 text-brand shrink-0" />
                      {t.scan.result.popupFeature3}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowPopup(false);
                      handleSignup("popup");
                    }}
                    className="w-full h-12 bg-brand text-bg-primary font-semibold text-[16px] rounded-[8px] hover:bg-brand-hover transition-colors cursor-pointer mb-3"
                  >
                    {t.common.freeStart}
                  </button>
                  <p className="text-[12px] text-text-muted">
                    {t.common.signupGoogle}
                  </p>
                </div>
              </div>
            )}
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
