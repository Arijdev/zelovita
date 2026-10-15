import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    if (type === 'signup') {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        message: 'Verification email sent. Please check your inbox.',
      });
    }

    if (type === 'recovery') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // Land on the site root — the browser client detects the recovery
        // token from the URL and opens the reset form automatically.
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        message: 'Password reset email sent. Please check your inbox.',
      });
    }

    if (type === 'magic_link') {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        message: 'Magic link sent. Please check your email.',
      });
    }

    return NextResponse.json(
      { error: 'Invalid OTP type' },
      { status: 400 }
    );
  } catch (error) {
    console.error('OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
