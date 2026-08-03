-- 1. Enable UUID Extension if not already active
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE SOCIAL PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.social_profiles (
    platform text PRIMARY KEY,
    url text NOT NULL,
    username text,
    updated_at timestamp with time zone DEFAULT now()
);

-- 3. CREATE MARKETING CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
    id text PRIMARY KEY, -- String ID matched to React client state
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
