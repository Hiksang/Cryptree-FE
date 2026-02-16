"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="해시, 프로토콜, 토큰 검색..."
        className="w-full h-10 pl-10 pr-4 bg-bg-surface-2 border border-border-default rounded-[6px] text-[14px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand transition-colors"
      />
    </div>
  );
}
