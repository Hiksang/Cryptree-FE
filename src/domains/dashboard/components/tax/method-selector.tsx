"use client";

import type { TaxMethod } from "@/core/types";
import { TAX_METHODS } from "@/core/constants";
import { useT } from "@/core/i18n";

interface MethodSelectorProps {
  selected: TaxMethod;
  onChange: (method: TaxMethod) => void;
}

export function MethodSelector({ selected, onChange }: MethodSelectorProps) {
  const t = useT();

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
          title={t.taxMethods[method.labelKey as keyof typeof t.taxMethods].description}
        >
          {t.taxMethods[method.labelKey as keyof typeof t.taxMethods].label}
        </button>
      ))}
    </div>
  );
}
