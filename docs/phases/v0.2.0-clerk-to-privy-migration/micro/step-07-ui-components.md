# Step 07: UI 컴포넌트 교체

## 메타데이터
- **난이도**: 🟡 보통
- **롤백 가능**: ✅
- **선행 조건**: Step 06

---

## 1. 구현 내용 (design.md: P14-P15)
- `src/shared/layout/header.tsx` — Clerk 임포트 → `usePrivy()` 훅 기반
- `src/domains/dashboard/components/layout/dashboard-header.tsx` — 동일 패턴

## 2. 완료 조건
- [x] Clerk import 0건 (SignInButton, SignUpButton, SignedIn, SignedOut, UserButton 제거)
- [x] `usePrivy()` 훅 사용: `ready, authenticated, login, logout, user`
- [x] dev 모드: Privy 키 없으면 Clerk/Privy UI 없이 기본 버튼 표시
- [x] 인증 시: 아바타 + 드롭다운 (대시보드 링크, 로그아웃)
- [x] 미인증 시: "로그인"/"시작하기" 버튼 → `login()` 호출

---

## Scope

### 수정 대상 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/shared/layout/header.tsx` | Clerk 5개 임포트 제거, `usePrivyAuth()` 래퍼 사용 |
| `src/domains/dashboard/components/layout/dashboard-header.tsx` | 동일 패턴 |

### Before (Clerk, header.tsx)
```typescript
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

// 선언적 패턴
<SignedOut>
  <SignInButton mode="modal"><Button>로그인</Button></SignInButton>
  <SignUpButton mode="modal"><Button>시작하기</Button></SignUpButton>
</SignedOut>
<SignedIn>
  <UserButton />
</SignedIn>
```

### After (Privy, header.tsx)
```typescript
function usePrivyAuth() {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  if (!privyAppId) return { ready: true, authenticated: false, login: () => {}, logout: () => {}, user: null };
  const { usePrivy } = require("@privy-io/react-auth");
  return usePrivy();
}

// 훅 기반 패턴
const { ready, authenticated, login, logout } = usePrivyAuth();

{!authenticated ? (
  <>
    <Button onClick={login}>로그인</Button>
    <Button onClick={login}>시작하기</Button>
  </>
) : (
  <DropdownMenu>
    <Avatar />
    <DropdownItem href="/dashboard">대시보드</DropdownItem>
    <DropdownItem onClick={logout}>로그아웃</DropdownItem>
  </DropdownMenu>
)}
```

### 설계 결정
- **conditional require()**: `process.env.NEXT_PUBLIC_PRIVY_APP_ID` 미설정 시 `@privy-io/react-auth`를 import하지 않음. dev 모드에서 에러 방지.
- **`usePrivyAuth()` 래퍼**: Privy 키 없을 때 fallback 객체 리턴. 조건부 훅 호출 문제 해결.

### Side Effect 위험
- `/sign-in`, `/sign-up` 링크 제거됨 → Step 08에서 페이지도 삭제
- `UserButton` (Clerk) → 커스텀 드롭다운: UI 차이 발생 (의도적)

## FP/FN 검증

### False Positive: 0건
### False Negative: 0건

### 검증 통과: ✅

---

→ 다음: [Step 08: Sign-in/Sign-up 페이지 삭제](step-08-delete-pages.md)
