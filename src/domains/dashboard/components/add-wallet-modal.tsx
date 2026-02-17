"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Loader2, Wallet } from "lucide-react";
import { toast } from "@/shared/ui";
import { api } from "@/domains/dashboard/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@/core/i18n";

interface AddWalletModalProps {
  open: boolean;
  onClose: () => void;
}

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

export function AddWalletModal({ open, onClose }: AddWalletModalProps) {
  const queryClient = useQueryClient();
  const [address, setAddress] = useState("");
  const [label, setLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const t = useT();

  // 모달 열릴 때 폼 초기화
  useEffect(() => {
    if (open) {
      setAddress("");
      setLabel("");
      setError("");
    }
  }, [open]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // 스크롤 방지
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  const handleSubmit = useCallback(async () => {
    const trimmed = address.trim();
    if (!trimmed) return;

    if (!ADDRESS_RE.test(trimmed)) {
      setError(t.dashboard.addWallet.addressError);
      return;
    }

    setAdding(true);
    setError("");
    try {
      await api.addWallet(trimmed, label.trim() || undefined);
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "settings"] });
      toast.success(t.dashboard.addWallet.walletAdded);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.dashboard.addWallet.walletAddFailed);
    } finally {
      setAdding(false);
    }
  }, [address, label, onClose, queryClient, t]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[440px] bg-bg-surface border border-border-default rounded-[12px] shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border-default">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-brand/15 flex items-center justify-center">
              <Wallet className="w-4.5 h-4.5 text-brand" />
            </div>
            <h2 className="text-[16px] font-semibold text-text-primary">
              {t.dashboard.addWallet.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-surface-2 rounded-[6px] transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[13px] font-medium text-text-secondary mb-1.5 block">
              {t.dashboard.addWallet.addressLabel}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (error) setError("");
              }}
              placeholder="0x..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              className="w-full h-11 px-3.5 rounded-[8px] bg-bg-surface-2 border border-border-default text-text-primary text-[14px] font-mono placeholder:text-text-disabled focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-all"
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-text-secondary mb-1.5 block">
              {t.dashboard.addWallet.labelField} <span className="text-text-muted font-normal">{t.dashboard.addWallet.labelOptional}</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={t.dashboard.addWallet.labelPlaceholder}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              className="w-full h-11 px-3.5 rounded-[8px] bg-bg-surface-2 border border-border-default text-text-primary text-[14px] placeholder:text-text-disabled focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-all"
            />
          </div>

          {error && (
            <p className="text-[13px] text-negative">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 p-5 pt-0">
          <button
            onClick={onClose}
            className="h-10 px-4 text-[14px] font-medium text-text-secondary bg-bg-surface-2 rounded-[8px] hover:bg-bg-surface-2/80 transition-colors cursor-pointer"
          >
            {t.common.cancel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!address.trim() || adding}
            className="h-10 px-5 bg-brand text-bg-primary text-[14px] font-semibold rounded-[8px] hover:bg-brand-hover disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
          >
            {adding && <Loader2 className="w-4 h-4 animate-spin" />}
            {adding ? t.dashboard.addWallet.adding : t.dashboard.addWallet.title}
          </button>
        </div>
      </div>
    </div>
  );
}
