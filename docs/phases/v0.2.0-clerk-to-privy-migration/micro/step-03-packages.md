# Step 03: Privy 패키지 설치

## 메타데이터
- **난이도**: 🟢 쉬움
- **롤백 가능**: ✅
- **선행 조건**: Step 02

---

## 1. 구현 내용 (design.md: P8)
- `npm install @privy-io/react-auth @privy-io/server-auth`
- 아직 Clerk 패키지 유지 (Phase 10에서 제거)

## 2. 완료 조건
- [x] `package.json`에 `@privy-io/react-auth` 존재
- [x] `package.json`에 `@privy-io/server-auth` 존재
- [x] `npm install` 성공 (exit code 0)

---

## Scope

### 수정 대상 파일

| 파일 | 변경 내용 |
|------|----------|
| `package.json` | dependencies에 2개 패키지 추가 |

### 환경변수 (준비)
```bash
NEXT_PUBLIC_PRIVY_APP_ID=...    # Privy 대시보드에서 발급
PRIVY_APP_SECRET=...             # Privy 대시보드에서 발급
PRIVY_WEBHOOK_SECRET=...         # Privy 웹훅 설정 시 발급
```

### Side Effect 위험
- `@privy-io/server-auth`는 deprecated (향후 `@privy-io/node`로 전환 권장)
- Clerk 패키지와 동시 설치 시 충돌 없음 (서로 독립적)

## FP/FN 검증

### False Positive: 0건
### False Negative: 0건

### 검증 통과: ✅

---

→ 다음: [Step 04: Core Auth 교체](step-04-core-auth.md)
