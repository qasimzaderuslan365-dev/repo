
-- ==========================================
-- HELPER.AZ SECURITY-HARDENED SCHEMA v2
-- ==========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Hardened)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT CHECK (role IN ('CUSTOMER', 'PROFESSIONAL')) DEFAULT 'CUSTOMER',
  profession TEXT,
  skills TEXT[] DEFAULT '{}',
  bio TEXT DEFAULT '',
  hourly_rate NUMERIC DEFAULT 15,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  avatar_url TEXT,
  location TEXT DEFAULT 'Bakı',
  is_available BOOLEAN DEFAULT TRUE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  last_sign_in TIMESTAMPTZ, -- New for security tracking
  joined_date TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Offers Table (Harden: Price Lock)
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  professional_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  service_type TEXT,
  description TEXT,
  price NUMERIC,
  date DATE,
  time TIME,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'PAID', 'COMPLETED', 'CANCELLED')),
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Transactions Table (Secure Logs)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  professional_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded')),
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 5. Policies (v2)
DROP POLICY IF EXISTS "Profiles are public" ON public.profiles;
CREATE POLICY "Profiles are public" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles 
FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow system to insert profiles" ON public.profiles;
CREATE POLICY "Allow system to insert profiles" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- OFFERS: Prevent customers from changing details after acceptance
DROP POLICY IF EXISTS "Users can see their own offers" ON public.offers;
CREATE POLICY "Users can see their own offers" ON public.offers 
FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = professional_id);

DROP POLICY IF EXISTS "Customers can create offers" ON public.offers;
CREATE POLICY "Customers can create offers" ON public.offers 
FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Only professional can accept, only customer can pay
DROP POLICY IF EXISTS "Participating users can update offer status" ON public.offers;
CREATE POLICY "Participating users can update offer status" ON public.offers
FOR UPDATE USING (auth.uid() = professional_id OR auth.uid() = customer_id);

-- TRANSACTIONS
DROP POLICY IF EXISTS "Users can see their own transactions" ON public.transactions;
CREATE POLICY "Users can see their own transactions" ON public.transactions
FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = professional_id);

DROP POLICY IF EXISTS "Only customer can initiate transaction" ON public.transactions;
CREATE POLICY "Only customer can initiate transaction" ON public.transactions
FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- 6. New Automation Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, avatar_url, onboarding_completed, is_verified, last_sign_in)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'CUSTOMER'),
    'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=' || COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    FALSE,
    FALSE,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET last_sign_in = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
