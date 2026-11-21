import type { AuthUser, AuthProvider } from '@/types/auth';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { DEFAULT_GUEST_USER } from '@/constants/authConstants';

/**
 * Maps Supabase raw User entity to application AuthUser model.
 */
export function mapSupabaseUserToAuthUser(sbUser: any): AuthUser {
  if (!sbUser || !sbUser.id) return DEFAULT_GUEST_USER;

  const metadata = sbUser.user_metadata || {};
  const rawProvider = sbUser.app_metadata?.provider || 'google';
  const provider: AuthProvider = rawProvider === 'github' ? 'github' : 'google';

  const name =
    metadata.full_name ||
    metadata.name ||
    metadata.user_name ||
    sbUser.email?.split('@')[0] ||
    'User';

  const avatarUrl =
    metadata.avatar_url ||
    metadata.picture ||
    undefined;

  return {
    id: sbUser.id,
    name,
    email: sbUser.email || '',
    avatarUrl,
    provider,
    createdAt: sbUser.created_at || new Date().toISOString(),
    lastSyncedAt: new Date().toISOString(),
    workspaceId: `ws_${sbUser.id.substring(0, 8)}`,
  };
}

/**
 * Initiates authentic OAuth redirect through Supabase.
 */
export async function signInWithSupabase(provider: 'google' | 'github'): Promise<{ error: any }> {
  if (!isSupabaseConfigured()) {
    return { error: new Error('Supabase is not configured yet. Please check .env.local') };
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const redirectTo = `${origin}/auth/callback`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  return { error };
}

/**
 * Signs out from Supabase session.
 */
export async function signOutFromSupabase(): Promise<{ error: any }> {
  if (!isSupabaseConfigured()) {
    return { error: null };
  }
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Fetches current active session user from Supabase.
 */
export async function getCurrentSupabaseUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.user) return null;
    return mapSupabaseUserToAuthUser(session.user);
  } catch (err) {
    console.warn('[getCurrentSupabaseUser] Error retrieving session:', err);
    return null;
  }
}
