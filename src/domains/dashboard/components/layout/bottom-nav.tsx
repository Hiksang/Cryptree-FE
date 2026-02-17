"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  FileText,
  Gift,
  Users,
  ShoppingBag,
  Settings,
  MoreHorizontal,
  X,
} from "lucide-react";
import { NAV_ITEMS } from "@/core/constants";
import { useT } from "@/core/i18n";

const ICON_MAP = {
  LayoutDashboard,
  ArrowLeftRight,
  FileText,
  Gift,
  Users,
  ShoppingBag,
  Settings,
} as const;

const MAIN_NAV = NAV_ITEMS.slice(0, 4);
const MORE_NAV = NAV_ITEMS.slice(4);

export function BottomNav() {
  const t = useT();
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isMoreActive = MORE_NAV.some((item) => pathname.startsWith(item.href));

  return (
    <>
      {/* More menu overlay */}
      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute bottom-16 left-0 right-0 bg-bg-surface border-t border-border-default rounded-t-[12px] p-4 space-y-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-semibold text-text-primary">
                {t.nav.more}
              </span>
              <button
                onClick={() => setMoreOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-text-muted cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {MORE_NAV.map((item) => {
              const Icon = ICON_MAP[item.icon];
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={`flex items-center gap-3 h-10 px-3 rounded-[6px] transition-colors ${
                    isActive
                      ? "bg-brand-muted text-brand"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-2"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[14px] font-medium">{t.nav[item.labelKey]}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-surface border-t border-border-default flex items-center justify-around z-40">
        {MAIN_NAV.map((item) => {
          const Icon = ICON_MAP[item.icon];
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-3 ${
                isActive ? "text-brand" : "text-text-muted"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] leading-[12px]">{t.nav[item.labelKey]}</span>
            </Link>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className={`flex flex-col items-center gap-1 py-2 px-3 cursor-pointer ${
            isMoreActive || moreOpen ? "text-brand" : "text-text-muted"
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] leading-[12px]">{t.nav.more}</span>
        </button>
      </nav>
    </>
  );
}
