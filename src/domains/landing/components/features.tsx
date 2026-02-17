"use client";

import { Search, BarChart3, Trophy } from "lucide-react";
import { useT } from "@/core/i18n";

export function Features() {
  const t = useT();

  const features = [
    {
      icon: Search,
      title: t.landing.features.card1Title,
      description: t.landing.features.card1Desc,
    },
    {
      icon: BarChart3,
      title: t.landing.features.card2Title,
      description: t.landing.features.card2Desc,
    },
    {
      icon: Trophy,
      title: t.landing.features.card3Title,
      description: t.landing.features.card3Desc,
    },
  ];

  return (
    <section id="features" className="py-16 px-4">
      <div className="max-w-[1280px] mx-auto">
        <h2 className="text-[28px] md:text-[32px] leading-[36px] font-bold text-text-primary text-center tracking-[-0.01em] mb-10">
          {t.landing.features.sectionTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-bg-surface border border-border-default rounded-[8px] p-6"
            >
              <div className="w-10 h-10 rounded-full bg-brand-muted flex items-center justify-center mb-3">
                <feature.icon className="w-5 h-5 text-brand" />
              </div>
              <h3 className="text-[20px] leading-[28px] font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-[14px] leading-[22px] text-text-secondary">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
