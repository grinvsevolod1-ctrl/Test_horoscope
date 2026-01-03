-- Performance indexes for the horoscope service

-- Users
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_users_zodiac_sign ON users(zodiac_sign);

-- Subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_renew_at ON subscriptions(renew_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status_renew ON subscriptions(status, renew_at);

-- Payments
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_payment_id ON payments(provider_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- Forecasts
CREATE INDEX IF NOT EXISTS idx_forecasts_date ON forecasts(date);
CREATE INDEX IF NOT EXISTS idx_forecasts_date_zodiac ON forecasts(date, zodiac_sign);

-- Deliveries
CREATE INDEX IF NOT EXISTS idx_deliveries_user_id ON deliveries(user_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_date ON deliveries(date);
CREATE INDEX IF NOT EXISTS idx_deliveries_user_date ON deliveries(user_id, date);

-- Astro events
CREATE INDEX IF NOT EXISTS idx_astro_events_date ON astro_events(date);

-- Content templates
CREATE INDEX IF NOT EXISTS idx_content_templates_trigger ON content_templates(trigger_type, trigger_value);
