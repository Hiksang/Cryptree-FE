"use client";

import Link from "next/link";
import { NAV_ITEMS } from "@/core/constants";
import { SidebarNavItem } from "./sidebar-nav-item";

export function Sidebar() {
  return (
    <>
      {/* Desktop sidebar — 240px */}
      <aside className="hidden lg:flex flex-col w-[240px] h-screen fixed left-0 top-0 bg-bg-surface border-r border-border-default z-40">
        <div className="h-16 flex items-center px-5">
          <Link href="/" className="text-[20px] leading-[28px] font-bold text-brand">
            Cryptree
          </Link>
        </div>
        <nav className="flex-1 px-3 py-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </nav>
      </aside>

      {/* Tablet sidebar — 64px icons only */}
      <aside className="hidden md:flex lg:hidden flex-col w-16 h-screen fixed left-0 top-0 bg-bg-surface border-r border-border-default z-40">
        <div className="h-16 flex items-center justify-center">
          <Link href="/" className="text-[16px] font-bold text-brand">
            HV
          </Link>
        </div>
        <nav className="flex-1 px-2 py-2 space-y-1">
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              collapsed
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
