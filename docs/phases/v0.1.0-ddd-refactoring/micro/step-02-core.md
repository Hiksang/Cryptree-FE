# Step 02: Core Layer

## 메타데이터
- **난이도**: 🟡 보통
- **롤백 가능**: ✅
- **선행 조건**: Step 01

---

## 1. 구현 내용 (design.md: B1-B7)
- `lib/types.ts` → `src/core/types/index.ts` (변경 없음)
- `lib/utils.ts` → `src/core/utils/index.ts` (변경 없음)
- `lib/constants.ts` + `lib/mock-data.ts`의 constants → `src/core/constants/index.ts` (통합)
  - CHAIN_COLORS, CHAIN_NAMES, DNA_COLORS, TIER_CONFIG (from mock-data)
  - NAV_ITEMS, TAX_COUNTRIES, TAX_METHODS, TRANSACTION_TYPE_LABELS (from constants)
- `lib/mock-data.ts`의 mocks → `src/core/mock/index.ts` (분리)
  - mockScanResult, mockDashboardStats, mockPortfolioData 등 모든 mock*
  - import 경로: `./types` → `@/core/types`, constants → `@/core/constants`
- `lib/schema.ts` → `src/core/db/schema.ts` (변경 없음)
- `lib/db.ts` → `src/core/db/index.ts` (`./schema` import 유지)
- `lib/auth.ts` → `src/core/auth/index.ts` (변경 없음)
- `src/core/index.ts` barrel export 생성

## 2. 완료 조건
- [ ] `src/core/types/index.ts` 존재 + 모든 타입 export 확인 (Tier, ChainId, ScanResult 등)
- [ ] `src/core/utils/index.ts` 존재 + cn, shortenAddress, formatCurrency 등 export 확인
- [ ] `src/core/constants/index.ts` 존재 + CHAIN_COLORS, NAV_ITEMS, TAX_COUNTRIES 등 export 확인
- [ ] `src/core/mock/index.ts` 존재 + mockScanResult, mockDashboardStats 등 export 확인
- [ ] `src/core/db/schema.ts` 존재 + 8개 테이블 (users, wallets, transactions 등)
- [ ] `src/core/db/index.ts` 존재 + `db` export 확인
- [ ] `src/core/auth/index.ts` 존재 + getAuthUserId, unauthorizedResponse export 확인
- [ ] `src/core/index.ts` barrel 존재
- [ ] core/ 내부 파일에서 `react` import 0건 (`grep -r "from \"react" src/core/`)
- [ ] core/ 내부 파일에서 shared/domains/app import 0건

---

## Scope

### 신규 생성 파일
```
src/core/
├── types/index.ts        # lib/types.ts 복사 (355줄, 변경 없음)
├── utils/index.ts        # lib/utils.ts 복사 (변경 없음)
├── constants/index.ts    # 통합: lib/constants.ts 전체 + lib/mock-data.ts의 4개 상수
├── mock/index.ts         # lib/mock-data.ts에서 mock 데이터 16개 분리
├── db/
│   ├── schema.ts         # lib/schema.ts 복사 (125줄, 변경 없음)
│   └── index.ts          # lib/db.ts 복사 (import ./schema 유지)
├── auth/index.ts         # lib/auth.ts 복사 (변경 없음)
└── index.ts              # barrel export
```

### 의존성 분석 (Explore 결과)

**constants (CHAIN_COLORS, CHAIN_NAMES, DNA_COLORS, TIER_CONFIG) 소비자:**
- CHAIN_COLORS: 16개 파일 (identity, pnl, scan, tax, dashboard의 overview/pnl/portfolio/transactions/tax/settings)
- CHAIN_NAMES: 4개 파일 (dashboard의 pnl/transactions/settings)
- DNA_COLORS: 1개 파일 (identity/defi-dna-bar)
- TIER_CONFIG: 5개 파일 (identity/tier-badge, dashboard의 leaderboard/settings)

**mock data 소비자:**
- mockScanResult: `app/address/[address]/page.tsx`만 사용
- 나머지 15개 mock: API route에서 타입 정보만 참조, 직접 import 없음

**auth.ts 소비자:** 11개 API route 파일
**db.ts 소비자:** 9개 API route 파일
**schema.ts 소비자:** 8개 API route + db.ts

### Side Effect 위험
- mock-data.ts 분리 시 constants와 mock 간 import 경계 정확히 설정 필요
- constants/index.ts에서 `@/core/types` import 경로 사용 (lib/constants.ts가 ./types 참조하므로)

## FP/FN 검증

### False Positive: 0건
모든 Scope 파일이 design.md B1-B7에 대응.

### False Negative: 0건

| 구현 내용 | Scope 포함 | 판정 |
|----------|-----------|------|
| B1: types.ts 이동 | core/types/index.ts | ✅ |
| B2: utils.ts 이동 | core/utils/index.ts | ✅ |
| B3: constants 통합 | core/constants/index.ts | ✅ |
| B4: mock 분리 | core/mock/index.ts | ✅ |
| B5: db 이동 | core/db/schema.ts + index.ts | ✅ |
| B6: auth 이동 | core/auth/index.ts | ✅ |
| B7: barrel | core/index.ts | ✅ |

### 검증 통과: ✅

---

→ 다음: [Step 03: Shared Layer](step-03-shared.md)
