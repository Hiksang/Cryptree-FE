/* ───── Lib ───── */
export { api } from "./lib/api-client";

/* ───── Hooks ───── */
export {
  useDashboardStats,
  useSettings,
  useRewards,
  useReferral,
  useLeaderboard,
  useExchange,
} from "./hooks/use-dashboard-queries";

/* ───── Layout ───── */
export {
  Sidebar,
  SidebarNavItem,
  DashboardHeader,
  BottomNav,
  DashboardSkeleton,
  SettingsSkeleton,
  RewardsSkeleton,
  ReferralSkeleton,
  LeaderboardSkeleton,
} from "./components/layout";

/* ───── Overview ───── */
export {
  InsightsCards,
  StatsCards,
} from "./components/overview";

/* ───── Settings ───── */
export {
  ConnectedWallets,
  PreferencesForm,
  ProfileCard,
  TierDisplay,
} from "./components/settings";

/* ───── Rewards ───── */
export {
  ClaimCta,
  DistributionHistory,
  PointsBreakdown,
  SeasonSummary,
} from "./components/rewards";

/* ───── Referral ───── */
export {
  ReferralCodeCard,
  ReferralStats,
  ShareButtons,
} from "./components/referral";

/* ───── Leaderboard ───── */
export {
  MyPosition,
  RankBadge,
  RankingsTable,
  TabSelector,
} from "./components/leaderboard";

/* ───── Exchange ───── */
export {
  ExchangeHistoryTable,
  PointsBalanceHero,
  ProductCard,
  ProductGrid,
} from "./components/exchange";
