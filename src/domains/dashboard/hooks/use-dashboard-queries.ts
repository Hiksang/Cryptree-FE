import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api-client";
import type { PnlPeriod, LeaderboardTab } from "@/core/types";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: api.getStats,
  });
}

export function usePortfolio() {
  return useQuery({
    queryKey: ["dashboard", "portfolio"],
    queryFn: api.getPortfolio,
  });
}

export function usePnl(period: PnlPeriod) {
  return useQuery({
    queryKey: ["dashboard", "pnl", period],
    queryFn: () => api.getPnl(period),
  });
}

export function useTaxReport(country: string, method: string) {
  return useQuery({
    queryKey: ["dashboard", "tax", country, method],
    queryFn: () => api.getTax(country, method),
  });
}

export function useTransactions(params: {
  page?: string;
  chain?: string;
  type?: string;
  q?: string;
}) {
  return useQuery({
    queryKey: ["dashboard", "transactions", params],
    queryFn: () => api.getTransactions(params),
  });
}

export function useSettings() {
  return useQuery({
    queryKey: ["dashboard", "settings"],
    queryFn: api.getSettings,
  });
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
