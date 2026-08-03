/// <reference types="vite/client" />

import { createClient } from '@supabase/supabase-js';

// Supabase configuration credentials extracted from the sibling loopdev project
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://sukjcsylkljiyvfklxvj.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_y7LKtWICauXvyWo6Aa9pSA_ylMUg845';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
