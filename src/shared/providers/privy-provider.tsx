"use client";

import { PrivyProvider as BasePrivyProvider } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

function LoginRedirect() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    if (ready && authenticated && window.location.pathname === "/") {
      router.replace("/dashboard");
    }
  }, [ready, authenticated, router]);

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
      <LoginRedirect />
      {children}
    </BasePrivyProvider>
  );
}
