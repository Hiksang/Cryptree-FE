# Step 03: Shared Layer

## 메타데이터
- **난이도**: 🟢 쉬움
- **롤백 가능**: ✅
- **선행 조건**: Step 02

---

## 1. 구현 내용 (design.md: C1-C5)
- `components/layout/header.tsx` → `src/shared/layout/header.tsx` (import: `@/lib/types` → `@/core/types`)
- `components/layout/footer.tsx` → `src/shared/layout/footer.tsx` (변경 없음)
- `components/providers/clerk-provider.tsx` → `src/shared/providers/clerk-provider.tsx`
- `lib/query-provider.tsx` → `src/shared/providers/query-provider.tsx`
- `components/ui/*.tsx` (5개) → `src/shared/ui/*.tsx` (import: `@/lib/utils` → `@/core/utils`)
- `lib/store.ts` → `src/shared/store/index.ts` (import: `@/lib/types` → `@/core/types`)
- barrel exports: `src/shared/layout/index.ts`, `src/shared/providers/index.ts`, `src/shared/ui/index.ts`, `src/shared/index.ts`

## 2. 완료 조건
- [ ] `src/shared/layout/header.tsx` 존재 + `@/core/types`에서 import
- [ ] `src/shared/layout/footer.tsx` 존재
- [ ] `src/shared/providers/clerk-provider.tsx` 존재
- [ ] `src/shared/providers/query-provider.tsx` 존재
- [ ] `src/shared/ui/` 하위 5개 파일 존재 (card-skeleton, empty-state, error-state, skeleton, toast)
- [ ] `src/shared/store/index.ts` 존재 + `@/core/types`에서 import
- [ ] barrel 파일 4개 존재 (layout, providers, ui, shared root)
- [ ] shared/ 내부에서 `@/lib/` import 0건
- [ ] shared/ 내부에서 domains/ 또는 app/ import 0건

---

## Scope

### 신규 생성 파일
```
src/shared/
├── layout/
│   ├── header.tsx        # components/layout/header.tsx (import 수정: @/lib/types → @/core/types)
│   ├── footer.tsx        # components/layout/footer.tsx (변경 없음)
│   └── index.ts          # barrel
├── providers/
│   ├── clerk-provider.tsx # components/providers/clerk-provider.tsx (변경 없음)
│   ├── query-provider.tsx # lib/query-provider.tsx (변경 없음)
│   └── index.ts          # barrel
├── ui/
│   ├── card-skeleton.tsx  # import: @/lib/utils → @/core/utils
│   ├── empty-state.tsx    # import: @/lib/utils → @/core/utils (있을 경우)
│   ├── error-state.tsx
│   ├── skeleton.tsx
│   ├── toast.tsx
│   └── index.ts          # barrel
├── store/index.ts        # lib/store.ts (import: @/lib/types → @/core/types)
└── index.ts              # barrel
```

### 의존성 분석
- header.tsx: app/page.tsx, app/address/[address]/page.tsx에서 사용
- footer.tsx: app/page.tsx에서 사용
- clerk-provider.tsx: app/layout.tsx에서 사용
- query-provider.tsx: app/layout.tsx에서 사용
- ui 컴포넌트: dashboard 10개 page에서 광범위 사용 (ErrorState, Skeleton 등)
- store: dashboard settings/preferences-form에서 사용

### Side Effect 위험
- 없음 (단순 파일 이동 + import 경로 변경)

## FP/FN 검증

### False Positive: 0건
### False Negative: 0건

| 구현 내용 | Scope 포함 | 판정 |
|----------|-----------|------|
| C1: layout 이동 | header.tsx, footer.tsx | ✅ |
| C2: providers 이동 | clerk-provider.tsx, query-provider.tsx | ✅ |
| C3: ui 이동 | 5개 파일 | ✅ |
| C4: store 이동 | store/index.ts | ✅ |
| C5: barrels | 4개 index.ts | ✅ |

### 검증 통과: ✅

---

→ 다음: [Step 04: Domains](step-04-domains.md)
