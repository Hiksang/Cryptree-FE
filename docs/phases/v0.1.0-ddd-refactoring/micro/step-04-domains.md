# Step 04: Domains (identity, pnl, tax, scan, landing)

## 메타데이터
- **난이도**: 🟡 보통
- **롤백 가능**: ✅
- **선행 조건**: Step 03

---

## 1. 구현 내용 (design.md: D1-D5)

### identity (4 컴포넌트)
- identity-card.tsx, tier-badge.tsx, chain-breakdown.tsx, defi-dna-bar.tsx
- import 변경: `@/lib/types` → `@/core/types`, `@/lib/mock-data` → `@/core/constants`, `@/lib/utils` → `@/core/utils`

### pnl (2 컴포넌트)
- pnl-chart.tsx, pnl-by-chain.tsx
- import 변경: `@/lib/types` → `@/core/types`, `@/lib/mock-data` → `@/core/constants`

### tax (1 컴포넌트)
- tax-preview.tsx
- import 변경: `@/lib/types` → `@/core/types`

### scan (3 컴포넌트) - cross-domain
- scan-input.tsx, scan-progress.tsx, scan-tabs.tsx
- import 변경: 위 + `@/components/identity/*` → `@/domains/identity`, `@/components/pnl/*` → `@/domains/pnl`, `@/components/tax/*` → `@/domains/tax`

### landing (3 컴포넌트) - cross-domain
- hero.tsx, features.tsx, comparison-table.tsx
- import 변경: `@/components/scan/*` → `@/domains/scan`

### barrel exports
- 각 도메인 `index.ts` (5개)

## 2. 완료 조건
- [ ] `src/domains/identity/components/` 하위 4개 파일 존재
- [ ] `src/domains/pnl/components/` 하위 2개 파일 존재
- [ ] `src/domains/tax/components/` 하위 1개 파일 존재
- [ ] `src/domains/scan/components/` 하위 3개 파일 존재
- [ ] `src/domains/landing/components/` 하위 3개 파일 존재
- [ ] scan-tabs.tsx가 `@/domains/identity`, `@/domains/pnl`, `@/domains/tax`에서 import
- [ ] hero.tsx가 `@/domains/scan`에서 import
- [ ] barrel 파일 5개 존재 (각 도메인 index.ts)
- [ ] domains/ 내부에서 `@/lib/` import 0건
- [ ] domains/ 내부에서 `@/components/` import 0건

---

## Scope

### 신규 생성 파일
```
src/domains/
├── identity/
│   ├── components/
│   │   ├── identity-card.tsx    # import: @/lib/types→@/core/types, @/lib/utils→@/core/utils
│   │   ├── tier-badge.tsx       # import: @/lib/mock-data→@/core/constants (TIER_CONFIG)
│   │   ├── chain-breakdown.tsx  # import: @/lib/mock-data→@/core/constants (CHAIN_COLORS)
│   │   └── defi-dna-bar.tsx     # import: @/lib/mock-data→@/core/constants (DNA_COLORS)
│   └── index.ts
├── pnl/
│   ├── components/
│   │   ├── pnl-chart.tsx        # import: @/lib/types→@/core/types
│   │   └── pnl-by-chain.tsx     # import: @/lib/mock-data→@/core/constants (CHAIN_COLORS)
│   └── index.ts
├── tax/
│   ├── components/
│   │   └── tax-preview.tsx      # import: @/lib/types→@/core/types, @/lib/mock-data→@/core/constants
│   └── index.ts
├── scan/
│   ├── components/
│   │   ├── scan-input.tsx       # import: @/lib/types→@/core/types
│   │   ├── scan-progress.tsx    # import: @/lib/mock-data→@/core/constants (CHAIN_COLORS)
│   │   └── scan-tabs.tsx        # cross-domain: @/components/identity→@/domains/identity, pnl, tax
│   └── index.ts
└── landing/
    ├── components/
    │   ├── hero.tsx             # cross-domain: @/components/scan→@/domains/scan
    │   ├── features.tsx         # 변경 없음 또는 최소
    │   └── comparison-table.tsx # 변경 없음 또는 최소
    └── index.ts
```

### 의존성 분석 (cross-domain)
- scan-tabs.tsx → identity (identity-card, chain-breakdown, tier-badge, defi-dna-bar)
- scan-tabs.tsx → pnl (pnl-chart, pnl-by-chain)
- scan-tabs.tsx → tax (tax-preview)
- hero.tsx → scan (scan-input)

### Side Effect 위험
- scan-tabs.tsx가 가장 복잡한 import 변경 (3개 도메인 참조)
- identity, pnl, tax의 barrel export가 정확해야 scan-tabs에서 참조 가능

## FP/FN 검증

### False Positive: 0건
### False Negative: 0건

| 구현 내용 | Scope 포함 | 판정 |
|----------|-----------|------|
| D1: identity 4개 | identity-card, tier-badge, chain-breakdown, defi-dna-bar | ✅ |
| D2: pnl 2개 | pnl-chart, pnl-by-chain | ✅ |
| D3: tax 1개 | tax-preview | ✅ |
| D4: scan 3개 | scan-input, scan-progress, scan-tabs | ✅ |
| D5: landing 3개 | hero, features, comparison-table | ✅ |
| cross-domain | scan-tabs→identity/pnl/tax, hero→scan | ✅ grep 확인 |
| barrels | 5개 index.ts | ✅ |

### 검증 통과: ✅

---

→ 다음: [Step 05: Dashboard Domain](step-05-dashboard.md)
