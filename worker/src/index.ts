import { startServer } from "./server.js";
import { startIncrementalScanCron, startPointsBatchCron } from "./cron.js";

console.log("=================================");
console.log("  HyperView Worker Starting...");
console.log("=================================");
console.log(`  Data sources: Etherscan V2 + Blockscout`);

// 1. 웹훅 수신 서버 시작
const port = parseInt(process.env.WEBHOOK_PORT || "4000", 10);
startServer(port);

// 2. Cron 스케줄러 시작
startIncrementalScanCron();
startPointsBatchCron();

console.log("[worker] All services started");
