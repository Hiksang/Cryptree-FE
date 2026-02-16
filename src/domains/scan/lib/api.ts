import type { ScanResult } from "@/core/types";

export async function getScanResult(
  address: string
): Promise<ScanResult & { found: boolean }> {
  const res = await fetch(`/api/scan/${address}`);
  if (!res.ok) {
    throw new Error("Failed to fetch scan result");
  }
  return res.json();
}
