-- i18n: Add English columns + update existing products
-- Run this on your production DB to enable English product names

ALTER TABLE shop_products ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE shop_products ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE shop_products ADD COLUMN IF NOT EXISTS badge_label_en TEXT;

UPDATE shop_products SET name_en = 'Coffee Coupon (Starbucks)', description_en = 'Starbucks Americano 1 cup voucher', badge_label_en = 'Popular' WHERE name = '커피 쿠폰 (스타벅스)';
UPDATE shop_products SET name_en = 'USDC $1 Voucher', description_en = 'Receive 1 USDC to your wallet', badge_label_en = 'Popular' WHERE name = 'USDC $1 교환권';
UPDATE shop_products SET name_en = 'HyperView Pro (1 Month)', description_en = 'HyperView Pro 1-month subscription. Advanced analytics + unlimited alerts' WHERE name = 'HyperView Pro (1개월)';
UPDATE shop_products SET name_en = 'HyperView Genesis NFT', description_en = 'Limited edition Genesis Collection NFT. Exclusive holder perks included', badge_label_en = '50 Limited' WHERE name = 'HyperView Genesis NFT';
UPDATE shop_products SET name_en = 'Discord Premium Role', description_en = 'Premium Discord role for 3 months', badge_label_en = 'New' WHERE name = 'Discord 프리미엄 역할';
UPDATE shop_products SET name_en = 'HYPE Sticker Pack', description_en = 'Physical HYPE sticker pack (10 types)' WHERE name = 'HYPE 스티커 팩';
UPDATE shop_products SET name_en = 'Tax Report PDF', description_en = 'Auto-generated annual tax report PDF' WHERE name = '세금 보고서 PDF';
UPDATE shop_products SET name_en = 'HyperView Hoodie', description_en = 'Limited edition HyperView branded hoodie', badge_label_en = '30 Limited' WHERE name = 'HyperView 후드티';
UPDATE shop_products SET name_en = 'AI Portfolio Review', description_en = 'AI-powered portfolio analysis report' WHERE name = 'AI 포트폴리오 리뷰';
UPDATE shop_products SET name_en = 'Custom Profile Frame', description_en = 'Custom frame for your dashboard profile', badge_label_en = 'New' WHERE name = '커스텀 프로필 프레임';
