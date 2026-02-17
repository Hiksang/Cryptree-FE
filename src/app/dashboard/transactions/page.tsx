"use client";

import { useState } from "react";
import { useTransactions } from "@/domains/dashboard/hooks/use-dashboard-queries";
import {
  TransactionTable,
  TransactionFilters,
  SearchBar,
  Pagination,
} from "@/domains/dashboard/components/transactions";
import { ErrorState, StatsCardSkeleton } from "@/shared/ui";
import { ArrowLeftRight } from "lucide-react";
import type { ChainId, TransactionType } from "@/core/types";

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [chainFilter, setChainFilter] = useState<ChainId | "all">("all");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch } = useTransactions({
    page,
    chain: chainFilter,
    type: typeFilter,
    search,
  });

  // 필터 변경 시 1페이지로 리셋
  function handleChainChange(chain: ChainId | "all") {
    setChainFilter(chain);
    setPage(1);
  }

  function handleTypeChange(type: TransactionType | "all") {
    setTypeFilter(type);
    setPage(1);
  }

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  if (isError) {
    return (
      <div className="space-y-6 max-w-[1200px]">
        <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">거래 내역</h1>
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ArrowLeftRight className="w-6 h-6 text-brand" />
          <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">
            거래 내역
          </h1>
        </div>
        {data && (
          <span className="text-[14px] text-text-muted">
            총 {data.total.toLocaleString()}건
          </span>
        )}
      </div>

      <div className="space-y-4">
        <SearchBar value={search} onChange={handleSearch} />
        <TransactionFilters
          chainFilter={chainFilter}
          typeFilter={typeFilter}
          onChainChange={handleChainChange}
          onTypeChange={handleTypeChange}
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <TransactionTable transactions={data?.transactions ?? []} />
          {data && data.totalPages > 1 && (
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
