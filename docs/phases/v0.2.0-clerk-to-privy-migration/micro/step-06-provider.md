# Step 06: Provider 교체

## 메타데이터
- **난이도**: 🟡 보통
- **롤백 가능**: ✅
- **선행 조건**: Step 05

---

## 1. 구현 내용 (design.md: P11-P13)
- `src/shared/providers/privy-provider.tsx` — 신규 생성
  - `ConditionalPrivyProvider`: Privy 키 있으면 PrivyProvider 래핑, 없으면 pass-through
  - `LoginTrigger`: `?login=required` 감지 시 자동 모달 오픈
- `src/shared/providers/index.ts` — export 변경
- `src/app/layout.tsx` — Provider를 `<body>` 안으로 이동

## 2. 완료 조건
- [x] `privy-provider.tsx` 존재
- [x] `ConditionalPrivyProvider` export
- [x] `LoginTrigger` 컴포넌트: `?login=required` 시 `login()` 호출 + URL 파라미터 제거
- [x] `layout.tsx`에서 Provider가 `<body>` 안에 위치 (Privy 요구사항)
- [x] dev 모드: Provider 없이 children만 렌더링

---

## Scope

### 신규 생성 파일

| 파일 | 내용 |
|------|------|
| `src/shared/providers/privy-provider.tsx` | PrivyProvider + LoginTrigger |

### 수정 대상 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/shared/providers/index.ts` | `ConditionalClerkProvider` → `ConditionalPrivyProvider` |
| `src/app/layout.tsx` | Provider를 `<html>` 바깥 → `<body>` 안으로 이동 |

### PrivyProvider 설정
```typescript
config={{
  appearance: {
    theme: "dark",
    accentColor: "#00D4AA",      // brand-primary
  },
  loginMethods: ["wallet", "email"],
  embeddedWallets: {
    ethereum: {
      createOnLogin: "users-without-wallets",  // 이메일 유저에게 자동 지갑 생성
    },
  },
}}
```

### LoginTrigger 동작
```
1. URL에 ?login=required 감지
2. Privy ready && !authenticated 확인
3. login() 호출 → 모달 오픈
4. URL에서 ?login=required 파라미터 제거
```

### Side Effect 위험
- `embeddedWallets.createOnLogin`의 위치가 Privy 버전에 따라 변경됨 (빌드 시 발견: `ethereum` 하위로 이동)
- `LoginTrigger`의 `useSearchParams()`는 Suspense boundary 필요할 수 있음

## FP/FN 검증

### False Positive: 0건
### False Negative: 0건

### 검증 통과: ✅

---

→ 다음: [Step 07: UI 컴포넌트 교체](step-07-ui-components.md)
