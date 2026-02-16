import { ScanInput } from "@/domains/scan";
import { Check } from "lucide-react";

export function Hero() {
  return (
    <section
      id="hero"
      className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16"
    >
      <div className="text-center max-w-3xl mx-auto">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-muted text-brand text-[13px] leading-[16px] font-medium mb-6">
          최초의 온체인 분석 타겟 광고 리워드 플랫폼
        </div>

        {/* Title */}
        <h1 className="text-[36px] md:text-[48px] leading-[44px] md:leading-[56px] font-bold text-text-primary tracking-[-0.02em] mb-4">
          멀티체인 온체인 활동을
          <br />
          분석하고 보상받으세요
        </h1>

        {/* Subtitle */}
        <p className="text-[18px] md:text-[20px] leading-[28px] text-text-secondary mb-8">
          온체인 트랜잭션 기반 데이터 분석
        </p>

        {/* Input */}
        <ScanInput size="lg" className="max-w-[480px] mx-auto mb-5" />

        {/* Features list */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
          {["완전 무료", "HyperEVM 지원", "멀티체인 분석"].map((item) => (
            <span
              key={item}
              className="flex items-center gap-1.5 text-[13px] leading-[16px] text-text-muted"
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
