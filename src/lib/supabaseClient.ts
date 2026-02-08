import { createClient } from '@supabase/supabase-js';

// On remplace les variables d'environnement par tes clés réelles
const supabaseUrl = "https://xlmdeukcnmzuvaiiquhd.supabase.co"; 
const supabaseAnonKey = "sb_publishable_YFpOFhO_oqICIcVVwenhuA_Plf8_aCl"; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
