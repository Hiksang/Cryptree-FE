import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TaxCountry, TaxMethod, ConnectedWallet } from "@/core/types";

type Locale = "ko" | "en";

interface UserPreferences {
  country: TaxCountry;
  method: TaxMethod;
}

interface HyperViewStore {
  preferences: UserPreferences;
  wallets: ConnectedWallet[];
  locale: Locale;
  setPreferences: (p: Partial<UserPreferences>) => void;
  addWallet: (w: ConnectedWallet) => void;
  removeWallet: (address: string) => void;
  setLocale: (locale: Locale) => void;
}

export const useHyperViewStore = create<HyperViewStore>()(
  persist(
    (set) => ({
      preferences: { country: "kr", method: "fifo" },
      wallets: [],
      locale: "ko",
      setPreferences: (p) =>
        set((state) => ({
          preferences: { ...state.preferences, ...p },
        })),
      addWallet: (w) =>
        set((state) => ({
          wallets: [...state.wallets, w],
        })),
      removeWallet: (address) =>
        set((state) => ({
          wallets: state.wallets.filter((w) => w.address !== address),
        })),
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "hyperview-store",
      partialize: (state) => ({ locale: state.locale }),
    },
  ),
);
