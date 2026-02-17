"use client";

import { useState } from "react";
import type { ConnectedWallet, WalletScanStatus } from "@/core/types";
import { CHAIN_COLORS, CHAIN_NAMES } from "@/core/constants";
import { Plus, Trash2, Star, Loader2, Copy, Check, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "@/shared/ui";
import { api } from "@/domains/dashboard/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { AddWalletModal } from "@/domains/dashboard/components/add-wallet-modal";

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

const STATUS_CONFIG: Record<WalletScanStatus, {
  label: string;
  className: string;
  icon?: "spinner" | "check" | "alert";
}> = {
  idle: { label: "대기 중", className: "text-text-muted bg-bg-surface" },
  scanning: { label: "스캔 중", className: "text-brand bg-brand/10", icon: "spinner" },
  completed: { label: "완료", className: "text-positive bg-positive/10", icon: "check" },
  failed: { label: "실패", className: "text-negative bg-negative/10", icon: "alert" },
};

function ScanStatusBadge({ wallet }: { wallet: ConnectedWallet }) {
  const config = STATUS_CONFIG[wallet.scanStatus];
  const progress = wallet.scanProgress;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${config.className}`}>
      {config.icon === "spinner" && <Loader2 className="w-3 h-3 animate-spin" />}
      {config.icon === "check" && <CheckCircle2 className="w-3 h-3" />}
      {config.icon === "alert" && <AlertCircle className="w-3 h-3" />}
      <span>
        {wallet.scanStatus === "scanning" && progress
          ? `스캔 중 ${progress.completed}/${progress.total}`
          : wallet.scanStatus === "completed" && wallet.txCount
            ? `${wallet.txCount.toLocaleString()}건 수집`
            : config.label}
      </span>
    </div>
  );
}

export function ConnectedWallets({ wallets }: ConnectedWalletsProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

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
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 h-8 px-3 text-[13px] font-medium text-brand border border-brand/30 rounded-[6px] hover:bg-brand-muted transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          지갑 추가
        </button>
      </div>

      <AddWalletModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

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
                <div className="flex items-center gap-2 mt-0.5 text-[12px] text-text-muted">
                  {wallet.label && <span>{wallet.label}</span>}
                  {wallet.label && <span>&middot;</span>}
                  <ScanStatusBadge wallet={wallet} />
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
