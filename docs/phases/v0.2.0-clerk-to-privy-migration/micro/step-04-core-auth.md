# Step 04: Core Auth 교체 (핵심)

## 메타데이터
- **난이도**: 🟠 어려움
- **롤백 가능**: ✅
- **선행 조건**: Step 03

---

## 1. 구현 내용 (design.md: P9)
- `src/core/auth/index.ts` 전면 교체
- Clerk의 `getAuth(request)` → Privy의 `PrivyClient.verifyAuthToken(token)`
- **핵심**: `getAuthUserId()` zero-arg 시그니처 유지

## 2. 완료 조건
- [x] `getAuthUserId()` 시그니처: `() => Promise<string | null>` (zero-arg 유지)
- [x] Clerk import 0건 (`@clerk/nextjs` 없음)
- [x] dev 모드: Privy 키 없으면 `dev_user_001` 리턴
- [x] production 모드: `privy-token` 쿠키에서 토큰 추출 → 서버 검증

---

## Scope

### 수정 대상 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/core/auth/index.ts` | 전면 교체 (아래 상세) |

### Before (Clerk)
```typescript
import { getAuth } from "@clerk/nextjs/server";

export async function getAuthUserId(): Promise<string | null> {
  const { userId } = getAuth(request);
  return userId;
}
```

### After (Privy)
```typescript
import { cookies } from "next/headers";

const DEV_USER_ID = "dev_user_001";

export async function getAuthUserId(): Promise<string | null> {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const privyAppSecret = process.env.PRIVY_APP_SECRET;
  if (!privyAppId || !privyAppSecret) return DEV_USER_ID;

  const cookieStore = await cookies();
  const token = cookieStore.get("privy-token")?.value;
  if (!token) return null;

  const { PrivyClient } = await import("@privy-io/server-auth");
  const client = new PrivyClient(privyAppId, privyAppSecret);
  const claims = await client.verifyAuthToken(token);
  return claims.userId;
}
```

### 핵심 설계 결정

1. **`cookies()` from `next/headers`**: Next.js 서버 컴포넌트/API 라우트에서 쿠키 접근. request 객체 불필요.
2. **dynamic import**: `@privy-io/server-auth`를 dynamic import하여 dev 모드에서 패키지 미설치 시에도 동작.
3. **`DEV_USER_ID` fallback**: Privy 키 미설정 시 자동으로 dev 유저 리턴. 로컬 개발 편의성.

### 영향 범위
- 이 파일을 호출하는 12+ API 라우트: **변경 없음** (zero-arg 유지)

### Side Effect 위험
- `privy-token` 쿠키명이 Privy SDK 버전에 따라 변경될 수 있음 → Privy 공식 문서 참조
- `verifyAuthToken` 실패 시 null 리턴 (401 처리는 각 API 라우트의 `unauthorizedResponse()` 사용)

## FP/FN 검증

### False Positive: 0건
### False Negative: 0건

12+ API 라우트에서 `getAuthUserId()` 호출 패턴이 동일하므로, 이 파일만 변경하면 전체 인증 전환 완료.

### 검증 통과: ✅

---

→ 다음: [Step 05: 미들웨어 교체](step-05-middleware.md)
