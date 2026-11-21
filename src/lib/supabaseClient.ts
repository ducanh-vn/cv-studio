import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function isSupabaseConfigured(): boolean {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseUrl.includes('xxxxxxxxxx')
  );
}

// Fallback dummy client for when keys are not set, preventing SSR/hydration crashes
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder-key';

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = isSupabaseConfigured() ? supabaseUrl : fallbackUrl;
  const key = isSupabaseConfigured() ? supabaseAnonKey : fallbackKey;

  cachedClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return cachedClient;
}

export const supabase = getSupabaseClient();
