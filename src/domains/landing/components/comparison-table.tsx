"use client";

import { Zap, Gift, Shield, Coins } from "lucide-react";
import { useT } from "@/core/i18n";

export function ComparisonTable() {
  const t = useT();

  const differentiators = [
    {
      icon: Zap,
      title: t.landing.comparison.card1Title,
      description: t.landing.comparison.card1Desc,
    },
    {
      icon: Gift,
      title: t.landing.comparison.card2Title,
      description: t.landing.comparison.card2Desc,
    },
    {
      icon: Shield,
      title: t.landing.comparison.card3Title,
      description: t.landing.comparison.card3Desc,
    },
    {
      icon: Coins,
      title: t.landing.comparison.card4Title,
      description: t.landing.comparison.card4Desc,
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-[1280px] mx-auto">
        <h2 className="text-[28px] md:text-[32px] leading-[36px] font-bold text-text-primary text-center tracking-[-0.01em] mb-3">
          {t.landing.comparison.sectionTitle}
        </h2>
        <p className="text-[16px] md:text-[18px] leading-[28px] text-text-secondary text-center mb-10 max-w-xl mx-auto">
          {t.landing.comparison.sectionSubtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {differentiators.map((item) => (
            <div
              key={item.title}
              className="bg-bg-surface border border-border-default rounded-[8px] p-6 flex gap-4"
            >
              <div className="w-12 h-12 rounded-[8px] bg-brand-muted flex items-center justify-center shrink-0">
                <item.icon className="w-6 h-6 text-brand" />
              </div>
              <div>
                <h3 className="text-[18px] leading-[26px] font-semibold text-text-primary mb-1">
                  {item.title}
                </h3>
                <p className="text-[14px] leading-[22px] text-text-secondary">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
