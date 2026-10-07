import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle OAuth errors from provider
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/login?error=${encodeURIComponent(errorDescription || error)}`
    );
  }

  if (code) {
    try {
      const supabase = await createSupabaseServerClient();
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (!exchangeError) {
        // Success - redirect to intended page
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}${next}`);
      }

      console.error('Code exchange failed:', exchangeError);
    } catch (err) {
      console.error('Callback error:', err);
    }
  }

  // Fallback: redirect to login with error
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_SITE_URL}/login?error=${encodeURIComponent('Authentication failed')}`
  );
}
