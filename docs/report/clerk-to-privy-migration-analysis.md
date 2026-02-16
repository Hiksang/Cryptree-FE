# Clerk → Privy 인증 마이그레이션 분석

> 인증 프로바이더 전환의 필요성, 사이드이펙트 분석, 기술 스택 재정의

---

## 개요

DDD 4계층 리팩토링(v0.1.0) 완료 후, taxdao-FE의 인증 프로바이더를 Clerk에서 Privy로 전환.
핵심 질문: **Web3 프로젝트에 Clerk이 적합한가? Privy 전환 시 사이드이펙트는 무엇인가?**

---

## 1. 현재 인증 아키텍처 (Clerk)

### 사용 중인 Clerk 기능

| 기능 | 구현 위치 | 설명 |
|------|-----------|------|
| ClerkProvider | `src/shared/providers/clerk-provider.tsx` | 앱 전체 인증 컨텍스트 |
| clerkMiddleware | `src/middleware.ts` | 보호 라우트 자동 리다이렉트 |
| getAuth() | `src/core/auth/index.ts` | 서버 사이드 유저 ID 추출 |
| SignInButton/SignUpButton | `src/shared/layout/header.tsx` | 헤더 인증 버튼 |
| SignedIn/SignedOut | `src/shared/layout/header.tsx` | 조건부 렌더링 |
| UserButton | `src/shared/layout/header.tsx` | 유저 아바타 드롭다운 |
| Svix Webhook | `src/app/api/webhook/clerk/route.ts` | 유저 생성/삭제 동기화 |

### 인증 데이터 흐름

```
브라우저                    Clerk                    taxdao-FE
━━━━━━━━                   ━━━━━                    ━━━━━━━━━
로그인 클릭                  ↓
  → Clerk 모달 ← ─ ─ ─ ─ ─ 호스팅됨
  → 이메일/Google 인증        ↓
  → 세션 쿠키 설정            ↓
                             Webhook ──────────→  /api/webhook/clerk
                             user.created          → DB users 테이블 insert

API 요청 (쿠키 포함)                                 ↓
  ──────────────────────────────────────────→  getAuth() → clerk_id 추출
                                                → DB 조회 → 응답
```

### DB 스키마 의존성

```sql
users (clerk_id TEXT PRIMARY KEY)
  ← wallets (user_id REFERENCES users(clerk_id))
  ← transactions (user_id REFERENCES users(clerk_id))
  ← point_balances (user_id REFERENCES users(clerk_id))
  ← point_ledger (user_id REFERENCES users(clerk_id))
  ← exchange_history (user_id REFERENCES users(clerk_id))
```

- `clerk_id`가 PK이자 5개 FK의 참조 대상
- Clerk 프로바이더에 강하게 결합된 네이밍

---

## 2. 전환 필요성

### Clerk의 한계

| 항목 | Clerk | 설명 |
|------|-------|------|
| 지갑 로그인 | ❌ 미지원 | Web3 Auth가 핵심인 프로젝트에 치명적 |
| 임베디드 월렛 | ❌ 미지원 | 이메일 유저에게 지갑 자동 생성 불가 |
| 체인 추상화 | ❌ | 멀티체인 지갑 관리 불가 |
| 가격 | $25/MAU 1K+ | 소규모에서도 비용 발생 |

### Privy의 장점

| 항목 | Privy | 설명 |
|------|-------|------|
| 지갑 로그인 | ✅ MetaMask, WalletConnect 등 | Web3 네이티브 |
| 임베디드 월렛 | ✅ createOnLogin | 이메일 유저에게 자동 지갑 생성 |
| 이메일 로그인 | ✅ OTP 기반 | 기존 이메일 로그인 유지 |
| 링크드 어카운트 | ✅ linked_accounts | 웹훅에서 지갑 주소 자동 추출 |
| 모달 전용 UI | ✅ login() 호출 | 별도 페이지 불필요 |

### 전환 결정 요약

```
Clerk:  이메일/소셜 전용 → Web3 프로젝트에 부적합
Privy:  지갑 + 이메일 → Web3 네이티브 + 기존 이메일 유저 모두 지원
```

---

## 3. 사이드이펙트 분석

### 영향도별 분류

| # | 사이드이펙트 | 영향도 | 영향 범위 | 해결 전략 |
|---|------------|--------|----------|----------|
| 1 | `getAuthUserId()` 시그니처 변경 위험 | **높음** | 12+ API 라우트 | `cookies()` from `next/headers`로 zero-arg 유지 |
| 2 | 미들웨어 대체 필요 (Privy에 미들웨어 없음) | **중간** | 1 파일 + 라우트 보호 | 커스텀 미들웨어: 쿠키 존재 확인 + 리다이렉트 |
| 3 | `/sign-in`, `/sign-up` 삭제 시 링크 깨짐 | **중간** | 2 페이지 + 참조 | 모든 참조를 `login()` 호출로 교체 |
| 4 | Provider 위치 변경 (html 바깥 → body 안) | **중간** | layout.tsx | layout.tsx 재구조화 |
| 5 | 클라이언트 컴포넌트 패턴 변경 | **중간** | 헤더 2개 | `<SignedIn>` 선언적 → `usePrivy()` 훅 기반 |
| 6 | User ID 포맷 변경 | **낮음** | DB TEXT 컬럼 | `user_2xxx` → `did:privy:clxxx`, TEXT라 호환 |
| 7 | 웹훅 데이터 구조 차이 | **중간** | 웹훅 라우트 | Privy도 Svix 사용, 이벤트 데이터 구조만 적응 |
| 8 | 지갑 주소 자동 획득 기회 | **긍정적** | 웹훅 | `linked_accounts`로 지갑 자동 등록 |

### 사이드이펙트 #1 상세 (가장 위험)

```
현재 getAuthUserId():
  import { getAuth } from "@clerk/nextjs/server"
  → getAuth(request) 또는 auth() 호출
  → 12+ API 라우트에서 사용

위험: 시그니처 변경 시 12개 파일 모두 수정 필요
해결: zero-arg 유지 → cookies()에서 privy-token 추출 → 서버 검증
결과: API 라우트 변경 0건
```

### 사이드이펙트 #3 상세

```
현재:
  헤더: "로그인" → /sign-in 링크
  헤더: "시작하기" → /sign-up 링크
  미들웨어: 미인증 → /sign-in 리다이렉트

전환 후:
  헤더: "로그인" → login() 호출 (모달)
  헤더: "시작하기" → login() 호출 (모달)
  미들웨어: 미인증 → /?login=required 리다이렉트 → LoginTrigger 자동 모달
```

---

## 4. DB 컬럼 네이밍 결정

### 옵션 비교

| 옵션 | 장점 | 단점 |
|------|------|------|
| `clerk_id` → `privy_id` | 명확한 프로바이더 표시 | 다음 전환 시 또 변경 필요 |
| `clerk_id` → `auth_id` | 프로바이더 독립적 | 기존 대비 의미 약간 모호 |
| `clerk_id` 유지 | 변경 비용 0 | 실제 Privy ID인데 이름이 clerk |

### 결정: `auth_id`

```
이유:
1. 프로바이더 독립적 → 향후 Auth0, Firebase 등으로 전환해도 변경 불필요
2. FK 참조 5곳 모두 일괄 변경 → 마이그레이션 SQL로 원자적 처리
3. 신규 프로젝트 상태 (기존 유저 데이터 없음) → 변경 비용 최소
```

---

## 5. 최종 아키텍처 비교

### Before (Clerk)

```
패키지:      @clerk/nextjs, @clerk/themes
인증 방식:   이메일 + Google (소셜)
로그인 UI:   /sign-in, /sign-up 전용 페이지
미들웨어:    clerkMiddleware (Clerk 제공)
서버 인증:   getAuth(request) from @clerk/nextjs/server
DB PK:       clerk_id
웹훅:        /api/webhook/clerk (user.created/deleted)
Provider:    <html> 바깥 래핑
```

### After (Privy)

```
패키지:      @privy-io/react-auth, @privy-io/server-auth
인증 방식:   지갑 + 이메일 (OTP)
로그인 UI:   모달 전용 (login() 호출)
미들웨어:    커스텀 (privy-token 쿠키 확인)
서버 인증:   PrivyClient.verifyAuthToken(token) + cookies()
DB PK:       auth_id (프로바이더 독립적)
웹훅:        /api/webhook/privy (user.created/deleted + 지갑 자동 등록)
Provider:    <body> 안 래핑
```

### 기술 스택 확정

```
호스팅:  Vercel (Next.js)
인증:    Privy (지갑 + 이메일)
DB:      Supabase (PostgreSQL)
Worker:  별도 서비스 (Redis 큐 + Etherscan/Blockscout)
```

---

## 결론

1. **Clerk는 Web3 프로젝트에 부적합**. 지갑 로그인/임베디드 월렛 미지원이 핵심 결함.
2. **Privy 전환 시 가장 큰 위험은 `getAuthUserId()` 시그니처 변경**(사이드이펙트 #1). zero-arg 유지로 12+ API 라우트 변경 회피.
3. **DB 컬럼 `clerk_id` → `auth_id`로 프로바이더 독립화**. 기존 유저 없으므로 변경 비용 최소.
4. **`/sign-in`, `/sign-up` 페이지 삭제 → 모달 전용**. `?login=required` 파라미터로 자동 모달 트리거.
5. **웹훅에서 `linked_accounts` 활용 → 지갑 자동 등록**. Clerk에 없던 기능이 Privy 전환으로 추가.

---

**작성일**: 2026-02-17 KST
