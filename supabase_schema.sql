
-- Helper.az Database Schema
-- Run this in the Supabase SQL Editor

-- 1. Create Profiles Table (Syncs with Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT CHECK (role IN ('CUSTOMER', 'PROFESSIONAL')),
  profession TEXT,
  skills TEXT[],
  bio TEXT,
  hourly_rate NUMERIC DEFAULT 10,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  avatar_url TEXT,
  location TEXT,
  availability TEXT[],
  is_available BOOLEAN DEFAULT TRUE,
  joined_date TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Offers Table (Jobs)
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- 4. RLS Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 5. RLS Policies for Offers
CREATE POLICY "Users can view their own offers" ON public.offers
  FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = professional_id);

CREATE POLICY "Customers can create offers" ON public.offers
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- 6. Trigger: Create a public profile record when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'CUSTOMER'),
    'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=' || COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
