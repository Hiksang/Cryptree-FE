"use client";

import { ScanInput } from "@/domains/scan";
import { Check } from "lucide-react";
import { useT } from "@/core/i18n";

export function Hero() {
  const t = useT();

  return (
    <section
      id="hero"
      className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16"
    >
      <div className="text-center max-w-3xl mx-auto">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-muted text-brand text-[13px] leading-[16px] font-medium mb-6">
          {t.landing.hero.badge}
        </div>

        {/* Title */}
        <h1 className="text-[36px] md:text-[48px] leading-[44px] md:leading-[56px] font-bold text-text-primary tracking-[-0.02em] mb-4">
          {t.landing.hero.titleLine1}
          <br />
          {t.landing.hero.titleLine2}
        </h1>

        {/* Subtitle */}
        <p className="text-[18px] md:text-[20px] leading-[28px] text-text-secondary mb-8">
          {t.landing.hero.subtitle}
        </p>

        {/* Input */}
        <ScanInput size="lg" className="max-w-[480px] mx-auto mb-5" />

        {/* Features list */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
          {[t.landing.hero.tag1, t.landing.hero.tag2, t.landing.hero.tag3].map((item) => (
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
