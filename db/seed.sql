-- Development seed data

-- Sample user
INSERT INTO users (clerk_id, address, tier, referral_code, tax_country, tax_method) VALUES
  ('dev_user_001', '0xA3b7C8d9E0f1a2B3c4D5e6F7a8B9c0D1e2F3d4', 'gold', 'HYPER-GOLD-7X3K', 'kr', 'fifo')
ON CONFLICT (clerk_id) DO NOTHING;

-- Sample wallet
INSERT INTO wallets (user_id, address, label, is_primary) VALUES
  ('dev_user_001', '0xa3b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3d4', '메인 지갑', TRUE)
ON CONFLICT DO NOTHING;

-- Point balance
INSERT INTO point_balances (user_id, balance, lifetime_earned, lifetime_spent) VALUES
  ('dev_user_001', 12450, 28900, 16450)
ON CONFLICT (user_id) DO NOTHING;

-- Shop products
INSERT INTO shop_products (name, description, category, points_cost, stock, tag, badge_label) VALUES
  ('커피 쿠폰 (스타벅스)', '스타벅스 아메리카노 1잔 교환권', 'physical', 5000, NULL, 'hot', '인기'),
  ('USDC $1 교환권', '1 USDC를 지갑으로 수령합니다', 'digital', 1000, NULL, 'hot', '인기'),
  ('HyperView Pro (1개월)', 'HyperView 프로 구독 1개월 이용권. 고급 분석 + 무제한 알림', 'service', 500, NULL, NULL, NULL),
  ('HyperView Genesis NFT', '한정판 Genesis 컬렉션 NFT. 홀더 전용 혜택 포함', 'nft', 2000, 50, 'limited', '50개 한정'),
  ('Discord 프리미엄 역할', '프리미엄 디스코드 역할 부여 (3개월)', 'digital', 300, NULL, 'new', '신규'),
  ('HYPE 스티커 팩', '실물 HYPE 스티커 팩 (10종)', 'physical', 800, NULL, NULL, NULL),
  ('세금 보고서 PDF', '연간 세금 보고서 PDF 자동 생성', 'service', 1500, NULL, NULL, NULL),
  ('HyperView 후드티', '한정판 HyperView 브랜드 후드티', 'physical', 3000, 30, 'limited', '30개 한정'),
  ('AI 포트폴리오 리뷰', 'AI 기반 포트폴리오 분석 리포트', 'service', 1000, NULL, NULL, NULL),
  ('커스텀 프로필 프레임', '대시보드 프로필 커스텀 프레임', 'digital', 400, NULL, 'new', '신규')
ON CONFLICT DO NOTHING;

-- Sample point ledger entries
INSERT INTO point_ledger (user_id, amount, type, description) VALUES
  ('dev_user_001', 500, 'ad_revenue', '광고 수익 분배 (2월 1주차)'),
  ('dev_user_001', 320, 'trading', '거래 활동 보상'),
  ('dev_user_001', 200, 'referral', '추천인 보상 (3명)'),
  ('dev_user_001', -500, 'purchase', 'HyperView Pro (1개월) 교환'),
  ('dev_user_001', -300, 'purchase', 'Discord 프리미엄 역할 교환'),
  ('dev_user_001', -1000, 'exchange', 'USDC 교환 (1,000P → 10 USDC)')
ON CONFLICT DO NOTHING;
