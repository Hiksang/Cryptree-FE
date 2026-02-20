/**
 * Etherscan V2 API Client
 *
 * Unified multichain API: https://api.etherscan.io/v2/api?chainid=...
 * 기존 hypurrquant-tax의 etherscan-v2.ts 패턴을 기반으로 작성.
 *
 * 전역 rate limiter를 사용하여 여러 유저의 병렬 요청을 안전하게 처리한다.
 */

import { etherscanLimiter, fetchWithRetry } from "./rate-limiter.js";

const ETHERSCAN_V2_BASE_URL = "https://api.etherscan.io/v2/api";

// ========== 응답 타입 ==========

export interface EtherscanTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  isError: string;
  contractAddress: string;
  functionName: string;
  methodId: string;
}

export interface EtherscanTokenTransfer {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  contractAddress: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
}

export interface EtherscanInternalTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  type: string;
  gas: string;
  gasUsed: string;
  isError: string;
}

interface EtherscanResponse<T> {
  status: string;
  message: string;
  result: T;
}

// ========== 클라이언트 ==========

export class EtherscanV2Client {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl || ETHERSCAN_V2_BASE_URL;
  }

  private async request<T>(
    chainId: number,
    params: Record<string, string | number | undefined>,
  ): Promise<T> {
    // 전역 rate limiter — 여러 유저가 동시에 요청해도 안전
    await etherscanLimiter.wait();

    return fetchWithRetry(async () => {
      const searchParams = new URLSearchParams();
      searchParams.set("chainid", String(chainId));
      searchParams.set("apikey", this.apiKey);

      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      }

      const url = `${this.baseUrl}?${searchParams.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Etherscan API error: ${response.status} ${response.statusText}`,
        );
      }

      const data = (await response.json()) as EtherscanResponse<T>;

      if (data.status === "0") {
        // 결과 없음은 에러가 아님
        if (
          data.message === "No transactions found" ||
          data.message === "No records found"
        ) {
          return [] as unknown as T;
        }
        // NOTOK 등은 실제 에러 → Blockscout 폴백 트리거
        throw new Error(`Etherscan API error: ${data.message} — ${typeof data.result === "string" ? data.result : ""}`);
      }

      return data.result;
    });
  }

  /**
   * 일반 트랜잭션 조회 (txlist)
   */
  async getTransactions(
    chainId: number,
    params: {
      address: string;
      startBlock?: number;
      endBlock?: number;
      page?: number;
      offset?: number;
      sort?: "asc" | "desc";
    },
  ): Promise<EtherscanTransaction[]> {
    const result = await this.request<EtherscanTransaction[] | string>(
      chainId,
      {
        module: "account",
        action: "txlist",
        address: params.address,
        startblock: params.startBlock ?? 0,
        endblock: params.endBlock ?? 99999999,
        page: params.page ?? 1,
        offset: params.offset ?? 1000,
        sort: params.sort ?? "desc",
      },
    );

    if (typeof result === "string" || !Array.isArray(result)) return [];
    return result;
  }

  /**
   * ERC-20 토큰 전송 조회 (tokentx)
   */
  async getTokenTransfers(
    chainId: number,
    params: {
      address: string;
      startBlock?: number;
      endBlock?: number;
      page?: number;
      offset?: number;
      sort?: "asc" | "desc";
    },
  ): Promise<EtherscanTokenTransfer[]> {
    const result = await this.request<EtherscanTokenTransfer[] | string>(
      chainId,
      {
        module: "account",
        action: "tokentx",
        address: params.address,
        startblock: params.startBlock ?? 0,
        endblock: params.endBlock ?? 99999999,
        page: params.page ?? 1,
        offset: params.offset ?? 1000,
        sort: params.sort ?? "desc",
      },
    );

    if (typeof result === "string" || !Array.isArray(result)) return [];
    return result;
  }

  /**
   * 내부 트랜잭션 조회 (txlistinternal)
   */
  async getInternalTransactions(
    chainId: number,
    params: {
      address: string;
      startBlock?: number;
      endBlock?: number;
      page?: number;
      offset?: number;
      sort?: "asc" | "desc";
    },
  ): Promise<EtherscanInternalTransaction[]> {
    try {
      const result = await this.request<
        EtherscanInternalTransaction[] | string
      >(chainId, {
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
      // 일부 체인은 internal tx를 지원하지 않음
      return [];
    }
  }
}

// 싱글톤 인스턴스
let _client: EtherscanV2Client | null = null;

export function getEtherscanClient(): EtherscanV2Client {
  if (!_client) {
    const apiKey = process.env.ETHERSCAN_API_KEY;
    if (!apiKey) {
      throw new Error("ETHERSCAN_API_KEY environment variable is required");
    }
    _client = new EtherscanV2Client(apiKey);
  }
  return _client;
}
