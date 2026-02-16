const BASE = "/api/dashboard";

async function fetchApi<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE}${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
    });
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function mutateApi<T>(
  path: string,
  method: string,
  body: unknown,
): Promise<T> {
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `API error: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // GET
  getStats: () =>
    fetchApi<{ stats: import("@/core/types").DashboardStats; insights: import("@/core/types").InsightCard[] }>("/stats"),
  getSettings: () =>
    fetchApi<import("@/core/types").SettingsData>("/settings"),
  getRewards: () =>
    fetchApi<import("@/core/types").RewardsData>("/rewards"),
  getReferral: () =>
    fetchApi<import("@/core/types").ReferralData>("/referral"),
  getLeaderboard: (tab: string) =>
    fetchApi<import("@/core/types").LeaderboardData>("/leaderboard", { tab }),
  getExchange: () =>
    fetchApi<import("@/core/types").ExchangeData>("/exchange"),

  // Mutations
  exchangeProduct: (productId: string) =>
    mutateApi<{ success: boolean; received: string }>(`${BASE}/exchange`, "POST", { type: "product", productId }),
  updateSettings: (prefs: { country?: string; method?: string }) =>
    mutateApi<{ success: boolean }>(`${BASE}/settings`, "PUT", prefs),
  updateProfile: (name: string) =>
    mutateApi<{ success: boolean }>(`${BASE}/settings`, "PUT", { name }),
  addWallet: (address: string, label?: string) =>
    mutateApi<{ id: string; address: string }>("/api/wallets", "POST", { address, label }),
  deleteWallet: (walletId: string) =>
    mutateApi<{ success: boolean }>("/api/wallets", "DELETE", { walletId }),
  updateWallet: (walletId: string, updates: { label?: string; isPrimary?: boolean }) =>
    mutateApi<{ id: string; label: string; isPrimary: boolean }>("/api/wallets", "PUT", { walletId, ...updates }),
};
