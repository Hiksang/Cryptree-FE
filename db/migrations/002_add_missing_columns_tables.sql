-- 002: 누락된 컬럼 및 테이블 추가
-- 실행: psql $DATABASE_URL -f db/migrations/002_add_missing_columns_tables.sql

-- users 테이블에 name 컬럼 추가
ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;

-- transactions 테이블 (이미 있으면 무시)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(auth_id) ON DELETE CASCADE,
  chain_id TEXT NOT NULL,
  hash TEXT NOT NULL,
  block_number BIGINT,
  timestamp TIMESTAMPTZ NOT NULL,
  protocol TEXT,
  type TEXT NOT NULL,
  type_label TEXT,
  from_token TEXT,
  to_token TEXT,
  amount NUMERIC NOT NULL DEFAULT 0,
  fee NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed',
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(chain_id, hash)
);

-- scan_jobs 테이블 (이미 있으면 무시)
CREATE TABLE IF NOT EXISTS scan_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  chain_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  scan_type TEXT NOT NULL DEFAULT 'full',
  from_block BIGINT DEFAULT 0,
  to_block BIGINT,
  tx_count INTEGER DEFAULT 0,
  error TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 (이미 있으면 무시)
CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_chain ON transactions(chain_id);
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_hash ON transactions(chain_id, hash);
CREATE INDEX IF NOT EXISTS idx_scan_jobs_wallet ON scan_jobs(wallet_id);
CREATE INDEX IF NOT EXISTS idx_scan_jobs_status ON scan_jobs(status);
