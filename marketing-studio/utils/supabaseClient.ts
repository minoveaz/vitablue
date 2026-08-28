/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

if (!SUPABASE_URL) {
  throw new Error(
    'Supabase is not configured: set VITE_SUPABASE_URL before starting VitaBlue.',
  );
}

if (!SUPABASE_ANON_KEY) {
  throw new Error(
    'Supabase is not configured: set VITE_SUPABASE_ANON_KEY before starting VitaBlue.',
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
