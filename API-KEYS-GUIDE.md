# 외부 API 키 발급 가이드

HyperView 운영에 필요한 4개 외부 서비스 API 키 발급 방법.

---

## 1. Privy (인증)

유저 로그인/회원가입 처리. 지갑 + 이메일 로그인 지원.

### 발급 절차

1. https://privy.io 접속 → **Sign up**
2. 대시보드에서 **Create app** 클릭
3. App name: `HyperView` 입력
4. Login methods: **Wallet** + **Email** 활성화
5. 생성 완료 후 **Settings** → **API Keys** 에서 키 복사:
   - `App ID` → `clxxx...` 형식
   - `App Secret` → `secret_...` 형식

### Webhook 설정 (유저 DB 동기화용)

1. Privy 대시보드 → **Webhooks** → **Add Endpoint**
2. Endpoint URL: `https://your-domain.com/api/webhook/privy`
   - 로컬 개발: ngrok URL 사용 (예: `https://xxx.ngrok-free.app/api/webhook/privy`)
3. Events: `user.created`, `user.deleted` 체크
4. 생성 후 **Signing Secret** 복사 → `whsec_...` 형식

### .env.local에 설정

```bash
NEXT_PUBLIC_PRIVY_APP_ID=clxxx_여기에_앱ID
PRIVY_APP_SECRET=secret_여기에_시크릿
PRIVY_WEBHOOK_SECRET=whsec_여기에_시크릿
```

---

## 2. Etherscan V2 (블록체인 트랜잭션 데이터)

6개 체인(Ethereum, Arbitrum, Base, Optimism, Polygon, HyperEVM)의 트랜잭션을 스캔.
무료 플랜: 5 calls/sec, 100,000 calls/day.

### 발급 절차

1. https://etherscan.io 접속 → 우측 상단 **Sign In** → 계정 없으면 **Register**
2. 이메일 인증 완료
3. 로그인 후 **My Account** → **API Keys** → **Add**
4. App Name: `HyperView` 입력
5. API Key 생성 완료 → `ABCDEF1234567890...` 형식 키 복사

### 중요: 하나의 키로 모든 체인 지원

Etherscan V2 API는 하나의 키로 다음 체인 모두 조회 가능:
- Ethereum (`api.etherscan.io`)
- Arbitrum (`api.arbiscan.io`)
- Base (`api.basescan.org`)
- Optimism (`api-optimistic.etherscan.io`)
- Polygon (`api.polygonscan.com`)

별도로 각 체인 사이트에서 키를 발급받을 필요 없음.

### .env.docker에 설정

```bash
ETHERSCAN_API_KEY=여기에_API_키
```

---

## 3. Blockscout (Etherscan 대체/보조)

Etherscan API 제한에 걸릴 때 fallback으로 사용. API 키 불필요.

### 사용 방식

- API 키 없이 바로 사용 가능 (공개 API)
- Rate limit: 약 50 calls/min
- Worker 코드에서 Etherscan 실패 시 자동으로 Blockscout 시도

### 지원 체인별 엔드포인트

| 체인 | Blockscout URL |
|------|---------------|
| Ethereum | `https://eth.blockscout.com/api` |
| Arbitrum | `https://arbitrum.blockscout.com/api` |
| Base | `https://base.blockscout.com/api` |
| Optimism | `https://optimism.blockscout.com/api` |
| Polygon | `https://polygon.blockscout.com/api` |

### 설정

별도 환경변수 불필요. Worker 코드에 하드코딩되어 있음.

---

## 4. Supabase (클라우드 PostgreSQL — 선택사항)

현재는 Docker PostgreSQL 사용 중. 프로덕션 배포 시 Supabase로 전환 가능.
무료 플랜: 500MB DB, 1GB bandwidth.

### 발급 절차

1. https://supabase.com 접속 → **Start your project** (GitHub 계정으로 가능)
2. **New Project** 클릭
3. 설정:
   - Organization: 기존 org 선택 또는 새로 생성
   - Project name: `hyperview`
   - Database Password: 안전한 비밀번호 입력 (나중에 사용)
   - Region: `Northeast Asia (Tokyo)` — 한국 서비스라면 가장 가까움
4. 프로젝트 생성 후 **Settings** → **Database**
5. **Connection string** → **URI** 탭에서 연결 문자열 복사

### Connection String 형식

```
postgresql://postgres.[project-ref]:[password]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

### .env.local에 설정

```bash
DATABASE_URL=postgresql://postgres.xxx:비밀번호@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

### DB 스키마 적용

Supabase에 연결 후 테이블 생성:

```bash
# 방법 1: Supabase SQL Editor에서 직접 실행
# db/init.sql 내용을 Supabase 대시보드 → SQL Editor에 붙여넣고 실행
# 이어서 db/seed.sql도 실행

# 방법 2: psql로 직접 연결
psql "postgresql://postgres.xxx:비밀번호@..." -f db/init.sql
psql "postgresql://postgres.xxx:비밀번호@..." -f db/seed.sql
```

### Supabase vs Docker PostgreSQL 비교

| | Docker (현재) | Supabase |
|---|---|---|
| 비용 | 무료 | 무료 (500MB) |
| 설정 | `docker compose up` | 웹에서 생성 |
| 위치 | 로컬 Mac | 클라우드 (Tokyo) |
| 백업 | 수동 | 자동 (일 1회) |
| 용도 | 개발/테스트 | 프로덕션 |

---

## 5. ngrok (로컬 터널링)

Worker를 외부에서 접근 가능하게 만들어 Privy webhook 수신용.
무료 플랜: 1 고정 도메인.

### 발급 절차

1. https://ngrok.com 접속 → **Sign up** (GitHub 계정으로 가능)
2. 대시보드 → **Your Authtoken** 복사
3. **Domains** → **New Domain** → 고정 도메인 생성 (예: `hyperview-dev.ngrok-free.app`)

### .env.docker에 설정

```bash
NGROK_AUTHTOKEN=여기에_토큰
NGROK_DOMAIN=hyperview-dev.ngrok-free.app
```

---

## 전체 환경변수 체크리스트

### web/.env.local (Next.js)

```bash
# 인증 (선택 — 없으면 dev_user_001로 자동 로그인)
NEXT_PUBLIC_PRIVY_APP_ID=clxxx...
PRIVY_APP_SECRET=secret_...
PRIVY_WEBHOOK_SECRET=whsec_...

# DB (Docker 기본값)
DATABASE_URL=postgresql://hyperview:hyperview_dev_password@localhost:5432/hyperview

# Worker
WORKER_URL=http://localhost:4000
```

### .env.docker (Docker Compose)

```bash
# DB
DB_USER=hyperview
DB_PASSWORD=hyperview_dev_password
DB_NAME=hyperview

# Worker
ETHERSCAN_API_KEY=발급받은_키

# Redis
REDIS_PASSWORD=redis_dev_password

# ngrok
NGROK_AUTHTOKEN=발급받은_토큰
NGROK_DOMAIN=발급받은_도메인.ngrok-free.app
```

---

## 최소 시작 (Clerk/Supabase 없이)

Clerk와 Supabase 없이도 개발 가능:

```bash
# 1. Docker로 DB + Worker 시작
cd hyper-ad-platform
cp .env.docker.example .env.docker  # 위 값들로 수정
docker compose up -d postgres redis

# 2. DB 초기화
docker exec -i $(docker ps -q -f name=postgres) psql -U hyperview -d hyperview < db/init.sql
docker exec -i $(docker ps -q -f name=postgres) psql -U hyperview -d hyperview < db/seed.sql

# 3. Next.js 실행
cd web
npm run dev
```

- Privy 키 비어있으면 → `dev_user_001`로 자동 로그인 (인증 우회)
- Docker PostgreSQL → seed 데이터로 대시보드 확인 가능
- Etherscan 키 없으면 → Worker 스캔만 안 됨 (나머지 기능 정상)
