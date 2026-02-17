-- HyperView DB Schema
-- Initialized via Docker entrypoint

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- Core Tables
-- =============================================

-- 유저 테이블 (인증 프로바이더 연동)
CREATE TABLE IF NOT EXISTS users (
  auth_id TEXT PRIMARY KEY,
  address TEXT,
  name TEXT,
  tier TEXT DEFAULT 'bronze',
  referral_code TEXT UNIQUE,
  tax_country TEXT DEFAULT 'kr',
  tax_method TEXT DEFAULT 'fifo',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- users 테이블에 name 컬럼 추가 (기존 DB 마이그레이션용)
ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;

-- 지갑 테이블 (1 유저 : N 지갑)
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(auth_id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  label TEXT DEFAULT '',
  is_primary BOOLEAN DEFAULT FALSE,
  last_scanned_block JSONB DEFAULT '{}',
  last_scanned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, address)
);

-- =============================================
-- Transaction Collection (Worker writes, Web reads)
-- =============================================

-- 수집된 온체인 트랜잭션
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

-- 스캔 작업 추적
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

-- =============================================
-- Points & Exchange
-- =============================================

-- 유저 포인트 잔고
CREATE TABLE IF NOT EXISTS point_balances (
  user_id TEXT PRIMARY KEY REFERENCES users(auth_id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0,
  lifetime_earned INTEGER NOT NULL DEFAULT 0,
  lifetime_spent INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 포인트 원장 (모든 적립/차감 기록)
CREATE TABLE IF NOT EXISTS point_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(auth_id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  reference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 상품 카탈로그
CREATE TABLE IF NOT EXISTS shop_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  description_en TEXT,
  category TEXT NOT NULL,
  points_cost INTEGER NOT NULL,
  stock INTEGER,
  tag TEXT,
  badge_label TEXT,
  badge_label_en TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- i18n migration: add English columns to existing shop_products
ALTER TABLE shop_products ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE shop_products ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE shop_products ADD COLUMN IF NOT EXISTS badge_label_en TEXT;

-- 교환 기록
CREATE TABLE IF NOT EXISTS exchange_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(auth_id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  product_id UUID REFERENCES shop_products(id),
  points_spent INTEGER NOT NULL,
  received TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  tx_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Referrals (추천 시스템)
-- =============================================

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id TEXT NOT NULL REFERENCES users(auth_id) ON DELETE CASCADE,
  referred_id TEXT NOT NULL REFERENCES users(auth_id) ON DELETE CASCADE,
  bonus_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

-- =============================================
-- Indexes
-- =============================================

CREATE INDEX IF NOT EXISTS idx_wallets_user ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_chain ON transactions(chain_id);
CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_hash ON transactions(chain_id, hash);
CREATE INDEX IF NOT EXISTS idx_scan_jobs_wallet ON scan_jobs(wallet_id);
CREATE INDEX IF NOT EXISTS idx_scan_jobs_status ON scan_jobs(status);
CREATE INDEX IF NOT EXISTS idx_point_ledger_user ON point_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_point_ledger_created ON point_ledger(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exchange_history_user ON exchange_history(user_id);
CREATE INDEX IF NOT EXISTS idx_exchange_history_created ON exchange_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shop_products_category ON shop_products(category);
CREATE INDEX IF NOT EXISTS idx_shop_products_active ON shop_products(is_active);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_id);
