-- =====================================================================
-- ZELOVITA HEALTH ACADEMY — SUPABASE DATABASE SETUP
-- Copy and run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new)
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================
-- 1. USER PROFILES TABLE
-- ===========================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'doctor')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Doctors can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'doctor')
  );

-- ===========================
-- 2. HEALTH RESOURCES TABLE
-- ===========================
CREATE TABLE IF NOT EXISTS public.health_resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL CHECK (category IN ('nutrition', 'longevity', 'heart', 'fasting', 'detox', 'mental')),
  is_free BOOLEAN NOT NULL DEFAULT false,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  original_price DECIMAL(10, 2),
  rating DECIMAL(3, 2) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  pages INTEGER DEFAULT 80,
  reading_time TEXT DEFAULT '2 hours',
  cover_image_url TEXT,
  pdf_url TEXT,
  badge TEXT,
  badge_color TEXT DEFAULT 'emerald',
  description TEXT NOT NULL,
  highlights TEXT[] DEFAULT '{}',
  table_of_contents TEXT[] DEFAULT '{}',
  full_content JSONB DEFAULT '{}',
  uploaded_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.health_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active resources" ON public.health_resources
  FOR SELECT USING (is_active = true);

CREATE POLICY "Doctors can manage resources" ON public.health_resources
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'doctor')
  );

-- ===========================
-- 3. DOWNLOAD HISTORY TABLE
-- ===========================
CREATE TABLE IF NOT EXISTS public.download_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resource_id UUID,
  resource_title TEXT NOT NULL,
  resource_category TEXT NOT NULL,
  cover_image_url TEXT,
  is_free BOOLEAN DEFAULT true,
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.download_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own download history" ON public.download_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own download history" ON public.download_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Doctors can view all download history" ON public.download_history
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'doctor')
  );

-- ===========================
-- 4. PURCHASE HISTORY TABLE
-- ===========================
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL DEFAULT '[]',
  total_paid DECIMAL(10, 2) NOT NULL,
  payment_method TEXT DEFAULT 'card',
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded')),
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases" ON public.purchases
  FOR SELECT USING (auth.uid() = user_id);

-- Paid purchases are inserted only by the server after PayPal capture verification.
DROP POLICY IF EXISTS "Users can insert own purchases" ON public.purchases;

CREATE POLICY "Doctors can view all purchases" ON public.purchases
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'doctor')
  );

-- ===========================
-- 4A. PAYPAL PAYMENT DRAFTS
-- ===========================
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

-- ===========================
-- 5. CONSULTATION BOOKINGS TABLE
-- ===========================
CREATE TABLE IF NOT EXISTS public.consultation_bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  package_title TEXT NOT NULL,
  package_price DECIMAL(10, 2) DEFAULT 0,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  primary_concern TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert consultation bookings" ON public.consultation_bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Doctors can view all consultation bookings" ON public.consultation_bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'doctor')
  );

-- Bind paid consultation appointments to the authenticated customer and payment.
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

DROP POLICY IF EXISTS "Anyone can insert consultation bookings" ON public.consultation_bookings;
DROP POLICY IF EXISTS "Users can view own consultation bookings" ON public.consultation_bookings;
CREATE POLICY "Users can view own consultation bookings" ON public.consultation_bookings
  FOR SELECT USING (auth.uid() = user_id);

-- ===========================
-- 6. TRIGGER: auto-create profile on signup
-- ===========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'customer'),
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ language plpgsql security definer;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ===========================
-- 7. RPC FUNCTIONS
-- ===========================
CREATE OR REPLACE FUNCTION public.increment_download_count(resource_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.health_resources
  SET download_count = download_count + 1
  WHERE id = resource_id;
END;
$$ language plpgsql security definer;

-- ===========================
-- 8. STORAGE BUCKETS
-- Run in Supabase Dashboard > Storage, or via these SQL commands:
-- ===========================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('pdfs', 'pdfs', false, 104857600, ARRAY['application/pdf'])
  ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('thumbnails', 'thumbnails', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
  ON CONFLICT (id) DO NOTHING;

-- Storage policies for pdfs bucket
CREATE POLICY "Doctors can upload pdfs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'pdfs');

CREATE POLICY "Authenticated users can read pdfs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'pdfs');

CREATE POLICY "Anyone can view thumbnails" ON storage.objects
  FOR SELECT USING (bucket_id = 'thumbnails');

CREATE POLICY "Doctors can upload thumbnails" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'thumbnails');

-- ===========================
-- 9. TO MAKE AN ACCOUNT A DOCTOR:
-- After Dr. Arif registers with his email, run:
-- ===========================
-- UPDATE public.profiles SET role = 'doctor' WHERE email = 'dr.arif@zelovita.health';
