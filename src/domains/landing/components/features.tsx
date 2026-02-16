import { Search, BarChart3, Trophy } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "멀티체인 트랜잭션 분석",
    description:
      "여러 체인의 온체인 트랜잭션을 자동으로 분류하고 해석합니다. 스왑, 브릿지, LP, 스테이킹 등 모든 활동을 한눈에.",
  },
  {
    icon: BarChart3,
    title: "활동 스코어 & 온체인 프로파일",
    description:
      "온체인 활동을 점수화하고 DeFi 프로파일을 분석합니다. 나의 온체인 행동 패턴과 활동 수준을 확인하세요.",
  },
  {
    icon: Trophy,
    title: "등급 기반 타겟 리워드",
    description:
      "활동 기반 등급(Bronze~Diamond)에 따라 맞춤형 광고 리워드를 제공합니다. 활동할수록 더 많은 보상.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 px-4">
      <div className="max-w-[1280px] mx-auto">
        <h2 className="text-[28px] md:text-[32px] leading-[36px] font-bold text-text-primary text-center tracking-[-0.01em] mb-10">
          핵심 기능
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
