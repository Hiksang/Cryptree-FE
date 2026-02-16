# Step 01: DB 스키마 마이그레이션

## 메타데이터
- **난이도**: 🟡 보통
- **롤백 가능**: ✅
- **선행 조건**: 없음

---

## 1. 구현 내용 (design.md: P1-P4)
- `db/init.sql` — `clerk_id TEXT PRIMARY KEY` → `auth_id TEXT PRIMARY KEY`, FK 참조 5곳 업데이트
- `src/core/db/schema.ts` — `clerkId: text("clerk_id")` → `authId: text("auth_id")`, FK `.references(() => users.authId)` 5곳
- `worker/src/lib/schema.ts` — 동일하게 변경
- `db/migrations/001_rename_clerk_id_to_auth_id.sql` — 마이그레이션 SQL 신규 생성

## 2. 완료 조건
- [x] `db/init.sql`에서 `clerk_id` 0건
- [x] `src/core/db/schema.ts`에서 `clerkId` / `clerk_id` 0건
- [x] `worker/src/lib/schema.ts`에서 `clerkId` / `clerk_id` 0건
- [x] `db/migrations/001_rename_clerk_id_to_auth_id.sql` 존재
- [x] 마이그레이션 SQL이 트랜잭션으로 래핑 (BEGIN/COMMIT)

---

## Scope

### 수정 대상 파일

| 파일 | 변경 내용 |
|------|----------|
| `db/init.sql` | PK `clerk_id` → `auth_id`, FK 참조 5곳, 주석 변경 |
| `src/core/db/schema.ts` | `clerkId` → `authId` (변수명), `clerk_id` → `auth_id` (컬럼명), FK 5곳 |
| `worker/src/lib/schema.ts` | 동일 |

### 신규 생성 파일
```
db/migrations/001_rename_clerk_id_to_auth_id.sql
```

마이그레이션 SQL 구조:
```sql
BEGIN;
  -- 1. FK 제약 5개 DROP
  -- 2. RENAME COLUMN clerk_id → auth_id
  -- 3. FK 제약 5개 RE-CREATE (auth_id 참조)
COMMIT;
```

### 의존성 분석

**users.clerk_id FK 참조 테이블:**
- `wallets.user_id` → `users(clerk_id)`
- `transactions.user_id` → `users(clerk_id)`
- `point_balances.user_id` → `users(clerk_id)`
- `point_ledger.user_id` → `users(clerk_id)`
- `exchange_history.user_id` → `users(clerk_id)`

### Side Effect 위험
- Phase 2와 원자적으로 수행 필요 (스키마 변경 후 코드 참조도 즉시 변경해야 빌드 통과)
- 기존 DB에 데이터가 있으면 마이그레이션 SQL 필수 (현재는 신규 프로젝트라 init.sql만으로 충분)

## FP/FN 검증

### False Positive: 0건
### False Negative: 0건

| 구현 내용 | Scope 포함 | 판정 |
|----------|-----------|------|
| P1: init.sql 변경 | db/init.sql | ✅ |
| P2: Drizzle 스키마 변경 | src/core/db/schema.ts | ✅ |
| P3: Worker 스키마 변경 | worker/src/lib/schema.ts | ✅ |
| P4: 마이그레이션 SQL | db/migrations/001_... | ✅ |

### 검증 통과: ✅

---

→ 다음: [Step 02: 코드 내 clerkId 참조 업데이트](step-02-code-refs.md)
