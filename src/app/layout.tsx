import type { Metadata } from "next";
import { ConditionalPrivyProvider } from "@/shared/providers";
import { QueryProvider } from "@/shared/providers";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cryptree - 온체인 활동 분석 & 리워드 플랫폼",
  description:
    "멀티체인 온체인 트랜잭션 분석, 활동 스코어, 타겟 광고 리워드 플랫폼",
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
