-- Daily Astro - Database Schema v1
-- Run this migration first to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM types
CREATE TYPE zodiac_sign AS ENUM (
  'aries', 'taurus', 'gemini', 'cancer', 
  'leo', 'virgo', 'libra', 'scorpio', 
  'sagittarius', 'capricorn', 'aquarius', 'pisces'
);

CREATE TYPE subscription_status AS ENUM (
  'trial', 'active', 'canceled', 'expired', 'grace'
);

CREATE TYPE payment_status AS ENUM (
  'pending', 'succeeded', 'failed', 'refunded'
);

CREATE TYPE plan_name AS ENUM (
  'basic', 'plus', 'premium'
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telegram_id BIGINT UNIQUE NOT NULL,
  email VARCHAR(255),
  zodiac_sign zodiac_sign NOT NULL,
  birth_date DATE,
  timezone VARCHAR(64) DEFAULT 'Europe/Minsk',
  locale VARCHAR(10) DEFAULT 'ru',
  delivery_time TIME DEFAULT '07:30:00',
  is_paused BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_users_zodiac_sign ON users(zodiac_sign);

-- Plans table
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name plan_name UNIQUE NOT NULL,
  price_byn_month INTEGER NOT NULL, -- in kopecks (300 = 3 BYN)
  features JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default plans
INSERT INTO plans (name, price_byn_month, features) VALUES
  ('basic', 300, '{"daily_forecast": true, "compatibility": false, "affirmations": false, "important_dates": false, "flexible_time": false, "no_ads": false}'),
  ('plus', 600, '{"daily_forecast": true, "compatibility": true, "affirmations": true, "important_dates": false, "flexible_time": false, "no_ads": false}'),
  ('premium', 1200, '{"daily_forecast": true, "compatibility": true, "affirmations": true, "important_dates": true, "flexible_time": true, "no_ads": true}');

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  status subscription_status DEFAULT 'trial',
  trial_ends_at TIMESTAMPTZ,
  start_at TIMESTAMPTZ DEFAULT NOW(),
  renew_at TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  payment_provider VARCHAR(32) DEFAULT 'bepaid',
  payment_token VARCHAR(255),
  last_payment_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_renew_at ON subscriptions(renew_at);

-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  provider_payment_id VARCHAR(255),
  order_id VARCHAR(255) UNIQUE NOT NULL,
  amount_byn INTEGER NOT NULL, -- in kopecks
  currency VARCHAR(3) DEFAULT 'BYN',
  status payment_status DEFAULT 'pending',
  is_recurring BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Astro Events table (real astronomical data)
CREATE TABLE astro_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_date DATE NOT NULL,
  planet VARCHAR(32) NOT NULL,
  sign zodiac_sign,
  aspect VARCHAR(64),
  magnitude FLOAT,
  source VARCHAR(128),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_astro_events_date ON astro_events(event_date);

-- Forecasts table (generated daily)
CREATE TABLE forecasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  forecast_date DATE NOT NULL,
  zodiac_sign zodiac_sign NOT NULL,
  love TEXT NOT NULL,
  money TEXT NOT NULL,
  mood TEXT NOT NULL,
  advice TEXT NOT NULL,
  source JSONB DEFAULT '{}',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(forecast_date, zodiac_sign)
);

CREATE INDEX idx_forecasts_date_sign ON forecasts(forecast_date, zodiac_sign);

-- Content templates library
CREATE TABLE content_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zodiac_sign zodiac_sign,
  trigger_type VARCHAR(64) NOT NULL, -- 'moon_in_sign', 'planet_aspect', 'season', etc.
  trigger_value VARCHAR(128) NOT NULL,
  category VARCHAR(32) NOT NULL, -- 'love', 'money', 'mood', 'advice'
  text_ru TEXT NOT NULL,
  weight INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_content_templates_trigger ON content_templates(trigger_type, trigger_value);

-- Deliveries table
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  delivery_date DATE NOT NULL,
  forecast_id UUID REFERENCES forecasts(id),
  telegram_message_id VARCHAR(64),
  opened BOOLEAN DEFAULT FALSE,
  streak_count INTEGER DEFAULT 1,
  plan_snapshot JSONB DEFAULT '{}',
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deliveries_user_date ON deliveries(user_id, delivery_date);

-- Partner zodiac for compatibility (Plus/Premium)
CREATE TABLE user_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  partner_sign zodiac_sign NOT NULL,
  partner_name VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gift subscriptions
CREATE TABLE gift_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_user_id UUID REFERENCES users(id),
  recipient_telegram_id BIGINT,
  plan_id UUID NOT NULL REFERENCES plans(id),
  duration_days INTEGER DEFAULT 30,
  payment_id UUID REFERENCES payments(id),
  redeemed BOOLEAN DEFAULT FALSE,
  redeemed_at TIMESTAMPTZ,
  code VARCHAR(32) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
