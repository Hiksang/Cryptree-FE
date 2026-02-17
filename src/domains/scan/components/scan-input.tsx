"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Search, Loader2 } from "lucide-react";
import { getScanResult } from "../lib/api";
import { SCAN_QUERY_KEY } from "../hooks/use-scan";
import { useT } from "@/core/i18n";

interface ScanInputProps {
  size?: "md" | "lg";
  className?: string;
}

function isValidEthAddress(addr: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(addr);
}

export function ScanInput({ size = "lg", className }: ScanInputProps) {
  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const t = useT();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = address.trim();

    if (!trimmed) return;

    // Validate Ethereum address format
    if (!isValidEthAddress(trimmed)) {
      setError(t.scan.input.invalidAddress);
      return;
    }

    setError(null);
    setSubmitting(true);

    // Start prefetching before navigation
    queryClient.prefetchQuery({
      queryKey: SCAN_QUERY_KEY(trimmed),
      queryFn: () => getScanResult(trimmed),
      staleTime: 5 * 60 * 1000,
    });

    // Navigate immediately (prefetch continues in background)
    router.push(`/address/${trimmed}`);
  };

  const inputHeight = size === "lg" ? "h-14" : "h-12";

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (error) setError(null);
            }}
            placeholder={t.scan.input.placeholder}
            className={`w-full ${inputHeight} pl-11 pr-4 bg-bg-surface-3 border ${
              error ? "border-negative" : "border-border-default"
            } rounded-l-[6px] text-[16px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand transition-colors`}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className={`${inputHeight} px-6 bg-brand text-bg-primary font-semibold text-[16px] rounded-r-[6px] hover:bg-brand-hover transition-colors whitespace-nowrap cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2`}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t.scan.input.analyzing}
            </>
          ) : (
            t.scan.input.analyze
          )}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-[13px] text-negative animate-fade-in-up">
          {error}
        </p>
      )}
    </form>
  );
}
