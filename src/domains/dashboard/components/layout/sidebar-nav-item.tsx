"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  FileText,
  ArrowLeftRight,
  Gift,
  Users,
  Trophy,
  ShoppingBag,
  Settings,
} from "lucide-react";

const ICON_MAP = {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  FileText,
  ArrowLeftRight,
  Gift,
  Users,
  Trophy,
  ShoppingBag,
  Settings,
} as const;

interface SidebarNavItemProps {
  href: string;
  label: string;
  icon: keyof typeof ICON_MAP;
  collapsed?: boolean;
}

export function SidebarNavItem({ href, label, icon, collapsed }: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive = href === "/dashboard"
    ? pathname === "/dashboard"
    : pathname.startsWith(href);

  const Icon = ICON_MAP[icon];

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 h-10 rounded-[6px] transition-colors ${
        collapsed ? "justify-center px-0" : "px-3"
      } ${
        isActive
          ? "bg-brand-muted text-brand"
          : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-2"
      }`}
      title={collapsed ? label : undefined}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {!collapsed && (
        <span className="text-[14px] leading-[20px] font-medium">{label}</span>
      )}
    </Link>
  );
}
