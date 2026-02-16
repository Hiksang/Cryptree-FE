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
    if (searchParams.get("login") === "required" && ready && !authenticated) {
      login();
      // URL에서 파라미터 제거
      const url = new URL(window.location.href);
      url.searchParams.delete("login");
      router.replace(url.pathname + url.search);
    }
  }, [searchParams, ready, authenticated, login, router]);

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
