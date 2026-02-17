"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * 랜딩 페이지의 ?ref= 파라미터를 localStorage에 저장.
 * 가입 후 대시보드 진입 시 자동으로 레퍼럴 등록에 사용.
 */
export function ReferralCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("pendingReferral", ref);
    }
  }, [searchParams]);

  return null;
}
