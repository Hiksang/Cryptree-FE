import cron from "node-cron";
import { db } from "./lib/db.js";
import { wallets } from "./lib/schema.js";
import { incrementalScanWallet } from "./scanner.js";
import { distributePoints } from "./batch/points.js";
import { lt, isNotNull, sql } from "drizzle-orm";

// 30분마다 증분 스캔
export function startIncrementalScanCron() {
  cron.schedule("*/30 * * * *", async () => {
    console.log("[cron] Starting incremental scan cycle");

    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      // 마지막 스캔이 30분 이상 된 지갑 조회
      const staleWallets = await db.query.wallets.findMany({
        where: lt(wallets.lastScannedAt, thirtyMinutesAgo),
      });

      // 아직 스캔 안 된 지갑도 포함
      const unscannedWallets = await db.query.wallets.findMany({
        where: sql`${wallets.lastScannedAt} IS NULL`,
      });

      const allWallets = [...staleWallets, ...unscannedWallets];

      if (allWallets.length === 0) {
        console.log("[cron] No wallets need scanning");
        return;
      }

      console.log(`[cron] Scanning ${allWallets.length} wallets`);

      for (const wallet of allWallets) {
        try {
          const lastBlocks =
            (wallet.lastScannedBlock as Record<string, number>) || {};
          await incrementalScanWallet(
            wallet.id,
            wallet.address,
            wallet.userId,
            lastBlocks,
          );
        } catch (error) {
          console.error(
            `[cron] Error scanning wallet ${wallet.address}:`,
            error,
          );
        }
      }

      console.log("[cron] Incremental scan cycle complete");
    } catch (error) {
      console.error("[cron] Scan cycle error:", error);
    }
  });

  console.log("[cron] Incremental scan scheduled (every 30 minutes)");
}

// 매일 00:00 포인트 배치 분배
export function startPointsBatchCron() {
  cron.schedule("0 0 * * *", async () => {
    console.log("[cron] Starting daily points distribution");

    try {
      await distributePoints();
      console.log("[cron] Daily points distribution complete");
    } catch (error) {
      console.error("[cron] Points distribution error:", error);
    }
  });

  console.log("[cron] Points distribution scheduled (daily at 00:00)");
}
