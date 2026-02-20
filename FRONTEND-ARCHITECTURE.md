# Frontend Architecture: HyperView

> Phase 0 MVP 중심 프론트엔드 설계
> PRD v4.0 기반 | HyperEVM 온체인 활동 분석 & 보상 포지셔닝

---

## 1. 기술 스택

```
Framework:    Next.js 14+ (App Router)
Language:     TypeScript
Auth:         Privy (@privy-io/react-auth)
Styling:      Tailwind CSS 4
Components:   shadcn/ui
Charts:       Recharts (PnL 차트) + custom SVG (DNA 바)
OG Image:     @vercel/og (satori)
State:        Zustand (클라이언트) + React Query (서버)
Analytics:    Mixpanel (이벤트) + Vercel Analytics (웹 바이탈)
Deploy:       Vercel (무료 티어 → Pro)
```

### 왜 이 스택인가

| 선택 | 이유 |
|------|------|
| Next.js App Router | OG 이미지 API Route + SSR + ISR 퍼블릭 프로필 |
| Privy | 지갑/이메일 로그인 통합. Web3 네이티브 인증. 임베디드 월렛 지원 |
| shadcn/ui | 복사-붙여넣기 방식, 번들 작음, 커스텀 자유 |
| Recharts | 가볍고 React 네이티브, PnL 차트에 충분 |
| Zustand | Redux 대비 보일러플레이트 최소, 작은 앱에 적합 |
| React Query | 백엔드 API 캐싱, 로딩/에러 상태 자동 관리 |

---

## 2. 프로젝트 구조

```
hyperview-web/
├── app/
│   ├── layout.tsx                    # 루트 레이아웃 (PrivyProvider, 폰트, 메타데이터)
│   ├── page.tsx                      # 랜딩 페이지
│   ├── globals.css                   # Tailwind + 커스텀 CSS
│   │
│   ├── sign-in/[[...sign-in]]/
│   │   └── page.tsx                  # Privy 로그인 (이메일/소셜/지갑)
│   ├── sign-up/[[...sign-up]]/
│   │   └── page.tsx                  # Privy 회원가입
│   │
│   ├── address/
│   │   └── [address]/
│   │       ├── page.tsx              # 스캔 결과 / 퍼블릭 프로필 (비로그인 가능)
│   │       └── loading.tsx           # 프로그레시브 로딩 UI
│   │
│   ├── r/
│   │   └── [code]/
│   │       └── page.tsx              # 레퍼럴 리다이렉트 → 랜딩
│   │
│   ├── api/
│   │   ├── og/
│   │   │   └── [address]/
│   │   │       └── route.tsx         # OG 이미지 생성 (Edge)
│   │   └── webhooks/
│   │       └── clerk/
│   │           └── route.ts          # Privy webhook → 유저 DB 동기화
│   │
│   ├── (authenticated)/              # Privy 미들웨어로 보호
│   │   ├── layout.tsx                # 사이드바 레이아웃
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── portfolio/
│   │   │   └── page.tsx
│   │   ├── pnl/
│   │   │   └── page.tsx
│   │   ├── tax/
│   │   │   └── page.tsx
│   │   ├── transactions/
│   │   │   └── page.tsx
│   │   ├── rewards/                  # Phase 2
│   │   │   └── page.tsx
│   │   └── referral/                 # Phase 2
│   │       └── page.tsx
│   │
│   └── not-found.tsx
│
├── middleware.ts                      # Privy auth middleware
│
├── components/
│   ├── landing/
│   │   ├── hero.tsx                  # 히어로 섹션 + 지갑 입력
│   │   ├── features.tsx              # 3개 가치 카드
│   │   ├── comparison-table.tsx      # DeBank vs Koinly vs HyperView
│   │   └── waitlist-form.tsx         # 이메일 수집
│   │
│   ├── scan/
│   │   ├── scan-input.tsx            # 지갑 주소 입력 + 검증
│   │   ├── scan-progress.tsx         # 프로그레시브 스캔 로딩
│   │   ├── scan-tabs.tsx             # Overview / PnL / Tax 탭
│   │   └── scan-cta.tsx              # 가입 유도 소프트 CTA
│   │
│   ├── identity/
│   │   ├── identity-card.tsx         # DeFi Identity 카드 (핵심)
│   │   ├── defi-dna-bar.tsx          # DNA 비율 막대
│   │   ├── tier-badge.tsx            # 등급 배지
│   │   ├── chain-breakdown.tsx       # 체인별 활동 바
│   │   └── share-buttons.tsx         # 이미지 저장, 링크 복사, 트위터
│   │
│   ├── pnl/
│   │   ├── pnl-chart.tsx             # 기간별 PnL 차트 (Recharts)
│   │   ├── pnl-by-chain.tsx          # 체인별 PnL 카드
│   │   ├── top-trades.tsx            # 상위 수익/손실 거래
│   │   └── period-selector.tsx       # 7일/30일/90일/1년/전체
│   │
│   ├── tax/
│   │   ├── tax-preview.tsx           # 세금 미리보기 (비가입)
│   │   ├── tax-report.tsx            # 전체 세금 리포트 (가입)
│   │   └── tax-cta.tsx               # "가입하고 리포트 받기"
│   │
│   ├── dashboard/                    # Phase 1
│   │   ├── stats-cards.tsx           # 총 자산, PnL, 체인 수
│   │   ├── portfolio-list.tsx        # 체인별 포트폴리오
│   │   ├── recent-trades.tsx         # 최근 거래
│   │   ├── insights.tsx              # APY 비교, 알림
│   │   └── sidebar.tsx               # 사이드 네비게이션
│   │
│   ├── rewards/                      # Phase 2
│   │   ├── season-banner.tsx
│   │   ├── points-summary.tsx
│   │   ├── points-history.tsx
│   │   └── claim-button.tsx
│   │
│   ├── referral/                     # Phase 2
│   │   ├── referral-code.tsx
│   │   ├── referral-stats.tsx
│   │   └── invited-list.tsx
│   │
│   └── ui/                           # shadcn/ui 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── tabs.tsx
│       ├── badge.tsx
│       ├── skeleton.tsx
│       ├── toast.tsx
│       └── ...
│
├── lib/
│   ├── api.ts                        # 백엔드 API 클라이언트
│   ├── hooks/
│   │   ├── use-scan.ts               # 스캔 API 호출 + 상태
│   │   └── use-identity.ts           # Identity 데이터
│   ├── utils.ts                      # 포맷팅, 주소 축약 등
│   ├── constants.ts                  # 체인 목록, 색상 등
│   └── types.ts                      # 공유 타입 정의
│
├── public/
│   ├── fonts/                        # 커스텀 폰트
│   └── images/
│       ├── chains/                   # 체인 로고 (svg)
│       └── logo.svg
│
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. 레이아웃 시스템

### 3.1 Phase 0: 단일 컬럼 (비가입)

```
┌─────────────────────────────────┐
│  Header (로고 + 네비게이션)       │  ← 고정, 투명 → 스크롤 시 배경
├─────────────────────────────────┤
│                                 │
│          Main Content           │  ← 전체 너비, max-w-6xl 센터
│                                 │
├─────────────────────────────────┤
│  Footer (간단)                   │
└─────────────────────────────────┘

적용 페이지: /, /address/[address]
```

### 3.2 Phase 1: 사이드바 + 콘텐츠 (가입 후)

```
┌──────┬──────────────────────────┐
│      │  Header (유저 정보)       │  ← 고정
│      ├──────────────────────────┤
│ Side │                          │
│ bar  │      Main Content        │  ← 스크롤 가능
│      │                          │
│ 240px│                          │
│      │                          │
│      │                          │
│ 고정  │                          │
└──────┴──────────────────────────┘

모바일: 사이드바 → 하단 탭 바로 전환
```

### 3.3 반응형 브레이크포인트

```
Mobile:   < 768px   → 단일 컬럼, 하단 탭
Tablet:   768-1024px → 사이드바 접힘, 아이콘만
Desktop:  > 1024px  → 사이드바 펼침
Wide:     > 1440px  → max-w-7xl 센터
```

---

## 4. 핵심 컴포넌트 설계

### 4.1 Identity Card (핵심 바이럴 컴포넌트)

```
설계 원칙:
1. 캡처/저장 가능한 이미지로 렌더링
2. OG 이미지와 동일한 디자인 (일관성)
3. 다크 테마 기본 (DeFi 유저 선호)
4. 체인 색상 활용 (시각적 차별화)

┌─────────────────────────────────────┐
│  배경: 다크 그라데이션                 │
│  (#0a0a0a → #1a1a2e)                │
│                                      │
│  ┌──────────────────────────────┐   │
│  │  DeFi Identity 2024          │   │
│  │                              │   │
│  │  5 Chains · 2,847 Trades     │   │
│  │  $1.2M Volume                │   │
│  │                              │   │
│  │  DNA:                        │   │
│  │  ███████████  40% Perp       │   │  ← 체인 고유 색상
│  │  ████████░░░  25% DEX        │   │
│  │  ██████░░░░░  20% Yield      │   │
│  │  ████░░░░░░░  15% Lending    │   │
│  │                              │   │
│  │  🥇 Gold DeFi Explorer      │   │
│  │  Top 8%                      │   │
│  │                              │   │
│  │  hyperview.xyz               │   │  ← 브랜딩 (레퍼럴 코드 없음 Phase 0)
│  └──────────────────────────────┘   │
│                                      │
│  [📥 저장]  [🔗 복사]  [𝕏 공유]     │
└─────────────────────────────────────┘

크기:
  웹 표시: 400x520px (카드)
  OG 이미지: 1200x630px (트위터 카드)
  다운로드: 1080x1350px (인스타 비율)
```

### 4.2 Scan Progress (프로그레시브 로딩)

```
상태 머신:

  idle → scanning → partial_result → complete → error

UI:
┌─────────────────────────────────┐
│                                 │
│  🔍 크로스체인 스캔 중...         │
│                                 │
│  ✅ Hyperliquid    1,200 tx     │  ← 완료 즉시 표시
│  ⏳ HyperEVM       스캔 중...    │  ← 스피너
│  ○  Arbitrum       대기 중      │  ← Phase 1
│  ○  Base           대기 중      │  ← Phase 1
│                                 │
│  ─────────────▓▓▓▓▓░░░░░░      │  ← 프로그레스 바
│  2/4 체인 완료                   │
│                                 │
│  [결과 먼저 보기 →]              │  ← 부분 결과 즉시 열람 가능
│                                 │
└─────────────────────────────────┘

핵심: 첫 체인 결과가 나오면 즉시 카드 표시. 나머지는 점진적 업데이트.
```

### 4.3 DeFi DNA Bar

```
Props: { label: string, percentage: number, color: string }

렌더링:
  ██████████░░░░░░░░░░  40% Perp Trading

색상 매핑:
  Perp:    #FF6B35 (오렌지)
  DEX:     #3B82F6 (블루)
  Yield:   #10B981 (그린)
  Lending: #8B5CF6 (퍼플)

애니메이션: 왼쪽에서 오른쪽으로 채워지는 효과 (0.5초)
```

### 4.4 Chain Breakdown

```
Props: { chains: Array<{ name, volume, txCount, percentage }> }

렌더링:
  Hyperliquid    ████████████████  $500K  1,200tx
  Arbitrum       ██████████░░░░░░  $420K    847tx

각 체인은 고유 색상 + 아이콘:
  Hyperliquid:  #00D4AA
  Arbitrum:     #28A0F0
  HyperEVM:     #00D4AA (계열)
  Base:         #0052FF
  Ethereum:     #627EEA
```

---

## 5. 페이지별 상세 설계

### 5.1 랜딩 페이지 (`/`)

```
섹션 구조:

1. Hero (뷰포트 100vh)
   ├── 헤드라인: "HyperEVM 온체인 활동을 분석하고 보상받으세요"
   ├── 서브: "트랜잭션 해석 · 활동 스코어 · DeFi DNA · 등급 측정"
   ├── 지갑 입력 + CTA 버튼
   └── 체크마크 3개: 무료 / HyperEVM 완벽 지원 / 35+ 체인

2. Features (3개 카드)
   ├── HyperEVM 트랜잭션 해석
   ├── 활동 스코어 & DNA 분석
   └── 등급 측정 & 보상

3. Comparison Table
   └── DeBank vs Koinly vs HyperView

4. (Phase 2+) Social Proof
   ├── 분석된 HyperEVM 트랜잭션 수
   ├── 연결된 지갑 수
   └── 분배된 USDC (첫 분배 후 추가)

5. Footer CTA
   └── 지갑 입력 반복 (스크롤 끝에서 다시)

데이터 요구: 없음 (정적 페이지, ISR 가능)
```

### 5.2 스캔 결과 페이지 (`/address/[address]`)

```
데이터 플로우:

  1. URL에서 address 파라미터 추출
  2. /api/scan/:address POST (서버 사이드 or 클라이언트)
  3. 프로그레시브 로딩 표시
  4. 결과 도착 시 탭 렌더링

메타데이터 (SEO/OG):
  title: "0xA3b7...F2d4 | Gold DeFi Explorer | HyperView"
  description: "5 chains, 2,847 trades, $1.2M volume"
  og:image: /api/og/0xA3b7...F2d4

탭 구조:
  [활동 분석] → Identity 카드 + HyperEVM tx 해석 + 활동 스코어
  [PnL 분석] → 차트 + 체인별 PnL + 상위 거래
  [세금 미리보기] → 요약 + 가입 CTA

캐싱:
  ISR revalidate: 1800 (30분)
  Redis 캐시: 30분 TTL
```

### 5.3 OG 이미지 API (`/api/og/[address]`)

```
Edge Runtime (Vercel Edge Function)

입력: address (URL 파라미터)
출력: 1200x630 PNG 이미지

로직:
  1. /api/identity/:address에서 데이터 fetch
  2. satori로 JSX → SVG 변환
  3. @resvg/resvg-js로 SVG → PNG 변환
  4. 30분 캐시 헤더

디자인:
  ┌────────────────────────────────────────┐
  │                                        │  1200x630
  │   DeFi Identity 2024                   │
  │   ─────────────────                    │
  │                                        │
  │   5 Chains · 2,847 Trades · $1.2M      │
  │                                        │
  │   ████████  40% Perp                   │
  │   ██████░░  25% DEX                    │
  │   ████░░░░  20% Yield                  │
  │   ██░░░░░░  15% Lending                │
  │                                        │
  │   🥇 Gold Explorer · Top 8%           │
  │                                        │
  │              hyperview.xyz             │
  └────────────────────────────────────────┘
```

---

## 6. 상태 관리

### 6.1 서버 상태 (React Query)

```typescript
// 스캔 결과
const { data, isLoading } = useQuery({
  queryKey: ['scan', address],
  queryFn: () => api.scan(address),
  staleTime: 30 * 60 * 1000, // 30분
});

// Identity 데이터
const { data: identity } = useQuery({
  queryKey: ['identity', address],
  queryFn: () => api.getIdentity(address),
  enabled: !!address,
});
```

### 6.2 클라이언트 상태 (Zustand)

```typescript
// 최소한의 클라이언트 상태
// 인증은 Privy이 관리하므로 별도 user 상태 불필요
interface AppStore {
  // 현재 스캔 중인 주소
  scanAddress: string | null;
  setScanAddress: (addr: string) => void;

  // 활성 탭
  activeTab: 'activity' | 'pnl' | 'tax';
  setActiveTab: (tab: string) => void;
}
```

---

## 7. 인증 (Privy)

### 7.1 Privy 설정

```typescript
// app/layout.tsx
import { ConditionalPrivyProvider } from '@/shared/providers';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <ConditionalPrivyProvider>
          {children}
        </ConditionalPrivyProvider>
      </body>
    </html>
  );
}
```

```typescript
// middleware.ts — 커스텀 (Privy는 미들웨어 미제공)
import { NextResponse, type NextRequest } from 'next/server';

const protectedPaths = ['/dashboard'];

export function middleware(request: NextRequest) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  if (!privyAppId) return NextResponse.next();

  const isProtected = protectedPaths.some(p => request.nextUrl.pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get('privy-token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/?login=required', request.url));
  }
  return NextResponse.next();
}
```

### 7.2 Privy 로그인 방식

```
로그인 방법:
├── 지갑 (MetaMask, WalletConnect 등)  ← Web3 네이티브
├── 이메일 (OTP)                        ← 마찰 최소
└── 임베디드 월렛 자동 생성              ← 지갑 없는 유저용

UI 패턴:
├── 모달 전용 (별도 /sign-in, /sign-up 없음)
├── login() 호출 → Privy 모달 오픈
└── ?login=required → 자동 모달 트리거
```

### 7.3 Privy Webhook → 유저 DB 동기화

```typescript
// app/api/webhook/privy/route.ts
import { Webhook } from 'svix';

export async function POST(req: Request) {
  const body = await req.text();
  const wh = new Webhook(process.env.PRIVY_WEBHOOK_SECRET);
  const event = wh.verify(body, svixHeaders);

  const authId = event.data.user.id;

  switch (event.type) {
    case 'user.created':
      const wallet = event.data.user.linked_accounts.find(a => a.type === 'wallet');
      await db.insert(users).values({
        auth_id: authId,
        address: wallet?.address,
        referral_code: generateReferralCode(),
      });
      break;
    case 'user.deleted':
      await db.delete(users).where(eq(users.authId, authId));
      break;
  }
}
```

---

## 8. API 클라이언트

```typescript
// lib/api.ts
// 인증은 privy-token 쿠키로 자동 전달됨

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  // Phase 0 (비로그인 가능)
  scan: (address: string) =>
    fetch(`${API_BASE}/api/scan/${address}`, { method: 'POST' })
      .then(res => res.json()),

  getIdentity: (address: string) =>
    fetch(`${API_BASE}/api/identity/${address}`)
      .then(res => res.json()),

  // Phase 0+ (로그인 필요 - Privy 토큰 자동 포함)
  getDashboard: async () => {
    const { getToken } = await auth();
    return fetch(`${API_BASE}/api/users/me`, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    }).then(res => res.json());
  },

  linkWallet: async (address: string) => {
    const { getToken } = await auth();
    return fetch(`${API_BASE}/api/users/link-wallet`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${await getToken()}` },
      body: JSON.stringify({ address }),
    }).then(res => res.json());
  },
};
```

---

## 8. 디자인 토큰

### 8.1 색상

```css
/* 다크 테마 기본 */
--background:     #0a0a0a;
--surface:        #141414;
--surface-hover:  #1a1a1a;
--border:         #262626;

/* 텍스트 */
--text-primary:   #fafafa;
--text-secondary: #a1a1aa;
--text-muted:     #71717a;

/* 브랜드 */
--brand:          #00D4AA;    /* HyperView 그린 */
--brand-hover:    #00B894;

/* DeFi DNA 색상 */
--dna-perp:       #FF6B35;
--dna-dex:        #3B82F6;
--dna-yield:      #10B981;
--dna-lending:    #8B5CF6;

/* 체인 색상 */
--chain-hl:       #00D4AA;
--chain-arbitrum: #28A0F0;
--chain-base:     #0052FF;
--chain-ethereum: #627EEA;
--chain-hyperevm: #00D4AA;

/* PnL */
--positive:       #22C55E;
--negative:       #EF4444;

/* 등급 */
--tier-bronze:    #CD7F32;
--tier-silver:    #C0C0C0;
--tier-gold:      #FFD700;
--tier-diamond:   #B9F2FF;
```

### 8.2 타이포그래피

```css
/* 폰트 */
font-family: 'Inter', system-ui, sans-serif;

/* 크기 */
--text-xs:    0.75rem;    /* 12px - 라벨, 캡션 */
--text-sm:    0.875rem;   /* 14px - 본문 보조 */
--text-base:  1rem;       /* 16px - 본문 */
--text-lg:    1.125rem;   /* 18px - 소제목 */
--text-xl:    1.25rem;    /* 20px - 제목 */
--text-2xl:   1.5rem;     /* 24px - 섹션 제목 */
--text-3xl:   1.875rem;   /* 30px - 히어로 서브 */
--text-4xl:   2.25rem;    /* 36px - 히어로 메인 */
--text-5xl:   3rem;       /* 48px - 숫자 강조 (PnL 등) */

/* 숫자는 모노스페이스 */
font-variant-numeric: tabular-nums;
```

### 8.3 간격 & 레이아웃

```css
/* 페이지 */
--page-max-width:    1280px;   /* max-w-6xl */
--page-padding:      1.5rem;   /* 모바일 */
--page-padding-lg:   2rem;     /* 데스크톱 */

/* 사이드바 */
--sidebar-width:     240px;
--sidebar-collapsed: 64px;

/* 카드 */
--card-padding:      1.5rem;
--card-radius:       0.75rem;
--card-border:       1px solid var(--border);

/* 그리드 */
--grid-gap:          1rem;
--grid-gap-lg:       1.5rem;
```

---

## 9. Phase별 구현 계획

### Phase 0 (Week 1-3): 3페이지

```
Week 1 (Day 1-5):
  Day 1: 프로젝트 셋업
    - npx create-next-app (App Router, TypeScript, Tailwind)
    - shadcn/ui init
    - Privy 설치 + PrivyProvider + middleware.ts
    - sign-in / sign-up 페이지 설정
    - Privy webhook 엔드포인트 (유저 DB 동기화)
    - 디자인 토큰 + 글로벌 스타일
    - Vercel 배포 파이프라인

  Day 2: 랜딩 페이지
    - Hero (HyperEVM 활동 분석 메시지) + 지갑 입력
    - Features 카드 3개 (tx 해석, 활동 스코어, 등급 & 보상)
    - Comparison Table
    - 모바일 반응형

  Day 3: 스캔 + 결과 페이지
    - scan-input + 주소 검증
    - scan-progress (프로그레시브 로딩, HyperEVM 먼저)
    - 활동 분석 탭 + Identity 카드 + tx 해석 리스트

  Day 4: PnL + 세금 탭
    - PnL 차트 (Recharts)
    - 체인별 PnL 카드
    - 세금 미리보기 + 가입 CTA

  Day 5: OG 이미지 + 공유
    - /api/og/[address] Edge Route
    - 메타태그 (트위터 카드, 오픈그래프)
    - 공유 버튼 (이미지 저장, 링크 복사, 트위터)

Week 2:
  - 퍼블릭 프로필 SEO 최적화
  - 이메일 수집 (waitlist)
  - Mixpanel 이벤트 트래킹
  - A/B 테스트 설정
  - 버그 수정 + 모바일 최적화
```

### Phase 1 (Week 4-8): +5페이지

```
  - 사이드바 레이아웃
  - 대시보드 (stats + 포트폴리오 + 거래)
  - PnL 분석 (상세)
  - 세금 리포트 (전체)
  - 거래 내역 (필터/검색/페이지네이션)
  - Privy Web3 지갑 연동 추가
  - 프로필 페이지 (Privy UserProfile 커스텀)
```

### Phase 2 (Week 9-14): +4페이지

```
  - 리워드 대시보드
  - 레퍼럴 대시보드
  - 프로토콜 디렉토리
  - 리더보드
  - Season 분배 알림 UI
```

---

## 10. 성능 목표

| 지표 | 목표 | 방법 |
|------|------|------|
| LCP (랜딩) | < 1.5초 | 정적 생성, 폰트 프리로드 |
| FID | < 100ms | JS 번들 최소화 |
| CLS | < 0.1 | 이미지 크기 명시, 스켈레톤 |
| 번들 크기 | < 150KB (초기 JS) | 동적 임포트, 트리쉐이킹 |
| 스캔 UX 응답 | < 3초 (첫 결과) | 프로그레시브 로딩 |

---

## 11. SEO 전략

```
퍼블릭 프로필 SEO:
  /address/0xAbc...
  → title: "0xAbc... | Gold DeFi Explorer | HyperView"
  → description: "5 chains, $1.2M volume, Perp trader"
  → og:image: /api/og/0xAbc...
  → ISR: 30분 revalidate

랜딩 SEO:
  title: "HyperView - HyperEVM On-chain Activity Analysis & Rewards"
  → "hyperevm transaction analysis", "hyperevm activity tracker", "hyperchain rewards" 타겟

robots.txt:
  퍼블릭 프로필은 크롤링 허용
  대시보드는 크롤링 차단
```
