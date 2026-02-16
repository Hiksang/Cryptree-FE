# Step 10: Clerk 제거 + 정리

## 메타데이터
- **난이도**: 🟢 쉬움
- **롤백 가능**: ✅
- **선행 조건**: Step 09

---

## 1. 구현 내용 (design.md: P20-P23)
- `npm uninstall @clerk/nextjs @clerk/themes`
- `src/shared/providers/clerk-provider.tsx` — 삭제
- `src/app/api/health/route.ts` — Clerk 참조 → Privy
- 문서 5개 업데이트: API-KEYS-GUIDE, INFRASTRUCTURE, FRONTEND-ARCHITECTURE, PRD, DESIGN-SPEC

## 2. 완료 조건
- [x] `package.json`에서 `@clerk/nextjs`, `@clerk/themes` 제거
- [x] `clerk-provider.tsx` 파일 미존재
- [x] `health/route.ts`에서 Clerk 참조 0건
- [x] `grep -r "clerk" src/` 결과 0건
- [x] 문서 5개에서 Clerk → Privy 참조 업데이트 완료
- [x] `npm run build` 성공

---

## Scope

### 패키지 제거
```bash
npm uninstall @clerk/nextjs @clerk/themes
```
> `svix`는 Privy 웹훅 검증에 여전히 필요하므로 유지

### 삭제 대상 파일

| 파일 | 이유 |
|------|------|
| `src/shared/providers/clerk-provider.tsx` | Privy provider로 대체됨 |

### 수정 대상 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/app/api/health/route.ts` | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` → `NEXT_PUBLIC_PRIVY_APP_ID`, `"clerk"` → `"privy"` |
| `API-KEYS-GUIDE.md` | Clerk 섹션 → Privy 발급 절차, 환경변수 업데이트 |
| `INFRASTRUCTURE.md` | 인증 스택 Clerk → Privy, 환경변수 업데이트 |
| `FRONTEND-ARCHITECTURE.md` | 인증 코드 예시, Provider 설명 Privy로 교체 |
| `PRD.md` | Clerk → Privy 텍스트 교체 |
| `DESIGN-SPEC.md` | 섹션 3.6 로그인/회원가입 Privy 모달로 교체, 작업 순서 업데이트 |

### 환경변수 정리

**제거**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
CLERK_WEBHOOK_SECRET
```

**유지/추가**
```
NEXT_PUBLIC_PRIVY_APP_ID
PRIVY_APP_SECRET
PRIVY_WEBHOOK_SECRET
```

### Side Effect 위험
- 문서 일괄 치환 시 코드 블록 내 `@clerk/` 패키지 경로가 불완전하게 변경될 수 있음 → 수동 검토 필요
- `replace_all` 사용 시 `Clerk` → `Privy`만 변경되고 `clerk` (소문자)는 별도 처리 필요

## FP/FN 검증

### False Positive: 0건
### False Negative: 0건

최종 검증:
```bash
npm run build           # 성공 (26개 라우트)
grep -r "clerk" src/    # 0건
```

### 검증 통과: ✅

---

## 전체 마이그레이션 완료 ✅

커밋: `5c7db1c` — `refactor: Clerk → Privy 인증 마이그레이션`
변경: 24 files changed, 476 insertions(+), 484 deletions(-)
