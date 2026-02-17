"use client";

import type { TaxCountry } from "@/core/types";
import { TAX_COUNTRIES } from "@/core/constants";
import { useT } from "@/core/i18n";

interface CountrySelectorProps {
  selected: TaxCountry;
  onChange: (country: TaxCountry) => void;
}

export function CountrySelector({ selected, onChange }: CountrySelectorProps) {
  const t = useT();

  return (
    <div className="flex flex-wrap gap-2">
      {TAX_COUNTRIES.map((country) => (
        <button
          key={country.value}
          onClick={() => onChange(country.value)}
          className={`flex items-center gap-2 px-3 py-1.5 text-[14px] leading-[20px] rounded-[6px] border transition-colors cursor-pointer ${
            selected === country.value
              ? "border-brand text-brand bg-brand-muted"
              : "border-border-default text-text-muted hover:text-text-secondary"
          }`}
        >
          <span>{country.flag}</span>
          <span>{t.countries[country.labelKey as keyof typeof t.countries]}</span>
        </button>
      ))}
    </div>
  );
}
