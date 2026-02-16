"use client";

import { useState } from "react";
import type { ConnectedWallet } from "@/core/types";
import { CHAIN_COLORS, CHAIN_NAMES } from "@/core/constants";
import { Plus, Trash2, Star, Loader2, X, Copy, Check } from "lucide-react";
import { toast } from "@/shared/ui";
import { api } from "@/domains/dashboard/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";

interface ConnectedWalletsProps {
  wallets: ConnectedWallet[];
}

function CopyAddressButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("주소가 복사되었습니다");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했습니다");
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-brand transition-colors cursor-pointer"
      title="주소 복사"
    >
      {copied ? <Check className="w-4 h-4 text-positive" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

export function ConnectedWallets({ wallets }: ConnectedWalletsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [address, setAddress] = useState("");
  const [label, setLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  async function handleAdd() {
    if (!address.trim()) return;
    setAdding(true);
    try {
      await api.addWallet(address.trim(), label.trim() || undefined);
      toast.success("지갑이 추가되었습니다");
      setAddress("");
      setLabel("");
      setShowAddForm(false);
      queryClient.invalidateQueries({ queryKey: ["dashboard", "settings"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "지갑 추가에 실패했습니다");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(wallet: ConnectedWallet) {
    setDeletingId(wallet.id);
    try {
      await api.deleteWallet(wallet.id);
      toast.success("지갑이 삭제되었습니다");
      queryClient.invalidateQueries({ queryKey: ["dashboard", "settings"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "지갑 삭제에 실패했습니다");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] leading-[24px] font-semibold text-text-primary">
          연결된 지갑
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 h-8 px-3 text-[13px] font-medium text-brand border border-brand/30 rounded-[6px] hover:bg-brand-muted transition-colors cursor-pointer"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? "취소" : "지갑 추가"}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-4 p-4 bg-bg-surface-2 rounded-[6px] space-y-3">
          <div>
            <label className="text-[12px] text-text-muted mb-1 block">지갑 주소</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="w-full h-10 px-3 rounded-[6px] bg-bg-surface border border-border-default text-text-primary text-[14px] font-mono placeholder:text-text-disabled focus:outline-none focus:border-brand/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-[12px] text-text-muted mb-1 block">라벨 (선택)</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="메인 지갑"
              className="w-full h-10 px-3 rounded-[6px] bg-bg-surface border border-border-default text-text-primary text-[14px] placeholder:text-text-disabled focus:outline-none focus:border-brand/50 transition-colors"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!address.trim() || adding}
            className="h-9 px-4 bg-brand text-bg-primary text-[13px] font-semibold rounded-[6px] hover:bg-brand-hover disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
          >
            {adding && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {adding ? "추가 중..." : "추가"}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {wallets.length === 0 && (
          <p className="text-[14px] text-text-muted text-center py-6">
            연결된 지갑이 없습니다. 지갑을 추가해 주세요.
          </p>
        )}
        {wallets.map((wallet) => (
          <div
            key={wallet.address}
            className="flex items-center justify-between p-4 bg-bg-surface-2 rounded-[6px]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor: CHAIN_COLORS[wallet.chainId] || "#888",
                }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium text-text-primary font-mono truncate md:overflow-visible">
                    <span className="hidden md:inline">{wallet.address}</span>
                    <span className="md:hidden">
                      {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                    </span>
                  </span>
                  {wallet.isPrimary && (
                    <Star className="w-3 h-3 text-warning fill-warning shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-[12px] text-text-muted">
                  <span>{wallet.label}</span>
                  <span>&middot;</span>
                  <span>{CHAIN_NAMES[wallet.chainId]}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <CopyAddressButton address={wallet.address} />
              {!wallet.isPrimary && (
                <button
                  onClick={() => handleDelete(wallet)}
                  disabled={deletingId === wallet.id}
                  className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-negative transition-colors cursor-pointer disabled:opacity-50"
                >
                  {deletingId === wallet.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
