import type { TransactionFull } from "@/core/types";
import { CHAIN_COLORS, CHAIN_NAMES } from "@/core/constants";
import { formatCurrency, formatDate } from "@/core/utils";
import { StatusBadge } from "./status-badge";

interface TransactionTableProps {
  transactions: TransactionFull[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-bg-surface border border-border-default rounded-[8px] p-12 text-center">
        <p className="text-[14px] text-text-muted">조건에 맞는 거래가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-default">
              <th className="text-left text-[12px] leading-[16px] text-text-muted font-medium px-4 py-3">
                시간
              </th>
              <th className="text-left text-[12px] leading-[16px] text-text-muted font-medium px-4 py-3">
                유형
              </th>
              <th className="text-left text-[12px] leading-[16px] text-text-muted font-medium px-4 py-3">
                프로토콜
              </th>
              <th className="text-left text-[12px] leading-[16px] text-text-muted font-medium px-4 py-3">
                체인
              </th>
              <th className="text-right text-[12px] leading-[16px] text-text-muted font-medium px-4 py-3">
                금액
              </th>
              <th className="text-right text-[12px] leading-[16px] text-text-muted font-medium px-4 py-3">
                수수료
              </th>
              <th className="text-center text-[12px] leading-[16px] text-text-muted font-medium px-4 py-3">
                상태
              </th>
              <th className="text-left text-[12px] leading-[16px] text-text-muted font-medium px-4 py-3">
                해시
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-border-subtle last:border-0 hover:bg-bg-surface-2 transition-colors"
              >
                <td className="px-4 py-3 text-[14px] text-text-secondary whitespace-nowrap">
                  {formatDate(tx.timestamp)}
                </td>
                <td className="px-4 py-3">
                  <div className="text-[14px] text-text-primary font-medium">
                    {tx.typeLabel}
                  </div>
                  {tx.fromToken && (
                    <div className="text-[12px] text-text-muted">
                      {tx.fromToken}
                      {tx.toToken ? ` → ${tx.toToken}` : ""}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-[14px] text-text-primary">
                  {tx.protocol}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: CHAIN_COLORS[tx.chainId] }}
                    />
                    <span className="text-[14px] text-text-secondary">
                      {CHAIN_NAMES[tx.chainId]}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-[14px] text-text-primary tabular-nums font-medium">
                  {formatCurrency(tx.amount)}
                </td>
                <td className="px-4 py-3 text-right text-[14px] text-text-muted tabular-nums">
                  ${tx.fee.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={tx.status} />
                </td>
                <td className="px-4 py-3 text-[12px] text-text-muted font-mono">
                  {tx.hash}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-border-subtle">
        {transactions.map((tx) => (
          <div key={tx.id} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: CHAIN_COLORS[tx.chainId] }}
                />
                <span className="text-[14px] font-medium text-text-primary">
                  {tx.typeLabel}
                </span>
                {tx.fromToken && (
                  <span className="text-[12px] text-text-muted">
                    {tx.fromToken}{tx.toToken ? ` → ${tx.toToken}` : ""}
                  </span>
                )}
              </div>
              <StatusBadge status={tx.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-text-muted">
                {tx.protocol} · {formatDate(tx.timestamp)}
              </span>
              <span className="text-[14px] font-medium text-text-primary tabular-nums">
                {formatCurrency(tx.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
