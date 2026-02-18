"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { useT } from "@/core/i18n";
import { LanguageToggle } from "@/shared/ui/language-toggle";

const NAV_LINKS = [
  { labelKey: "features" as const, href: "#features" },
  { labelKey: "integrate" as const, href: "#integrate" },
  { labelKey: "docs" as const, href: "#docs" },
];

function usePrivyAuth() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  return { ready, authenticated, login, logout, user };
}

function AuthButtons() {
  const { ready, authenticated, login, logout } = usePrivyAuth();
  const router = useRouter();
  const pathname = usePathname();
  const wasAuthenticated = useRef(false);
  const t = useT();

  useEffect(() => {
    if (ready && authenticated && !wasAuthenticated.current) {
      if (pathname === "/" || pathname.startsWith("/address/")) {
        // If the user was scanning an address before signup, redirect back there
        try {
          const savedAddress = localStorage.getItem("lastScanAddress");
          if (savedAddress) {
            localStorage.removeItem("lastScanAddress");
            router.push(`/address/${savedAddress}`);
          } else {
            router.push("/dashboard");
          }
        } catch {
          router.push("/dashboard");
        }
      }
    }
    wasAuthenticated.current = authenticated;
  }, [ready, authenticated, router, pathname]);

  if (ready && authenticated) {
    return (
      <div className="relative group">
        <button className="w-8 h-8 rounded-full bg-brand-muted flex items-center justify-center text-brand text-[14px] font-semibold cursor-pointer">
          U
        </button>
        <div className="absolute right-0 top-full mt-1 w-40 bg-bg-surface border border-border-default rounded-[6px] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-[14px] text-text-secondary hover:text-text-primary hover:bg-bg-surface-2 rounded-t-[6px]"
          >
            <LayoutDashboard className="w-4 h-4" />
            {t.header.dashboard}
          </Link>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 w-full px-3 py-2 text-[14px] text-text-secondary hover:text-text-primary hover:bg-bg-surface-2 rounded-b-[6px] cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            {t.common.logout}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => login()}
      className="h-8 px-4 bg-brand text-bg-primary text-[14px] font-semibold rounded-[6px] hover:bg-brand-hover transition-colors cursor-pointer"
    >
      {t.common.start}
    </button>
  );
}

function MobileAuthButtons({ onClose }: { onClose: () => void }) {
  const { ready, authenticated, login, logout } = usePrivyAuth();
  const t = useT();

  if (ready && authenticated) {
    return (
      <>
        <Link
          href="/dashboard"
          className="block w-full px-4 py-2 text-[14px] text-text-secondary hover:text-text-primary"
          onClick={onClose}
        >
          {t.header.dashboard}
        </Link>
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="block w-full px-4 py-2 text-left text-[14px] text-text-secondary hover:text-text-primary cursor-pointer"
        >
          {t.common.logout}
        </button>
      </>
    );
  }

  return (
    <button
      onClick={() => {
        login();
        onClose();
      }}
      className="block w-full px-4 py-2 bg-brand text-bg-primary text-[14px] font-semibold rounded-[6px] text-center cursor-pointer"
    >
      {t.common.start}
    </button>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useT();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-200 ${
        scrolled
          ? "bg-bg-primary border-b border-border-default"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-[20px] leading-[28px] font-bold text-brand"
        >
          <Image src="/icon.png" alt="Cryptree" width={28} height={28} />
          Cryptree
        </Link>

        {/* Center nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[16px] font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              {t.header[link.labelKey]}
            </a>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />
          <AuthButtons />
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-text-secondary cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-bg-primary border-b border-border-default p-4 space-y-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block w-full px-4 py-2 text-[14px] text-text-secondary hover:text-text-primary"
            >
              {t.header[link.labelKey]}
            </a>
          ))}
          <div className="px-4 py-2">
            <LanguageToggle />
          </div>
          <div className="border-t border-border-default pt-2 mt-2">
            <MobileAuthButtons onClose={() => setMenuOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
