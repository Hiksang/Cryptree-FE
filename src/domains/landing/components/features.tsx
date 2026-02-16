import { Search, BarChart3, Trophy } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "HyperEVM 트랜잭션 해석",
    description:
      "모든 HyperEVM 트랜잭션을 사람이 읽을 수 있게 해석합니다. 스왑, 브릿지, LP, 스테이킹 등 자동 분류.",
  },
  {
    icon: BarChart3,
    title: "활동 스코어 & DNA 분석",
    description:
      "온체인 활동을 점수화하고 DeFi DNA를 분석합니다. Perp, DEX, Yield, Lending 비율을 한눈에.",
  },
  {
    icon: Trophy,
    title: "등급 측정 & 보상",
    description:
      "활동 기반 등급(Bronze~Diamond)을 측정합니다. 등급에 따라 USDC 보상이 분배됩니다.",
  },
];

export function Features() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <p className="text-[14px] leading-[20px] text-text-secondary">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
