"use client";

import { useHyperViewStore } from "@/shared/store";

export function LanguageToggle() {
  const locale = useHyperViewStore((s) => s.locale);
  const setLocale = useHyperViewStore((s) => s.setLocale);

  return (
    <div className="flex items-center gap-1 text-[13px]">
      <button
        onClick={() => setLocale("ko")}
        className={`cursor-pointer ${locale === "ko" ? "text-brand font-semibold" : "text-text-muted"}`}
      >
        KO
      </button>
      <span className="text-text-muted">/</span>
      <button
        onClick={() => setLocale("en")}
        className={`cursor-pointer ${locale === "en" ? "text-brand font-semibold" : "text-text-muted"}`}
      >
        EN
      </button>
    </div>
  );
}
