import express from "express";
import { db } from "./lib/db.js";
import { wallets } from "./lib/schema.js";
import { eq } from "drizzle-orm";
import { fullScanWallet, publicScanAddress } from "./scanner.js";

const app = express();
app.use(express.json());

// In-memory cache for public scan results (5-minute TTL)
const scanCache = new Map<string, { result: unknown; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCachedResult(address: string): unknown | null {
  const entry = scanCache.get(address.toLowerCase());
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    scanCache.delete(address.toLowerCase());
    return null;
  }
  return entry.result;
}

function setCachedResult(address: string, result: unknown): void {
  scanCache.set(address.toLowerCase(), { result, timestamp: Date.now() });
}

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 수동 스캔 트리거 (관리용)
// POST /scan { walletId, address, userId }
app.post("/scan", async (req, res) => {
  try {
    const { walletId, address, userId } = req.body;

    if (!walletId || !address || !userId) {
      res.status(400).json({ error: "walletId, address, userId required" });
      return;
    }

    console.log(`[server] Manual scan triggered for ${address}`);

    // 비동기로 스캔 시작 (응답은 즉시 반환)
    fullScanWallet(walletId, address, userId).catch((err) =>
      console.error(`[server] Scan failed for ${address}:`, err),
    );

    res.json({ ok: true, message: "Scan started" });
  } catch (error) {
    console.error("[server] Error:", error);
    res.status(500).json({ error: "Internal error" });
  }
});

// 신규 지갑 등록 웹훅
// Next.js API에서 유저가 지갑을 연결하면 호출
app.post("/webhook/wallet-added", async (req, res) => {
  try {
    const { walletId, address, userId } = req.body;

    if (!walletId || !address || !userId) {
      res.status(400).json({ error: "walletId, address, userId required" });
      return;
    }

    console.log(`[webhook] New wallet added: ${address}, starting full scan`);

    // 풀스캔 비동기 실행
    fullScanWallet(walletId, address, userId).catch((err) =>
      console.error(`[webhook] Full scan failed for ${address}:`, err),
    );

    res.json({ ok: true, message: "Full scan queued" });
  } catch (error) {
    console.error("[webhook] Error:", error);
    res.status(500).json({ error: "Internal error" });
  }
});

// 공개 스캔 (DB 저장 없이 결과 반환)
// POST /scan/public { address }
app.post("/scan/public", async (req, res) => {
  try {
    const { address } = req.body;

    if (!address || typeof address !== "string") {
      res.status(400).json({ error: "address required" });
      return;
    }

    // Check cache first
    const cached = getCachedResult(address);
    if (cached) {
      console.log(`[server] Cache hit for ${address}`);
      res.json(cached);
      return;
    }

    console.log(`[server] Public scan requested for ${address}`);
    const result = await publicScanAddress(address);

    // Cache the result
    setCachedResult(address, result);

    res.json(result);
  } catch (error) {
    console.error("[server] Public scan error:", error);
    res.status(500).json({ error: "Scan failed" });
  }
});

export function startServer(port: number = 4000) {
  app.listen(port, () => {
    console.log(`[server] Webhook server listening on port ${port}`);
  });

  return app;
}
