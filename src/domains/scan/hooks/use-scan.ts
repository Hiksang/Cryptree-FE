import { useQuery } from "@tanstack/react-query";
import { getScanResult } from "../lib/api";

export function useScan(address: string) {
  return useQuery({
    queryKey: ["scan", address],
    queryFn: () => getScanResult(address),
    enabled: !!address,
  });
}
