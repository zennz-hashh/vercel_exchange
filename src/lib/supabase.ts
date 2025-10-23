import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseEnabled = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let supabase: SupabaseClient | null = null;

if (isSupabaseEnabled) {
  supabase = createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string);
}

export function getSupabase() {
  if (!isSupabaseEnabled) return null;
  return supabase;
}
