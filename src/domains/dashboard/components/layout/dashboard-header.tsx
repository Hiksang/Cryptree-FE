"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, Settings, ChevronDown } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { useT } from "@/core/i18n";
import { LanguageToggle } from "@/shared/ui/language-toggle";
import { useSettings } from "@/domains/dashboard/hooks/use-dashboard-queries";

export function DashboardHeader() {
  const t = useT();
  const { ready, authenticated, login, logout } = usePrivy();
  const { data: settingsData } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const profileName = settingsData?.profile?.name ?? "User";
  const initial = profileName.charAt(0).toUpperCase();

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <header className="h-16 bg-bg-surface border-b border-border-default flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Mobile logo */}
      <Link href="/dashboard" className="md:hidden flex items-center gap-2">
        <Image src="/icon.png" alt="Cryptree" width={22} height={25} />
        <span className="text-[18px] font-bold text-brand">Cryptree</span>
      </Link>

      <div className="hidden md:block" />

      <div className="flex items-center gap-4">
        <LanguageToggle />
        {ready && authenticated ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-full hover:bg-bg-surface-2 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-brand-muted flex items-center justify-center text-brand text-[13px] font-semibold">
                {initial}
              </div>
              <span className="text-[14px] font-medium text-text-primary hidden sm:block max-w-[120px] truncate">
                {profileName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-bg-surface border border-border-default rounded-[8px] shadow-lg py-1 animate-fade-in">
                <Link
                  href="/dashboard/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 text-[14px] text-text-secondary hover:text-text-primary hover:bg-bg-surface-2 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  {t.nav.settings}
                </Link>
                <div className="h-px bg-border-default mx-2 my-1" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[14px] text-negative hover:bg-negative/5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  {t.common.logout}
                </button>
              </div>
            )}
          </div>
        ) : ready && !authenticated ? (
          <button
            onClick={() => login()}
            className="text-[14px] text-text-secondary hover:text-text-primary cursor-pointer"
          >
            {t.common.login}
          </button>
        ) : (
          <div className="w-7 h-7 rounded-full bg-brand-muted" />
        )}
      </div>
    </header>
  );
}
