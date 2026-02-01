
-- ==========================================
-- HELPER.AZ DATABASE SETUP SCRIPT
-- ==========================================
-- 1. PASTE THIS INTO YOUR SUPABASE SQL EDITOR
-- 2. CLICK 'RUN'
-- ==========================================

-- Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT CHECK (role IN ('CUSTOMER', 'PROFESSIONAL')),
  profession TEXT,
  skills TEXT[] DEFAULT '{}',
  bio TEXT DEFAULT '',
  hourly_rate NUMERIC DEFAULT 15,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  avatar_url TEXT,
  location TEXT DEFAULT 'Bakı',
  availability TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  joined_date TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Offers Table
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  professional_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  service_type TEXT,
  description TEXT,
  price NUMERIC,
  date DATE,
  time TIME,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'COMPLETED')),
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- 4. Set RLS Policies (Allows your app to talk to the DB)

-- PROFILES
DROP POLICY IF EXISTS "Profiles are public" ON public.profiles;
CREATE POLICY "Profiles are public" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles 
FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow individual insert during trigger" ON public.profiles;
CREATE POLICY "Allow individual insert during trigger" ON public.profiles
FOR INSERT WITH CHECK (true);

-- OFFERS
DROP POLICY IF EXISTS "Users can see their own offers" ON public.offers;
CREATE POLICY "Users can see their own offers" ON public.offers 
FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = professional_id);

DROP POLICY IF EXISTS "Customers can create offers" ON public.offers;
CREATE POLICY "Customers can create offers" ON public.offers 
FOR INSERT WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Parties can update their offers" ON public.offers;
CREATE POLICY "Parties can update their offers" ON public.offers 
FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() = professional_id);

-- 5. AUTOMATIC PROFILE CREATION TRIGGER
-- This creates a row in 'profiles' every time someone signs up via Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, avatar_url, onboarding_completed)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'CUSTOMER'),
    'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=' || COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    FALSE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
