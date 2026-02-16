"use client";

import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center p-6">
      <div className="w-16 h-16 rounded-full bg-negative-bg flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-negative" />
      </div>
      <div>
        <h2 className="text-[20px] font-semibold text-text-primary mb-2">
          오류가 발생했습니다
        </h2>
        <p className="text-[14px] text-text-secondary max-w-md">
          페이지를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.
        </p>
      </div>
      <button
        onClick={reset}
        className="h-10 px-6 bg-brand text-bg-primary text-[14px] font-semibold rounded-[6px] hover:bg-brand-hover transition-colors cursor-pointer"
      >
        다시 시도
      </button>
    </div>
  );
}
