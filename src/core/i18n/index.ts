import { useHyperViewStore } from "@/shared/store";
import { ko } from "./ko";
import { en } from "./en";

export type { Translations } from "./ko";
export type Locale = "ko" | "en";

export function useT() {
  const locale = useHyperViewStore((s) => s.locale);
  return locale === "en" ? en : ko;
}

export { ko, en };
