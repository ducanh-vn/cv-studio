import { NextResponse } from 'next/server';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code && isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      console.error('[AuthCallback] Session exchange error:', error);
    } catch (err) {
      console.error('[AuthCallback] Unexpected error exchanging code:', err);
    }
  }

  // Redirect to application root
  return NextResponse.redirect(`${origin}${next}`);
}
