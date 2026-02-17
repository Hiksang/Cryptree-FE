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
  { href: "/dashboard", labelKey: "dashboard" as const, icon: "LayoutDashboard" },
  // { href: "/dashboard/transactions", labelKey: "transactions" as const, icon: "ArrowLeftRight" },  // 추후 공개
  { href: "/dashboard/tax", labelKey: "taxReport" as const, icon: "FileText" },
  { href: "/dashboard/rewards", labelKey: "rewards" as const, icon: "Gift" },
  { href: "/dashboard/referral", labelKey: "referral" as const, icon: "Users" },
  { href: "/dashboard/exchange", labelKey: "pointShop" as const, icon: "ShoppingBag" },
  { href: "/dashboard/settings", labelKey: "settings" as const, icon: "Settings" },
] as const;

export const TAX_COUNTRIES: { value: TaxCountry; labelKey: string; flag: string }[] = [
  { value: "kr", labelKey: "kr", flag: "🇰🇷" },
  { value: "us", labelKey: "us", flag: "🇺🇸" },
  { value: "jp", labelKey: "jp", flag: "🇯🇵" },
  { value: "de", labelKey: "de", flag: "🇩🇪" },
  { value: "uk", labelKey: "uk", flag: "🇬🇧" },
  { value: "au", labelKey: "au", flag: "🇦🇺" },
  { value: "ca", labelKey: "ca", flag: "🇨🇦" },
];

export const TAX_METHODS: { value: TaxMethod; labelKey: string }[] = [
  { value: "fifo", labelKey: "fifo" },
  { value: "lifo", labelKey: "lifo" },
  { value: "hifo", labelKey: "hifo" },
  { value: "avg", labelKey: "avg" },
];

export const TRANSACTION_TYPE_KEYS: Record<TransactionType, string> = {
  swap: "swap",
  transfer: "transfer",
  bridge: "bridge",
  stake: "stake",
  unstake: "unstake",
  lp_add: "lp_add",
  lp_remove: "lp_remove",
  borrow: "borrow",
  repay: "repay",
  claim: "claim",
  approve: "approve",
};
