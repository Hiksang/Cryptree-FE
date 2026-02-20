/**
 * 지원 체인 설정
 *
 * 각 체인의 Etherscan chain ID와 Blockscout API URL을 정의한다.
 * Etherscan V2 API는 chainid 파라미터로 멀티체인을 지원한다.
 * Blockscout은 체인별로 별도 인스턴스를 운영한다.
 */

export interface ChainConfig {
  name: string;
  etherscanChainId: number;
  blockscoutApiUrl?: string; // Blockscout API가 있는 체인만
  nativeSymbol: string;
}

export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  ethereum: {
    name: "Ethereum",
    etherscanChainId: 1,
    blockscoutApiUrl: "https://eth.blockscout.com/api",
    nativeSymbol: "ETH",
  },
  arbitrum: {
    name: "Arbitrum One",
    etherscanChainId: 42161,
    blockscoutApiUrl: "https://arbitrum.blockscout.com/api",
    nativeSymbol: "ETH",
  },
  base: {
    name: "Base",
    etherscanChainId: 8453,
    blockscoutApiUrl: "https://base.blockscout.com/api",
    nativeSymbol: "ETH",
  },
  optimism: {
    name: "Optimism",
    etherscanChainId: 10,
    blockscoutApiUrl: "https://optimism.blockscout.com/api",
    nativeSymbol: "ETH",
  },
  polygon: {
    name: "Polygon",
    etherscanChainId: 137,
    blockscoutApiUrl: "https://polygon.blockscout.com/api",
    nativeSymbol: "MATIC",
  },
  hyperevm: {
    name: "HyperEVM",
    etherscanChainId: 999,
    nativeSymbol: "HYPE",
  },
  // bnb: Etherscan V2 유료 플랜 필요 + 공개 Blockscout 없음 → 추후 지원
};

export function getChainIds(): string[] {
  return Object.keys(SUPPORTED_CHAINS);
}
