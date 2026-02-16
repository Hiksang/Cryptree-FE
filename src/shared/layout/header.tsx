"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

const navLinks = [
  { label: "Feature", href: "#features" },
  { label: "Integrate", href: "#integrate" },
  { label: "Docs", href: "#" },
];

function AuthButtons() {
  const { ready, authenticated, login, logout } = usePrivy();

  if (!ready) return null;

  if (authenticated) {
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
            대시보드
          </Link>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 w-full px-3 py-2 text-[14px] text-text-secondary hover:text-text-primary hover:bg-bg-surface-2 rounded-b-[6px] cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
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
      Launch App
    </button>
  );
}

function MobileAuthButtons({ onClose }: { onClose: () => void }) {
  const { ready, authenticated, login, logout } = usePrivy();

  if (!ready) return null;

  if (authenticated) {
    return (
      <>
        <Link
          href="/dashboard"
          className="block w-full px-4 py-2 text-[14px] text-text-secondary hover:text-text-primary"
          onClick={onClose}
        >
          대시보드
        </Link>
        <button
          onClick={() => {
            logout();
            onClose();
          }}
          className="block w-full px-4 py-2 text-left text-[14px] text-text-secondary hover:text-text-primary cursor-pointer"
        >
          로그아웃
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
      Launch App
    </button>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
          className="text-[20px] leading-[28px] font-bold text-brand"
        >
          Cryptree
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[14px] text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <AuthButtons />
        </nav>

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
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block w-full px-4 py-2 text-[14px] text-text-secondary hover:text-text-primary"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <MobileAuthButtons onClose={() => setMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}
