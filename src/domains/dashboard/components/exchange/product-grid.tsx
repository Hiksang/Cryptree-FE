"use client";

import { useState } from "react";
import { Store } from "lucide-react";
import type { ShopProduct, ShopCategory } from "@/core/types";
import { ProductCard } from "./product-card";

const TABS: { value: ShopCategory | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "digital", label: "디지털" },
  { value: "service", label: "서비스" },
  { value: "nft", label: "NFT" },
  { value: "physical", label: "실물" },
];

interface ProductGridProps {
  products: ShopProduct[];
  pointsBalance: number;
}

export function ProductGrid({ products, pointsBalance }: ProductGridProps) {
  const [activeTab, setActiveTab] = useState<ShopCategory | "all">("all");

  const filtered =
    activeTab === "all"
      ? products
      : products.filter((p) => p.category === activeTab);

  return (
    <div className="rounded-[12px] bg-bg-surface border border-border-default p-5">
      <div className="flex items-center gap-2 mb-4">
        <Store className="w-5 h-5 text-brand" />
        <h3 className="text-[16px] font-semibold text-text-primary">
          상품 마켓플레이스
        </h3>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 mb-5 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.value
                ? "bg-brand/10 text-brand"
                : "text-text-muted hover:text-text-secondary hover:bg-bg-surface-2"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            pointsBalance={pointsBalance}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-text-muted text-[14px]">
          해당 카테고리에 상품이 없습니다
        </div>
      )}
    </div>
  );
}
