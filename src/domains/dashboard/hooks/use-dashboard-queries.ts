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
