import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api-client";
import type { LeaderboardTab } from "@/core/types";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: api.getStats,
  });
}

export function useSettings() {
  const query = useQuery({
    queryKey: ["dashboard", "settings"],
    queryFn: api.getSettings,
    // 스캔 중인 지갑이 있으면 5초마다 폴링
    refetchInterval: (query) => {
      const data = query.state.data;
      const hasScanning = data?.wallets?.some((w) => w.scanStatus === "scanning");
      return hasScanning ? 5000 : false;
    },
  });
  return query;
}

export function useRewards() {
  return useQuery({
    queryKey: ["dashboard", "rewards"],
    queryFn: api.getRewards,
  });
}

export function useReferral() {
  return useQuery({
    queryKey: ["dashboard", "referral"],
    queryFn: api.getReferral,
  });
}

export function useLeaderboard(tab: LeaderboardTab) {
  return useQuery({
    queryKey: ["dashboard", "leaderboard", tab],
    queryFn: () => api.getLeaderboard(tab),
  });
}

export function useExchange() {
  return useQuery({
    queryKey: ["dashboard", "exchange"],
    queryFn: api.getExchange,
  });
}

export function useTransactions(params: {
  page: number;
  chain: string;
  type: string;
  search: string;
}) {
  return useQuery({
    queryKey: ["dashboard", "transactions", params],
    queryFn: () =>
      api.getTransactions({
        page: String(params.page),
        chain: params.chain,
        type: params.type,
        q: params.search,
      }),
  });
}
