import type {
  ScanResult,
  DashboardStats,
  PortfolioData,
  TransactionFull,
  TaxReportData,
  InsightCard,
  PnlDataPoint,
  SettingsData,
  RewardsData,
  ReferralData,
  LeaderboardData,
  LeaderboardEntry,
  Tier,
  ExchangeData,
} from "@/core/types";

export const mockScanResult: ScanResult = {
  identity: {
    address: "0xA3b7C8d9E0f1a2B3c4D5e6F7a8B9c0D1e2F3d4",
    activeChains: 5,
    totalTrades: 2847,
    totalVolume: 1_200_000,
    tier: "gold",
    tierPercentile: 8,
    dna: [
      { category: "perp", label: "Perp Trading", percentage: 40 },
      { category: "dex", label: "DEX Swaps", percentage: 25 },
      { category: "yield", label: "Yield Farming", percentage: 20 },
      { category: "lending", label: "Lending", percentage: 15 },
    ],
    activityScore: 2847,
  },
  chains: [
    {
      chainId: "hyperevm",
      name: "HyperEVM",
      txCount: 320,
      volume: 120_000,
      status: "completed",
    },
    {
      chainId: "hyperliquid",
      name: "Hyperliquid",
      txCount: 1200,
      volume: 500_000,
      status: "completed",
    },
    {
      chainId: "arbitrum",
      name: "Arbitrum",
      txCount: 847,
      volume: 420_000,
      status: "completed",
    },
    {
      chainId: "base",
      name: "Base",
      txCount: 280,
      volume: 110_000,
      status: "completed",
    },
    {
      chainId: "ethereum",
      name: "Ethereum",
      txCount: 200,
      volume: 50_000,
      status: "completed",
    },
  ],
  transactions: [
    {
      id: "1",
      timestamp: "2h ago",
      protocol: "HyperSwap",
      chainId: "hyperevm",
      type: "Swap HYPE→USDC",
      amount: 1000,
      status: "completed",
    },
    {
      id: "2",
      timestamp: "5h ago",
      protocol: "KittenSwap",
      chainId: "hyperevm",
      type: "Add LP",
      amount: 2500,
      status: "completed",
    },
    {
      id: "3",
      timestamp: "1d ago",
      protocol: "Bridge",
      chainId: "hyperliquid",
      type: "HL→HyperEVM",
      amount: 5000,
      status: "completed",
    },
    {
      id: "4",
      timestamp: "2d ago",
      protocol: "HyperLend",
      chainId: "hyperevm",
      type: "Supply USDC",
      amount: 10_000,
      status: "completed",
    },
    {
      id: "5",
      timestamp: "3d ago",
      protocol: "HyperSwap",
      chainId: "hyperevm",
      type: "Swap ETH→HYPE",
      amount: 800,
      status: "completed",
    },
  ],
  pnlHistory: [
    { date: "Jan", value: 2000 },
    { date: "Feb", value: 5200 },
    { date: "Mar", value: 3800 },
    { date: "Apr", value: 8100 },
    { date: "May", value: 6500 },
    { date: "Jun", value: 4200 },
    { date: "Jul", value: 9800 },
    { date: "Aug", value: 7600 },
    { date: "Sep", value: 11200 },
    { date: "Oct", value: 10500 },
    { date: "Nov", value: 13100 },
    { date: "Dec", value: 15247 },
  ],
  chainPnl: [
    { chainId: "hyperliquid", name: "HL Perp", pnl: 8200, percentage: 54 },
    { chainId: "arbitrum", name: "Arbitrum", pnl: 3547, percentage: 23 },
    { chainId: "base", name: "Base", pnl: 1200, percentage: 8 },
    { chainId: "ethereum", name: "Ethereum", pnl: 600, percentage: 4 },
    { chainId: "hyperevm", name: "HyperEVM", pnl: 1700, percentage: 11 },
  ],
  topTrades: [
    {
      rank: 1,
      description: "ETH Long (HL) Feb 12",
      chainId: "hyperliquid",
      amount: 2100,
    },
    {
      rank: 2,
      description: "ARB/ETH LP (Arbitrum) Jan-Mar",
      chainId: "arbitrum",
      amount: 890,
    },
    {
      rank: 3,
      description: "HYPE Swap (HyperEVM) Mar 5",
      chainId: "hyperevm",
      amount: 650,
    },
    {
      rank: 4,
      description: "USDC Yield (Base) Feb-Apr",
      chainId: "base",
      amount: 420,
    },
    {
      rank: 5,
      description: "ETH Staking (Ethereum) Q1",
      chainId: "ethereum",
      amount: 310,
    },
  ],
  taxSummary: {
    totalGains: 18847,
    totalLosses: 5200,
    netProfit: 13647,
    chainBreakdown: [
      {
        chainId: "hyperliquid",
        name: "Hyperliquid",
        amount: 8200,
        categories: "Perp, Funding",
      },
      {
        chainId: "arbitrum",
        name: "Arbitrum",
        amount: 3547,
        categories: "GMX, Swap",
      },
      {
        chainId: "hyperevm",
        name: "HyperEVM",
        amount: 2400,
        categories: "Staking, Airdrop",
      },
      {
        chainId: "base",
        name: "Base",
        amount: 1200,
        categories: "LP",
      },
      {
        chainId: "ethereum",
        name: "Ethereum",
        amount: 600,
        categories: "Lending interest",
      },
    ],
  },
  insights: [
    "HyperEVM 주요 활동: 스왑 320건, LP 12건",
    "Perp 트레이딩 40%로 가장 높은 비율",
    "활동 스코어: 2,847점 (상위 8%)",
    "크로스체인 활동이 활발 (5개 체인)",
  ],
};

/* ───── Dashboard Phase 1 Mock Data ───── */

export const mockDashboardStats: DashboardStats = {
  totalValue: 48_523,
  totalValueChange: 3.2,
  totalPnl: 15_247,
  totalPnlPercent: 31.4,
  activePositions: 12,
  activePositionsChange: 2,
};

export const mockPortfolioData: PortfolioData = {
  totalValue: 48_523,
  change24h: 1_523,
  change24hPercent: 3.24,
  chains: [
    {
      chainId: "hyperliquid",
      name: "Hyperliquid",
      totalValue: 22_400,
      tokens: [
        { symbol: "USDC", name: "USD Coin", amount: 12_000, value: 12_000, price: 1.0, change24h: 0, chainId: "hyperliquid" },
        { symbol: "HYPE", name: "Hyperliquid", amount: 520, value: 8_320, price: 16.0, change24h: 5.2, chainId: "hyperliquid" },
        { symbol: "ETH", name: "Ethereum", amount: 0.6, value: 2_080, price: 3_467, change24h: 2.1, chainId: "hyperliquid" },
      ],
    },
    {
      chainId: "hyperevm",
      name: "HyperEVM",
      totalValue: 10_200,
      tokens: [
        { symbol: "HYPE", name: "Hyperliquid", amount: 320, value: 5_120, price: 16.0, change24h: 5.2, chainId: "hyperevm" },
        { symbol: "USDC", name: "USD Coin", amount: 3_200, value: 3_200, price: 1.0, change24h: 0, chainId: "hyperevm" },
        { symbol: "WETH", name: "Wrapped ETH", amount: 0.54, value: 1_880, price: 3_481, change24h: 2.3, chainId: "hyperevm" },
      ],
    },
    {
      chainId: "arbitrum",
      name: "Arbitrum",
      totalValue: 8_900,
      tokens: [
        { symbol: "ETH", name: "Ethereum", amount: 1.2, value: 4_160, price: 3_467, change24h: 2.1, chainId: "arbitrum" },
        { symbol: "ARB", name: "Arbitrum", amount: 3_200, value: 2_880, price: 0.9, change24h: -1.5, chainId: "arbitrum" },
        { symbol: "GMX", name: "GMX", amount: 42, value: 1_860, price: 44.3, change24h: 3.8, chainId: "arbitrum" },
      ],
    },
    {
      chainId: "base",
      name: "Base",
      totalValue: 4_523,
      tokens: [
        { symbol: "ETH", name: "Ethereum", amount: 0.8, value: 2_773, price: 3_467, change24h: 2.1, chainId: "base" },
        { symbol: "AERO", name: "Aerodrome", amount: 1_500, value: 1_350, price: 0.9, change24h: -2.4, chainId: "base" },
        { symbol: "USDC", name: "USD Coin", amount: 400, value: 400, price: 1.0, change24h: 0, chainId: "base" },
      ],
    },
    {
      chainId: "ethereum",
      name: "Ethereum",
      totalValue: 2_500,
      tokens: [
        { symbol: "ETH", name: "Ethereum", amount: 0.5, value: 1_733, price: 3_467, change24h: 2.1, chainId: "ethereum" },
        { symbol: "stETH", name: "Lido Staked ETH", amount: 0.22, value: 767, price: 3_486, change24h: 2.0, chainId: "ethereum" },
      ],
    },
  ],
};

export const mockTransactionsFull: TransactionFull[] = [
  { id: "t01", hash: "0xabc1...def1", timestamp: "2025-02-15T09:30:00Z", protocol: "HyperSwap", chainId: "hyperevm", type: "swap", typeLabel: "스왑", fromToken: "HYPE", toToken: "USDC", amount: 1_200, fee: 0.12, status: "completed" },
  { id: "t02", hash: "0xabc2...def2", timestamp: "2025-02-15T08:15:00Z", protocol: "Hyperliquid", chainId: "hyperliquid", type: "swap", typeLabel: "스왑", fromToken: "ETH", toToken: "USDC", amount: 3_400, fee: 0.85, status: "completed" },
  { id: "t03", hash: "0xabc3...def3", timestamp: "2025-02-14T22:00:00Z", protocol: "Bridge", chainId: "hyperliquid", type: "bridge", typeLabel: "브릿지", fromToken: "USDC", amount: 5_000, fee: 1.0, status: "completed" },
  { id: "t04", hash: "0xabc4...def4", timestamp: "2025-02-14T18:30:00Z", protocol: "HyperLend", chainId: "hyperevm", type: "stake", typeLabel: "스테이킹", fromToken: "USDC", amount: 10_000, fee: 0.5, status: "completed" },
  { id: "t05", hash: "0xabc5...def5", timestamp: "2025-02-14T15:00:00Z", protocol: "HyperSwap", chainId: "hyperevm", type: "swap", typeLabel: "스왑", fromToken: "ETH", toToken: "HYPE", amount: 800, fee: 0.08, status: "completed" },
  { id: "t06", hash: "0xabc6...def6", timestamp: "2025-02-14T12:00:00Z", protocol: "KittenSwap", chainId: "hyperevm", type: "lp_add", typeLabel: "LP 추가", fromToken: "HYPE/USDC", amount: 2_500, fee: 0.25, status: "completed" },
  { id: "t07", hash: "0xabc7...def7", timestamp: "2025-02-13T20:00:00Z", protocol: "GMX", chainId: "arbitrum", type: "swap", typeLabel: "스왑", fromToken: "ETH", toToken: "GMX", amount: 1_860, fee: 1.2, status: "completed" },
  { id: "t08", hash: "0xabc8...def8", timestamp: "2025-02-13T16:30:00Z", protocol: "Aave", chainId: "arbitrum", type: "borrow", typeLabel: "대출", fromToken: "USDC", amount: 3_000, fee: 0.3, status: "completed" },
  { id: "t09", hash: "0xabc9...def9", timestamp: "2025-02-13T14:00:00Z", protocol: "Aerodrome", chainId: "base", type: "swap", typeLabel: "스왑", fromToken: "ETH", toToken: "AERO", amount: 1_350, fee: 0.05, status: "completed" },
  { id: "t10", hash: "0xab10...de10", timestamp: "2025-02-13T10:00:00Z", protocol: "Lido", chainId: "ethereum", type: "stake", typeLabel: "스테이킹", fromToken: "ETH", amount: 767, fee: 2.5, status: "completed" },
  { id: "t11", hash: "0xab11...de11", timestamp: "2025-02-12T22:00:00Z", protocol: "HyperSwap", chainId: "hyperevm", type: "swap", typeLabel: "스왑", fromToken: "USDC", toToken: "HYPE", amount: 2_000, fee: 0.2, status: "completed" },
  { id: "t12", hash: "0xab12...de12", timestamp: "2025-02-12T18:00:00Z", protocol: "Hyperliquid", chainId: "hyperliquid", type: "claim", typeLabel: "클레임", fromToken: "HYPE", amount: 500, fee: 0, status: "completed" },
  { id: "t13", hash: "0xab13...de13", timestamp: "2025-02-12T14:00:00Z", protocol: "Uniswap", chainId: "arbitrum", type: "swap", typeLabel: "스왑", fromToken: "ARB", toToken: "ETH", amount: 900, fee: 0.45, status: "completed" },
  { id: "t14", hash: "0xab14...de14", timestamp: "2025-02-12T10:00:00Z", protocol: "Bridge", chainId: "base", type: "bridge", typeLabel: "브릿지", fromToken: "ETH", amount: 1_500, fee: 0.8, status: "completed" },
  { id: "t15", hash: "0xab15...de15", timestamp: "2025-02-11T20:00:00Z", protocol: "HyperSwap", chainId: "hyperevm", type: "lp_remove", typeLabel: "LP 제거", fromToken: "HYPE/USDC", amount: 1_800, fee: 0.18, status: "completed" },
  { id: "t16", hash: "0xab16...de16", timestamp: "2025-02-11T16:00:00Z", protocol: "Aave", chainId: "arbitrum", type: "repay", typeLabel: "상환", fromToken: "USDC", amount: 1_500, fee: 0.15, status: "completed" },
  { id: "t17", hash: "0xab17...de17", timestamp: "2025-02-11T12:00:00Z", protocol: "HyperLend", chainId: "hyperevm", type: "claim", typeLabel: "클레임", fromToken: "HYPE", amount: 120, fee: 0.01, status: "completed" },
  { id: "t18", hash: "0xab18...de18", timestamp: "2025-02-11T08:00:00Z", protocol: "Hyperliquid", chainId: "hyperliquid", type: "transfer", typeLabel: "전송", fromToken: "USDC", amount: 5_000, fee: 0, status: "completed" },
  { id: "t19", hash: "0xab19...de19", timestamp: "2025-02-10T22:00:00Z", protocol: "KittenSwap", chainId: "hyperevm", type: "swap", typeLabel: "스왑", fromToken: "HYPE", toToken: "ETH", amount: 640, fee: 0.06, status: "pending" },
  { id: "t20", hash: "0xab20...de20", timestamp: "2025-02-10T18:00:00Z", protocol: "GMX", chainId: "arbitrum", type: "stake", typeLabel: "스테이킹", fromToken: "GMX", amount: 880, fee: 0.44, status: "completed" },
  { id: "t21", hash: "0xab21...de21", timestamp: "2025-02-10T14:00:00Z", protocol: "Aerodrome", chainId: "base", type: "lp_add", typeLabel: "LP 추가", fromToken: "ETH/AERO", amount: 2_200, fee: 0.11, status: "completed" },
  { id: "t22", hash: "0xab22...de22", timestamp: "2025-02-10T10:00:00Z", protocol: "Uniswap", chainId: "ethereum", type: "swap", typeLabel: "스왑", fromToken: "ETH", toToken: "USDC", amount: 3_200, fee: 5.0, status: "completed" },
  { id: "t23", hash: "0xab23...de23", timestamp: "2025-02-09T20:00:00Z", protocol: "HyperSwap", chainId: "hyperevm", type: "approve", typeLabel: "승인", fromToken: "HYPE", amount: 0, fee: 0.01, status: "completed" },
  { id: "t24", hash: "0xab24...de24", timestamp: "2025-02-09T16:00:00Z", protocol: "Hyperliquid", chainId: "hyperliquid", type: "swap", typeLabel: "스왑", fromToken: "BTC", toToken: "USDC", amount: 4_800, fee: 1.2, status: "completed" },
  { id: "t25", hash: "0xab25...de25", timestamp: "2025-02-09T12:00:00Z", protocol: "Bridge", chainId: "arbitrum", type: "bridge", typeLabel: "브릿지", fromToken: "ETH", amount: 2_100, fee: 1.05, status: "failed" },
  { id: "t26", hash: "0xab26...de26", timestamp: "2025-02-09T08:00:00Z", protocol: "HyperLend", chainId: "hyperevm", type: "borrow", typeLabel: "대출", fromToken: "USDC", amount: 4_000, fee: 0.4, status: "completed" },
  { id: "t27", hash: "0xab27...de27", timestamp: "2025-02-08T20:00:00Z", protocol: "KittenSwap", chainId: "hyperevm", type: "swap", typeLabel: "스왑", fromToken: "USDC", toToken: "HYPE", amount: 1_600, fee: 0.16, status: "completed" },
  { id: "t28", hash: "0xab28...de28", timestamp: "2025-02-08T16:00:00Z", protocol: "Aave", chainId: "arbitrum", type: "stake", typeLabel: "스테이킹", fromToken: "ETH", amount: 1_200, fee: 0.6, status: "completed" },
  { id: "t29", hash: "0xab29...de29", timestamp: "2025-02-08T12:00:00Z", protocol: "Aerodrome", chainId: "base", type: "claim", typeLabel: "클레임", fromToken: "AERO", amount: 180, fee: 0.02, status: "completed" },
  { id: "t30", hash: "0xab30...de30", timestamp: "2025-02-08T08:00:00Z", protocol: "Hyperliquid", chainId: "hyperliquid", type: "swap", typeLabel: "스왑", fromToken: "SOL", toToken: "USDC", amount: 2_600, fee: 0.65, status: "completed" },
];

export const mockTaxReport: TaxReportData = {
  year: 2024,
  totalGains: 18_847,
  totalLosses: 5_200,
  netIncome: 13_647,
  method: "fifo",
  country: "kr",
  chainBreakdown: [
    { chainId: "hyperliquid", name: "Hyperliquid", gains: 9_200, losses: 1_000, net: 8_200, events: 124 },
    { chainId: "arbitrum", name: "Arbitrum", gains: 4_547, losses: 1_000, net: 3_547, events: 87 },
    { chainId: "hyperevm", name: "HyperEVM", gains: 3_100, losses: 700, net: 2_400, events: 65 },
    { chainId: "base", name: "Base", gains: 1_500, losses: 300, net: 1_200, events: 42 },
    { chainId: "ethereum", name: "Ethereum", gains: 500, losses: 2_200, net: -1_700, events: 18 },
  ],
  events: [
    { id: "e1", date: "2024-12-15", type: "매도", asset: "ETH", amount: 1.5, costBasis: 3_200, proceeds: 5_200, gainLoss: 2_000, chainId: "hyperliquid" },
    { id: "e2", date: "2024-11-20", type: "스왑", asset: "HYPE", amount: 1000, costBasis: 8_000, proceeds: 16_000, gainLoss: 8_000, chainId: "hyperevm" },
    { id: "e3", date: "2024-10-10", type: "매도", asset: "ARB", amount: 5000, costBasis: 4_500, proceeds: 4_000, gainLoss: -500, chainId: "arbitrum" },
    { id: "e4", date: "2024-09-05", type: "LP 제거", asset: "ETH/USDC", amount: 2.0, costBasis: 6_000, proceeds: 7_200, gainLoss: 1_200, chainId: "base" },
    { id: "e5", date: "2024-08-15", type: "매도", asset: "ETH", amount: 0.5, costBasis: 1_800, proceeds: 1_600, gainLoss: -200, chainId: "ethereum" },
  ],
};

export const mockInsights: InsightCard[] = [
  { id: "i1", title: "포트폴리오 집중도 높음", description: "HYPE이 전체 자산의 27%를 차지합니다. 분산 투자를 고려해보세요.", type: "warning", icon: "AlertTriangle" },
  { id: "i2", title: "PnL 상승 추세", description: "최근 7일간 수익이 12.4% 증가했습니다.", type: "positive", icon: "TrendingUp" },
  { id: "i3", title: "가스비 절약 기회", description: "HyperEVM으로 이동하면 가스비를 90% 절약할 수 있습니다.", type: "info", icon: "Zap" },
  { id: "i4", title: "세금 이벤트 감지", description: "이번 분기 42건의 과세 이벤트가 발생했습니다.", type: "negative", icon: "FileText" },
];

export const mockPnlHistory7d: PnlDataPoint[] = [
  { date: "2/9", value: 12_800 },
  { date: "2/10", value: 13_200 },
  { date: "2/11", value: 12_500 },
  { date: "2/12", value: 14_100 },
  { date: "2/13", value: 13_800 },
  { date: "2/14", value: 14_900 },
  { date: "2/15", value: 15_247 },
];

export const mockPnlHistory30d: PnlDataPoint[] = [
  { date: "1/16", value: 8_200 },
  { date: "1/19", value: 9_100 },
  { date: "1/22", value: 8_800 },
  { date: "1/25", value: 10_200 },
  { date: "1/28", value: 9_500 },
  { date: "1/31", value: 11_300 },
  { date: "2/3", value: 10_800 },
  { date: "2/6", value: 12_100 },
  { date: "2/9", value: 12_800 },
  { date: "2/12", value: 14_100 },
  { date: "2/15", value: 15_247 },
];

/* ───── Dashboard Phase 2 Mock Data ───── */

export const mockSettingsData: SettingsData = {
  profile: {
    name: "HyperTrader",
    email: "trader@cryptree.xyz",
    tier: "gold",
    tierPoints: 2_847,
    nextTierPoints: 5_000,
    joinedAt: "2024-06-15",
  },
  wallets: [
    { id: "w1", address: "0xA3b7...F3d4", label: "메인 지갑", chainId: "hyperevm", isPrimary: true, connectedAt: "2024-06-15" },
    { id: "w2", address: "0xB4c8...A2e5", label: "트레이딩", chainId: "hyperliquid", isPrimary: false, connectedAt: "2024-08-20" },
    { id: "w3", address: "0xC5d9...B3f6", label: "DeFi", chainId: "arbitrum", isPrimary: false, connectedAt: "2024-09-10" },
  ],
  preferences: { country: "kr", method: "fifo" },
};

export const mockRewardsData: RewardsData = {
  season: {
    name: "시즌 3 — Hypercharge",
    startDate: "2025-01-01",
    endDate: "2025-03-31",
    rank: 142,
    totalParticipants: 12_480,
    totalPoints: 2_847,
    status: "active",
  },
  points: [
    { category: "트레이딩", icon: "TrendingUp", points: 1_200, description: "거래량 기반 포인트" },
    { category: "유동성", icon: "Droplets", points: 680, description: "LP 제공 포인트" },
    { category: "스테이킹", icon: "Lock", points: 420, description: "HYPE 스테이킹 보상" },
    { category: "추천", icon: "Users", points: 320, description: "친구 초대 포인트" },
    { category: "활동", icon: "Activity", points: 227, description: "일일 활동 보너스" },
  ],
  claimableAmount: 145.5,
  claimableToken: "HYPE",
  distributions: [
    { id: "d1", date: "2025-01-15", season: "시즌 2", amount: 320, token: "HYPE", status: "claimed" },
    { id: "d2", date: "2024-10-15", season: "시즌 1", amount: 180, token: "HYPE", status: "claimed" },
    { id: "d3", date: "2025-02-15", season: "시즌 3 중간", amount: 145.5, token: "HYPE", status: "claimable" },
  ],
};

export const mockReferralData: ReferralData = {
  code: "HYPER-GOLD-7X3K",
  stats: {
    totalReferred: 12,
    activeReferred: 8,
    totalEarned: 1_240,
    pendingRewards: 180,
  },
  friends: [
    { address: "0x1a2b...3c4d", joinedAt: "2025-02-10", volume: 45_000, earned: 320, status: "active" },
    { address: "0x2b3c...4d5e", joinedAt: "2025-02-05", volume: 32_000, earned: 240, status: "active" },
    { address: "0x3c4d...5e6f", joinedAt: "2025-01-28", volume: 28_000, earned: 200, status: "active" },
    { address: "0x4d5e...6f7g", joinedAt: "2025-01-20", volume: 15_000, earned: 120, status: "active" },
    { address: "0x5e6f...7g8h", joinedAt: "2025-01-15", volume: 8_000, earned: 80, status: "active" },
    { address: "0x6f7g...8h9i", joinedAt: "2025-01-10", volume: 5_200, earned: 60, status: "active" },
    { address: "0x7g8h...9i0j", joinedAt: "2024-12-20", volume: 3_100, earned: 40, status: "active" },
    { address: "0x8h9i...0j1k", joinedAt: "2024-12-15", volume: 1_800, earned: 30, status: "active" },
    { address: "0x9i0j...1k2l", joinedAt: "2024-12-01", volume: 800, earned: 50, status: "inactive" },
    { address: "0xa0j1...2l3m", joinedAt: "2024-11-20", volume: 400, earned: 40, status: "inactive" },
    { address: "0xb1k2...3m4n", joinedAt: "2024-11-10", volume: 200, earned: 35, status: "inactive" },
    { address: "0xc2l3...4n5o", joinedAt: "2024-10-25", volume: 100, earned: 25, status: "inactive" },
  ],
};

function generateLeaderboard(count: number, myRank: number): LeaderboardData {
  const entries: LeaderboardEntry[] = [];
  const tiers: Tier[] = ["diamond", "diamond", "gold", "gold", "gold", "silver", "silver", "silver", "bronze", "bronze"];

  for (let i = 0; i < count; i++) {
    const rank = i + 1;
    entries.push({
      rank,
      address: `0x${rank.toString(16).padStart(4, "0")}...${(rank * 7).toString(16).padStart(4, "0")}`,
      tier: tiers[Math.min(i, tiers.length - 1)] || "bronze",
      value: Math.round(50_000 / (rank * 0.5 + 0.5)),
      change: Math.round((Math.random() - 0.3) * 20 * 10) / 10,
      isMe: rank === myRank,
    });
  }
  return {
    tab: "pnl",
    entries,
    myPosition: entries.find((e) => e.isMe) || {
      rank: myRank,
      address: "0xA3b7...F3d4",
      tier: "gold",
      value: Math.round(50_000 / (myRank * 0.5 + 0.5)),
      change: 12.4,
      isMe: true,
    },
    updatedAt: new Date().toISOString(),
  };
}

export const mockLeaderboardPnl: LeaderboardData = { ...generateLeaderboard(50, 14), tab: "pnl" };
export const mockLeaderboardVolume: LeaderboardData = { ...generateLeaderboard(50, 8), tab: "volume" };
export const mockLeaderboardActivity: LeaderboardData = { ...generateLeaderboard(50, 22), tab: "activity" };
export const mockLeaderboardReferral: LeaderboardData = { ...generateLeaderboard(50, 5), tab: "referral" };

/* ───── Dashboard Phase 3 Mock Data — 포인트샵 ───── */

export const mockExchangeData: ExchangeData = {
  pointsBalance: 12_450,
  lifetimeEarned: 28_900,
  lifetimeSpent: 16_450,
  adRevenueShare: {
    totalAdRevenue: 125_000,
    yourShare: 50_000,
    sharePercent: 40,
  },
  exchangeRate: {
    pointsPerUsdc: 100,
    minPoints: 100,
    maxPoints: 50_000,
    dailyLimit: 10_000,
    dailyUsed: 2_000,
    fee: 0.5,
  },
  products: [
    {
      id: "p1",
      name: "Cryptree Pro (1개월)",
      description: "Cryptree 프로 구독 1개월 이용권. 고급 분석 + 무제한 알림",
      category: "service",
      pointsCost: 500,
      stock: null,
      tag: "hot",
      badgeLabel: "인기",
    },
    {
      id: "p2",
      name: "Cryptree Genesis NFT",
      description: "한정판 Genesis 컬렉션 NFT. 홀더 전용 혜택 포함",
      category: "nft",
      pointsCost: 2_000,
      stock: 50,
      tag: "limited",
      badgeLabel: "50개 한정",
    },
    {
      id: "p3",
      name: "Discord 프리미엄 역할",
      description: "프리미엄 디스코드 역할 부여 (3개월)",
      category: "digital",
      pointsCost: 300,
      stock: null,
      tag: "new",
      badgeLabel: "신규",
    },
    {
      id: "p4",
      name: "HYPE 스티커 팩",
      description: "실물 HYPE 스티커 팩 (10종)",
      category: "physical",
      pointsCost: 800,
      stock: null,
    },
    {
      id: "p5",
      name: "세금 보고서 PDF",
      description: "연간 세금 보고서 PDF 자동 생성",
      category: "service",
      pointsCost: 1_500,
      stock: null,
    },
    {
      id: "p6",
      name: "Cryptree 후드티",
      description: "한정판 Cryptree 브랜드 후드티",
      category: "physical",
      pointsCost: 3_000,
      stock: 30,
      tag: "limited",
      badgeLabel: "30개 한정",
    },
    {
      id: "p7",
      name: "AI 포트폴리오 리뷰",
      description: "AI 기반 포트폴리오 분석 리포트",
      category: "service",
      pointsCost: 1_000,
      stock: null,
    },
    {
      id: "p8",
      name: "커스텀 프로필 프레임",
      description: "대시보드 프로필 커스텀 프레임",
      category: "digital",
      pointsCost: 400,
      stock: null,
      tag: "new",
      badgeLabel: "신규",
    },
  ],
  history: [
    {
      id: "ex1",
      date: "2025-02-14",
      type: "usdc",
      description: "USDC 교환",
      pointsSpent: 1_000,
      received: "10.00 USDC",
      status: "completed",
      txHash: "0xabc...def",
    },
    {
      id: "ex2",
      date: "2025-02-12",
      type: "product",
      description: "Cryptree Pro (1개월)",
      pointsSpent: 500,
      received: "구독 활성화",
      status: "completed",
    },
    {
      id: "ex3",
      date: "2025-02-10",
      type: "product",
      description: "Discord 프리미엄 역할",
      pointsSpent: 300,
      received: "역할 부여",
      status: "completed",
    },
    {
      id: "ex4",
      date: "2025-02-08",
      type: "usdc",
      description: "USDC 교환",
      pointsSpent: 5_000,
      received: "50.00 USDC",
      status: "completed",
      txHash: "0x123...456",
    },
    {
      id: "ex5",
      date: "2025-02-05",
      type: "product",
      description: "AI 포트폴리오 리뷰",
      pointsSpent: 1_000,
      received: "리포트 발송",
      status: "processing",
    },
    {
      id: "ex6",
      date: "2025-02-02",
      type: "usdc",
      description: "USDC 교환",
      pointsSpent: 2_000,
      received: "20.00 USDC",
      status: "failed",
    },
  ],
};
