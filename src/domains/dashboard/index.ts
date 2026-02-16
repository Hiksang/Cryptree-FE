/* ───── Lib ───── */
export { api } from "./lib/api-client";

/* ───── Hooks ───── */
export {
  useDashboardStats,
  usePortfolio,
  usePnl,
  useTaxReport,
  useTransactions,
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
  PortfolioSkeleton,
  PnlSkeleton,
  TaxSkeleton,
  TransactionsSkeleton,
  SettingsSkeleton,
  RewardsSkeleton,
  ReferralSkeleton,
  LeaderboardSkeleton,
} from "./components/layout";

/* ───── Overview ───── */
export {
  InsightsCards,
  PnlOverviewChart,
  PortfolioList,
  RecentTrades,
  StatsCards,
} from "./components/overview";

/* ───── PnL ───── */
export {
  ChainFilter,
  ChainPnlCards,
  PeriodSelector,
  PnlAreaChart,
  TopTradesTable,
} from "./components/pnl";

/* ───── Portfolio ───── */
export {
  AllocationChart,
  ChainAssetList,
  PortfolioSummary,
} from "./components/portfolio";

/* ───── Tax ───── */
export {
  ChainTaxBreakdown,
  CountrySelector,
  ExportCta,
  MethodSelector,
  TaxSummaryCard,
} from "./components/tax";

/* ───── Transactions ───── */
export {
  Pagination,
  SearchBar,
  StatusBadge,
  TransactionFilters,
  TransactionTable,
} from "./components/transactions";

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
  InvitedFriendsList,
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
  AdRevenueBanner,
  ExchangeHistoryTable,
  PointsBalanceHero,
  ProductCard,
  ProductGrid,
  UsdcExchangeCard,
} from "./components/exchange";
