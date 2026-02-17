"use client";

import { useState } from "react";
import {
  Monitor,
  Wrench,
  Gem,
  Package,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { toast } from "@/shared/ui";
import { api } from "@/domains/dashboard/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import type { ShopProduct } from "@/core/types";
import { useT } from "@/core/i18n";

const CATEGORY_CONFIG = {
  digital: {
    icon: Monitor,
    gradient: "from-blue-500/10 to-blue-600/5",
    iconColor: "text-blue-400",
  },
  service: {
    icon: Wrench,
    gradient: "from-purple-500/10 to-purple-600/5",
    iconColor: "text-purple-400",
  },
  nft: {
    icon: Gem,
    gradient: "from-amber-500/10 to-amber-600/5",
    iconColor: "text-amber-400",
  },
  physical: {
    icon: Package,
    gradient: "from-emerald-500/10 to-emerald-600/5",
    iconColor: "text-emerald-400",
  },
} as const;

const TAG_STYLES = {
  hot: "bg-negative/10 text-negative",
  new: "bg-info/10 text-info",
  limited: "bg-warning/10 text-warning",
  soldout: "bg-bg-surface-3 text-text-disabled",
} as const;

interface ProductCardProps {
  product: ShopProduct;
  pointsBalance: number;
}

export function ProductCard({ product, pointsBalance }: ProductCardProps) {
  const t = useT();
  const config = CATEGORY_CONFIG[product.category];
  const Icon = config.icon;
  const canAfford = pointsBalance >= product.pointsCost;
  const isSoldOut = product.tag === "soldout" || product.stock === 0;
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  async function handleExchange() {
    if (!canAfford || isSoldOut || loading) return;
    setLoading(true);
    try {
      await api.exchangeProduct(product.id);
      toast.success(t.dashboard.exchange.exchangeSuccess);
      queryClient.invalidateQueries({ queryKey: ["exchange"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.dashboard.exchange.exchangeFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[12px] bg-bg-surface border border-border-default overflow-hidden flex flex-col">
      {/* Icon area */}
      <div
        className={`h-28 bg-gradient-to-br ${config.gradient} flex items-center justify-center relative`}
      >
        <Icon className={`w-10 h-10 ${config.iconColor}`} />
        {product.tag && product.tag !== "soldout" && (
          <span
            className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${TAG_STYLES[product.tag]}`}
          >
            {product.badgeLabel || product.tag.toUpperCase()}
          </span>
        )}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-[14px] font-bold text-text-disabled">
              {t.dashboard.exchange.soldOut}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h4 className="text-[14px] font-semibold text-text-primary mb-1 line-clamp-1">
          {product.name}
        </h4>
        <p className="text-[12px] text-text-muted mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-brand tabular-nums">
            {product.pointsCost.toLocaleString()}P
          </span>
          {product.stock !== null && product.stock > 0 && (
            <span className="text-[11px] text-text-muted">
              {t.dashboard.exchange.stockRemaining(product.stock)}
            </span>
          )}
        </div>

        <button
          onClick={handleExchange}
          disabled={!canAfford || isSoldOut || loading}
          className="mt-3 w-full h-9 rounded-[6px] bg-brand/10 text-brand hover:bg-brand/20 disabled:bg-bg-surface-3 disabled:text-text-disabled text-[13px] font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ShoppingCart className="w-3.5 h-3.5" />
          )}
          {loading
            ? t.dashboard.exchange.exchanging
            : isSoldOut
              ? t.dashboard.exchange.soldOut
              : canAfford
                ? t.dashboard.exchange.exchange
                : t.dashboard.exchange.insufficientPoints}
        </button>
      </div>
    </div>
  );
}
