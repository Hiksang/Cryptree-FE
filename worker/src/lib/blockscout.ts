/**
 * Blockscout API Client
 *
 * Blockscout은 Etherscan 호환 API를 제공한다.
 * 체인별로 별도 인스턴스 URL을 사용한다.
 *
 * Etherscan에 비해 rate limit이 관대하고,
 * Etherscan이 지원하지 않는 체인(HyperEVM 등)의 fallback으로 사용한다.
 *
 * 전역 rate limiter를 사용하여 병렬 요청을 안전하게 처리한다.
 */

import { blockscoutLimiter, fetchWithRetry } from "./rate-limiter.js";
import type {
  EtherscanTransaction,
  EtherscanTokenTransfer,
  EtherscanInternalTransaction,
} from "./etherscan.js";

interface BlockscoutResponse<T> {
  status: string;
  message: string;
  result: T;
}

export class BlockscoutClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    params: Record<string, string | number | undefined>,
  ): Promise<T> {
    await blockscoutLimiter.wait();

    return fetchWithRetry(async () => {
      const searchParams = new URLSearchParams();

      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      }

      const url = `${this.baseUrl}?${searchParams.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Blockscout API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = (await response.json()) as BlockscoutResponse<T>;

      if (data.status === "0") {
        if (
          data.message === "No transactions found" ||
          data.message === "No records found" ||
          data.message === "NOTOK"
        ) {
          return [] as unknown as T;
        }
        throw new Error(`Blockscout API error: ${data.message}`);
      }

      return data.result;
    });
  }

  async getTransactions(params: {
    address: string;
    startBlock?: number;
    endBlock?: number;
    page?: number;
    offset?: number;
    sort?: "asc" | "desc";
  }): Promise<EtherscanTransaction[]> {
    const result = await this.request<EtherscanTransaction[] | string>({
      module: "account",
      action: "txlist",
      address: params.address,
      startblock: params.startBlock ?? 0,
      endblock: params.endBlock ?? 99999999,
      page: params.page ?? 1,
      offset: params.offset ?? 1000,
      sort: params.sort ?? "desc",
    });

    if (typeof result === "string" || !Array.isArray(result)) return [];
    return result;
  }

  async getTokenTransfers(params: {
    address: string;
    startBlock?: number;
    endBlock?: number;
    page?: number;
    offset?: number;
    sort?: "asc" | "desc";
  }): Promise<EtherscanTokenTransfer[]> {
    const result = await this.request<EtherscanTokenTransfer[] | string>({
      module: "account",
      action: "tokentx",
      address: params.address,
      startblock: params.startBlock ?? 0,
      endblock: params.endBlock ?? 99999999,
      page: params.page ?? 1,
      offset: params.offset ?? 1000,
      sort: params.sort ?? "desc",
    });

    if (typeof result === "string" || !Array.isArray(result)) return [];
    return result;
  }

  async getInternalTransactions(params: {
    address: string;
    startBlock?: number;
    endBlock?: number;
    page?: number;
    offset?: number;
    sort?: "asc" | "desc";
  }): Promise<EtherscanInternalTransaction[]> {
    try {
      const result = await this.request<
        EtherscanInternalTransaction[] | string
      >({
        module: "account",
        action: "txlistinternal",
        address: params.address,
        startblock: params.startBlock ?? 0,
        endblock: params.endBlock ?? 99999999,
        page: params.page ?? 1,
        offset: params.offset ?? 1000,
        sort: params.sort ?? "desc",
      });

      if (typeof result === "string" || !Array.isArray(result)) return [];
      return result;
    } catch {
      return [];
    }
  }
}

// 체인별 클라이언트 캐시
const clientCache = new Map<string, BlockscoutClient>();

export function getBlockscoutClient(
  apiUrl: string,
): BlockscoutClient {
  if (!clientCache.has(apiUrl)) {
    clientCache.set(apiUrl, new BlockscoutClient(apiUrl));
  }
  return clientCache.get(apiUrl)!;
}
