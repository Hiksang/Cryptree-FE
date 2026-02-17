"use client";

import { FileText } from "lucide-react";
import { useT } from "@/core/i18n";

export default function TaxPage() {
  const t = useT();

  return (
    <div className="space-y-6 max-w-[1200px]">
      <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">
        {t.dashboard.tax.title}
      </h1>

      <div className="bg-bg-surface border border-border-default rounded-[8px] p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-bg-surface-2 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-text-muted" />
        </div>
        <h2 className="text-[20px] font-semibold text-text-primary mb-2">
          {t.dashboard.tax.comingSoonTitle}
        </h2>
        <p className="text-[14px] leading-[22px] text-text-secondary max-w-md mx-auto">
          {t.dashboard.tax.comingSoonDesc}
        </p>
      </div>
    </div>
  );
}
