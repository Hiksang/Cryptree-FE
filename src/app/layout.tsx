import type { Metadata } from "next";
import { ConditionalPrivyProvider } from "@/shared/providers";
import { QueryProvider } from "@/shared/providers";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cryptree - HyperEVM 온체인 활동 분석",
  description:
    "HyperEVM 트랜잭션 해석, 활동 스코어, DeFi DNA 분석, 등급 측정 & 보상",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <ConditionalPrivyProvider>
          <QueryProvider>
            {children}
            <Toaster
              theme="dark"
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#141414",
                  border: "1px solid #262626",
                  color: "#FAFAFA",
                },
              }}
            />
          </QueryProvider>
        </ConditionalPrivyProvider>
      </body>
    </html>
  );
}
