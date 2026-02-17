import { useQuery } from "@tanstack/react-query";
import { getScanResult } from "../lib/api";

export const SCAN_QUERY_KEY = (address: string) => ["scan", address] as const;

export function useScan(address: string) {
  return useQuery({
    queryKey: SCAN_QUERY_KEY(address),
    queryFn: () => getScanResult(address),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes — same address revisit = instant
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
  });
}
