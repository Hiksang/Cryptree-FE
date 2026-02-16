"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";

const hasPrivy = !!process.env.NEXT_PUBLIC_PRIVY_APP_ID;

function usePrivyAuth() {
  if (!hasPrivy) {
    return {
      ready: true,
      authenticated: false,
      login: () => {},
      logout: () => {},
      user: null,
    };
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { ready, authenticated, login, logout, user } = require("@privy-io/react-auth").usePrivy();
  return { ready, authenticated, login, logout, user };
}

export function DashboardHeader() {
  const { ready, authenticated, login, logout } = usePrivyAuth();

  return (
    <header className="h-16 bg-bg-surface border-b border-border-default flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Mobile logo */}
      <Link href="/" className="md:hidden text-[18px] font-bold text-brand">
        Cryptree
      </Link>

      <div className="hidden md:block" />

      <div className="flex items-center gap-4">
        {ready && authenticated ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-muted flex items-center justify-center text-brand text-[14px] font-semibold">
              U
            </div>
            <button
              onClick={() => logout()}
              className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              title="로그아웃"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : ready && !authenticated ? (
          <button
            onClick={() => login()}
            className="text-[14px] text-text-secondary hover:text-text-primary cursor-pointer"
          >
            로그인
          </button>
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-muted flex items-center justify-center text-brand text-[14px] font-semibold">
            U
          </div>
        )}
      </div>
    </header>
  );
}
