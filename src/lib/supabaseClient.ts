import { createClient } from '@supabase/supabase-js';

// Ces variables iront chercher les clés que tu vas mettre dans Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
