import { Zap, Gift, Shield, Coins } from "lucide-react";

const differentiators = [
  {
    icon: Zap,
    title: "온체인 활동 자동 분석",
    description:
      "지갑 주소만 입력하면 모든 온체인 활동을 자동으로 분류하고 점수화합니다. 복잡한 설정 없이 바로 시작.",
  },
  {
    icon: Gift,
    title: "활동 기반 리워드",
    description:
      "온체인 활동에 따라 등급이 부여되고, 등급에 맞는 맞춤형 광고 리워드를 받을 수 있습니다.",
  },
  {
    icon: Shield,
    title: "완전 무료",
    description:
      "모든 기능을 무료로 제공합니다. 숨겨진 비용이나 프리미엄 구독 없이 온체인 분석과 리워드를 이용하세요.",
  },
  {
    icon: Coins,
    title: "멀티체인 지원",
    description:
      "HyperEVM을 포함한 다양한 EVM 체인을 지원합니다. 여러 체인의 활동을 하나의 대시보드에서 관리하세요.",
  },
];

export function ComparisonTable() {
  return (
    <section id="integrate" className="py-16 px-4">
      <div className="max-w-[1280px] mx-auto">
        <h2 className="text-[28px] md:text-[32px] leading-[36px] font-bold text-text-primary text-center tracking-[-0.01em] mb-3">
          왜 Cryptree인가?
        </h2>
        <p className="text-[16px] md:text-[18px] leading-[28px] text-text-secondary text-center mb-10 max-w-xl mx-auto">
          기존 플랫폼과는 다릅니다. 분석만 하지 않고, 보상까지 제공합니다.
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
