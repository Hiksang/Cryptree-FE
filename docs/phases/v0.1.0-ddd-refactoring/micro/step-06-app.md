# Step 06: App Layer

## 메타데이터
- **난이도**: 🟡 보통
- **롤백 가능**: ✅
- **선행 조건**: Step 05

---

## 1. 구현 내용 (design.md: F1-F3)

### F1: Pages 이동 (18개)
- Root: `app/layout.tsx`, `app/page.tsx`, `app/globals.css` → `src/app/`
- Auth: `app/sign-in/`, `app/sign-up/` → `src/app/`
- Address: `app/address/[address]/page.tsx` → `src/app/`
- Dashboard: `app/dashboard/layout.tsx`, 10개 sub-pages, `error.tsx`, `loading.tsx` → `src/app/dashboard/`

**Pages import 변경:**
- `@/components/layout/*` → `@/shared/layout`
- `@/components/providers/*` → `@/shared/providers`
- `@/components/landing/*` → `@/domains/landing`
- `@/components/scan/*` → `@/domains/scan`
- `@/components/dashboard/*` → `@/domains/dashboard`
- `@/lib/hooks/*` → `@/domains/dashboard/hooks`
- `@/lib/store` → `@/shared/store`

### F2: API routes 이동 (13개)
- `app/api/dashboard/{stats,portfolio,pnl,tax,transactions,settings,rewards,referral,leaderboard,exchange}/route.ts`
- `app/api/health/route.ts`
- `app/api/wallets/route.ts`
- `app/api/webhook/clerk/route.ts`
- `app/api/og/[address]/route.tsx`

**API routes import 변경:**
- `@/lib/db` → `@/core/db`
- `@/lib/schema` → `@/core/db/schema`
- `@/lib/auth` → `@/core/auth`
- `@/lib/mock-data` → `@/core/mock`

### F3: middleware
- `middleware.ts` → `src/middleware.ts`

## 2. 완료 조건
- [ ] `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css` 존재
- [ ] `src/app/sign-in/[[...sign-in]]/page.tsx` 존재
- [ ] `src/app/sign-up/[[...sign-up]]/page.tsx` 존재
- [ ] `src/app/address/[address]/page.tsx` 존재
- [ ] `src/app/dashboard/` 하위 layout + 10 pages + error + loading 존재 (13개 파일)
- [ ] `src/app/api/` 하위 13개 route 파일 존재
- [ ] `src/middleware.ts` 존재
- [ ] `grep -r "@/lib/" src/app/` → 0건
- [ ] `grep -r "@/components/" src/app/` → 0건
- [ ] `grep -r "from \"@/lib" src/middleware.ts` → 0건

---

## Scope

### 이동 + import 변경 파일

**Pages (18개):**
| 파일 | @/lib/ imports | @/components/ imports |
|------|---------------|---------------------|
| page.tsx | 없음 | layout/{header,footer}, landing/*, scan/scan-input |
| layout.tsx | query-provider | providers/clerk-provider |
| address/[address]/page.tsx | mock-data, utils | layout/header, scan/* |
| sign-in, sign-up | 없음 | 없음 |
| dashboard/layout.tsx | 없음 | dashboard/{sidebar,dashboard-header,bottom-nav} |
| dashboard/page.tsx | hooks/use-dashboard-queries | dashboard/overview/*, ui/* |
| dashboard/portfolio/page.tsx | hooks/use-dashboard-queries | dashboard/portfolio/*, ui/* |
| dashboard/pnl/page.tsx | types, hooks | dashboard/pnl/*, ui/* |
| dashboard/tax/page.tsx | store, types, hooks | dashboard/tax/*, ui/* |
| dashboard/transactions/page.tsx | types, hooks | dashboard/transactions/*, ui/* |
| dashboard/settings/page.tsx | hooks | dashboard/settings/*, ui/* |
| dashboard/rewards/page.tsx | hooks | dashboard/rewards/*, ui/* |
| dashboard/referral/page.tsx | hooks | dashboard/referral/*, ui/* |
| dashboard/leaderboard/page.tsx | types, hooks | dashboard/leaderboard/*, ui/* |
| dashboard/exchange/page.tsx | hooks | dashboard/exchange/*, ui/* |
| dashboard/error.tsx | 없음 | 없음 |
| dashboard/loading.tsx | 없음 | dashboard/page-skeletons |

**API routes (13개) - 공통 패턴:**
- `@/lib/auth` → `@/core/auth` (11개)
- `@/lib/db` → `@/core/db` (9개)
- `@/lib/schema` → `@/core/db/schema` (8개)
- `@/lib/types` → `@/core/types` (일부)
- `@/lib/mock-data` → `@/core/mock` (일부)

**middleware.ts:** 외부 import만 (@clerk/nextjs/server), 변경 없음

### Side Effect 위험
- dashboard 10개 page가 모두 `@/lib/hooks/use-dashboard-queries` → `@/domains/dashboard/hooks/use-dashboard-queries`로 변경 필요
- app/layout.tsx에서 `@/lib/query-provider` → `@/shared/providers` 변경

## FP/FN 검증

### False Positive: 0건
### False Negative: 0건

**Pages import 검증 (grep 기반):**
| 페이지 | @/lib imports | @/components imports | Scope 반영 |
|--------|-------------|---------------------|-----------|
| page.tsx | 없음 | layout/*, landing/*, scan/* | ✅ |
| layout.tsx | query-provider | providers/clerk-provider | ✅ |
| address page | mock-data, utils | layout/header, scan/* | ✅ |
| sign-in/up | 없음 | 없음 | ✅ (변경 없음) |
| dashboard/layout | 없음 | dashboard/{sidebar,header,bottom-nav} | ✅ |
| dashboard pages (10) | hooks, types, store | dashboard/*, ui/* | ✅ |
| dashboard/loading | 없음 | dashboard/page-skeletons | ✅ |
| dashboard/error | 없음 | 없음 | ✅ |

**API routes 공통 패턴 검증:**
| 패턴 | route 수 | Scope 반영 |
|------|---------|-----------|
| `@/lib/auth` | 11개 | → `@/core/auth` ✅ |
| `@/lib/db` | 9개 | → `@/core/db` ✅ |
| `@/lib/schema` | 8개 | → `@/core/db/schema` ✅ |
| `@/lib/types` | 7개 | → `@/core/types` ✅ |
| OG route (edge) | 1개 | 변경 없음 ✅ |

### 검증 통과: ✅

---

→ 다음: [Step 07: Config + Cleanup + Verification](step-07-verify.md)
