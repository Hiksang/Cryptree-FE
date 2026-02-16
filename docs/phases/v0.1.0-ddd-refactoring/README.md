# DDD 4계층 아키텍처 리팩토링 - v1.0.0

## 문제 정의

### 현상
- 75+ 소스 파일이 `web/` 하위 flat 구조(`app/`, `components/`, `lib/`)에 혼재
- `lib/` 디렉토리에 React-free 순수 로직(types, utils, schema)과 React 의존 코드(store, query-provider, hooks)가 섞여 있음
- `components/` 디렉토리에 공통 UI(layout, ui)와 도메인별 비즈니스 컴포넌트(dashboard/42개, scan, identity 등)가 구분 없이 존재
- `mock-data.ts`(661줄)에 constants와 mock data가 단일 파일에 통합

### 원인
- Phase 0 MVP(22파일)에서 Phase 2+3(75+파일)으로 급속 확장하면서 구조 정리 없이 기능만 추가
- flat 구조는 소규모에서 효율적이지만, 규모 증가 시 레이어/도메인 경계가 모호해짐
- `web/` 서브디렉토리가 불필요하게 존재 (taxdao-FE가 root여야 함)

### 영향
- 새 기능 추가 시 파일 위치/import 경로 결정에 혼란
- React-free 코드와 React 코드의 의존성 방향 관리 불가
- 도메인 간 경계 부재로 의도치 않은 결합 발생 가능
- 코드 리뷰 시 변경 영향 범위 파악 어려움

### 목표
- DDD 4계층 `src/` 구조로 전환: core(0) → shared(1) → domains(2) → app(3)
- `web/` 디렉토리 제거, `taxdao-FE`를 프로젝트 root로 사용
- 레이어 의존성 규칙 확립 (외부→내부만 import, core는 React-free)
- 기존 기능 100% 유지 (리팩토링 only, 기능 변경 없음)

## 성공 기준
- [ ] `tsc --noEmit` 타입 체크 0 에러
- [ ] `npm run build` 빌드 성공
- [ ] 잔여 old import 0건 (`@/lib/`, `@/components/` 검색)
- [ ] 레이어 위반 0건 (core→shared/domains/app import 없음)
- [ ] `web/` 디렉토리 완전 제거
- [ ] dev 서버 실행 + 주요 페이지 정상 로드 (`/`, `/dashboard`)

## 제약사항
- 기능 변경 없음 (순수 파일 이동 + import 경로 변경)
- 기존 Next.js App Router 구조 유지 (src/app/)
- 외부 의존성 변경 없음
