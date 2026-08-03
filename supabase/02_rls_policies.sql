-- 1. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.social_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;

-- 2. POLICIES FOR SOCIAL PROFILES TABLE
-- Allow public read access (essential for frontend display and pre-rendering)
CREATE POLICY "Allow public read access to social_profiles" 
ON public.social_profiles 
FOR SELECT 
USING (true);

-- Allow public insert, update and delete (restricted locally in dev environment)
CREATE POLICY "Allow public access to social_profiles" 
ON public.social_profiles 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 3. POLICIES FOR MARKETING CAMPAIGNS TABLE
-- Allow public read access
CREATE POLICY "Allow public read access to marketing_campaigns" 
ON public.marketing_campaigns 
FOR SELECT 
USING (true);

-- Allow public insert, update and delete
CREATE POLICY "Allow public access to marketing_campaigns" 
ON public.marketing_campaigns 
FOR ALL 
USING (true) 
WITH CHECK (true);
