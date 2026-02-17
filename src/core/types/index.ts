export type Tier = "bronze" | "silver" | "gold" | "diamond";

export type ChainId =
  | "hyperevm"
  | "hyperliquid"
  | "arbitrum"
  | "base"
  | "ethereum"
  | "optimism"
  | "polygon";

export type DnaCategory = "perp" | "dex" | "yield" | "lending";

export interface DnaBreakdown {
  category: DnaCategory;
  label: string;
  percentage: number;
}

export interface ChainActivity {
  chainId: ChainId;
  name: string;
  txCount: number;
  volume: number;
  status: "completed" | "scanning" | "pending";
}

export interface Transaction {
  id: string;
  timestamp: string;
  protocol: string;
  chainId: ChainId;
  type: string;
  amount: number;
  status: "completed" | "pending" | "failed";
}

export interface PnlDataPoint {
  date: string;
  value: number;
}

export interface ChainPnl {
  chainId: ChainId;
  name: string;
  pnl: number;
  percentage: number;
}

export interface TopTrade {
  rank: number;
  description: string;
  chainId: ChainId;
  amount: number;
}

export interface TaxSummary {
  totalGains: number;
  totalLosses: number;
  netProfit: number;
  chainBreakdown: {
    chainId: ChainId;
    name: string;
    amount: number;
    categories: string;
  }[];
}

export interface IdentityData {
  address: string;
  activeChains: number;
  totalTrades: number;
  totalVolume: number;
  tier: Tier;
  tierPercentile: number;
  dna: DnaBreakdown[];
  activityScore: number;
}

export interface ScanResult {
  identity: IdentityData;
  chains: ChainActivity[];
  transactions: Transaction[];
  pnlHistory: PnlDataPoint[];
  chainPnl: ChainPnl[];
  topTrades: TopTrade[];
  taxSummary: TaxSummary;
  insights: string[];
}

/* ───── Dashboard Phase 1 Types ───── */

export type TransactionType =
  | "swap"
  | "transfer"
  | "bridge"
  | "stake"
  | "unstake"
  | "lp_add"
  | "lp_remove"
  | "borrow"
  | "repay"
  | "claim"
  | "approve";

export interface TokenHolding {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  price: number;
  change24h: number;
  chainId: ChainId;
}

export interface ChainPortfolio {
  chainId: ChainId;
  name: string;
  totalValue: number;
  tokens: TokenHolding[];
}

export interface PortfolioData {
  totalValue: number;
  change24h: number;
  change24hPercent: number;
  chains: ChainPortfolio[];
}

export interface TransactionFull {
  id: string;
  hash: string;
  timestamp: string;
  protocol: string;
  chainId: ChainId;
  type: TransactionType;
  typeLabel: string;
  fromToken?: string;
  toToken?: string;
  amount: number;
  fee: number;
  status: "completed" | "pending" | "failed";
}

export interface TaxEvent {
  id: string;
  date: string;
  type: string;
  asset: string;
  amount: number;
  costBasis: number;
  proceeds: number;
  gainLoss: number;
  chainId: ChainId;
}

export interface ChainTaxBreakdown {
  chainId: ChainId;
  name: string;
  gains: number;
  losses: number;
  net: number;
  events: number;
}

export type TaxMethod = "fifo" | "lifo" | "hifo" | "avg";
export type TaxCountry = "kr" | "us" | "jp" | "de" | "uk" | "au" | "ca";

export interface TaxReportData {
  year: number;
  totalGains: number;
  totalLosses: number;
  netIncome: number;
  method: TaxMethod;
  country: TaxCountry;
  chainBreakdown: ChainTaxBreakdown[];
  events: TaxEvent[];
}

export interface DashboardStats {
  totalValue: number;
  totalValueChange: number;
  totalPnl: number;
  totalPnlPercent: number;
  activePositions: number;
  activePositionsChange: number;
}

export interface InsightCard {
  id: string;
  title: string;
  description: string;
  type: "info" | "warning" | "positive" | "negative";
  icon: string;
}

export type PnlPeriod = "7d" | "30d" | "90d" | "1y" | "all";

/* ───── Dashboard Phase 2 Types ───── */

// Settings
export interface UserProfile {
  name: string;
  email: string;
  tier: Tier;
  tierPoints: number;
  nextTierPoints: number;
  joinedAt: string;
  avatarUrl?: string;
}

export type WalletScanStatus = "idle" | "scanning" | "completed" | "failed";

export interface ConnectedWallet {
  id: string;
  address: string;
  label: string;
  chainId: ChainId;
  isPrimary: boolean;
  connectedAt: string;
  scanStatus: WalletScanStatus;
  scanProgress?: { completed: number; total: number };
  txCount?: number;
}

export interface SettingsData {
  profile: UserProfile;
  wallets: ConnectedWallet[];
  preferences: {
    country: TaxCountry;
    method: TaxMethod;
  };
}

// Rewards
export interface SeasonSummary {
  name: string;
  startDate: string;
  endDate: string;
  rank: number;
  totalParticipants: number;
  totalPoints: number;
  status: "active" | "ended" | "upcoming";
}

export interface PointsBreakdown {
  category: string;
  icon: string;
  points: number;
  description: string;
}

export interface DistributionEvent {
  id: string;
  date: string;
  season: string;
  amount: number;
  token: string;
  status: "claimed" | "claimable" | "pending";
}

export interface RewardsData {
  season: SeasonSummary;
  points: PointsBreakdown[];
  claimableAmount: number;
  claimableToken: string;
  distributions: DistributionEvent[];
}

// Referral
export interface ReferralStats {
  totalReferred: number;
  activeReferred: number;
  totalEarned: number;
  pendingRewards: number;
}

export interface ReferredFriend {
  address: string;
  joinedAt: string;
  volume: number;
  earned: number;
  status: "active" | "inactive";
}

export interface ReferralData {
  code: string;
  stats: ReferralStats;
  friends: ReferredFriend[];
}

// Leaderboard
export type LeaderboardTab = "pnl" | "volume" | "activity" | "referral";

export interface LeaderboardEntry {
  rank: number;
  address: string;
  tier: Tier;
  value: number;
  change?: number;
  isMe?: boolean;
}

export interface LeaderboardData {
  tab: LeaderboardTab;
  entries: LeaderboardEntry[];
  myPosition: LeaderboardEntry | null;
  updatedAt: string;
}

/* ───── Dashboard Phase 3 Types — 포인트샵 ───── */

export type ShopCategory = "digital" | "service" | "nft" | "physical";

export interface ShopProduct {
  id: string;
  name: string;
  description: string;
  category: ShopCategory;
  pointsCost: number;
  imageUrl?: string;
  stock: number | null;
  tag?: "hot" | "new" | "limited" | "soldout";
  badgeLabel?: string;
}

export interface ExchangeRate {
  pointsPerUsdc: number;
  minPoints: number;
  maxPoints: number;
  dailyLimit: number;
  dailyUsed: number;
  fee: number;
}

export interface ExchangeHistoryItem {
  id: string;
  date: string;
  type: "usdc" | "product";
  description: string;
  pointsSpent: number;
  received: string;
  status: "completed" | "processing" | "failed";
  txHash?: string;
}

export interface ExchangeData {
  pointsBalance: number;
  lifetimeEarned: number;
  lifetimeSpent: number;
  adRevenueShare: {
    totalAdRevenue: number;
    yourShare: number;
    sharePercent: number;
  };
  exchangeRate: ExchangeRate;
  products: ShopProduct[];
  history: ExchangeHistoryItem[];
}
