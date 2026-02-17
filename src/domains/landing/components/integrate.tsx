"use client";

import { Layers, Plug, Clock } from "lucide-react";
import { useT } from "@/core/i18n";

const chains = [
  { name: "HyperEVM", status: "live" as const },
  { name: "Hyperliquid", status: "live" as const },
  { name: "Arbitrum", status: "live" as const },
  { name: "Base", status: "live" as const },
  { name: "Ethereum", status: "live" as const },
];

const protocols = [
  { name: "BNB Chain", status: "soon" as const },
  { name: "Uniswap", status: "soon" as const },
  { name: "Aave", status: "soon" as const },
  { name: "GMX", status: "soon" as const },
  { name: "Aerodrome", status: "soon" as const },
  { name: "Lido", status: "soon" as const },
  { name: "Curve", status: "soon" as const },
];

export function Integrate() {
  const t = useT();

  return (
    <section id="integrate" className="py-16 px-4">
      <div className="max-w-[1280px] mx-auto">
        <h2 className="text-[28px] md:text-[32px] leading-[36px] font-bold text-text-primary text-center tracking-[-0.01em] mb-3">
          {t.landing.integrate.sectionTitle}
        </h2>
        <p className="text-[16px] md:text-[18px] leading-[28px] text-text-secondary text-center mb-10 max-w-xl mx-auto">
          {t.landing.integrate.sectionSubtitle}
        </p>

        {/* Supported Chains */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-brand" />
            <h3 className="text-[18px] leading-[26px] font-semibold text-text-primary">
              {t.landing.integrate.supportedChains}
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
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
                  {t.landing.integrate.live}
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
              {t.landing.integrate.upcomingProtocols}
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
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
                  {t.landing.integrate.comingSoon}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[14px] text-text-muted text-center">
          {t.landing.integrate.moreProtocols}
        </p>
      </div>
    </section>
  );
}
