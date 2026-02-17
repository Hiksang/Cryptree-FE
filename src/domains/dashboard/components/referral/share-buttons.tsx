"use client";

import { Share2 } from "lucide-react";
import { useT } from "@/core/i18n";

interface ShareButtonsProps {
  code: string;
}

export function ShareButtons({ code }: ShareButtonsProps) {
  const t = useT();
  const shareText = t.dashboard.referral.shareText(code);

  const handleTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  };

  const handleDiscord = () => {
    navigator.clipboard.writeText(shareText);
  };

  return (
    <div className="bg-bg-surface border border-border-default rounded-[8px] p-6">
      <h3 className="text-[16px] leading-[24px] font-semibold text-text-primary mb-3">
        {t.dashboard.referral.share}
      </h3>
      <p className="text-[14px] text-text-secondary mb-4">
        {t.dashboard.referral.shareDesc}
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleTwitter}
          className="flex items-center gap-2 h-10 px-4 bg-[#1DA1F2] text-white text-[14px] font-semibold rounded-[6px] hover:bg-[#1A8CD8] transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          {t.dashboard.referral.shareTwitter}
        </button>
        <button
          onClick={handleDiscord}
          className="flex items-center gap-2 h-10 px-4 bg-[#5865F2] text-white text-[14px] font-semibold rounded-[6px] hover:bg-[#4752C4] transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          {t.dashboard.referral.shareDiscord}
        </button>
      </div>
    </div>
  );
}
