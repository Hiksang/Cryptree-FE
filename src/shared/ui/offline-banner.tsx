"use client";

import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";
import { useT } from "@/core/i18n";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const t = useT();

  useEffect(() => {
    function handleOffline() { setIsOffline(true); }
    function handleOnline() { setIsOffline(false); }

    setIsOffline(!navigator.onLine);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-negative text-white text-center py-2 px-4 flex items-center justify-center gap-2 text-[13px] font-medium">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>{t.common.offline}</span>
      <span className="hidden sm:inline text-white/80">— {t.common.offlineDesc}</span>
    </div>
  );
}
