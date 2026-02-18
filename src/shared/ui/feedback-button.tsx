"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { MessageSquarePlus, X, Loader2 } from "lucide-react";
import { toast } from "@/shared/ui";
import { useT } from "@/core/i18n";

type Category = "bug" | "feature" | "general";

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<Category>("general");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const t = useT();
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  useEffect(() => {
    if (open) {
      setCategory("general");
      setMessage("");
      setEmail("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const handleSubmit = useCallback(async () => {
    if (!message.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          message: message.trim(),
          email: email.trim() || undefined,
          page: window.location.pathname,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: t.feedback.error }));
        throw new Error(err.error || t.feedback.error);
      }

      toast.success(t.feedback.success);
      setOpen(false);
    } catch {
      toast.error(t.feedback.error);
    } finally {
      setSubmitting(false);
    }
  }, [category, message, email, submitting, t]);

  const categories: { value: Category; label: string }[] = [
    { value: "bug", label: t.feedback.categoryBug },
    { value: "feature", label: t.feedback.categoryFeature },
    { value: "general", label: t.feedback.categoryGeneral },
  ];

  return (
    <>
      {/* Floating Button — shift up on mobile dashboard to avoid bottom nav */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed right-6 z-40 flex items-center gap-2 h-11 px-4 bg-brand text-bg-primary text-[14px] font-semibold rounded-full shadow-lg hover:bg-brand-hover transition-colors cursor-pointer ${
          isDashboard ? "bottom-20 md:bottom-6" : "bottom-6"
        }`}
      >
        <MessageSquarePlus className="w-4.5 h-4.5" />
        <span className="hidden sm:inline">{t.feedback.button}</span>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-[440px] bg-bg-surface border border-border-default rounded-[12px] shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border-default">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-brand/15 flex items-center justify-center">
                  <MessageSquarePlus className="w-4.5 h-4.5 text-brand" />
                </div>
                <h2 className="text-[16px] font-semibold text-text-primary">
                  {t.feedback.title}
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-bg-surface-2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Category */}
              <div>
                <label className="text-[13px] font-medium text-text-secondary mb-1.5 block">
                  {t.feedback.categoryLabel}
                </label>
                <div className="flex gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setCategory(c.value)}
                      className={`h-8 px-3 text-[13px] rounded-[6px] border transition-colors cursor-pointer ${
                        category === c.value
                          ? "bg-brand/15 border-brand/40 text-brand font-medium"
                          : "bg-bg-surface-2 border-border-default text-text-secondary hover:border-border-hover"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.feedback.messagePlaceholder}
                  maxLength={1000}
                  rows={4}
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-[8px] bg-bg-surface-2 border border-border-default text-text-primary text-[14px] placeholder:text-text-disabled focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-all resize-none"
                />
                <p className="text-[11px] text-text-muted mt-1 text-right">
                  {message.length}/1000
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="text-[13px] font-medium text-text-secondary mb-1.5 block">
                  {t.feedback.emailLabel}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.feedback.emailPlaceholder}
                  className="w-full h-11 px-3.5 rounded-[8px] bg-bg-surface-2 border border-border-default text-text-primary text-[14px] placeholder:text-text-disabled focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-all"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 p-5 pt-0">
              <button
                onClick={() => setOpen(false)}
                className="h-10 px-4 text-[14px] text-text-secondary hover:text-text-primary rounded-[8px] hover:bg-bg-surface-2 transition-colors cursor-pointer"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!message.trim() || submitting}
                className="h-10 px-5 bg-brand text-bg-primary text-[14px] font-semibold rounded-[8px] hover:bg-brand-hover disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? t.feedback.submitting : t.feedback.submit}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
