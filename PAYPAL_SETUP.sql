-- Additive, rerunnable migration for existing Supabase projects using PayPal checkout.
-- Run this once in Supabase SQL Editor after deploying the PayPal payment routes.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.payment_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('resources', 'consultation')),
  details JSONB NOT NULL DEFAULT '{}',
  amount_usd DECIMAL(10, 2) NOT NULL CHECK (amount_usd > 0),
  paypal_order_id TEXT UNIQUE,
  paypal_capture_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own payment orders" ON public.payment_orders;
CREATE POLICY "Users can view own payment orders" ON public.payment_orders
  FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE public.consultation_bookings
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS payment_order_id UUID REFERENCES public.payment_orders(id),
  ADD COLUMN IF NOT EXISTS paypal_order_id TEXT,
  ADD COLUMN IF NOT EXISTS paypal_capture_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS consultation_bookings_payment_order_id_key
  ON public.consultation_bookings(payment_order_id)
  WHERE payment_order_id IS NOT NULL;

ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert consultation bookings" ON public.consultation_bookings;
DROP POLICY IF EXISTS "Users can view own consultation bookings" ON public.consultation_bookings;
CREATE POLICY "Users can view own consultation bookings" ON public.consultation_bookings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own purchases" ON public.purchases;
