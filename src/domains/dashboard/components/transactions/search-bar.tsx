"use client";

import { Search } from "lucide-react";
import { useT } from "@/core/i18n";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const t = useT();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.dashboard.transactions.searchPlaceholder}
        className="w-full h-10 pl-10 pr-4 bg-bg-surface-2 border border-border-default rounded-[6px] text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand transition-colors"
      />
    </div>
  );
}
