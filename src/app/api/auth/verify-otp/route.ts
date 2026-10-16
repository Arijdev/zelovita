import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { email, token, fullName, phone } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and verification code are required' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    // Verify the OTP
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });

    if (verifyError) {
      return NextResponse.json({ error: verifyError.message }, { status: 400 });
    }

    // Set optional profile fields after Supabase confirms the signup code.
    if (verifyData.user && (fullName || phone)) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName || email.split('@')[0],
          phone: phone || '',
          role: 'customer',
        },
      });

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 });
      }
    }

    // Get the session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      return NextResponse.json({ error: sessionError.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Account verified and created successfully',
      user: verifyData.user,
      session: sessionData.session,
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}