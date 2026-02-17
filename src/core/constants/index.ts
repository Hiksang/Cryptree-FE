import type { TaxCountry, TaxMethod, TransactionType } from "@/core/types";

/* ───── Chain & Identity Constants ───── */

export const CHAIN_COLORS: Record<string, string> = {
  hyperevm: "#00D4AA",
  hyperliquid: "#00D4AA",
  arbitrum: "#28A0F0",
  base: "#0052FF",
  ethereum: "#627EEA",
  optimism: "#FF0420",
  polygon: "#8247E5",
  bnb: "#F0B90B",
};

export const CHAIN_NAMES: Record<string, string> = {
  hyperevm: "HyperEVM",
  hyperliquid: "Hyperliquid",
  arbitrum: "Arbitrum",
  base: "Base",
  ethereum: "Ethereum",
  optimism: "Optimism",
  polygon: "Polygon",
  bnb: "BNB Chain",
};

export const DNA_COLORS: Record<string, string> = {
  perp: "#FF6B35",
  dex: "#3B82F6",
  yield: "#10B981",
  lending: "#8B5CF6",
};

export const TIER_CONFIG = {
  bronze: { label: "Bronze", icon: "🥉", color: "#CD7F32" },
  silver: { label: "Silver", icon: "🥈", color: "#C0C0C0" },
  gold: { label: "Gold", icon: "🥇", color: "#FFD700" },
  diamond: { label: "Diamond", icon: "💎", color: "#B9F2FF" },
} as const;

/* ───── Navigation & UI Constants (from constants) ───── */

export const NAV_ITEMS = [
  { href: "/dashboard", label: "대시보드", icon: "LayoutDashboard" },
  { href: "/dashboard/transactions", label: "거래 내역", icon: "ArrowLeftRight" },
  { href: "/dashboard/tax", label: "세금 보고서", icon: "FileText" },
  { href: "/dashboard/rewards", label: "리워드", icon: "Gift" },
  { href: "/dashboard/referral", label: "추천", icon: "Users" },
  { href: "/dashboard/exchange", label: "포인트샵", icon: "ShoppingBag" },
  { href: "/dashboard/settings", label: "설정", icon: "Settings" },
] as const;

export const TAX_COUNTRIES: { value: TaxCountry; label: string; flag: string }[] = [
  { value: "kr", label: "한국", flag: "🇰🇷" },
  { value: "us", label: "미국", flag: "🇺🇸" },
  { value: "jp", label: "일본", flag: "🇯🇵" },
  { value: "de", label: "독일", flag: "🇩🇪" },
  { value: "uk", label: "영국", flag: "🇬🇧" },
  { value: "au", label: "호주", flag: "🇦🇺" },
  { value: "ca", label: "캐나다", flag: "🇨🇦" },
];

export const TAX_METHODS: { value: TaxMethod; label: string; description: string }[] = [
  { value: "fifo", label: "FIFO", description: "선입선출" },
  { value: "lifo", label: "LIFO", description: "후입선출" },
  { value: "hifo", label: "HIFO", description: "최고가 우선" },
  { value: "avg", label: "이동평균", description: "평균 취득가" },
];

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  swap: "스왑",
  transfer: "전송",
  bridge: "브릿지",
  stake: "스테이킹",
  unstake: "언스테이킹",
  lp_add: "LP 추가",
  lp_remove: "LP 제거",
  borrow: "대출",
  repay: "상환",
  claim: "클레임",
  approve: "승인",
};
