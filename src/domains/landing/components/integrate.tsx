import { Layers, Plug, Clock } from "lucide-react";

const chains = [
  { name: "HyperEVM", status: "live" as const },
  { name: "Hyperliquid", status: "live" as const },
  { name: "Arbitrum", status: "live" as const },
  { name: "Base", status: "live" as const },
  { name: "Ethereum", status: "live" as const },
  { name: "BNB Chain", status: "live" as const },
];

const protocols = [
  { name: "Uniswap", status: "soon" as const },
  { name: "Aave", status: "soon" as const },
  { name: "GMX", status: "soon" as const },
  { name: "Aerodrome", status: "soon" as const },
  { name: "Lido", status: "soon" as const },
  { name: "Curve", status: "soon" as const },
];

export function Integrate() {
  return (
    <section id="integrate" className="py-16 px-4">
      <div className="max-w-[1280px] mx-auto">
        <h2 className="text-[28px] md:text-[32px] leading-[36px] font-bold text-text-primary text-center tracking-[-0.01em] mb-3">
          멀티 DeFi 플랫폼 통합
        </h2>
        <p className="text-[16px] md:text-[18px] leading-[28px] text-text-secondary text-center mb-10 max-w-xl mx-auto">
          다양한 DeFi 프로토콜과 체인의 데이터를 한 곳에서 분석합니다
        </p>

        {/* Supported Chains */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-brand" />
            <h3 className="text-[18px] leading-[26px] font-semibold text-text-primary">
              지원 체인
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {chains.map((chain) => (
              <div
                key={chain.name}
                className="bg-bg-surface border border-border-default rounded-[8px] p-4 flex flex-col items-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-brand-muted flex items-center justify-center">
                  <Layers className="w-5 h-5 text-brand" />
                </div>
                <span className="text-[14px] font-medium text-text-primary">
                  {chain.name}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-positive/10 text-positive">
                  지원 중
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Protocols */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Plug className="w-5 h-5 text-text-muted" />
            <h3 className="text-[18px] leading-[26px] font-semibold text-text-primary">
              추가 예정 프로토콜
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {protocols.map((protocol) => (
              <div
                key={protocol.name}
                className="bg-bg-surface border border-border-default rounded-[8px] p-4 flex flex-col items-center gap-2 opacity-60"
              >
                <div className="w-10 h-10 rounded-full bg-bg-surface-2 flex items-center justify-center">
                  <Plug className="w-5 h-5 text-text-muted" />
                </div>
                <span className="text-[14px] font-medium text-text-primary">
                  {protocol.name}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-bg-surface-2 text-text-muted flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  곧 지원
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[14px] text-text-muted text-center">
          더 많은 프로토콜이 추가될 예정입니다
        </p>
      </div>
    </section>
  );
}
