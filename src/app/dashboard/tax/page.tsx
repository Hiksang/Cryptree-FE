import { FileText } from "lucide-react";

export default function TaxPage() {
  return (
    <div className="space-y-6 max-w-[1200px]">
      <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">
        세금 보고서
      </h1>

      <div className="bg-bg-surface border border-border-default rounded-[8px] p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-bg-surface-2 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-text-muted" />
        </div>
        <h2 className="text-[20px] font-semibold text-text-primary mb-2">
          세금 보고서 기능은 추후 제공될 예정입니다.
        </h2>
        <p className="text-[14px] leading-[22px] text-text-secondary max-w-md mx-auto">
          온체인 활동 기반의 세금 보고서를 자동으로 생성해 드립니다. 조금만 기다려 주세요.
        </p>
      </div>
    </div>
  );
}
