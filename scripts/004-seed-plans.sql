-- Добавляем тарифные планы
INSERT INTO plans (id, name, price_byn_month, features, is_active) VALUES
  (
    'a1b2c3d4-0001-4000-8000-000000000001',
    'basic',
    300, -- 3 BYN в копейках
    '{"daily_forecast": true, "love": true, "money": true, "mood": true, "advice": true}',
    true
  ),
  (
    'a1b2c3d4-0002-4000-8000-000000000002',
    'plus',
    600, -- 6 BYN в копейках
    '{"daily_forecast": true, "love": true, "money": true, "mood": true, "advice": true, "compatibility": true, "affirmations": true}',
    true
  ),
  (
    'a1b2c3d4-0003-4000-8000-000000000003',
    'premium',
    1200, -- 12 BYN в копейках
    '{"daily_forecast": true, "love": true, "money": true, "mood": true, "advice": true, "compatibility": true, "affirmations": true, "important_dates": true, "flexible_time": true, "no_ads": true}',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  price_byn_month = EXCLUDED.price_byn_month,
  features = EXCLUDED.features,
  is_active = EXCLUDED.is_active;
