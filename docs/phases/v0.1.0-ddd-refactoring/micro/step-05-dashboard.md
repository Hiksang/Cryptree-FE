# Step 05: Dashboard Domain

## 메타데이터
- **난이도**: 🟠 중간
- **롤백 가능**: ✅
- **선행 조건**: Step 04

---

## 1. 구현 내용 (design.md: E1-E3)

### E1: lib + hooks
- `lib/api-client.ts` → `src/domains/dashboard/lib/api-client.ts`
  - import: `./types` → `@/core/types`
- `lib/hooks/use-dashboard-queries.ts` → `src/domains/dashboard/hooks/use-dashboard-queries.ts`
  - import: `@/lib/api-client` → `../lib/api-client`, `@/lib/types` → `@/core/types`

### E2: 42 컴포넌트 이동 (11개 그룹)
1:1 매핑: `components/dashboard/{group}/{file}.tsx` → `src/domains/dashboard/components/{group}/{file}.tsx`

| 그룹 | 파일 수 |
|------|---------|
| layout | 5 (sidebar, sidebar-nav-item, dashboard-header, bottom-nav, page-skeletons) |
| overview | 5 (stats-cards, pnl-overview-chart, portfolio-list, recent-trades, insights-cards) |
| pnl | 5 (pnl-area-chart, chain-pnl-cards, period-selector, chain-filter, top-trades-table) |
| portfolio | 3 (portfolio-summary, allocation-chart, chain-asset-list) |
| tax | 5 (tax-summary-card, chain-tax-breakdown, country-selector, method-selector, export-cta) |
| transactions | 5 (transaction-table, transaction-filters, search-bar, pagination, status-badge) |
| settings | 4 (profile-card, connected-wallets, preferences-form, tier-display) |
| rewards | 4 (season-summary, points-breakdown, claim-cta, distribution-history) |
| referral | 4 (referral-code-card, referral-stats, invited-friends-list, share-buttons) |
| leaderboard | 4 (tab-selector, rankings-table, rank-badge, my-position) |
| exchange | 6 (points-balance-hero, usdc-exchange-card, product-grid, product-card, exchange-history-table, ad-revenue-banner) |

**모든 컴포넌트 공통 import 변경:**
- `@/lib/types` → `@/core/types`
- `@/lib/utils` → `@/core/utils`
- `@/lib/mock-data` → `@/core/mock` 또는 `@/core/constants`
- `@/lib/constants` → `@/core/constants`
- `@/lib/store` → `@/shared/store`
- `@/lib/hooks/use-dashboard-queries` → `@/domains/dashboard/hooks/use-dashboard-queries`
- `@/components/ui/*` → `@/shared/ui`
- `@/components/dashboard/*` → 상대 경로 or `@/domains/dashboard`

### E3: barrel exports
- `src/domains/dashboard/index.ts`
- 각 `components/{group}/index.ts` (11개)

## 2. 완료 조건
- [ ] `src/domains/dashboard/lib/api-client.ts` 존재 + `@/core/types` import
- [ ] `src/domains/dashboard/hooks/use-dashboard-queries.ts` 존재 + `../lib/api-client` import
- [ ] dashboard/components/ 하위 11개 그룹 디렉토리 + 42개 tsx 파일 존재
- [ ] `grep -r "@/lib/" src/domains/dashboard/` → 0건
- [ ] `grep -r "@/components/" src/domains/dashboard/` → 0건
- [ ] barrel 파일 12개 존재 (dashboard root + 11 groups)
- [ ] 각 그룹별 파일 수 일치 (layout:5, overview:5, pnl:5, portfolio:3, tax:5, transactions:5, settings:4, rewards:4, referral:4, leaderboard:4, exchange:6)

---

## Scope

### 신규 생성 파일 (44 소스 + 12 barrel = 56)
`components/dashboard/{group}/{file}.tsx` → `src/domains/dashboard/components/{group}/{file}.tsx`
+ `lib/api-client.ts`, `hooks/use-dashboard-queries.ts`

### 의존성 분석 (Explore 결과)

**@/lib/ import 패턴 (변경 필요):**
| 패턴 | 파일 수 | 변경 대상 |
|------|---------|----------|
| `@/lib/types` | 26개 | `@/core/types` |
| `@/lib/mock-data` | 14개 | `@/core/constants` (CHAIN_COLORS, CHAIN_NAMES, TIER_CONFIG) |
| `@/lib/utils` | 9개 | `@/core/utils` |
| `@/lib/constants` | 4개 | `@/core/constants` |
| `@/lib/api-client` | 3개 | `../lib/api-client` (hooks에서) |
| `@/lib/store` | 1개 | `@/shared/store` |

**@/components/ import 패턴 (변경 필요):**
| 패턴 | 파일 수 | 변경 대상 |
|------|---------|----------|
| `@/components/ui/toast` | 2개 | `@/shared/ui` |
| `@/components/dashboard/tax/country-selector` | 1개 | 상대경로 `../tax/country-selector` |
| `@/components/dashboard/tax/method-selector` | 1개 | 상대경로 `../tax/method-selector` |

**dashboard 내부 참조 (상대경로 유지):**
| 소스 | 대상 | 경로 |
|------|------|------|
| sidebar.tsx | sidebar-nav-item.tsx | `./sidebar-nav-item` (유지) |
| transaction-table.tsx | status-badge.tsx | `./status-badge` (유지) |
| rankings-table.tsx | rank-badge.tsx | `./rank-badge` (유지) |
| product-grid.tsx | product-card.tsx | `./product-card` (유지) |
| preferences-form.tsx | country-selector | `@/components/dashboard/tax/` → `../tax/country-selector` |
| preferences-form.tsx | method-selector | `@/components/dashboard/tax/` → `../tax/method-selector` |

### Side Effect 위험
- preferences-form.tsx의 cross-group 참조 (settings→tax) 경로 변경 주의
- 42개 파일 일괄 import 변경 시 누락 가능 → grep 검증 필수

## FP/FN 검증

### False Positive: 0건
모든 42 컴포넌트 + hooks + lib이 design.md E1-E3에 대응.

### False Negative: 0건

**Import 패턴 완전성 검증 (grep 기반):**
| 패턴 | 파일 수 | Scope 반영 | 판정 |
|------|---------|-----------|------|
| `@/lib/types` | 26개 | → `@/core/types` | ✅ |
| `@/lib/mock-data` | 14개 | → `@/core/constants` | ✅ |
| `@/lib/utils` | 9개 | → `@/core/utils` | ✅ |
| `@/lib/constants` | 4개 | → `@/core/constants` | ✅ |
| `@/lib/api-client` | 3개 | → `../lib/api-client` | ✅ |
| `@/lib/store` | 1개 | → `@/shared/store` | ✅ |
| `@/components/ui/toast` | 2개 | → `@/shared/ui` | ✅ |
| `@/components/dashboard/tax/*` | 2개 | → 상대경로 `../tax/*` | ✅ |
| `@/components/ui/card-skeleton` | 1개 (page-skeletons) | → `@/shared/ui` | ✅ |

### 검증 통과: ✅

---

→ 다음: [Step 06: App Layer](step-06-app.md)
