-- 003: 추천(Referral) 테이블 추가
-- 실행: psql $DATABASE_URL -f db/migrations/003_add_referrals.sql

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id TEXT NOT NULL REFERENCES users(auth_id) ON DELETE CASCADE,
  referred_id TEXT NOT NULL REFERENCES users(auth_id) ON DELETE CASCADE,
  bonus_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id)
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_id);
