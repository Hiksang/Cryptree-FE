import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "데이터를 불러오는 데 실패했습니다.", onRetry }: ErrorStateProps) {
  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-8 flex flex-col items-center gap-4 text-center">
      <div className="w-12 h-12 rounded-full bg-negative-bg flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-negative" />
      </div>
      <div>
        <p className="text-[16px] font-semibold text-text-primary mb-1">오류 발생</p>
        <p className="text-[14px] text-text-secondary">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="h-9 px-4 bg-brand text-bg-primary text-[14px] font-semibold rounded-[6px] hover:bg-brand-hover transition-colors cursor-pointer"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
