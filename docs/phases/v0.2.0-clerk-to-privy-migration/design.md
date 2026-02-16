# 설계 - v0.2.0

## 해결 방식

### 접근법
10단계 순차 마이그레이션. DB 스키마 → 코드 참조 → 패키지 → 핵심 인증 → 미들웨어 → Provider → UI → 페이지 삭제 → 웹훅 → 정리.
핵심 원칙: `getAuthUserId()` zero-arg 시그니처를 유지하여 12+ API 라우트 변경 회피.

### 대안 검토

| 방식 | 장점 | 단점 | 선택 |
|------|------|------|------|
| A: 점진적 전환 (Clerk + Privy 병행) | 롤백 용이, 무중단 | 두 프로바이더 동시 관리 복잡, Provider 충돌 위험 | ❌ |
| B: 빅뱅 전환 (10단계 순차) | 클린 전환, 코드 복잡도 최소 | 중간 빌드 실패 구간 존재 | ✅ |
| C: DB 컬럼 유지 (clerk_id 그대로) | DB 변경 비용 0 | 프로바이더 결합 지속, 혼란 유발 | ❌ |

**선택 이유**: B. 기존 유저 데이터가 없으므로 병행 기간 불필요. 빅뱅 전환이 코드 복잡도를 최소화.

### 기술 결정

1. **DB 컬럼 `auth_id`**: 프로바이더 독립적 네이밍. FK 5곳 원자적 변경 (마이그레이션 SQL)
2. **zero-arg `getAuthUserId()`**: `cookies()` from `next/headers`로 서버 사이드 토큰 추출. 12+ API 라우트 변경 불필요
3. **커스텀 미들웨어**: Privy에 미들웨어 없음 → `privy-token` 쿠키 존재만 확인, 검증은 API 라우트에서
4. **`?login=required` 패턴**: 미인증 리다이렉트 → URL 파라미터 → `LoginTrigger` 컴포넌트가 자동 모달 오픈
5. **conditional require()**: Privy 키 미설정 시에도 컴포넌트 렌더링 가능 (dev 모드 지원)
6. **웹훅 지갑 자동 등록**: `user.created` 시 `linked_accounts`에서 지갑 주소 추출 → wallets 테이블 자동 insert

## 구현 내용

### Phase 1: DB 스키마 마이그레이션
- P1: `db/init.sql` — `clerk_id` → `auth_id` (PK + FK 5곳)
- P2: `src/core/db/schema.ts` — Drizzle 스키마 동기화
- P3: `worker/src/lib/schema.ts` — Worker 스키마 동기화
- P4: `db/migrations/001_rename_clerk_id_to_auth_id.sql` — 마이그레이션 SQL 생성

### Phase 2: 코드 내 clerkId 참조 업데이트
- P5: `src/app/api/webhook/clerk/route.ts` — 변수명 `clerkId` → `authId`
- P6: `src/app/api/dashboard/settings/route.ts` — `users.clerkId` → `users.authId`
- P7: `src/app/api/dashboard/referral/route.ts` — `users.clerkId` → `users.authId`

### Phase 3: 패키지 교체
- P8: `npm install @privy-io/react-auth @privy-io/server-auth`

### Phase 4: Core Auth 교체
- P9: `src/core/auth/index.ts` — Clerk → Privy 서버 인증 (zero-arg 유지)

### Phase 5: 미들웨어 교체
- P10: `src/middleware.ts` — `clerkMiddleware` → 커스텀 미들웨어

### Phase 6: Provider 교체
- P11: `src/shared/providers/privy-provider.tsx` — 신규 생성
- P12: `src/shared/providers/index.ts` — export 변경
- P13: `src/app/layout.tsx` — Provider를 `<body>` 안으로 이동

### Phase 7: UI 컴포넌트 교체
- P14: `src/shared/layout/header.tsx` — Clerk 임포트 → `usePrivy()` 훅
- P15: `src/domains/dashboard/components/layout/dashboard-header.tsx` — 동일 패턴

### Phase 8: Sign-in/Sign-up 페이지 삭제
- P16: `src/app/sign-in/` 디렉토리 삭제
- P17: `src/app/sign-up/` 디렉토리 삭제

### Phase 9: 웹훅 마이그레이션
- P18: `src/app/api/webhook/privy/route.ts` — 신규 생성 (Privy 이벤트 데이터 + 지갑 자동 등록)
- P19: `src/app/api/webhook/clerk/` — 디렉토리 삭제

### Phase 10: Clerk 제거 + 정리
- P20: `npm uninstall @clerk/nextjs @clerk/themes`
- P21: `src/shared/providers/clerk-provider.tsx` — 삭제
- P22: `src/app/api/health/route.ts` — Clerk 참조 → Privy
- P23: 문서 5개 업데이트 (API-KEYS-GUIDE, INFRASTRUCTURE, FRONTEND-ARCHITECTURE, PRD, DESIGN-SPEC)
