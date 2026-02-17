"use client";

import { Download } from "lucide-react";
import { useT } from "@/core/i18n";

export function ExportCta() {
  const t = useT();

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[16px] leading-[24px] font-semibold text-text-primary mb-2">
        {t.dashboard.tax.exportTitle}
      </h3>
      <p className="text-[14px] leading-[20px] text-text-secondary mb-4">
        {t.dashboard.tax.exportDesc}
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          disabled
          className="flex items-center gap-2 h-10 px-4 bg-bg-surface-2 text-text-muted text-[14px] font-semibold rounded-[6px] cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          {t.dashboard.tax.downloadCsv}
        </button>
        <button
          disabled
          className="flex items-center gap-2 h-10 px-4 bg-bg-surface-2 text-text-muted text-[14px] font-medium rounded-[6px] cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          {t.dashboard.tax.downloadPdf}
        </button>
      </div>
    </div>
  );
}
