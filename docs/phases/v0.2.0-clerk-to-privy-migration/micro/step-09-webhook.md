# Step 09: 웹훅 마이그레이션

## 메타데이터
- **난이도**: 🟡 보통
- **롤백 가능**: ✅
- **선행 조건**: Step 08

---

## 1. 구현 내용 (design.md: P18-P19)
- `src/app/api/webhook/privy/route.ts` — 신규 생성 (Clerk 웹훅 기반으로 Privy 이벤트 적응)
- `src/app/api/webhook/clerk/` — 디렉토리 삭제
- 지갑 주소 자동 등록 기능 추가 (Clerk에 없던 기능)

## 2. 완료 조건
- [x] `src/app/api/webhook/privy/route.ts` 존재
- [x] `src/app/api/webhook/clerk/` 디렉토리 미존재
- [x] Svix 검증 로직 유지 (Privy도 Svix 사용)
- [x] `user.created` → users 테이블 insert + 포인트 초기화
- [x] `user.created` → `linked_accounts`에서 지갑 추출 → wallets 테이블 자동 insert
- [x] `user.deleted` → users 테이블 delete

---

## Scope

### 신규 생성 파일

| 파일 | 내용 |
|------|------|
| `src/app/api/webhook/privy/route.ts` | Privy 웹훅 핸들러 |

### 삭제 대상

| 파일 | 이유 |
|------|------|
| `src/app/api/webhook/clerk/route.ts` | Privy 웹훅으로 대체 |

### 이벤트 데이터 구조 비교

**Clerk**
```json
{
  "type": "user.created",
  "data": {
    "id": "user_2xxx",
    "email_addresses": [{"email_address": "..."}]
  }
}
```

**Privy**
```json
{
  "type": "user.created",
  "data": {
    "user": {
      "id": "did:privy:clxxx",
      "linked_accounts": [
        {"type": "wallet", "address": "0x..."},
        {"type": "email", "address": "user@example.com"}
      ]
    }
  }
}
```

### 지갑 자동 등록 (신규 기능)
```typescript
// user.created 이벤트에서 지갑 추출
const walletAccount = user.linked_accounts?.find(
  (a: { type: string }) => a.type === "wallet"
);
if (walletAccount?.address) {
  await db.insert(wallets).values({
    userId: user.id,
    address: walletAccount.address.toLowerCase(),
    chain: "ethereum",
    isPrimary: true,
  });
}
```

### Side Effect 위험
- 환경변수 변경: `CLERK_WEBHOOK_SECRET` → `PRIVY_WEBHOOK_SECRET`
- Privy 대시보드에서 웹훅 엔드포인트 URL 변경 필요: `/api/webhook/clerk` → `/api/webhook/privy`

## FP/FN 검증

### False Positive: 0건
### False Negative: 0건

### 검증 통과: ✅

---

→ 다음: [Step 10: Clerk 제거 + 정리](step-10-cleanup.md)
