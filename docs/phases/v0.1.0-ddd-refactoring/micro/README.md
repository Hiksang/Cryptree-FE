# 개발 단계 - v1.0.0

## 전체 현황

| # | Step | 난이도 | 롤백 | Scope | FP/FN | 개발 | 완료일 |
|---|------|--------|------|-------|-------|------|--------|
| 01 | web→root + src 구조 생성 | 🟢 | ✅ | ✅ | ✅ | ⏳ | - |
| 02 | Core Layer (types, utils, constants, mock, db, auth) | 🟡 | ✅ | ✅ | ✅ | ⏳ | - |
| 03 | Shared Layer (layout, providers, ui, store) | 🟢 | ✅ | ✅ | ✅ | ⏳ | - |
| 04 | Domains - identity, pnl, tax, scan, landing | 🟡 | ✅ | ✅ | ✅ | ⏳ | - |
| 05 | Dashboard Domain (42 components + hooks + lib) | 🟠 | ✅ | ✅ | ✅ | ⏳ | - |
| 06 | App Layer (pages, API routes, middleware) | 🟡 | ✅ | ✅ | ✅ | ⏳ | - |
| 07 | Config + Cleanup + Verification | 🟢 | ✅ | ✅ | ✅ | ⏳ | - |

## 의존성

```
01 → 02 → 03 → 04 → 05 → 06 → 07
```

순차 의존: 각 레이어가 하위 레이어의 barrel export에 의존하므로 순서대로 진행.

## Step 상세
- [Step 01: web→root + src 구조 생성](step-01-structure.md)
- [Step 02: Core Layer](step-02-core.md)
- [Step 03: Shared Layer](step-03-shared.md)
- [Step 04: Domains (5개)](step-04-domains.md)
- [Step 05: Dashboard Domain](step-05-dashboard.md)
- [Step 06: App Layer](step-06-app.md)
- [Step 07: Config + Cleanup + Verification](step-07-verify.md)
