"use client";

import { useState, useEffect } from "react";
import type { UserProfile } from "@/core/types";
import { TIER_CONFIG } from "@/core/constants";
import { User, Pencil, Check, X, Loader2 } from "lucide-react";
import { toast } from "@/shared/ui";
import { api } from "@/domains/dashboard/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@/core/i18n";
import { useHyperViewStore } from "@/shared/store";

interface ProfileCardProps {
  profile: UserProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const tier = TIER_CONFIG[profile.tier];
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [saving, setSaving] = useState(false);
  const t = useT();
  const locale = useHyperViewStore((s) => s.locale);

  // profile prop이 바뀌면 name state도 동기화
  useEffect(() => {
    setName(profile.name);
  }, [profile.name]);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await api.updateProfile(name.trim());
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "settings"] });
      toast.success(t.dashboard.settings.nameChanged);
      setEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.dashboard.settings.nameChangeFailed);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setName(profile.name);
    setEditing(false);
  }

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[16px] leading-[24px] font-semibold text-text-primary mb-4">
        {t.dashboard.settings.profile}
      </h3>

      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-bg-surface-2 flex items-center justify-center shrink-0">
          <User className="w-7 h-7 text-text-muted" />
        </div>

        <div className="flex-1 space-y-3">
          <div>
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 h-9 px-3 rounded-[6px] bg-bg-surface-2 border border-border-default text-text-primary text-[16px] font-semibold focus:outline-none focus:border-brand/50 transition-colors"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") handleCancel();
                  }}
                />
                <button
                  onClick={handleSave}
                  disabled={saving || !name.trim()}
                  className="w-8 h-8 flex items-center justify-center text-positive hover:bg-positive/10 rounded-[4px] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleCancel}
                  className="w-8 h-8 flex items-center justify-center text-text-muted hover:bg-bg-surface-2 rounded-[4px] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-[18px] font-semibold text-text-primary">
                  {profile.name}
                </p>
                <button
                  onClick={() => setEditing(true)}
                  className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-surface-2 rounded-[4px] transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-[14px] text-text-secondary">{profile.email}</p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[12px] font-semibold"
              style={{
                backgroundColor: `${tier.color}20`,
                color: tier.color,
              }}
            >
              {tier.icon} {tier.label}
            </span>
            <span className="text-[12px] text-text-muted">
              {t.dashboard.settings.joinedAt} {new Date(profile.joinedAt).toLocaleDateString(locale === "en" ? "en-US" : "ko-KR")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
