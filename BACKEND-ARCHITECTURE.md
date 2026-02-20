# Backend Architecture: Crypto Tax Tracker API

> 기존 `tax` 프로젝트(`packages/api/`)의 백엔드 구조를 문서화한다.
> HyperView 플랫폼은 이 백엔드 위에 구축되므로, 현재 구현 상태를 명확히 기록한다.

---

## 1. 프로젝트 구조

```
packages/api/
├── src/
│   ├── index.ts                 # 서버 진입점 (Hono + CORS + 라우팅)
│   ├── config/
│   │   ├── env.ts               # 환경변수 스키마 (Zod 검증)
│   │   ├── chains.ts            # 체인 설정 + API 엔드포인트
│   │   ├── known-addresses.ts   # 알려진 주소 데이터
│   │   ├── protocols.ts         # 프로토콜 레지스트리 (함수 시그니처, 이벤트 등)
│   │   └── hyperevm-protocols.ts # HyperEVM 프로토콜 설정
│   ├── db/
│   │   ├── index.ts             # Drizzle ORM 인스턴스 (postgres-js 드라이버)
│   │   └── schema.ts            # 전체 DB 스키마 (30+ 테이블)
│   ├── adapters/
│   │   ├── registry.ts          # 어댑터 레지스트리 (동적 등록/관리)
│   │   ├── hyperevm.ts          # HyperEVM 체인 어댑터
│   │   ├── hyperliquid.ts       # Hyperliquid 퍼프 어댑터
│   │   ├── evm-factory.ts       # 범용 EVM 어댑터 팩토리 (35+ 체인)
│   │   ├── perp/                # 퍼프 DEX 어댑터들
│   │   │   ├── registry.ts      #   퍼프 어댑터 레지스트리
│   │   │   ├── hyperliquid.ts   #   Hyperliquid 퍼프
│   │   │   ├── grvt.ts          #   GRVT
│   │   │   ├── lighter.ts       #   Lighter
│   │   │   ├── pacifica.ts      #   Pacifica
│   │   │   └── types.ts         #   공통 타입
│   │   └── index.ts             # 어댑터 모듈 re-export
│   ├── clients/
│   │   ├── hyperliquid.ts       # Hyperliquid API 클라이언트
│   │   ├── hyperscan.ts         # Hyperscan (Etherscan-compatible) 클라이언트
│   │   ├── etherscan-v2.ts      # Etherscan V2 API (멀티체인)
│   │   ├── coingecko.ts         # CoinGecko 가격 API
│   │   ├── coinmarketcap.ts     # CoinMarketCap 가격 API
│   │   ├── dexscreener.ts       # DEX Screener 가격 API
│   │   ├── grvt.ts              # GRVT 퍼프 API
│   │   ├── lighter.ts           # Lighter 퍼프 API
│   │   ├── pacifica.ts          # Pacifica 퍼프 API
│   │   ├── rate-limiter.ts      # API 요청 제한 관리
│   │   └── index.ts
│   ├── services/
│   │   ├── sync.ts              # 통합 동기화 (체인별 병렬, 체크포인트 기반 재개)
│   │   ├── classifier.ts        # 트랜잭션 분류 (프로토콜/함수/이벤트 기반)
│   │   ├── defi-classifier.ts   # DeFi 트랜잭션 분류 (메서드 시그니처 매칭)
│   │   ├── pnl.ts               # PnL 분석 (입출금, 실현손익, 펀딩, 수수료)
│   │   ├── price.ts             # 가격 서비스 (멀티소스 + 캐싱 + 폴백)
│   │   ├── portfolio.ts         # 포트폴리오 (온체인+CEX+수동 통합)
│   │   ├── hyperliquid.ts       # Hyperliquid 데이터 (트레이드, 펀딩, 요약)
│   │   ├── perps.ts             # 퍼프 포지션 관리
│   │   ├── flow.ts              # 자금 흐름 분석
│   │   ├── fund-flow.ts         # 자금 유입/유출 추적
│   │   ├── roi-calculator.ts    # ROI 계산
│   │   ├── label-service.ts     # 주소 라벨링 서비스
│   │   ├── external-label-fetcher.ts # 외부 라벨 조회
│   │   ├── gemini-report.ts     # AI 세금 리포트 (Gemini 2.0 Flash)
│   │   ├── csv-importer.ts      # CSV 임포트 (거래소별 파싱)
│   │   ├── data-sync.ts         # 데이터 캐시 동기화
│   │   ├── defillama.ts         # DefiLlama 프로토콜 데이터
│   │   ├── defi-pnl.ts          # DeFi PnL 계산
│   │   ├── balance-reconstructor.ts # 잔액 재구성
│   │   ├── multicall-decoder.ts # Multicall 디코딩
│   │   ├── position-population.ts # 포지션 데이터 생성
│   │   ├── taxable-income.ts    # 과세 소득 계산
│   │   ├── wash-sale.ts         # 워시 세일 감지
│   │   ├── tax-loss-harvesting.ts # 세금 손실 수확 단독 서비스
│   │   ├── cost-basis/          # 원가 계산 모듈
│   │   │   ├── cost-basis-engine.ts #   원가 계산 엔진
│   │   │   ├── methods/         #   계산 방법별 구현
│   │   │   │   ├── fifo.ts      #     FIFO (선입선출)
│   │   │   │   ├── lifo.ts      #     LIFO (후입선출)
│   │   │   │   ├── hifo.ts      #     HIFO (고비용 우선)
│   │   │   │   └── average-cost.ts #  이동평균법
│   │   │   └── types.ts
│   │   ├── tax/                 # 국가별 세금 계산 모듈
│   │   │   ├── calculator-factory.ts # 국가별 계산기 팩토리
│   │   │   ├── calculators/
│   │   │   │   ├── korea-calculator.ts    # 한국 (KR)
│   │   │   │   ├── us-calculator.ts       # 미국 (US)
│   │   │   │   ├── japan-calculator.ts    # 일본 (JP)
│   │   │   │   ├── uk-calculator.ts       # 영국 (UK)
│   │   │   │   ├── germany-calculator.ts  # 독일 (DE)
│   │   │   │   ├── australia-calculator.ts # 호주 (AU)
│   │   │   │   └── singapore-calculator.ts # 싱가포르 (SG)
│   │   │   └── types.ts
│   │   ├── export/              # 내보내기 모듈
│   │   │   ├── csv-generator.ts  # CSV 생성
│   │   │   ├── pdf-generator.ts  # PDF 생성
│   │   │   └── form-generators/  # 세금 신고서 양식
│   │   ├── cex-integration/     # 거래소 연동
│   │   │   ├── upbit-client.ts   # 업비트
│   │   │   ├── bithumb-client.ts # 빗썸
│   │   │   ├── binance-client.ts # 바이낸스
│   │   │   ├── coinbase-client.ts # 코인베이스
│   │   │   ├── kraken-client.ts  # 크라켄
│   │   │   └── types.ts
│   │   ├── nft/                 # NFT 서비스
│   │   │   ├── nft-tracker.ts    # NFT 추적
│   │   │   ├── nft-classifier.ts # NFT 트랜잭션 분류
│   │   │   ├── nft-cost-basis.ts # NFT 원가 계산
│   │   │   ├── nft-valuation.ts  # NFT 가치 평가
│   │   │   └── types.ts
│   │   ├── lp-analytics/        # LP 분석
│   │   │   ├── lp-position-tracker.ts # LP 포지션 추적
│   │   │   ├── impermanent-loss.ts    # 비영구적 손실 계산
│   │   │   ├── concentrated-liquidity.ts # 집중 유동성 (V3)
│   │   │   ├── pool-registry.ts       # 풀 레지스트리
│   │   │   └── types.ts
│   │   ├── yield-farming/       # 이자 농사
│   │   │   ├── reward-tracker.ts  # 리워드 추적
│   │   │   ├── vesting-tracker.ts # 베스팅 추적
│   │   │   ├── farm-registry.ts   # 팜 레지스트리
│   │   │   ├── yield-income-service.ts # 수익 분류
│   │   │   └── types.ts
│   │   ├── transfer-detection/  # 이체 감지
│   │   │   └── index.ts
│   │   ├── tax-loss-harvesting/ # 세금 손실 수확 모듈
│   │   └── index.ts
│   ├── routes/                  # API 라우트 (25+ 파일)
│   │   ├── health.ts, wallets.ts, sync.ts, transactions.ts,
│   │   │   perp.ts, perps.ts, hyperliquid.ts, flow.ts,
│   │   │   pnl.ts, roi.ts, chains.ts, reports.ts,
│   │   │   labels.ts, dex.ts, cex.ts, tax.ts, export.ts,
│   │   │   nft.ts, lp.ts, farming.ts, import.ts,
│   │   │   portfolio.ts, defillama.ts, data-sync.ts,
│   │   │   balance.ts, defi.ts
│   │   └── index.ts
│   ├── data/                    # 정적 데이터
│   │   ├── cex/                 # 거래소 주소 데이터
│   │   │   ├── korean-exchanges.ts    # 한국 거래소
│   │   │   ├── asia-exchanges.ts      # 아시아 거래소
│   │   │   ├── us-exchanges.ts        # 미국 거래소
│   │   │   ├── eu-exchanges.ts        # 유럽 거래소
│   │   │   ├── global-exchanges.ts    # 글로벌 거래소
│   │   │   └── hot-wallets.ts         # 핫월렛 주소
│   │   └── dex/                 # DEX 주소 데이터 (14 체인)
│   │       ├── ethereum.ts, arbitrum.ts, base.ts,
│   │       │   optimism.ts, polygon.ts, bsc.ts,
│   │       │   avalanche.ts, zksync.ts, hyperevm.ts,
│   │       │   others.ts
│   │       └── method-signatures.ts   # DEX 메서드 시그니처
│   └── scripts/
│       └── seed-protocols.ts    # 프로토콜 시드 데이터
└── package.json
```

---

## 2. 기술 스택

| 영역 | 기술 | 설명 |
|------|------|------|
| **런타임** | Bun / Node.js + tsx | tsx watch로 개발, Bun 호환 |
| **웹 프레임워크** | Hono v4 | 경량 웹 프레임워크 (Express 대안) |
| **ORM** | Drizzle ORM v0.38 | 타입세이프 SQL 쿼리 빌더 |
| **DB 드라이버** | postgres (postgres.js) v3 | Drizzle과 연동하는 PostgreSQL 드라이버 |
| **데이터베이스** | PostgreSQL | 메인 데이터 저장소 (30+ 테이블) |
| **캐시** | Redis (ioredis) | 세션, 가격 캐시, Rate Limit |
| **검증** | Zod v3 | 환경변수 + API 입력 검증 |
| **정밀 계산** | Decimal.js | 암호화폐 수량/가격 정밀 계산 |
| **AI 리포트** | Gemini 2.0 Flash | AI 기반 세금/PnL 리포트 생성 |
| **패키지 관리** | Monorepo (workspace) | `@tax/shared` 공유 패키지 |

### 환경변수

```
PORT, NODE_ENV, DATABASE_URL, REDIS_URL,
ETHERSCAN_API_KEY, HYPERSCAN_API_URL/KEY,
HYPERLIQUID_API_URL, COINGECKO_API_KEY/PRO,
CMC_API_KEY, GEMINI_API_KEY
```

---

## 3. DB 스키마 (33개 테이블)

### 3.1 핵심 테이블

| 테이블 | PK | 설명 |
|--------|-----|------|
| `wallets` | `address` | 지갑 주소 (최상위 엔티티) |
| `sync_states` | `address + chain_id` | 체인별 동기화 상태 + 체크포인트 |
| `transactions` | `id` (chainId:txHash) | 통합 트랜잭션 (모든 체인, 수동 포함) |
| `token_balances` | `address + chain_id + contract` | 토큰 잔액 캐시 |

### 3.2 Hyperliquid 테이블

| 테이블 | PK | 설명 |
|--------|-----|------|
| `perp_positions` | `address + coin` | 현재 퍼프 포지션 |
| `hyperliquid_trades` | `id` (hash:tid) | 상세 트레이드 기록 |
| `hyperliquid_funding` | `id` (address:coin:ts) | 펀딩비 수령/지급 |
| `hyperliquid_summary` | `address` | 지갑별 집계 통계 |
| `hyperliquid_coin_summary` | `address + coin` | 코인별 집계 통계 |

### 3.3 라벨링/분류 테이블

| 테이블 | PK | 설명 |
|--------|-----|------|
| `defi_protocols` | `contract_address` | 알려진 DeFi 프로토콜 |
| `address_labels` | `id` (chainId:address) | 주소 라벨 (CEX/DEX/컨트랙트) |
| `address_clusters` | `id` (clusterId:address:chainId) | 관련 주소 클러스터 |
| `dex_contracts` | `id` (chainId:address) | 검증된 DEX 컨트랙트 |

### 3.4 세금 관련 테이블

| 테이블 | PK | 설명 |
|--------|-----|------|
| `tax_lots` | `id` (UUID) | 취득 로트 (원가 추적용) |
| `tax_disposals` | `id` (UUID) | 처분 기록 (로트 매칭 포함) |
| `tax_settings` | `address` | 유저별 세금 설정 (국가, 방법 등) |

### 3.5 CEX 테이블

| 테이블 | PK | 설명 |
|--------|-----|------|
| `cex_credentials` | `id` (UUID) | 거래소 API 키 (암호화) |
| `cex_trades` | `id` (exchange:tradeId) | 거래소 거래 기록 |
| `cex_transfers` | `id` (exchange:transferId) | 거래소 입출금 기록 |

### 3.6 NFT 테이블

| 테이블 | PK | 설명 |
|--------|-----|------|
| `nft_holdings` | `id` (address:contract:tokenId) | NFT 보유 현황 |
| `nft_transactions` | `id` (txHash:logIndex) | NFT 트랜잭션 |
| `nft_collections` | `id` (chainId:contract) | NFT 컬렉션 바닥가 |

### 3.7 LP/Yield 테이블

| 테이블 | PK | 설명 |
|--------|-----|------|
| `lp_positions` | `id` (address:pool:txHash) | LP 포지션 (V2/V3 지원) |
| `lp_transactions` | `id` (txHash:logIndex) | LP 추가/제거/수수료 수집 |
| `farming_positions` | `id` (address:farm:txHash) | 스테이킹/파밍 포지션 |
| `farming_rewards` | `id` (txHash:logIndex) | 파밍 리워드 수확 |
| `lending_positions` | `id` (address:protocol:token...) | 대출/공급 포지션 |
| `vesting_schedules` | `id` (address:contract:scheduleId) | 토큰 베스팅 스케줄 |

### 3.8 데이터 캐시 테이블

| 테이블 | PK | 설명 |
|--------|-----|------|
| `price_cache` | `token + chain_id + timestamp` | 가격 캐시 |
| `price_history` | `id` (token:timestamp) | 일간 가격 히스토리 |
| `token_metadata` | `id` (chainId:contract) | 토큰 메타데이터 |
| `known_addresses` | `id` (chainId:address) | 알려진 주소 정보 |
| `lp_pools` | `id` (chainId:poolAddress) | LP 풀 정보 |
| `yield_farms` | `id` (DefiLlama pool ID) | 이자 농사 정보 |
| `defillama_protocols` | `slug` | DefiLlama 프로토콜 데이터 |
| `defillama_sync_state` | `id` | DefiLlama 동기화 상태 |
| `data_sync_state` | `id` | 전체 데이터 소스 동기화 상태 |

---

## 4. API 엔드포인트 (25개 라우트 그룹)

### 4.1 라우트 맵

| 경로 | 파일 | 설명 |
|------|------|------|
| `/health` | `health.ts` | 헬스체크 |
| `/api/wallets` | `wallets.ts` | 지갑 CRUD |
| `/api/sync` | `sync.ts` | 트랜잭션 동기화 트리거 |
| `/api/transactions` | `transactions.ts` | 트랜잭션 조회/수동 입력/수정/삭제 |
| `/api/perp` | `perp.ts` | 퍼프 포지션 |
| `/api/hyperliquid` | `hyperliquid.ts` | Hyperliquid 전용 (트레이드, 펀딩, 요약) |
| `/api/flow` | `flow.ts` | 자금 흐름 분석 |
| `/api/pnl` | `pnl.ts` | PnL 분석 |
| `/api/roi` | `roi.ts` | ROI 계산 |
| `/api/chains` | `chains.ts` | 지원 체인 목록 |
| `/api/reports` | `reports.ts` | AI 리포트 (Gemini) |
| `/api/labels` | `labels.ts` | 주소 라벨 조회 |
| `/api/dex` | `dex.ts` | DEX 스왑 기록 |
| `/api/cex` | `cex.ts` | CEX 연동 (자격증명, 거래, 이체) |
| `/api/tax` | `tax.ts` | 세금 계산 (국가별) |
| `/api/export` | `export.ts` | CSV/PDF 내보내기 |
| `/api/nft` | `nft.ts` | NFT 보유/트랜잭션 |
| `/api/lp` | `lp.ts` | LP 포지션/트랜잭션 |
| `/api/farming` | `farming.ts` | 이자 농사 포지션/리워드 |
| `/api/import` | `import.ts` | CSV 임포트 (Binance, Upbit, Bithumb 등 7개) |
| `/api/portfolio` | `portfolio.ts` | 포트폴리오 대시보드 |
| `/api/defillama` | `defillama.ts` | DefiLlama 프로토콜 데이터 |
| `/api/data` | `data-sync.ts` | 데이터 동기화/토큰/주소/풀/팜/가격 조회 |
| `/api/balance` | `balance.ts` | 잔액 조회 |
| `/api/defi` | `defi.ts` | DeFi 포지션 종합 |

### 4.2 주요 API 패턴

```
GET    /api/wallets                    # 지갑 목록
POST   /api/wallets                    # 지갑 추가
POST   /api/sync/:address             # 동기화 시작
GET    /api/transactions/:address      # 트랜잭션 목록 (필터, 페이지네이션)
POST   /api/transactions/manual        # 수동 트랜잭션
GET    /api/pnl/:address              # PnL 분석
GET    /api/tax/:address/calculate     # 세금 계산
GET    /api/portfolio/:address         # 포트폴리오 조회
GET    /api/hyperliquid/:address       # HL 데이터
GET    /api/export/csv/transactions    # CSV 내보내기
POST   /api/import/csv                # CSV 임포트
```

---

## 5. 핵심 서비스

### 5.1 SyncService (`sync.ts`)

통합 동기화 오케스트레이터. 모든 체인의 데이터 수집을 관리.

```
기능:
├── syncWallet(address, options)    # 전체 체인 병렬 동기화
├── syncChain(address, chainId)     # 단일 체인 동기화
├── ensureWallet(address)           # 지갑 존재 확인/생성
└── 증분 동기화                      # 마지막 블록 이후만 조회

HyperEVM 특화:
├── 페이지네이션 기반 전체 이력 수집
├── 체크포인트 저장 (중단 시 재개 가능)
├── 6단계 진행 상태: transactions → transfers → internal → merging → enriching → saving
└── 진행률: 0-45% 트랜잭션, 45-90% 전송, 90-100% 저장
```

### 5.2 ClassifierService (`classifier.ts`)

트랜잭션 유형 분류기. 컨트랙트 주소, 함수 시그니처, 이벤트 로그 기반.

```
입력: { to, from, input, value, logs }
출력: { type, protocol, protocolType, action, confidence }

분류 전략:
1. 단순 ETH 전송 감지 (input 없음)
2. 프로토콜 식별 (컨트랙트 주소 → 프로토콜 레지스트리)
3. 함수 시그니처 매칭 (4byte → action 매핑)
4. 이벤트 로그 분석 (Swap, Transfer, Approval 등)

TransactionType enum:
SWAP, LP_ADD, LP_REMOVE, DEPOSIT, WITHDRAW, BORROW, REPAY,
STAKE, UNSTAKE, CLAIM, WRAP, UNWRAP, TRANSFER_OUT, TRANSFER_IN,
APPROVE, CONTRACT_CALL, ...
```

### 5.3 DeFiClassifier (`defi-classifier.ts`)

HyperEVM 전용 DeFi 트랜잭션 분류기. 60+ 메서드 시그니처 매핑.

```
지원 프로토콜:
├── Uniswap V2/V3 Router       # swap*, addLiquidity*, removeLiquidity*
├── Uniswap Universal Router    # execute
├── Staking 공통                # stake, unstake, getReward, compound
├── Lending 공통 (Aave-like)    # supply, borrow, repay, withdraw
├── Permit2                     # permit
└── DB 기반 프로토콜 매칭        # defi_protocols 테이블 조회
```

### 5.4 PnLService (`pnl.ts`)

실제 자금 흐름 기반 PnL 분석 (Hyperliquid 중심).

```
출력 (PnLSummary):
├── 현금 흐름: totalDeposits, totalWithdrawals, netCashFlow
├── 트레이딩: totalRealizedPnl, totalFeesPaid, netFundingPayments
├── 계산값: netPnL (realizedPnl - fees + funding), roi
├── 현재 상태: currentAccountValue, unrealizedPnl
└── 분석: topWinners, topLosers, monthlyPnL
```

### 5.5 PriceService (`price.ts`)

멀티소스 가격 서비스. 폴백 + 캐싱 + Rate Limit 관리.

```
가격 소스 우선순위:
1. DB 캐시 (5분 TTL)
2. Hyperliquid (퍼프 가격)
3. DEX Screener (온체인 가격)
4. CoinMarketCap
5. CoinGecko
6. Fallback (하드코딩)

HyperEVM 토큰 매핑:
HYPE → hyperliquid, USDC → usd-coin, ...
```

### 5.6 PortfolioService (`portfolio.ts`)

다중 소스 포트폴리오 통합.

```
데이터 소스:
├── token_balances    (온체인 토큰)
├── nft_holdings      (NFT)
├── lp_positions      (LP 포지션)
├── cex_trades        (CEX 자산)
└── perp_positions    (퍼프 포지션)

출력 (PortfolioSummary):
├── holdings: [{ asset, amount, valueUsd, allocation, source }]
├── byChain: { chainId: { valueUsd, assets } }
├── byType: { type: { valueUsd, count } }
└── bySource: { source: { valueUsd, count } }
```

### 5.7 Cost Basis 모듈 (`cost-basis/`)

4가지 원가 계산 방법 지원.

```
방법:
├── FIFO  (선입선출) — 한국 기본값
├── LIFO  (후입선출)
├── HIFO  (고비용 우선) — 세금 최적화용
└── AVERAGE_COST (이동평균) — 일본 기본값

데이터 흐름:
transactions → tax_lots (취득) + tax_disposals (처분)
각 처분에 lotsUsed 기록 (어떤 로트가 매칭되었는지)
```

### 5.8 Tax 모듈 (`tax/`)

7개국 세금 계산기 팩토리.

```
국가별 계산기:
├── KR (한국)    — 250만원 기본공제, 22% 세율
├── US (미국)    — 단/장기 자본이득 구분
├── JP (일본)    — 잡소득 분류, 이동평균법
├── UK (영국)    — CGT 연간 공제
├── DE (독일)    — 1년 보유 비과세
├── AU (호주)    — CGT 50% 할인 (12개월+)
└── SG (싱가포르) — 자본이득 비과세
```

### 5.9 HyperliquidService (`hyperliquid.ts`)

Hyperliquid 전용 상세 데이터 서비스.

```
기능:
├── syncAll(address)           # 트레이드 + 펀딩 전체 동기화
├── 트레이드 방향 판별          # Open Long/Short, Close Long/Short
├── 코인별 요약 집계            # 거래 수, 볼륨, 수수료, 펀딩, PnL
└── 지갑 전체 요약              # 총 거래, 총 볼륨, 순 PnL
```

### 5.10 기타 서비스

| 서비스 | 파일 | 설명 |
|--------|------|------|
| Gemini Report | `gemini-report.ts` | Gemini 2.0 Flash AI로 세금 리포트 생성 |
| CSV Importer | `csv-importer.ts` | Binance, Upbit, Bithumb, Koinly, CoinTracker, Bybit, OKX 파싱 |
| LP Analytics | `lp-analytics/` | LP 포지션, 비영구적 손실, 집중 유동성 |
| NFT Service | `nft/` | NFT 추적, 분류, 원가, 가치 평가 |
| Yield Farming | `yield-farming/` | 리워드 추적, 베스팅, 수익 분류 |
| Label Service | `label-service.ts` | 주소 라벨링 (CEX/DEX/컨트랙트 식별) |
| DefiLlama | `defillama.ts` | 6900+ 프로토콜 데이터 캐싱 |
| Data Sync | `data-sync.ts` | 토큰, 주소, LP 풀, 팜, 가격 히스토리 동기화 |
| Wash Sale | `wash-sale.ts` | 워시 세일 규칙 감지 |
| Tax Loss Harvesting | `tax-loss-harvesting.ts` | 세금 손실 수확 기회 분석 |
| Transfer Detection | `transfer-detection/` | 내부 이체 vs 외부 이체 구분 |

---

## 6. 외부 클라이언트

### 6.1 블록체인 데이터

| 클라이언트 | 파일 | 용도 |
|-----------|------|------|
| **Etherscan V2** | `etherscan-v2.ts` | 35+ EVM 체인 트랜잭션/토큰 전송/내부 트랜잭션 |
| **Hyperscan** | `hyperscan.ts` | HyperEVM 전용 (Etherscan 호환) |
| **Hyperliquid** | `hyperliquid.ts` | 퍼프 트레이드, 펀딩, 포지션, 잔액, 원장 |

### 6.2 가격 데이터

| 클라이언트 | 파일 | 용도 |
|-----------|------|------|
| **CoinGecko** | `coingecko.ts` | 토큰 가격, 메타데이터, 히스토리 |
| **CoinMarketCap** | `coinmarketcap.ts` | 토큰 가격 (CoinGecko 폴백) |
| **DEX Screener** | `dexscreener.ts` | 온체인 DEX 가격 |

### 6.3 퍼프 DEX

| 클라이언트 | 파일 | 용도 |
|-----------|------|------|
| **GRVT** | `grvt.ts` | GRVT 퍼프 거래 데이터 |
| **Lighter** | `lighter.ts` | Lighter 퍼프 거래 데이터 |
| **Pacifica** | `pacifica.ts` | Pacifica 퍼프 거래 데이터 |

### 6.4 Rate Limiter (`rate-limiter.ts`)

API 요청 제한 관리. 소스별 쿨다운 (1분 기본 → 30분 최대, 지수 백오프).

---

## 7. 어댑터 구조

### 7.1 ChainAdapter 인터페이스

`@tax/shared` 패키지에 정의된 공통 인터페이스.

```typescript
interface ChainAdapter {
  chainId: string;
  chainName: string;
  chainType: 'evm' | 'perp' | 'cosmos';

  getBalance(address: string): Promise<Balance>;
  getTokenBalances(address: string): Promise<TokenBalance[]>;
  getTransactions(address: string, options?: SyncOptions): Promise<UnifiedTransaction[]>;
}
```

### 7.2 어댑터 레지스트리 (`registry.ts`)

```
초기화 시 등록:
├── HyperliquidAdapter  (non-EVM, 퍼프)
├── HyperEvmAdapter     (EVM, Hyperscan 사용)
└── EVMAdapter × N      (EVM 팩토리, Etherscan V2 사용)

동적 등록:
├── initialize()         # 인기 체인 자동 로드
├── register(adapter)    # 수동 등록
├── get(chainId)         # ID로 조회
├── getEVM(chainId)      # 네이티브 체인 ID로 EVM 어댑터 조회 (온디맨드 생성)
└── getByType(type)      # 타입별 조회
```

### 7.3 어댑터 목록

| 어댑터 | 체인 | 타입 | 데이터 소스 |
|--------|------|------|-----------|
| `HyperEvmAdapter` | HyperEVM (999) | evm | Hyperscan API + DeFi 분류 |
| `HyperliquidAdapter` | Hyperliquid | perp | Hyperliquid API |
| `EVMAdapter` (팩토리) | 35+ EVM 체인 | evm | Etherscan V2 API |

### 7.4 퍼프 어댑터 (`perp/`)

| 어댑터 | 설명 |
|--------|------|
| `hyperliquid.ts` | Hyperliquid 퍼프 |
| `grvt.ts` | GRVT |
| `lighter.ts` | Lighter |
| `pacifica.ts` | Pacifica |
| `registry.ts` | 퍼프 어댑터 레지스트리 |

---

## 8. 데이터 파이프라인

### 8.1 전체 흐름

```
① 지갑 연결
   POST /api/wallets { address }
   └── wallets 테이블에 저장

② 동기화 시작
   POST /api/sync/:address
   └── SyncService.syncWallet()
       ├── 체인별 어댑터 선택 (AdapterRegistry)
       ├── 체인별 병렬 동기화
       │   ├── HyperEVM: 페이지네이션 + 체크포인트
       │   ├── Hyperliquid: 트레이드 + 펀딩
       │   └── EVM chains: Etherscan V2 API
       ├── sync_states 업데이트 (진행률, 상태)
       └── transactions 테이블에 통합 저장

③ 트랜잭션 분류
   ClassifierService.classify()
   ├── 프로토콜 식별 (컨트랙트 → 프로토콜 레지스트리)
   ├── 액션 분류 (함수 시그니처 → TransactionType)
   ├── DeFi 분류 (DeFiClassifier, 60+ 메서드 시그니처)
   └── 결과: { type, protocol, action, confidence }

④ 가격 조회
   PriceService.getPrice()
   ├── 캐시 확인 (5분 TTL)
   ├── 멀티소스 폴백: HL → DEX Screener → CMC → CoinGecko
   └── price_cache 저장

⑤ 포트폴리오 계산
   PortfolioService.getPortfolio()
   ├── 온체인 잔액 (token_balances)
   ├── NFT (nft_holdings)
   ├── LP 포지션 (lp_positions)
   ├── CEX 자산 (cex_trades)
   ├── 퍼프 포지션 (perp_positions)
   └── 통합 → holdings + allocation + byChain/Type/Source

⑥ PnL 계산
   PnLService.getPnLAnalysis()
   ├── 입출금 조회
   ├── 실현 PnL (트레이드 기반)
   ├── 펀딩비 수익
   ├── 수수료
   └── 월별/코인별 분석

⑦ 세금 계산
   a. 원가 계산: CostBasisEngine
      ├── 취득 트랜잭션 → tax_lots 생성
      ├── 처분 트랜잭션 → 로트 매칭 (FIFO/LIFO/HIFO/AVG)
      └── tax_disposals 기록 (gain, holdingPeriod, isLongTerm)

   b. 국가별 세금: TaxCalculatorFactory
      ├── tax_settings에서 국가/방법 조회
      ├── 해당 국가 계산기 선택
      └── 결과: 과세소득, 공제, 예상 세액

⑧ 리포트 생성
   ├── CSV/PDF 내보내기 (export/)
   ├── AI 리포트 (Gemini)
   └── 세금 신고서 양식 (form-generators/)
```

### 8.2 동기화 상세 (HyperEVM)

```
SyncService.syncChain(address, 'hyperevm')
│
├── 1. 기존 sync_state 확인 (증분 동기화)
│   └── lastSyncedBlock, syncCheckpoint 조회
│
├── 2. HyperEvmAdapter.getTransactions()
│   ├── Hyperscan에서 트랜잭션 가져오기 (페이지네이션)
│   ├── 토큰 전송 가져오기
│   ├── 내부 트랜잭션 가져오기
│   ├── DeFiClassifier로 각 트랜잭션 분류
│   └── 체크포인트 저장 (중단 시 재개용)
│
├── 3. 트랜잭션 머지 + 인리칭
│   ├── 동일 txHash 트랜잭션 병합
│   ├── assetsIn/assetsOut 계산
│   ├── totalValueUsd 계산 (PriceService)
│   └── fee/feeUsd 계산
│
└── 4. DB 저장
    ├── transactions 테이블 UPSERT
    └── sync_states 업데이트 (completed, lastSyncedBlock)
```

---

## 9. HyperView 확장 포인트

### 9.1 기존 코드 재사용 (그대로 사용 가능)

| 모듈 | 재사용 부분 | HyperView 용도 |
|------|-----------|---------------|
| **SyncService** | 전체 | 지갑 연결 시 데이터 수집 (온보딩 "30초 스캔") |
| **ClassifierService** | 전체 | 트랜잭션 분류 → 활동 패턴 분석 |
| **DeFiClassifier** | 전체 | DeFi 상호작용 프로토콜 식별 |
| **PnLService** | 전체 | PnL 대시보드, 트레이딩 성적표 |
| **PriceService** | 전체 | 가격 조회 (포트폴리오, PnL) |
| **PortfolioService** | 전체 | 포트폴리오 대시보드 |
| **CostBasisEngine** | 전체 | 세금 리포트 |
| **Tax Calculators** | 전체 (7개국) | 세금 계산 |
| **HyperliquidService** | 전체 | HL 트레이드 분석, 고래 추적 |
| **CSV Importer** | 전체 | CSV 임포트 기능 |
| **Export** | 전체 | CSV/PDF 내보내기 |
| **Gemini Report** | 전체 | AI 세금 리포트 |
| **AdapterRegistry** | 전체 | 멀티체인 지원 |
| **DefiLlama** | 전체 | 프로토콜 디렉토리 데이터 |
| **DB Schema** | 33개 테이블 전부 | 기존 데이터 레이어 |

### 9.2 확장이 필요한 기존 모듈

| 모듈 | 확장 내용 | 이유 |
|------|---------|------|
| **wallets 테이블** | 유저 정보 추가 (등급, 레퍼럴 코드 등) | wallets → users 확장 or 별도 테이블 |
| **SyncService** | 동기화 후 등급 산정 트리거 | 동기화 완료 → 포인트 부여 훅 |
| **PnLService** | 기간별 랭킹 데이터 생성 | 리더보드용 집계 |
| **PortfolioService** | 유휴 자산 감지 로직 | 맞춤 프로토콜 추천용 |
| **transactions 테이블** | 인덱스 추가 (볼륨, 기간 집계용) | 등급 산정 쿼리 최적화 |

### 9.3 신규 구현 필요 (PRD 기반)

| 모듈 | 설명 | 우선순위 |
|------|------|---------|
| **UserService** | 유저 가입, 인증, 프로필, 등급 산정 | P0 |
| **PointService** | 포인트 원장, 잔액, 일일 적립, 소멸 | P0 |
| **ReferralService** | 레퍼럴 코드 생성, 2단계 추적, 보상 | P0 |
| **TierService** | 온체인 이력 기반 등급 산정 (Bronze→Diamond) | P0 |
| **WrappedService** | 트레이딩 성적표 이미지 생성 | P0 |
| **LeaderboardService** | PnL/볼륨/포인트/레퍼럴 랭킹 | P1 |
| **WhaleTrackerService** | 대규모 거래 감지/알림 | P1 |
| **ProtocolDirectoryService** | 프로토콜 디렉토리 (Featured, 추천) | P0 (Phase 2) |
| **CampaignService** | 광고 캠페인 관리, 노출/클릭/전환 추적 | P1 (Phase 2) |
| **ReviewService** | 프로토콜 리뷰 작성/조회/모더레이션 | P1 (Phase 2) |
| **RewardDistributionService** | 수익 분배 계산, USDC 클레임 | P0 (Phase 3) |
| **TransparencyService** | 수익/분배 현황 공개 | P0 (Phase 3) |

### 9.4 신규 DB 테이블 (PRD 참조)

```
users, point_ledger, point_balances, referrals,
protocols, campaigns, conversions, reviews,
monthly_distributions, user_distributions
```

> 상세 스키마는 PRD.md §8.2 참조.

### 9.5 신규 API 엔드포인트 (PRD 참조)

```
/api/users/*, /api/points/*, /api/referral/*,
/api/protocols/*, /api/campaigns/*,
/api/rewards/*, /api/transparency/*,
/api/leaderboard/*, /api/whale/*
```

> 상세 엔드포인트는 PRD.md §8.3 참조.

### 9.6 아키텍처 다이어그램 (확장 후)

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                         │
│  Landing │ Dashboard │ Tax │ Protocol │ Reward │ Leaderboard │
├─────────────────────────────────────────────────────────────┤
│                    API Layer (Hono)                           │
│  ┌─────────────────┐  ┌──────────────────────────────────┐  │
│  │  기존 API (25개)  │  │  신규 API                        │  │
│  │  /sync, /tax,    │  │  /users, /points, /referral,    │  │
│  │  /pnl, /portfolio│  │  /protocols, /campaigns,        │  │
│  │  /hyperliquid,   │  │  /rewards, /transparency,       │  │
│  │  /export, ...    │  │  /leaderboard, /whale           │  │
│  └─────────────────┘  └──────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Service Layer                              │
│  ┌──────────────────┐ ┌──────────────────┐ ┌─────────────┐  │
│  │  기존 서비스       │ │  플랫폼 서비스     │ │  광고 서비스  │  │
│  │  sync, classifier │ │  user, point,    │ │  campaign,  │  │
│  │  pnl, price,     │ │  tier, referral, │ │  conversion,│  │
│  │  portfolio,      │ │  leaderboard,    │ │  review,    │  │
│  │  cost-basis, tax │ │  whale, wrapped  │ │  targeting  │  │
│  └──────────────────┘ └──────────────────┘ └─────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │  PostgreSQL   │ │    Redis     │ │     HyperEVM         │ │
│  │  기존 33 테이블│ │  세션, 캐시   │ │  Revenue Vault       │ │
│  │  + 신규 10    │ │  Rate Limit  │ │  Distribution        │ │
│  └──────────────┘ └──────────────┘ └──────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    External APIs                             │
│  Etherscan V2 │ Hyperliquid │ CoinGecko │ CMC │ DefiLlama  │
│  Hyperscan    │ DEX Screener│ GRVT/Lighter/Pacifica         │
└─────────────────────────────────────────────────────────────┘
```

---

**문서 버전**: 1.0
**작성일**: 2025-02-13
**대상 코드**: `tax/packages/api/` (Crypto Tax Tracker API)
**관련 문서**: [PRD.md](./PRD.md)
