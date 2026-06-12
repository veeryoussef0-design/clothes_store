import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://eapufiqfkvcffsizzgff.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_bZBy66TOOAH_4ak01k0y8g_OqiJcc9W';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
