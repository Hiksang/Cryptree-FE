# HyperView: 전체 아키텍처 & 운영 가이드

> Phase 3 기준 확정 아키텍처. 유저 플로우, 데이터 흐름, MVP 갭 분석 포함.

---

## 1. 확정 스택

```
Frontend:     Next.js 16 (App Router) → Vercel 배포
Auth:         Privy (@privy-io/react-auth)
DB:           PostgreSQL 16 (Docker → 추후 Supabase 전환 가능)
Cache:        Redis 7 (Docker)
ORM:          Drizzle ORM + postgres 드라이버
Worker:       Node.js (Docker) — 트랜잭션 수집, 배치 처리
Tunnel:       ngrok (Docker) — 웹훅 수신
Blockchain:   Etherscan V2 API (멀티체인) + Blockscout (fallback)
State:        Zustand (클라이언트) + React Query (서버)
Styling:      Tailwind CSS 4
Charts:       Recharts
```

### 비용 구조

| 서비스 | 용도 | 비용 |
|--------|------|------|
| Vercel | Next.js 호스팅 | 무료 |
| Privy | 인증 (지갑+이메일) | 무료 (1K MAU) |
| Supabase | PostgreSQL DB | 무료 (500MB) |
| Etherscan | 블록체인 API | 무료 (3 calls/sec) |
| ngrok | 웹훅 터널 | 무료 (고정 도메인 1개) |
| Docker (로컬 맥) | Worker + Redis | 전기세만 |
| **합계** | | **$0/월** |

---

## 2. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────────┐
│                          유저 브라우저                                │
└──────────┬──────────────────────────────────┬───────────────────────┘
           │ HTTPS                            │ HTTPS
           ▼                                  ▼
┌─────── Privy ──────┐          ┌──────── Vercel ─────────────────────┐
│  인증 서버 (SaaS)   │◄────────│  Next.js 16 (App Router)            │
│  - 지갑/이메일 로그인│         │  ├── middleware.ts (인증 가드)        │
│  - JWT 발급         │─────────►  ├── /dashboard/* (CSR 페이지 10개)  │
│  - 세션 관리        │          │  ├── /api/dashboard/* (API 10개)    │
└────────────────────┘          │  └── Drizzle ORM                    │
                                └──────────┬──────────────────────────┘
                                           │ DATABASE_URL
                                           ▼
                                ┌─── PostgreSQL ──────────────────────┐
                                │  users, wallets, transactions,      │
                                │  scan_jobs, point_balances,         │
                                │  point_ledger, shop_products,       │
                                │  exchange_history                   │
                                └──────────▲──────────────────────────┘
                                           │ DATABASE_URL
               ┌──────── Docker (로컬 맥) ──┴──────────────────────────┐
               │                                                       │
               │  ┌─── Worker (Express :4000) ──────────────────────┐ │
               │  │  /webhook/wallet-added  ← Next.js API 호출      │ │
               │  │  /scan                  ← 수동 트리거            │ │
               │  │  Cron: 30분 증분 스캔                             │ │
               │  │  Cron: 매일 포인트 배치                           │ │
               │  └──────┬────────────┬─────────────────────────────┘ │
               │         │            │                                │
               │         ▼            ▼                                │
               │   Etherscan V2   Blockscout                           │
               │   (2.5/sec)      (4/sec, 인스턴스별)                   │
               │                                                       │
               │  ┌──────────┐ ┌───────────┐ ┌──────────┐            │
               │  │ postgres │ │  redis     │ │  ngrok   │            │
               │  │ :5432    │ │  :6379     │ │  :4040   │            │
               │  └──────────┘ └───────────┘ └──────────┘            │
               └───────────────────────────────────────────────────────┘
```

### 핵심 원칙

- **외부 노출**: Vercel(Next.js)과 ngrok 엔드포인트만
- **DB 접근**: Next.js API Routes + Worker 모두 같은 PostgreSQL 사용
- **인증**: 커스텀 미들웨어가 /dashboard/* 보호, API는 Privy 토큰 검증
- **Worker**: Docker 내부 네트워크에서만 DB/Redis 접근

---

## 3. 유저 플로우 & API 콜 상세

### 3.1 회원가입 & 로그인

```
유저                    브라우저                  Privy                Next.js
 │                       │                        │                     │
 │  hyperview.com 접속    │                        │                     │
 │──────────────────────►│  GET /dashboard         │                     │
 │                       │───────────────────────────────────────────────►│
 │                       │                        │    middleware.ts     │
 │                       │                        │◄── auth.protect() ──│
 │                       │                        │   "인증 안됨"        │
 │                       │◄──── 302 /sign-in ────────────────────────────│
 │                       │                        │                     │
 │  이메일/Google 로그인  │                        │                     │
 │──────────────────────►│── POST 인증 요청 ──────►│                     │
 │                       │                        │  유저 생성/검증      │
 │                       │◄── JWT 토큰 (쿠키) ────│                     │
 │                       │                        │                     │
 │                       │  GET /dashboard (쿠키 포함)                   │
 │                       │───────────────────────────────────────────────►│
 │                       │                        │    middleware.ts     │
 │                       │                        │◄── auth.protect() ──│
 │                       │                        │   "인증 OK ✓"       │
 │                       │◄──── 200 대시보드 HTML ──────────────────────│
```

- Privy이 모든 인증을 처리 (코드 작성 불필요)
- `middleware.ts`가 `/dashboard/*` 경로를 `auth.protect()`로 보호
- JWT 토큰은 쿠키로 자동 관리, 프론트엔드 코드 변경 없음

### 3.2 대시보드 진입 (데이터 로딩)

```
브라우저                          Next.js API                    DB
 │                                  │                            │
 │  /dashboard 페이지 렌더링         │                            │
 │  useDashboardStats() 훅 실행     │                            │
 │                                  │                            │
 │  GET /api/dashboard/stats        │                            │
 │─────────────────────────────────►│                            │
 │                                  │  auth() → userId 추출       │
 │                                  │  SELECT FROM wallets       │
 │                                  │  WHERE user_id = {userId}  │
 │                                  │─────────────────────────────►│
 │                                  │◄── 지갑 + 트랜잭션 데이터 ──│
 │                                  │  통계 계산                   │
 │◄── JSON { stats, insights } ────│                            │
 │                                  │                            │
 │  React Query 캐시 (30초)         │                            │
 │  화면에 통계 카드 렌더링          │                            │
```

각 페이지 이동 시 해당 API 1건씩 호출:

| 페이지 | API 콜 | 데이터 |
|--------|--------|--------|
| `/dashboard` | `GET /api/dashboard/stats` | 총 자산, 변동률, 인사이트 |
| `/dashboard/portfolio` | `GET /api/dashboard/portfolio` | 토큰별 보유량, 체인별 분포 |
| `/dashboard/pnl` | `GET /api/dashboard/pnl` | 기간별 수익률 차트 |
| `/dashboard/transactions` | `GET /api/dashboard/transactions` | 거래 내역, 페이지네이션 |
| `/dashboard/tax` | `GET /api/dashboard/tax` | 세금 보고서, 과세 이벤트 |
| `/dashboard/rewards` | `GET /api/dashboard/rewards` | 포인트, 리워드, 미션 |
| `/dashboard/referral` | `GET /api/dashboard/referral` | 추천 코드, 초대 현황 |
| `/dashboard/leaderboard` | `GET /api/dashboard/leaderboard` | 전체 유저 랭킹 |
| `/dashboard/exchange` | `GET /api/dashboard/exchange` | 포인트샵, 상품, 교환 내역 |
| `/dashboard/settings` | `GET /api/dashboard/settings` | 설정, 연결된 지갑 목록 |

### 3.3 지갑 추가 → 풀스캔 (핵심 플로우)

```
유저          브라우저              Next.js API            Worker            Etherscan/Blockscout
 │              │                     │                     │                      │
 │ 지갑 주소    │                     │                     │                      │
 │ 입력         │                     │                     │                      │
 │─────────────►│                     │                     │                      │
 │              │ POST /api/wallets   │                     │                      │
 │              │ { address: "0x..." }│                     │                      │
 │              │────────────────────►│                     │                      │
 │              │                     │ 1. auth() → userId  │                      │
 │              │                     │ 2. INSERT wallets   │                      │
 │              │                     │ 3. POST worker:4000/│                      │
 │              │                     │    webhook/wallet-  │                      │
 │              │                     │    added            │                      │
 │              │                     │────────────────────►│                      │
 │              │                     │                     │ fullScanWallet()     │
 │              │◄── { ok: true } ───│                     │ (비동기 실행)         │
 │              │                     │                     │                      │
 │ toast:       │                     │                     │                      │
 │ "스캔 중..." │                     │                     │  ┌── 6체인 병렬 ─────┐│
 │              │                     │                     │  │                   ││
 │              │                     │                     │  │ Ethereum (id=1)   ││
 │              │                     │                     │  │  GET txlist ──────►│
 │              │                     │                     │  │  ◄── 일반 TX ─────│
 │              │                     │                     │  │  GET tokentx ─────►│
 │              │                     │                     │  │  ◄── 토큰 전송 ───│
 │              │                     │                     │  │                   ││
 │              │                     │                     │  │ Arbitrum (42161)  ││
 │              │                     │                     │  │ Base (8453)       ││
 │              │                     │                     │  │ Optimism (10)     ││
 │              │                     │                     │  │ Polygon (137)     ││
 │              │                     │                     │  │ HyperEVM (999)    ││
 │              │                     │                     │  └───────────────────┘│
 │              │                     │                     │                      │
 │              │                     │                     │ ★ 전역 rate limiter  │
 │              │                     │                     │   6체인 × 2콜 = 12콜  │
 │              │                     │                     │   ÷ 2.5/sec          │
 │              │                     │                     │   ≈ 5초 소요          │
 │              │                     │                     │                      │
 │              │                     │                     │ 트랜잭션 분류:        │
 │              │                     │                     │ swap, transfer,      │
 │              │                     │                     │ stake, mint, bridge  │
 │              │                     │                     │                      │
 │              │                     │                     │ INSERT transactions  │
 │              │                     │                     │ UPDATE wallets       │
 │              │                     │                     │ (lastScannedBlock)   │
 │              │                     │                     │                      │
 │ 새로고침     │ GET /api/dashboard/ │                     │                      │
 │─────────────►│ transactions        │                     │                      │
 │              │────────────────────►│ SELECT transactions │                      │
 │              │◄── 거래 내역 ──────│ WHERE user_id = ... │                      │
 │ 데이터 표시  │                     │                     │                      │
```

### 3.4 증분 스캔 (30분마다 자동)

```
Cron (*/30 * * * *)      Worker                   DB                 Etherscan
    │                      │                       │                     │
    │ 30분마다 트리거       │                       │                     │
    │─────────────────────►│                       │                     │
    │                      │ SELECT wallets        │                     │
    │                      │ WHERE lastScannedAt   │                     │
    │                      │   < NOW() - 30분      │                     │
    │                      │──────────────────────►│                     │
    │                      │◄── 스캔 필요한 지갑들 ──│                     │
    │                      │                       │                     │
    │                      │ 유저 A 지갑 3개        │                     │
    │                      │ 유저 B 지갑 1개        │                     │
    │                      │ 유저 C 지갑 2개        │                     │
    │                      │ = 총 6개 지갑          │                     │
    │                      │                       │                     │
    │                      │ 순차 처리 (지갑별)     │                     │
    │                      │ 각 지갑: 6체인 병렬    │                     │
    │                      │   startBlock = last+1  │                     │
    │                      │                       │                     │
    │                      │ 6지갑 × 6체인 × 2콜    │                     │
    │                      │ = 72 API 콜            │                     │
    │                      │ ÷ 2.5/sec             │                     │
    │                      │ ≈ 29초 소요            │                     │
    │                      │──────────────────────────────────────────────►│
    │                      │                       │                     │
    │                      │ INSERT new txs         │                     │
    │                      │ UPDATE lastScannedAt   │                     │
    │                      │──────────────────────►│                     │
```

#### 유저 수별 스캔 시간 추정 (Etherscan Free 2.5/sec 기준)

| 유저 수 | 지갑 수 | API 콜 (30분 주기) | 소요 시간 | 상태 |
|---------|--------|-------------------|----------|------|
| 10 | ~20 | 240 | ~1.5분 | OK |
| 50 | ~100 | 1,200 | ~8분 | OK |
| 200 | ~400 | 4,800 | ~32분 | **주기 초과** |
| 500+ | ~1,000 | 12,000 | ~80분 | Etherscan 유료 필요 |

→ 유저 200명 시점에서 Etherscan Lite($49/mo, 5/sec) 또는 Blockscout primary 전환 고려.

### 3.5 포인트 적립 (매일 00:00 배치)

```
Cron (0 0 * * *)          Worker                        DB
 │                          │                            │
 │ 매일 자정 트리거          │                            │
 │─────────────────────────►│                            │
 │                          │                            │
 │                          │ 1. 광고 수익 집계           │
 │                          │    (TODO: 광고 API 연동)    │
 │                          │    임시: $500/일            │
 │                          │                            │
 │                          │ 2. 유저 풀 계산             │
 │                          │    $500 × 40% = $200       │
 │                          │    $200 × 100P = 20,000P   │
 │                          │                            │
 │                          │ 3. 활성 유저 조회           │
 │                          │    SELECT DISTINCT userId  │
 │                          │    FROM transactions       │
 │                          │    WHERE timestamp > 24h   │
 │                          │───────────────────────────►│
 │                          │◄── userA:15tx, B:8tx, C:2tx│
 │                          │                            │
 │                          │ 4. 활동량 비례 분배         │
 │                          │    A: 60% → 12,000P        │
 │                          │    B: 32% → 6,400P         │
 │                          │    C: 8%  → 1,600P         │
 │                          │                            │
 │                          │ 5. INSERT point_ledger     │
 │                          │    UPSERT point_balances   │
 │                          │───────────────────────────►│
```

### 3.6 포인트 교환

```
유저           브라우저                 Next.js API              DB
 │               │                       │                       │
 │ 5,000P →      │                       │                       │
 │ 50 USDC 교환  │                       │                       │
 │──────────────►│ POST /api/dashboard/  │                       │
 │               │ exchange              │                       │
 │               │ { points: 5000,       │                       │
 │               │   type: "usdc" }      │                       │
 │               │──────────────────────►│                       │
 │               │                       │ 1. auth() → userId    │
 │               │                       │ 2. SELECT balance     │
 │               │                       │    FROM point_balances│
 │               │                       │───────────────────────►│
 │               │                       │◄── balance: 8,200P ──│
 │               │                       │                       │
 │               │                       │ 3. 잔고 >= 5000? ✓    │
 │               │                       │                       │
 │               │                       │ 4. UPDATE balance     │
 │               │                       │    -= 5000            │
 │               │                       │ 5. INSERT point_ledger│
 │               │                       │    { -5000, exchange }│
 │               │                       │ 6. INSERT exchange_   │
 │               │                       │    history            │
 │               │                       │───────────────────────►│
 │               │                       │                       │
 │               │◄── { ok: true } ─────│                       │
 │ toast:        │                       │                       │
 │ "교환 완료!"   │                       │                       │
```

---

## 4. 프로젝트 구조

```
hyper-ad-platform/
├── INFRASTRUCTURE.md              ← 이 문서
├── docker-compose.yml              # postgres + redis + worker + ngrok
├── .env.docker                     # Docker 환경변수 (gitignore)
│
├── db/
│   ├── init.sql                    # 전체 DB 스키마 (8 테이블)
│   └── seed.sql                    # 개발용 시드 데이터
│
├── worker/                         # 백그라운드 워커 서비스
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                # 진입점 (서버 + 크론 시작)
│       ├── server.ts               # Express 웹훅 수신 서버
│       ├── cron.ts                 # 주기적 스캔 스케줄러
│       ├── scanner.ts              # Etherscan + Blockscout 트랜잭션 수집
│       ├── batch/
│       │   └── points.ts           # 광고수익 포인트 분배
│       └── lib/
│           ├── db.ts               # Drizzle ORM 인스턴스
│           ├── schema.ts           # Drizzle 스키마
│           ├── etherscan.ts        # Etherscan V2 API 클라이언트
│           ├── blockscout.ts       # Blockscout API 클라이언트
│           ├── chains.ts           # 지원 체인 설정 (6개)
│           └── rate-limiter.ts     # 전역 API rate limiter
│
└── web/                            # Next.js 프론트엔드
    ├── package.json
    ├── drizzle.config.ts
    ├── middleware.ts                # Privy 인증 가드
    ├── app/
    │   ├── sign-in/                # 로그인 페이지
    │   ├── sign-up/                # 회원가입 페이지
    │   ├── dashboard/              # 10개 대시보드 페이지
    │   └── api/dashboard/          # 10개 API 라우트
    ├── components/
    │   ├── providers/              # Privy, React Query Provider
    │   └── dashboard/              # 대시보드 컴포넌트
    └── lib/
        ├── db.ts                   # Drizzle ORM 인스턴스
        ├── schema.ts               # Drizzle 스키마
        ├── types.ts                # 프론트엔드 타입
        ├── mock-data.ts            # Mock 데이터 (개발용)
        ├── api-client.ts           # API 클라이언트
        ├── hooks/                  # React Query 훅
        └── store.ts                # Zustand 스토어
```

---

## 5. 데이터 모델

### 핵심 관계

```
users (1)
  ├── wallets (N)                   1 유저 = 여러 지갑
  │     └── transactions (N)        1 지갑 = 여러 트랜잭션
  ├── point_balances (1)            1 유저 = 1 포인트 잔고
  ├── point_ledger (N)              1 유저 = 여러 포인트 기록
  └── exchange_history (N)          1 유저 = 여러 교환 기록

shop_products                       전체 공유 (상품 카탈로그)
scan_jobs                           스캔 작업 추적
```

### 테이블 목록

| 테이블 | 설명 | 접근 주체 |
|--------|------|----------|
| `users` | Privy 연동 유저 | Web + Worker |
| `wallets` | 유저 지갑 (N개) | Web + Worker |
| `transactions` | 수집된 온체인 트랜잭션 | Worker(쓰기), Web(읽기) |
| `scan_jobs` | 스캔 작업 상태 추적 | Worker |
| `point_balances` | 유저 포인트 잔고 | Web + Worker |
| `point_ledger` | 포인트 적립/차감 원장 | Web + Worker |
| `shop_products` | 상품 카탈로그 | Web |
| `exchange_history` | 교환 기록 | Web |

---

## 6. API 매핑

### Next.js API Routes (Vercel)

| 엔드포인트 | 메서드 | Hook | 설명 |
|-----------|--------|------|------|
| `/api/dashboard/stats` | GET | `useDashboardStats` | 대시보드 요약 통계 |
| `/api/dashboard/portfolio` | GET | `usePortfolio` | 포트폴리오 (전 지갑 합산) |
| `/api/dashboard/pnl` | GET | `usePnl` | PnL 분석 (기간별) |
| `/api/dashboard/tax` | GET | `useTaxReport` | 세금 보고서 |
| `/api/dashboard/transactions` | GET | `useTransactions` | 거래 내역 (전 지갑 합산) |
| `/api/dashboard/settings` | GET | `useSettings` | 설정 + 지갑 목록 |
| `/api/dashboard/rewards` | GET | `useRewards` | 리워드 현황 |
| `/api/dashboard/referral` | GET | `useReferral` | 추천 현황 |
| `/api/dashboard/leaderboard` | GET | `useLeaderboard` | 리더보드 |
| `/api/dashboard/exchange` | GET | `useExchange` | 포인트샵 |
| `/api/wallets` | POST | - | 지갑 추가 → Worker 트리거 |
| `/api/wallets` | DELETE | - | 지갑 삭제 |

### Worker 엔드포인트 (Docker, ngrok 경유)

| 엔드포인트 | 메서드 | 호출 주체 | 설명 |
|-----------|--------|----------|------|
| `/webhook/wallet-added` | POST | Next.js API | 신규 지갑 → 풀스캔 트리거 |
| `/scan` | POST | 관리자 | 수동 스캔 트리거 |
| `/health` | GET | 모니터링 | 헬스체크 |

### Worker 내부 작업 (Cron)

| 작업 | 주기 | 설명 |
|------|------|------|
| 증분 스캔 | 30분 (`*/30 * * * *`) | 모든 활성 지갑의 신규 트랜잭션 수집 |
| 포인트 배치 | 매일 00:00 (`0 0 * * *`) | 광고 수익 기반 포인트 분배 |

---

## 7. 블록체인 API Rate Limit

### Etherscan V2

| 항목 | 값 |
|------|-----|
| 제한 단위 | **계정(Account)** 단위. 같은 계정의 API key는 한도 공유 |
| 체인 간 | **모든 체인 합산** (chainid 변경해도 같은 풀에서 차감) |
| Free tier | 3 calls/sec, 일 100,000건 |
| Lite ($49/mo) | 5 calls/sec, 일 100,000건 |
| Standard ($199/mo) | 10 calls/sec, 일 200,000건 |

### Blockscout

| 항목 | 값 |
|------|-----|
| 제한 단위 | **IP** 단위 (기본), API key 있으면 key별 별도 풀 |
| 체인 간 | **인스턴스별 독립** (eth ≠ base ≠ arbitrum) |
| 키 없이 | 5 req/sec (IP당) |
| API key | 10 req/sec (Etherscan 호환 API만 적용) |

### 현재 Worker 설정

```
etherscanLimiter:  2.5 calls/sec (Free tier 3/sec에 안전 마진)
blockscoutLimiter: 4 calls/sec   (인스턴스별 독립이라 실질적으로 더 여유)
```

---

## 8. 전체 API 콜 맵 요약

```
┌─────────── 유저 액션 ──────────┬──────────── API 콜 ─────────────┬──── 데이터 소스 ────┐
│                                │                                  │                    │
│ 1. 회원가입/로그인              │ Privy SDK (자동)                  │ Privy SaaS         │
│                                │                                  │                    │
│ 2. 대시보드 진입               │ GET /api/dashboard/stats         │ DB: wallets +      │
│                                │                                  │     transactions   │
│                                │                                  │                    │
│ 3. 지갑 추가                   │ POST /api/wallets                │ DB: wallets        │
│    └→ 풀스캔 트리거             │ → POST worker/webhook/           │ Etherscan +        │
│       └→ 6체인 × 2콜 = 12콜    │   wallet-added                   │ Blockscout         │
│                                │                                  │                    │
│ 4. 포트폴리오 조회              │ GET /api/dashboard/portfolio     │ DB: transactions   │
│ 5. PnL 분석                    │ GET /api/dashboard/pnl           │ DB: transactions   │
│ 6. 거래 내역                   │ GET /api/dashboard/transactions  │ DB: transactions   │
│ 7. 세금 보고서                  │ GET /api/dashboard/tax           │ DB: transactions   │
│ 8. 리워드                      │ GET /api/dashboard/rewards       │ DB: point_balances │
│ 9. 추천                        │ GET /api/dashboard/referral      │ DB: users          │
│ 10. 리더보드                    │ GET /api/dashboard/leaderboard   │ DB: users + points │
│ 11. 포인트샵                    │ GET /api/dashboard/exchange      │ DB: products +     │
│                                │                                  │     points         │
│ 12. 포인트 교환                 │ POST /api/dashboard/exchange     │ DB: points +       │
│                                │                                  │     exchange_hist  │
│ 13. 설정                       │ GET /api/dashboard/settings      │ DB: users + wallet │
│                                │                                  │                    │
│ ── 자동 (백그라운드) ──          │                                  │                    │
│ 14. 증분 스캔 (30분)            │ Worker Cron → Etherscan/Block.   │ 외부 API → DB      │
│ 15. 포인트 배치 (매일)           │ Worker Cron → DB                 │ DB                 │
└────────────────────────────────┴──────────────────────────────────┴────────────────────┘
```

---

## 9. 보안

| 계층 | 방법 |
|------|------|
| **네트워크** | DB/Redis 포트는 Docker 내부 네트워크만 접근. 외부 노출 없음 |
| **인증** | Privy 미들웨어 → /api/* 인증된 유저만 접근 |
| **DB 자격증명** | .env.docker로 관리, .gitignore에 포함 |
| **API 보안** | `auth()` 호출로 userId 확인 후 쿼리 실행 |
| **웹훅 보안** | Worker는 Docker 내부 네트워크에서만 접근 가능 |
| **입력 검증** | Zod 스키마로 모든 API 입력 검증 |
| **Rate Limit** | Redis 기반 per-user rate limiting |

---

## 10. 구현 현황 & MVP 갭 분석

### 현재 구현 상태

| 계층 | 상태 | 설명 |
|------|------|------|
| Privy 인증 | ✅ 완료 | middleware.ts + PrivyProvider + sign-in/up 페이지 |
| 프론트엔드 10개 페이지 | ✅ 완료 | React Query + Zustand + 스켈레톤/에러/토스트 |
| 포인트샵 페이지 | ✅ 완료 | 상품 그리드 + USDC 교환 + 히스토리 |
| API Routes 10개 | ⚠️ Mock | 모두 mock-data.ts 반환. DB 쿼리 미연동 |
| Worker 스캐너 | ✅ 완료 | Etherscan V2 + Blockscout + rate limiter |
| Worker 크론 | ✅ 완료 | 30분 증분 스캔 + 매일 포인트 배치 |
| Docker Compose | ✅ 완료 | postgres + redis + worker + ngrok |
| DB 스키마 | ✅ 완료 | 8개 테이블 + 인덱스 (init.sql) |
| 지갑 추가 → Worker 연동 | ❌ 미구현 | Next.js API에서 Worker 호출하는 코드 없음 |
| Mock → 실제 DB 쿼리 | ❌ 미구현 | API Route에서 Drizzle 쿼리로 교체 필요 |
| Zustand 영속화 | ❌ 미구현 | localStorage persist 미들웨어 없음 |
| Privy → DB 유저 동기화 | ❌ 미구현 | Privy 웹훅으로 users 테이블 동기화 필요 |
| 토큰 가격 조회 | ❌ 미구현 | 포트폴리오/PnL에 현재 시세 필요 |
| 지갑 삭제 API | ❌ 미구현 | DELETE /api/wallets 엔드포인트 필요 |

### MVP 운영을 위해 필요한 작업

#### P0 — 없으면 서비스 불가 (핵심 루프)

| # | 작업 | 설명 | 예상 범위 |
|---|------|------|----------|
| 1 | **Privy → DB 유저 동기화** | Privy 웹훅(user.created)으로 `users` 테이블에 자동 INSERT. 없으면 DB에 유저가 없어 모든 쿼리 실패 | Privy 웹훅 엔드포인트 1개 |
| 2 | **지갑 추가 API** | `POST /api/wallets` → DB INSERT + Worker 호출. 유저가 지갑을 등록해야 스캔 시작 | API route 1개 |
| 3 | **지갑 삭제 API** | `DELETE /api/wallets` → DB DELETE (cascade로 관련 tx 삭제) | API route 1개 |
| 4 | **API Mock → DB 쿼리 교체** | 10개 API Route가 모두 mock 데이터 반환 중. Drizzle로 실제 DB 조회하도록 교체 | API route 10개 수정 |
| 5 | **web/lib/schema.ts 동기화** | worker의 schema.ts에는 wallets, transactions 등이 있지만 web의 schema.ts에는 없음. 동일하게 맞춰야 DB 쿼리 가능 | 파일 1개 수정 |

#### P1 — 없으면 UX가 심하게 부족

| # | 작업 | 설명 | 예상 범위 |
|---|------|------|----------|
| 6 | **토큰 가격 API 연동** | 포트폴리오 자산 가치 계산에 현재 시세 필요. CoinGecko/CoinMarketCap 무료 API 사용 | 클라이언트 1개 + 크론 1개 |
| 7 | **스캔 상태 표시** | 지갑 추가 후 "스캔 중..." 상태를 보여줘야 함. scan_jobs 테이블 폴링 또는 SSE | API 1개 + 컴포넌트 수정 |
| 8 | **포인트 교환 POST API** | 현재 GET만 있음. 실제 교환 처리 (잔고 차감, 기록 저장) | API route 1개 |
| 9 | **Zustand persist** | 설정(세금 국가, 계산 방식)이 새로고침하면 초기화됨 | store.ts에 persist 미들웨어 추가 |
| 10 | **에러 핸들링 강화** | API 에러 시 유저에게 의미 있는 메시지. 잔고 부족, 스캔 실패 등 | 전반적 |

#### P2 — 운영 품질

| # | 작업 | 설명 | 예상 범위 |
|---|------|------|----------|
| 11 | **Redis 캐시 적용** | 자주 조회되는 데이터(리더보드, 통계)를 Redis에 캐시 | 유틸 함수 + API 수정 |
| 12 | **API Rate Limiting** | 유저별 API 호출 제한 (Redis counter) | 미들웨어 1개 |
| 13 | **입력 검증 (Zod)** | 모든 POST API에 Zod 스키마 적용 | 스키마 + API 수정 |
| 14 | **로깅/모니터링** | Worker 로그 구조화, 에러 알림 (Slack/Discord 웹훅) | Worker 수정 |
| 15 | **DB 마이그레이션** | Drizzle Kit 마이그레이션 플로우 정립 | drizzle.config.ts + 스크립트 |

### MVP 최소 구현 순서 (권장)

```
Step 1: Privy → DB 동기화 (P0-1)
   └→ 유저가 가입하면 DB에 자동 등록

Step 2: web schema.ts 동기화 (P0-5)
   └→ web과 worker가 같은 스키마 사용

Step 3: 지갑 추가/삭제 API (P0-2, P0-3)
   └→ 유저가 지갑 등록 가능 → Worker 스캔 트리거

Step 4: API Mock → DB 쿼리 교체 (P0-4)
   └→ 실제 데이터가 대시보드에 표시

Step 5: 토큰 가격 연동 (P1-6)
   └→ 포트폴리오에 실제 자산 가치 표시

Step 6: 포인트 교환 API (P1-8)
   └→ 포인트샵 실제 동작

→ 여기까지 하면 MVP 운영 가능
```

---

## 11. 개발 워크플로우

### 로컬 개발

```bash
# 1. Docker 서비스 시작 (postgres + redis + worker + ngrok)
cd hyper-ad-platform
docker compose --env-file .env.docker up -d

# 2. DB 초기화 (최초 1회 — docker가 init.sql 자동 실행)
# 시드 데이터 필요시:
docker compose exec postgres psql -U hyperview -d hyperview -f /seed.sql

# 3. Next.js 개발 서버
cd web
npm run dev

# 4. 상태 확인
docker compose ps              # 컨테이너 상태
docker compose logs -f worker  # 워커 로그
open http://localhost:4040     # ngrok 대시보드
```

### 배포

```bash
# Next.js → Vercel
cd web && vercel deploy

# Worker → 로컬 맥 Docker (상시 실행)
cd hyper-ad-platform
docker compose --env-file .env.docker up -d
```

---

## 12. 향후 마이그레이션 경로

### DB: Docker PostgreSQL → Supabase

```
변경점: .env.docker의 DATABASE_URL만 Supabase 연결 문자열로 교체
코드 변경: 없음 (Drizzle ORM이 추상화)
```

### Worker: 로컬 맥 → 클라우드

```
변경점: Docker 이미지를 Railway/Fly.io에 배포
비용: $5/월
```

### 스케일 업

```
Phase 1 (지금):      로컬 맥 Docker + Vercel              $0/월
Phase 2 (유저 100+): Supabase + Railway Worker            $5/월
Phase 3 (유저 1K+):  Supabase Pro + 전용 Worker           $30/월
Phase 4 (유저 10K+): Etherscan Lite + 풀 클라우드          $80/월
```

---

## 13. 운영 환경 구축 가이드

MVP를 실제로 운영하기 위해 설정해야 하는 외부 서비스와 로컬 환경.

### 13.1 Privy 설정 (인증)

**가입**: https://privy.com → 무료 계정 생성

**대시보드에서 설정할 것**:

```
1. Application 생성 → "HyperView" 이름으로 생성
2. Sign-in methods 설정:
   - Email + Password ✓
   - Google OAuth ✓ (Google Cloud Console에서 OAuth 클라이언트 ID 필요)
3. 환경 변수 복사:
   - NEXT_PUBLIC_PRIVY_APP_ID=clxxx...
   - PRIVY_APP_SECRET=secret_xxx...
4. Redirect URLs 설정:
   - Sign-in: /sign-in
   - Sign-up: /sign-up
   - After sign-in: /dashboard
   - After sign-up: /dashboard
5. Webhook 설정 (Privy → DB 유저 동기화용):
   - Endpoint URL: https://your-app.vercel.app/api/webhook/privy
   - Events: user.created, user.updated, user.deleted
   - Signing Secret 복사 → PRIVY_WEBHOOK_SECRET 환경변수
```

**Next.js 환경변수** (`.env.local`):

```env
NEXT_PUBLIC_PRIVY_APP_ID=clxxx_xxxxx
PRIVY_APP_SECRET=secret_xxxxx
PRIVY_WEBHOOK_SECRET=whsec_xxxxx
```

### 13.2 Supabase 설정 (PostgreSQL DB)

**가입**: https://supabase.com → 무료 계정 생성 (500MB DB)

**프로젝트 생성 후**:

```
1. New Project → "hyperview" 이름, 비밀번호 설정, Region: Northeast Asia (Tokyo)
2. Settings → Database → Connection string 복사:
   - Transaction mode (port 6543): API용 (Vercel에서 사용)
   - Session mode (port 5432): 마이그레이션용
3. init.sql 실행:
   - SQL Editor → New Query → db/init.sql 내용 붙여넣기 → Run
4. 시드 데이터 (선택):
   - SQL Editor → db/seed.sql 내용 실행
```

**환경변수**:

```env
# Vercel (Next.js용) — Transaction mode
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres

# Worker (Docker용) — Session mode (로컬 개발 시)
WORKER_DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres
```

**주의**: Supabase 무료 티어는 일주일간 비활성 시 DB가 일시 중지됨. 대시보드에서 수동 재시작 필요.

### 13.3 Etherscan API Key 발급

**가입**: https://etherscan.io → 무료 계정 생성

```
1. 로그인 → My Account → API Keys
2. Add → "HyperView Worker" 이름으로 생성
3. API Key Token 복사
```

**환경변수**:

```env
ETHERSCAN_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Free tier 한도**: 3 calls/sec, 일 100,000건, 모든 체인 합산.
V2 API는 하나의 키로 60+ 체인을 지원하므로 체인별로 키를 만들 필요 없음.

### 13.4 ngrok 설정 (웹훅 터널)

**가입**: https://ngrok.com → 무료 계정 생성

```
1. 로그인 → Your Authtoken 복사
2. Domains → New Domain → 무료 고정 도메인 1개 생성
   예: your-name.ngrok-free.app
3. 이 도메인이 Worker의 웹훅 수신 주소가 됨
```

**환경변수**:

```env
NGROK_AUTHTOKEN=2xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NGROK_DOMAIN=your-name.ngrok-free.app
```

### 13.5 Vercel 설정 (Next.js 배포)

**가입**: https://vercel.com → GitHub 연동

```
1. New Project → GitHub 레포 연결
2. Root Directory: hyper-ad-platform/web
3. Framework Preset: Next.js (자동 감지)
4. Environment Variables 설정:
   - NEXT_PUBLIC_PRIVY_APP_ID
   - PRIVY_APP_SECRET
   - PRIVY_WEBHOOK_SECRET
   - DATABASE_URL (Supabase Transaction mode 연결 문자열)
   - WORKER_URL (ngrok 도메인: https://your-name.ngrok-free.app)
5. Deploy
```

### 13.6 Mac Docker 설정 (Worker 운영)

**사전 요구사항**: Docker Desktop 설치 (https://docker.com)

#### 최초 설정

```bash
# 1. 프로젝트 디렉토리로 이동
cd hyper-ad-platform

# 2. .env.docker 환경변수 설정
cp .env.docker .env.docker.local
# .env.docker.local을 편집하여 실제 값 입력:
#   DB_USER=hyperview
#   DB_PASSWORD=<강력한 비밀번호>
#   REDIS_PASSWORD=<강력한 비밀번호>
#   ETHERSCAN_API_KEY=<발급받은 키>
#   NGROK_AUTHTOKEN=<발급받은 토큰>
#   NGROK_DOMAIN=<발급받은 도메인>

# 3. Docker Compose 실행
docker compose --env-file .env.docker.local up -d

# 4. 상태 확인
docker compose ps
# NAME        STATUS         PORTS
# postgres    Up (healthy)   127.0.0.1:5432->5432
# redis       Up (healthy)   127.0.0.1:6379->6379
# worker      Up             0.0.0.0:4000->4000
# ngrok       Up             0.0.0.0:4040->4040

# 5. Worker 로그 확인
docker compose logs -f worker
# [worker] All services started
# [cron] Incremental scan scheduled (every 30 minutes)
# [cron] Points distribution scheduled (daily at 00:00)

# 6. ngrok 터널 확인
open http://localhost:4040
# Forwarding: https://your-name.ngrok-free.app → worker:4000
```

#### Mac 재부팅 후 자동 시작 설정

```bash
# Docker Desktop 설정 → General → "Start Docker Desktop when you sign in to your computer" ✓

# Docker Compose가 자동으로 재시작됨 (restart: unless-stopped 설정)
# 수동으로 확인하려면:
docker compose --env-file .env.docker.local ps
```

#### Supabase 사용 시 (로컬 PostgreSQL 불필요)

```bash
# docker-compose.yml에서 postgres 서비스를 비활성화하고
# Worker의 DATABASE_URL을 Supabase 연결 문자열로 변경

# .env.docker.local 수정:
# DATABASE_URL=postgresql://postgres.xxxxx:password@supabase-host:5432/postgres

# postgres 없이 실행:
docker compose --env-file .env.docker.local up -d redis worker ngrok
```

### 13.7 전체 환경변수 체크리스트

| 환경변수 | 사용처 | 발급처 | 필수 |
|---------|--------|--------|------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | Next.js | Privy 대시보드 | ✅ |
| `PRIVY_APP_SECRET` | Next.js API | Privy 대시보드 | ✅ |
| `PRIVY_WEBHOOK_SECRET` | Next.js API | Privy 웹훅 설정 | ✅ |
| `DATABASE_URL` | Next.js + Worker | Supabase 또는 Docker | ✅ |
| `ETHERSCAN_API_KEY` | Worker | Etherscan 계정 | ✅ |
| `REDIS_PASSWORD` | Worker | 직접 설정 | ✅ |
| `NGROK_AUTHTOKEN` | ngrok 컨테이너 | ngrok 대시보드 | ✅ |
| `NGROK_DOMAIN` | ngrok 컨테이너 | ngrok 대시보드 | ✅ |
| `WORKER_URL` | Next.js API | ngrok 도메인 기반 | ✅ |

### 13.8 구축 순서 요약

```
1. Privy 가입 → 앱 생성 → 키 복사                         (5분)
2. Supabase 가입 → 프로젝트 생성 → init.sql 실행           (10분)
3. Etherscan 가입 → API Key 발급                           (3분)
4. ngrok 가입 → 고정 도메인 생성                            (3분)
5. Mac에 Docker Desktop 설치                               (5분)
6. .env.docker 환경변수 설정                                (5분)
7. docker compose up -d → Worker 실행 확인                  (5분)
8. Vercel에 Next.js 배포 → 환경변수 설정                    (10분)
9. Privy 웹훅 URL을 Vercel 도메인으로 설정                   (3분)
10. 전체 동작 테스트                                         (10분)
                                                    총 약 1시간
```
