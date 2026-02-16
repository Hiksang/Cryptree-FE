# Step 01: web→root + src 구조 생성

## 메타데이터
- **난이도**: 🟢 쉬움
- **롤백 가능**: ✅
- **선행 조건**: 없음

---

## 1. 구현 내용 (design.md: A1, A2)
- `web/` 내용을 taxdao-FE root로 이동 (app/, components/, lib/, configs)
- `web/` 디렉토리 삭제
- `npm install`로 의존성 확인
- `src/` 하위 4계층 디렉토리 구조 생성 (core, shared, domains, app)

## 2. 완료 조건
- [ ] `web/` 디렉토리가 존재하지 않음
- [ ] `package.json`이 taxdao-FE root에 위치
- [ ] `npm install` 성공 (exit code 0)
- [ ] `src/core/{types,utils,constants,mock,db,auth}` 디렉토리 존재
- [ ] `src/shared/{layout,providers,ui,store}` 디렉토리 존재
- [ ] `src/domains/{scan,identity,pnl,tax,landing}/components` 디렉토리 존재
- [ ] `src/domains/dashboard/{components/{layout,overview,pnl,portfolio,tax,transactions,settings,rewards,referral,leaderboard,exchange},hooks,lib}` 디렉토리 존재
- [ ] `src/app/` 디렉토리 존재 (하위 구조 포함)

---

## Scope

### 수정 대상 파일
없음 (디렉토리 이동만)

### 이동 대상
```
web/ → taxdao-FE root
├── app/           → app/
├── components/    → components/
├── lib/           → lib/
├── middleware.ts   → middleware.ts
├── package.json   → package.json (이미 존재 시 web/ 것으로 교체)
├── tsconfig.json  → tsconfig.json
├── next.config.ts → next.config.ts
├── postcss.config.mjs → postcss.config.mjs
└── drizzle.config.ts  → drizzle.config.ts
```

### 신규 생성 디렉토리
```
src/
├── core/{types,utils,constants,mock,db,auth}
├── shared/{layout,providers,ui,store}
├── domains/{scan,identity,pnl,tax,landing}/components
├── domains/dashboard/{components/{layout,overview,pnl,portfolio,tax,transactions,settings,rewards,referral,leaderboard,exchange},hooks,lib}
└── app/ (하위 구조 포함)
```

### Side Effect 위험
- root에 이미 존재하는 package.json/tsconfig.json 등과 충돌 가능 → web/ 것으로 덮어쓰기
- node_modules 재설치 필요

## FP/FN 검증

### False Positive: 0건
### False Negative: 0건
### 검증 통과: ✅
(디렉토리 생성만, 코드 변경 없음)

---

→ 다음: [Step 02: Core Layer](step-02-core.md)
