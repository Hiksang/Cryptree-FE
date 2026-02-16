# Clerk → Privy 인증 마이그레이션 - v0.2.0

## 문제 정의

### 현상
- taxdao-FE는 블록체인/크립토 세금 분석 프로젝트이나, 인증에 Clerk(이메일/소셜 전용)을 사용 중
- 지갑 로그인 미지원 → Web3 유저 온보딩 불가
- DB 컬럼명 `clerk_id`가 프로바이더에 강하게 결합
- `/sign-in`, `/sign-up` 전용 페이지가 모달 기반 UX와 불일치

### 원인
- 초기 MVP에서 빠른 인증 구현을 위해 Clerk 채택
- 프로젝트 성격(Web3)과 인증 프로바이더(Web2) 간 미스매치

### 영향
- 지갑 연동이 핵심 기능인데 로그인 시 지갑 연결 불가
- 이메일 유저에게 임베디드 월렛 생성 불가
- Web3 유저 이탈 위험

### 목표
- Clerk → Privy 전환: 지갑 + 이메일 로그인 지원
- DB 컬럼 `clerk_id` → `auth_id` (프로바이더 독립적)
- 로그인 UI: 모달 전용 (`/sign-in`, `/sign-up` 삭제)
- 기존 API 라우트 시그니처 유지 (변경 최소화)

## 성공 기준
- [x] `npm run build` 빌드 성공 (TypeScript 0 에러)
- [x] `grep -r "clerk" src/` 결과 0건
- [x] `getAuthUserId()` zero-arg 시그니처 유지 (API 라우트 변경 불필요)
- [x] dev 모드 (Privy 키 없음) 정상 동작 (`dev_user_001` 자동 로그인)
- [x] DB 마이그레이션 SQL 생성 (`db/migrations/001_rename_clerk_id_to_auth_id.sql`)
- [x] 문서 5개 Clerk → Privy 참조 업데이트

## 제약사항
- 기존 유저 데이터 없음 (클린 전환)
- 12+ API 라우트의 `getAuthUserId()` 호출 패턴 변경 불가 (zero-arg 유지)
- Svix 웹훅 검증 로직 유지 (Privy도 Svix 사용)
- dev 모드 지원 필수 (Privy 키 없이도 동작)
