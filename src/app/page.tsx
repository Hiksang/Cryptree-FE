import { Suspense } from "react";
import { Header } from "@/shared/layout";
import { Footer } from "@/shared/layout";
import { Hero } from "@/domains/landing";
import { Features } from "@/domains/landing";
import { ComparisonTable } from "@/domains/landing";
import { Integrate } from "@/domains/landing";
import { ScanInput } from "@/domains/scan";
import { ReferralCapture } from "@/shared/ui/referral-capture";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Suspense><ReferralCapture /></Suspense>
      <Header />

      <main className="pt-16">
        <Hero />
        <Features />
        <ComparisonTable />
        <Integrate />

        {/* Footer CTA */}
        <section
          id="docs"
          className="py-16 px-4 text-center"
          style={{
            background:
              "linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-surface) 100%)",
          }}
        >
          <h2 className="text-[30px] leading-[36px] font-semibold text-text-primary tracking-[-0.01em] mb-3">
            지금 바로 분석해보세요
          </h2>
          <p className="text-[18px] leading-[28px] text-text-secondary mb-6">
            지갑 주소만 넣으면 됩니다
          </p>
          <ScanInput size="lg" className="max-w-[480px] mx-auto" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
