# CLAUDE.md — AI 에이전트 작업 규칙

이 파일은 AI 에이전트(Claude Code 등)가 이 프로젝트에서 작업할 때 반드시 따라야 하는 규칙을 정의합니다.

---

## 절대 변경 금지 사항 (DO NOT MODIFY)

### 1. 랜딩페이지 Header 시작하기 버튼
- **파일**: `src/shared/layout/header.tsx`
- 비로그인 상태에서 **"시작하기" 버튼이 반드시** 존재해야 함 (별도 "로그인" 버튼 없음)
- `AuthButtons`(데스크톱)와 `MobileAuthButtons`(모바일) 모두 해당
- 리팩토링, UI 정리, 랜딩 리뉴얼 등 어떤 작업에서도 이 버튼을 제거하지 말 것
- `if (!ready) return null;` 패턴 금지 — Privy SDK 미초기화 시 버튼이 아예 안 보이는 원인. `ready && authenticated` 조건만 사용할 것
- `usePrivy()`는 반드시 정적 import 사용 (동적 `require()` 금지 — Provider 컨텍스트 못 찾음)
