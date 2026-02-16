"use client";

import { useState } from "react";
import type { ChainId, TransactionType } from "@/core/types";
import { useTransactions } from "@/domains/dashboard/hooks/use-dashboard-queries";
import { SearchBar } from "@/domains/dashboard";
import { TransactionFilters } from "@/domains/dashboard";
import { TransactionTable } from "@/domains/dashboard";
import { Pagination } from "@/domains/dashboard";
import { ErrorState } from "@/shared/ui";
import { TableCardSkeleton } from "@/shared/ui";

const PAGE_SIZE = 10;

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [chainFilter, setChainFilter] = useState<ChainId | "all">("all");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, refetch } = useTransactions({
    page: String(currentPage),
    chain: chainFilter,
    type: typeFilter,
    q: search,
  });

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

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
      <h1 className="text-[24px] leading-[32px] font-semibold text-text-primary">
        거래 내역
      </h1>

      <SearchBar
        value={search}
        onChange={(v) => {
          setSearch(v);
          handleFilterChange();
        }}
      />

      <TransactionFilters
        chainFilter={chainFilter}
        typeFilter={typeFilter}
        onChainChange={(c) => {
          setChainFilter(c);
          handleFilterChange();
        }}
        onTypeChange={(t) => {
          setTypeFilter(t);
          handleFilterChange();
        }}
      />

      <div className="flex items-center justify-between">
        <p className="text-[14px] text-text-muted">
          {data ? `${data.total}건의 거래` : "로딩 중..."}
        </p>
      </div>

      {isLoading ? (
        <TableCardSkeleton rows={10} />
      ) : data ? (
        <>
          <TransactionTable transactions={data.transactions} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : null}
    </div>
  );
}
