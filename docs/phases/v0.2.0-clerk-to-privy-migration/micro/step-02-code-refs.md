# Step 02: 코드 내 clerkId 참조 업데이트

## 메타데이터
- **난이도**: 🟢 쉬움
- **롤백 가능**: ✅
- **선행 조건**: Step 01

---

## 1. 구현 내용 (design.md: P5-P7)
- `src/app/api/webhook/clerk/route.ts` — 변수명 `clerkId` → `authId`, DB insert/delete 쿼리 업데이트
- `src/app/api/dashboard/settings/route.ts` — `users.clerkId` → `users.authId` (2곳)
- `src/app/api/dashboard/referral/route.ts` — `users.clerkId` → `users.authId` (1곳)

## 2. 완료 조건
- [x] `grep -r "clerkId" src/` 결과 0건
- [x] `grep -r "users.clerkId" src/` 결과 0건
- [x] `npm run build` 타입 체크 통과 (Step 01과 원자적 실행)

---

## Scope

### 수정 대상 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/app/api/webhook/clerk/route.ts` | `clerkId` 변수 → `authId`, `users.clerkId` → `users.authId` |
| `src/app/api/dashboard/settings/route.ts` | `users.clerkId` → `users.authId` (2곳: GET, PUT) |
| `src/app/api/dashboard/referral/route.ts` | `users.clerkId` → `users.authId` (1곳) |

### 발견 방법
```bash
grep -r "clerkId\|clerk_id" src/ --include="*.ts" --include="*.tsx"
```

### Side Effect 위험
- Step 01과 반드시 원자적 실행. 스키마에서 `clerkId`가 `authId`로 변경되었으므로 코드도 즉시 동기화해야 함.

## FP/FN 검증

### False Positive: 0건
### False Negative: 0건

grep 결과 3개 파일에서만 `clerkId` 사용 확인. 모두 Scope에 포함.

### 검증 통과: ✅

---

→ 다음: [Step 03: Privy 패키지 설치](step-03-packages.md)
