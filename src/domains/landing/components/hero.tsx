import { ScanInput } from "@/domains/scan";
import { Check } from "lucide-react";

export function Hero() {
  return (
    <section
      id="hero"
      className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16"
    >
      <div className="text-center max-w-2xl mx-auto">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-muted text-brand text-[12px] leading-[16px] mb-6">
          HyperEVM 최초 활동 분석 플랫폼
        </div>

        {/* Title */}
        <h1 className="text-[30px] md:text-[36px] leading-[40px] md:leading-[44px] font-semibold text-text-primary tracking-[-0.02em] mb-4">
          HyperEVM 온체인 활동을
          <br />
          분석하고 보상받으세요
        </h1>

        {/* Subtitle */}
        <p className="text-[18px] leading-[28px] text-text-secondary mb-6">
          트랜잭션 해석 · 활동 스코어
          <br className="md:hidden" />
          {" "}· DeFi DNA · 등급 측정
        </p>

        {/* Input */}
        <ScanInput size="lg" className="max-w-[480px] mx-auto mb-4" />

        {/* Features list */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
          {["완전 무료", "HyperEVM 완벽 지원", "35+ 체인"].map((item) => (
            <span
              key={item}
              className="flex items-center gap-1.5 text-[12px] leading-[16px] text-text-muted"
            >
              <Check className="w-4 h-4 text-positive" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
