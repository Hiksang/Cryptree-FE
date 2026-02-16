"use client";

import { Download } from "lucide-react";

export function ExportCta() {
  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[16px] leading-[24px] font-semibold text-text-primary mb-2">
        세금 리포트 내보내기
      </h3>
      <p className="text-[14px] leading-[20px] text-text-secondary mb-4">
        거래 데이터가 충분히 수집되면 리포트를 내보낼 수 있습니다.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          disabled
          className="flex items-center gap-2 h-10 px-4 bg-bg-surface-2 text-text-muted text-[14px] font-semibold rounded-[6px] cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          CSV 다운로드
        </button>
        <button
          disabled
          className="flex items-center gap-2 h-10 px-4 bg-bg-surface-2 text-text-muted text-[14px] font-medium rounded-[6px] cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          PDF 다운로드
        </button>
      </div>
    </div>
  );
}
