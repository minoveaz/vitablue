-- SQL SCHEMA FOR VITABLUE SUPABASE INTEGRATION
-- Run this script in the Supabase SQL Editor of your project (loopdev) to set up the tables.

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SOCIAL PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.social_profiles (
    platform text PRIMARY KEY,
    url text NOT NULL,
    username text,
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.social_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read & write (since it is a dev workspace)
CREATE POLICY "Allow public read access to social_profiles" ON public.social_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update to social_profiles" ON public.social_profiles FOR ALL USING (true) WITH CHECK (true);

-- 2. MARKETING CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    objective text,
    status text DEFAULT 'draft',
    start_date date,
    platforms text[] DEFAULT '{}',
    copies jsonb DEFAULT '{}'::jsonb,
    assets jsonb DEFAULT '[]'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies for public read & write
CREATE POLICY "Allow public read access to marketing_campaigns" ON public.marketing_campaigns FOR SELECT USING (true);
CREATE POLICY "Allow public access to marketing_campaigns" ON public.marketing_campaigns FOR ALL USING (true) WITH CHECK (true);

-- Seed Initial Social Profiles from default values
INSERT INTO public.social_profiles (platform, url, username)
VALUES 
('facebook', 'https://www.facebook.com/share/1FwKPbX8N7/?mibextid=wwXIfr', 'Página VitaBlue'),
('instagram', 'https://www.instagram.com/vitablue_seguros/', '@vitablue_seguros'),
('tiktok', 'https://www.tiktok.com/@vitablueseguros', '@vitablueseguros'),
('youtube', 'https://www.youtube.com/@VitaBlue-seguros', '@VitaBlue-seguros'),
('linkedin', 'https://www.linkedin.com/company/vitablue-seguros/', '/company/vitablue-seguros'),
('x', 'https://x.com/vitablueseguros', '@vitablueseguros')
ON CONFLICT (platform) DO NOTHING;
