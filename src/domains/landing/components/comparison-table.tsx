import { Check, X } from "lucide-react";

const rows = [
  {
    feature: "HyperEVM 해석",
    debank: false,
    koinly: false,
    cryptree: "완벽",
  },
  {
    feature: "활동 측정/등급",
    debank: false,
    koinly: false,
    cryptree: true,
  },
  {
    feature: "활동 보상",
    debank: false,
    koinly: false,
    cryptree: "USDC",
  },
  {
    feature: "크로스체인 PnL",
    debank: false,
    koinly: true,
    cryptree: "무료",
  },
  {
    feature: "세금 리포트",
    debank: false,
    koinly: true,
    cryptree: "무료",
  },
  {
    feature: "비용",
    debank: "무료",
    koinly: "$49+/년",
    cryptree: "무료",
  },
];

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) {
    return <Check className="w-4 h-4 text-positive mx-auto" />;
  }
  if (value === false) {
    return <X className="w-4 h-4 text-text-muted mx-auto" />;
  }
  return (
    <span className="text-[14px] font-medium text-text-primary">{value}</span>
  );
}

function CryptreeCell({ value }: { value: boolean | string }) {
  if (value === true) {
    return <Check className="w-4 h-4 text-positive mx-auto" />;
  }
  return (
    <span className="text-[14px] font-semibold text-brand">{value as string}</span>
  );
}

export function ComparisonTable() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-[800px] mx-auto">
        <h2 className="text-[30px] leading-[36px] font-semibold text-text-primary text-center tracking-[-0.01em] mb-8">
          왜 Cryptree인가?
        </h2>

        <div className="bg-bg-surface border border-border-default rounded-[8px] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-4 bg-bg-surface-2">
            <div className="p-3 text-[12px] font-medium text-text-muted" />
            <div className="p-3 text-[12px] font-medium text-text-muted text-center">
              DeBank
            </div>
            <div className="p-3 text-[12px] font-medium text-text-muted text-center">
              Koinly
            </div>
            <div className="p-3 text-[12px] font-medium text-center text-brand border-t-2 border-brand bg-brand-muted">
              Cryptree
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-4 ${
                i < rows.length - 1 ? "border-b border-border-default" : ""
              }`}
            >
              <div className="p-3 flex items-center text-[14px] text-text-secondary">
                {row.feature}
              </div>
              <div className="p-3 flex items-center justify-center">
                <CellValue value={row.debank} />
              </div>
              <div className="p-3 flex items-center justify-center">
                <CellValue value={row.koinly} />
              </div>
              <div className="p-3 flex items-center justify-center bg-brand-muted">
                <CryptreeCell value={row.cryptree} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
