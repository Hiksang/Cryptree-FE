# taxdao-FE 아키텍처 현황 분석 — FE/BE 역할 정리

> taxdao-FE의 현재 기능 현황, mock 상태, collect-v2 연동 계획, BE 역할 재정의

---

## 개요

DDD 4계층 리팩토링(v1.0.0) 완료 후, taxdao-FE의 실제 기능 동작 상태와 collect-v2와의 역할 분담을 분석.
핵심 질문: **taxdao-FE의 BE(API 라우트)에 무엇이 남아야 하는가?**

---

## 1. 현재 기능 목록

### 퍼블릭 페이지 (비로그인)

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 랜딩 | `/` | Hero, Features, 비교표, 지갑주소 입력 |
| 주소 스캔 | `/address/[address]` | 스캔 애니메이션 → Identity/PnL/Tax 탭 |
| 로그인 | 모달 (Privy) | Privy 인증 (지갑, 이메일) — v0.2.0에서 전환 |

### 대시보드 (로그인 필요) — 10개 서브페이지

| 페이지 | 경로 | 설명 |
|--------|------|------|
| Overview | `/dashboard` | 총 자산, PnL 차트, 포트폴리오, 인사이트, 최근 거래 |
| Portfolio | `/dashboard/portfolio` | 체인별 자산, 토큰 allocation 차트 |
| PnL | `/dashboard/pnl` | 기간/체인 필터, PnL 차트, 최고/최저 거래 |
| Tax | `/dashboard/tax` | 국가(7개국), 계산법(FIFO/LIFO/HIFO/AVG), 체인별 세금 |
| Transactions | `/dashboard/transactions` | 검색, 필터, 페이지네이션 테이블 |
| Leaderboard | `/dashboard/leaderboard` | PnL/Volume/Activity/Referral 순위 |
| Rewards | `/dashboard/rewards` | 시즌 요약, 포인트, Claim, 분배 히스토리 |
| Referral | `/dashboard/referral` | 추천코드, 통계, 초대 목록, 공유 |
| Exchange | `/dashboard/exchange` | 포인트 잔액, 상품 그리드, USDC 교환 |
| Settings | `/dashboard/settings` | 프로필, 지갑 관리, 세금 설정, 티어 |

### API 라우트 — 13개

| 라우트 | 메서드 | 설명 |
|--------|--------|------|
| `/api/webhook/privy` | POST | Privy → users 테이블 동기화 (v0.2.0에서 전환) |
| `/api/wallets` | POST/PUT/DELETE | 유저별 지갑 CRUD |
| `/api/health` | GET | 헬스체크 |
| `/api/og/[address]` | GET | OG 이미지 생성 |
| `/api/dashboard/stats` | GET | 대시보드 통계 |
| `/api/dashboard/portfolio` | GET | 포트폴리오 |
| `/api/dashboard/pnl` | GET | PnL 데이터 |
| `/api/dashboard/tax` | GET | 세금 리포트 |
| `/api/dashboard/transactions` | GET | 트랜잭션 목록 |
| `/api/dashboard/leaderboard` | GET | 리더보드 |
| `/api/dashboard/settings` | GET/PUT | 유저 설정 |
| `/api/dashboard/rewards` | GET | 리워드/포인트 |
| `/api/dashboard/referral` | GET | 추천 시스템 |
| `/api/dashboard/exchange` | GET/POST | 포인트 상점 |

---

## 2. 데이터 소스 현황 (Mock vs Real vs Empty)

### 실제 DB 연동 (동작함)

| API | DB 테이블 | 비고 |
|-----|-----------|------|
| transactions | `transactions` | Drizzle 쿼리, 필터/페이징 포함 |
| settings | `users`, `wallets` | 유저 프로필, 지갑 조회/수정 |
| rewards | `pointBalances`, `pointLedger` | 포인트 잔액, 내역 |
| exchange | `shopProducts`, `exchangeHistory` | 상품 목록, 교환 내역 |
| wallets | `wallets` | CRUD 완전 동작 |
| webhook/privy | `users` | Privy 동기화 (v0.2.0에서 전환) |

### 빈 껍데기 (Empty 리턴)

| API | 실제 리턴값 |
|-----|-------------|
| portfolio | `{ totalValue: 0, chains: [] }` |
| pnl | `{ history: [], chainPnl: [], topTrades: [] }` |
| tax | 전부 0 |
| leaderboard | `{ entries: [], myPosition: null }` |
| stats | 일부 DB 카운트 + 나머지 0 |

### 하드코딩 Mock

| 위치 | 사용하는 mock |
|------|--------------|
| `/address/[address]/page.tsx` | `mockScanResult` (유일한 직접 mock import) |

### 요약

```
실제 동작:     인증, 지갑 관리, 포인트/상점, 트랜잭션 조회, 설정
빈 껍데기:     Portfolio, PnL, Tax, Leaderboard, Stats (핵심 금융 데이터)
하드코딩 mock:  주소 스캔 결과 1곳
```

---

## 3. collect-v2 연동 계획

### collect-v2 역할

| 기능 | 설명 |
|------|------|
| TX 수집 | Etherscan API → `chain_tx` 저장 |
| Receipt 수집 | TX별 receipt (가스비, 로그) → `chain_tx_receipt` 저장 |
| Asset Flow 추출 | raw TX+receipt → fee, native transfer, ERC20 transfer 구조화 |
| **PnL 계산 (예정)** | asset flow → cost basis 매칭 → 실현/미실현 손익 |
| **Tax 계산 (예정)** | PnL + 국가별 세율 → 세금 리포트 |

### collect-v2 DB 스키마 (`collect`)

| 테이블 | 내용 |
|--------|------|
| `chain_tx` | raw TX (hash, block, payload) |
| `chain_tx_receipt` | raw receipt (gas_used, logs) |
| `chain_tx_full` | VIEW — TX + receipt JOIN |
| `address_tx` | 주소 ↔ TX 매핑 |
| `sync_cursor` | 주소별 마지막 sync 블록 |
| `task` / `work_unit` | 수집 작업 상태 관리 |

### 연동 후 데이터 흐름

```
collect-v2 (Python/FastAPI)              taxdao-FE (Next.js)
━━━━━━━━━━━━━━━━━━━━━━━━━               ━━━━━━━━━━━━━━━━━━━
Etherscan API                             사용자 브라우저
     ↓                                         ↓
raw TX → receipt → asset flow             대시보드 UI
     ↓                                         ↓
PnL/Tax 계산 (예정)                       API 라우트
     ↓                                         ↓
PostgreSQL ──────────────────────────→  DB에서 결과 SELECT
  (collect 스키마)                       (읽기만)
```

---

## 4. BE 역할 재정의 — 무엇이 남는가?

### 제거 가능 (collect-v2가 대체)

| API | 대체 방식 |
|-----|-----------|
| `/api/dashboard/stats` | collect-v2 계산 결과 SELECT |
| `/api/dashboard/portfolio` | collect-v2 계산 결과 SELECT |
| `/api/dashboard/pnl` | collect-v2 계산 결과 SELECT |
| `/api/dashboard/tax` | collect-v2 계산 결과 SELECT |
| `/api/dashboard/transactions` | collect-v2의 `chain_tx_full` 직접 쿼리 |
| `/api/dashboard/leaderboard` | collect-v2 데이터 기반 집계 |

> 위 6개는 현재도 빈 껍데기이므로, 제거해도 기능 손실 없음.
> 향후 collect-v2 연동 시 **collect-v2 API를 직접 호출**하거나, **같은 DB의 collect 스키마를 읽는** 얇은 프록시로 대체.

### 유지 필요 (taxdao-FE 고유 기능)

| API | 이유 |
|-----|------|
| `/api/webhook/privy` | Privy 인증 연동 (v0.2.0에서 전환) |
| `/api/wallets` | 유저별 지갑 관리 (collect-v2에 sync 요청 시에도 필요) |
| `/api/dashboard/settings` | 유저 설정 (국가, 세금 방식 등 유저 데이터) |
| `/api/dashboard/rewards` | 포인트 시스템 (블록체인 데이터 아님) |
| `/api/dashboard/referral` | 추천 시스템 (블록체인 데이터 아님) |
| `/api/dashboard/exchange` | 포인트 상점 (블록체인 데이터 아님) |
| `/api/og/[address]` | OG 이미지 생성 |
| `/api/health` | 헬스체크 |

### 요약

```
제거 가능:  금융 데이터 API 6개 (stats, portfolio, pnl, tax, transactions, leaderboard)
유지 필요:  유저/게이미피케이션 API 6개 + 인증 2개

→ "블록체인 데이터 관련 BE는 전부 제거 가능"
→ "유저 관리 + 게이미피케이션 BE는 taxdao-FE에 남아야 함"
```

---

## 5. Drizzle 스키마 영향

### 현재 taxdao-FE DB 테이블 (src/core/db/schema.ts)

| 테이블 | 제거 가능? | 이유 |
|--------|:----------:|------|
| `users` | ❌ | 유저 프로필, 설정, 추천코드 |
| `wallets` | ❌ | 유저별 연결 지갑 |
| `transactions` | ✅ | collect-v2의 `chain_tx`로 대체 |
| `scanJobs` | ✅ | collect-v2의 `task`로 대체 |
| `pointBalances` | ❌ | 포인트 시스템 |
| `pointLedger` | ❌ | 포인트 내역 |
| `shopProducts` | ❌ | 상점 상품 |
| `exchangeHistory` | ❌ | 교환 내역 |

---

## 결론

1. **taxdao-FE의 본질은 프레젠테이션 레이어**. 블록체인 데이터 수집/계산은 collect-v2에 완전 위임.
2. **금융 데이터 API 6개는 현재도 빈 껍데기**이므로 제거 비용 제로. collect-v2 연동 시 얇은 프록시 또는 직접 호출로 대체.
3. **유저 관리 + 게이미피케이션 API 8개는 taxdao-FE 고유 기능**으로 유지 필요.
4. **DB 스키마에서 `transactions`, `scanJobs` 2개 테이블은 제거 가능**. 나머지 6개는 유지.

---

**작성일**: 2026-02-16 KST
