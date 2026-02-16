# Step 05: 미들웨어 교체

## 메타데이터
- **난이도**: 🟡 보통
- **롤백 가능**: ✅
- **선행 조건**: Step 04

---

## 1. 구현 내용 (design.md: P10)
- `src/middleware.ts` — `clerkMiddleware` → 커스텀 Next.js 미들웨어
- `privy-token` 쿠키 존재만 확인 (검증은 API 라우트에서)
- 미인증 시 `/?login=required`로 리다이렉트

## 2. 완료 조건
- [x] Clerk import 0건 (`@clerk/nextjs` 없음)
- [x] 보호 라우트 (`/dashboard`) 미인증 접근 시 `/?login=required` 리다이렉트
- [x] dev 모드 (`!privyAppId`): 보호 안 함 (모든 접근 허용)
- [x] 비보호 라우트 (`/`, `/address/*`): 미들웨어 통과

---

## Scope

### 수정 대상 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/middleware.ts` | 전면 교체 |

### Before (Clerk)
```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});
```

### After (커스텀)
```typescript
import { NextResponse, type NextRequest } from "next/server";

const protectedPaths = ["/dashboard"];

export function middleware(request: NextRequest) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  if (!privyAppId) return NextResponse.next();  // dev 모드

  const isProtected = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("privy-token")?.value;
  if (!token) {
    const url = new URL("/", request.url);
    url.searchParams.set("login", "required");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
```

### 설계 결정
- **쿠키 존재만 확인**: 미들웨어에서 Privy 서버 검증을 하면 모든 요청에 네트워크 호출 발생 → 성능 이슈. 쿠키 존재만 확인하고 실제 검증은 API 라우트에서.
- **`/?login=required` 리다이렉트**: `LoginTrigger` 컴포넌트(Step 06)가 이 파라미터를 감지하여 자동 모달 오픈.

### Side Effect 위험
- Next.js 16에서 `middleware` → `proxy` 컨벤션 변경 경고 발생 (기능에는 영향 없음)
- 쿠키 존재만 확인하므로 만료된 토큰으로도 미들웨어 통과 가능 → API 라우트에서 최종 검증

## FP/FN 검증

### False Positive: 0건
### False Negative: 0건

### 검증 통과: ✅

---

→ 다음: [Step 06: Provider 교체](step-06-provider.md)
