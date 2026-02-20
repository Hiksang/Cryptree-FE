"use client";

import { PrivyProvider as BasePrivyProvider } from "@privy-io/react-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

function LoginTrigger() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, ready, authenticated } = usePrivy();

  useEffect(() => {
    // ?ref= 파라미터가 있으면 localStorage에 저장
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("referral_code", ref);
      const url = new URL(window.location.href);
      url.searchParams.delete("ref");
      router.replace(url.pathname + url.search);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (searchParams.get("login") === "required" && ready && !authenticated) {
      login();
      // URL에서 파라미터 제거
      const url = new URL(window.location.href);
      url.searchParams.delete("login");
      router.replace(url.pathname + url.search);
    }
  }, [searchParams, ready, authenticated, login, router]);

  // 로그인 후 추천 코드 자동 제출
  useEffect(() => {
    if (ready && authenticated) {
      const storedCode = localStorage.getItem("referral_code");
      if (storedCode) {
        localStorage.removeItem("referral_code");
        fetch("/api/dashboard/referral/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: storedCode }),
        }).catch(() => {});
      }
    }
  }, [ready, authenticated]);

  return null;
}

export function ConditionalPrivyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!privyAppId) {
    return <>{children}</>;
  }

  return (
    <BasePrivyProvider
      appId={privyAppId}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#00D4AA",
        },
        loginMethods: ["wallet", "google"],
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      <Suspense>
        <LoginTrigger />
      </Suspense>
      {children}
    </BasePrivyProvider>
  );
}
