"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface ScanInputProps {
  size?: "md" | "lg";
  className?: string;
}

export function ScanInput({ size = "lg", className }: ScanInputProps) {
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = address.trim();
    if (trimmed) {
      router.push(`/address/${trimmed}`);
    }
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
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x... 지갑 주소 입력"
            className={`w-full ${inputHeight} pl-11 pr-4 bg-bg-surface-3 border border-border-default rounded-l-[6px] text-[16px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand transition-colors`}
          />
        </div>
        <button
          type="submit"
          className={`${inputHeight} px-6 bg-brand text-bg-primary font-semibold text-[16px] rounded-r-[6px] hover:bg-brand-hover transition-colors whitespace-nowrap cursor-pointer`}
        >
          분석하기
        </button>
      </div>
    </form>
  );
}
