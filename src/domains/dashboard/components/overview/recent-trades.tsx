import type { TransactionFull } from "@/core/types";
import { CHAIN_COLORS } from "@/core/constants";
import { formatCurrency, formatDate } from "@/core/utils";

interface RecentTradesProps {
  transactions: TransactionFull[];
}

export function RecentTrades({ transactions }: RecentTradesProps) {
  const recent = transactions.slice(0, 5);

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[14px] leading-[20px] text-text-secondary mb-4">
        최근 거래
      </h3>
      <div className="space-y-3">
        {recent.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: CHAIN_COLORS[tx.chainId] }}
              />
              <div>
                <p className="text-[14px] leading-[20px] text-text-primary font-medium">
                  {tx.typeLabel}
                  {tx.fromToken && (
                    <span className="text-text-muted ml-1">
                      {tx.fromToken}
                      {tx.toToken ? ` → ${tx.toToken}` : ""}
                    </span>
                  )}
                </p>
                <p className="text-[12px] leading-[16px] text-text-muted">
                  {tx.protocol} · {formatDate(tx.timestamp)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[14px] leading-[20px] text-text-primary tabular-nums font-medium">
                {formatCurrency(tx.amount)}
              </p>
              <span
                className={`text-[12px] leading-[16px] ${
                  tx.status === "completed"
                    ? "text-positive"
                    : tx.status === "pending"
                    ? "text-warning"
                    : "text-negative"
                }`}
              >
                {tx.status === "completed" ? "완료" : tx.status === "pending" ? "대기" : "실패"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
