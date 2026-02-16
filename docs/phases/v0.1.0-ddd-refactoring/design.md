# 설계 - v1.0.0

## 해결 방식

### 접근법
DDD 4계층 아키텍처로 전환. 의존성 방향: app(3) → domains(2) → shared(1) → core(0). core는 React-free 원칙.

**2단계 전환:**
1. `web/` 내용을 root로 flatten
2. flat 구조(`app/`, `components/`, `lib/`)를 `src/` 4계층으로 재배치

### 대안 검토

| 방식 | 장점 | 단점 | 선택 |
|------|------|------|------|
| A: Feature-based (co-location) | 도메인별 완전 독립 | types/utils 중복, 75파일 규모에선 과잉 | ❌ |
| B: DDD 4계층 | 레이어 의존성 명확, 기존 구조에서 자연스러운 전환 | barrel 파일 증가(~29개) | ✅ |
| C: 단순 폴더 정리 | 작업량 최소 | 근본적 구조 개선 없음 | ❌ |

**선택 이유**: B는 core(React-free) 원칙으로 순수 로직 격리 가능. 현재 규모(75파일)에 적합하며, 기존 flat 구조에서 자연스럽게 전환 가능.

### 기술 결정

1. **core React-free**: types, utils, constants, mock, db, auth → React import 없음
2. **constants 통합**: `mock-data.ts`의 CHAIN_COLORS + `constants.ts`의 NAV_ITEMS → `core/constants/` 단일 파일
3. **types.ts 통합 유지**: 355줄이지만 ScanResult 중심 단일 aggregate. 분리 시 cross-import만 증가
4. **api-client → dashboard/lib**: React-free이나 dashboard 전용 → 도메인 귀속
5. **store → shared**: zustand hook은 React 의존 + cross-domain 공유
6. **cross-domain 허용**: 동일 레이어(domains) 간 import 허용 (hero→scan, scan-tabs→identity/pnl/tax)
7. **barrel exports**: 모든 모듈 경계에 index.ts

## 구현 내용

### A. 사전 준비
- A1: `web/` → root flatten (파일 이동, npm install)
- A2: `src/` 디렉토리 구조 생성

### B. Core Layer (Layer 0)
- B1: `types.ts` 이동 (변경 없음)
- B2: `utils.ts` 이동 (변경 없음)
- B3: `constants.ts` + `mock-data.ts` constants 통합 → `core/constants/`
- B4: `mock-data.ts` mocks 분리 → `core/mock/`
- B5: `schema.ts` + `db.ts` 이동 → `core/db/`
- B6: `auth.ts` 이동 → `core/auth/`
- B7: `core/index.ts` barrel 생성

### C. Shared Layer (Layer 1)
- C1: layout (header, footer) 이동 + import 수정
- C2: providers (clerk-provider, query-provider) 이동
- C3: ui (5 컴포넌트) 이동 + import 수정
- C4: store 이동 + import 수정
- C5: barrel exports 생성

### D. Domains Layer (Layer 2) - 소규모 5개
- D1: identity (4 컴포넌트) 이동 + import 수정
- D2: pnl (2 컴포넌트) 이동 + import 수정
- D3: tax (1 컴포넌트) 이동 + import 수정
- D4: scan (3 컴포넌트) 이동 + import 수정 (cross-domain 참조 포함)
- D5: landing (3 컴포넌트) 이동 + import 수정

### E. Dashboard Domain (Layer 2) - 대규모
- E1: dashboard/lib (api-client) + hooks (use-dashboard-queries) 이동
- E2: dashboard/components (42개) 이동 + import 일괄 수정
- E3: barrel exports 생성

### F. App Layer (Layer 3) + Config
- F1: pages (18개) 이동 + import 수정
- F2: API routes (13개) 이동 + import 수정
- F3: middleware.ts 이동
- F4: tsconfig.json, drizzle.config.ts 경로 업데이트

### G. 정리 + 검증
- G1: 구 디렉토리 삭제 (app/, components/, lib/)
- G2: tsc --noEmit + npm run build
- G3: 잔여 import / 레이어 위반 검증
