"use client";

import { AlertTriangle } from "lucide-react";
import { useT } from "@/core/i18n";

export default function AddressError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center p-6">
        <div className="w-16 h-16 rounded-full bg-negative-bg flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-negative" />
        </div>
        <div>
          <h2 className="text-[20px] font-semibold text-text-primary mb-2">
            {t.common.errorOccurred}
          </h2>
          <p className="text-[14px] text-text-secondary max-w-md">
            {t.common.errorLoadPage}
          </p>
        </div>
        <button
          onClick={reset}
          className="h-10 px-6 bg-brand text-bg-primary text-[14px] font-semibold rounded-[6px] hover:bg-brand-hover transition-colors cursor-pointer"
        >
          {t.common.retry}
        </button>
      </div>
    </div>
  );
}
