# Step 07: Config + Cleanup + Verification

## 메타데이터
- **난이도**: 🟢 쉬움
- **롤백 가능**: ✅
- **선행 조건**: Step 06

---

## 1. 구현 내용 (design.md: F4, G1-G3)

### F4: Config 업데이트
- `tsconfig.json`: `"@/*": ["./*"]` → `"@/*": ["./src/*"]`
- `drizzle.config.ts`: `schema: "./lib/schema.ts"` → `schema: "./src/core/db/schema.ts"`

### G1: 구 디렉토리 삭제
- `rm -rf app/ components/ lib/`
- `middleware.ts` (root에 있던 원본) 삭제

### G2: 빌드 검증
- `node_modules/.bin/tsc --noEmit` — 타입 에러 0건
- `npm run build` — 빌드 성공

### G3: 잔여 import + 레이어 위반 검증
- `grep -r "@/lib/" src/` → 0건
- `grep -r "@/components/" src/` → 0건
- `grep -r "from \"react" src/core/` → 0건 (core React-free)
- `grep -r "@/shared/" src/core/` → 0건 (core→shared 위반 없음)
- `grep -r "@/domains/" src/core/` → 0건 (core→domains 위반 없음)
- `grep -r "@/domains/" src/shared/` → 0건 (shared→domains 위반 없음)

## 2. 완료 조건
- [ ] `tsconfig.json`의 `@/*` paths가 `./src/*`를 가리킴
- [ ] `drizzle.config.ts`의 schema 경로가 `./src/core/db/schema.ts`
- [ ] root에 `app/`, `components/`, `lib/` 디렉토리 없음
- [ ] root에 `middleware.ts` 없음 (src/middleware.ts만 존재)
- [ ] `tsc --noEmit` exit code 0
- [ ] `npm run build` exit code 0
- [ ] 잔여 old import 0건 (`@/lib/`, `@/components/`)
- [ ] 레이어 위반 0건 (core→shared, core→domains, shared→domains)
- [ ] core/ 내부 React import 0건

---

## Scope

### 수정 대상 파일
```
tsconfig.json         # paths: @/* → ./src/*
drizzle.config.ts     # schema 경로 → ./src/core/db/schema.ts
```

### 삭제 대상
```
app/                  # src/app/로 이동 완료
components/           # src/domains, src/shared로 이동 완료
lib/                  # src/core, src/domains/dashboard로 이동 완료
middleware.ts         # src/middleware.ts로 이동 완료
```

### Side Effect 위험
- tsconfig.json 변경 시 IDE 재시작 필요할 수 있음
- drizzle.config.ts는 migration 명령에만 영향

## FP/FN 검증

### False Positive: 0건
### False Negative: 0건
### 검증 통과: ✅
(config 변경 + 삭제 + 검증만, 코드 로직 변경 없음)
