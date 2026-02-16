"use client";

import type { TaxMethod } from "@/core/types";
import { TAX_METHODS } from "@/core/constants";

interface MethodSelectorProps {
  selected: TaxMethod;
  onChange: (method: TaxMethod) => void;
}

export function MethodSelector({ selected, onChange }: MethodSelectorProps) {
  return (
    <div className="flex gap-2">
      {TAX_METHODS.map((method) => (
        <button
          key={method.value}
          onClick={() => onChange(method.value)}
          className={`px-3 py-1.5 text-[14px] leading-[20px] rounded-[6px] border transition-colors cursor-pointer ${
            selected === method.value
              ? "border-brand text-brand bg-brand-muted"
              : "border-border-default text-text-muted hover:text-text-secondary"
          }`}
          title={method.description}
        >
          {method.label}
        </button>
      ))}
    </div>
  );
}
