import { create } from "zustand";
import type { TaxCountry, TaxMethod, ConnectedWallet } from "@/core/types";

interface UserPreferences {
  country: TaxCountry;
  method: TaxMethod;
}

interface CryptreeStore {
  preferences: UserPreferences;
  wallets: ConnectedWallet[];
  setPreferences: (p: Partial<UserPreferences>) => void;
  addWallet: (w: ConnectedWallet) => void;
  removeWallet: (address: string) => void;
}

export const useCryptreeStore = create<CryptreeStore>((set) => ({
  preferences: { country: "kr", method: "fifo" },
  wallets: [],
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
}));
