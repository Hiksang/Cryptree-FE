"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { TaxCountry, TaxMethod } from "@/core/types";
import { CountrySelector } from "../tax/country-selector";
import { MethodSelector } from "../tax/method-selector";
import { useCryptreeStore } from "@/shared/store";
import { api } from "@/domains/dashboard/lib/api-client";
import { toast } from "@/shared/ui";

interface PreferencesFormProps {
  country: TaxCountry;
  method: TaxMethod;
}

export function PreferencesForm({ country, method }: PreferencesFormProps) {
  const setPreferences = useCryptreeStore((s) => s.setPreferences);
  const storePrefs = useCryptreeStore((s) => s.preferences);
  const [saving, setSaving] = useState(false);

  const currentCountry = storePrefs.country || country;
  const currentMethod = storePrefs.method || method;

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateSettings({
        country: currentCountry,
        method: currentMethod,
      });
      toast.success("설정이 저장되었습니다");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "저장에 실패했습니다");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[16px] leading-[24px] font-semibold text-text-primary mb-4">
        세금 선호도
      </h3>

      <div className="space-y-4">
        <div>
          <p className="text-[14px] text-text-secondary mb-2">국가</p>
          <CountrySelector
            selected={currentCountry}
            onChange={(c) => setPreferences({ country: c })}
          />
        </div>
        <div>
          <p className="text-[14px] text-text-secondary mb-2">계산 방법</p>
          <MethodSelector
            selected={currentMethod}
            onChange={(m) => setPreferences({ method: m })}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="h-10 px-6 bg-brand text-bg-primary text-[14px] font-semibold rounded-[6px] hover:bg-brand-hover disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}
