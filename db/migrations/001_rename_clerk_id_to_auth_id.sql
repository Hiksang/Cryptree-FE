-- Migration: Rename clerk_id to auth_id (provider-independent)
-- Date: 2026-02-16

BEGIN;

-- 1. Drop FK constraints referencing users(clerk_id)
ALTER TABLE wallets DROP CONSTRAINT IF EXISTS wallets_user_id_fkey;
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_user_id_fkey;
ALTER TABLE point_balances DROP CONSTRAINT IF EXISTS point_balances_user_id_fkey;
ALTER TABLE point_ledger DROP CONSTRAINT IF EXISTS point_ledger_user_id_fkey;
ALTER TABLE exchange_history DROP CONSTRAINT IF EXISTS exchange_history_user_id_fkey;

-- 2. Rename the column
ALTER TABLE users RENAME COLUMN clerk_id TO auth_id;

-- 3. Re-create FK constraints referencing users(auth_id)
ALTER TABLE wallets ADD CONSTRAINT wallets_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(auth_id) ON DELETE CASCADE;
ALTER TABLE transactions ADD CONSTRAINT transactions_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(auth_id) ON DELETE CASCADE;
ALTER TABLE point_balances ADD CONSTRAINT point_balances_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(auth_id) ON DELETE CASCADE;
ALTER TABLE point_ledger ADD CONSTRAINT point_ledger_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(auth_id) ON DELETE CASCADE;
ALTER TABLE exchange_history ADD CONSTRAINT exchange_history_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(auth_id) ON DELETE CASCADE;

COMMIT;
