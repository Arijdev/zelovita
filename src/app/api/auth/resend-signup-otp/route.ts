import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (typeof email !== 'string' || !email.trim() || !email.includes('@')) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
    });

    if (error) {
      if (/rate limit|too many requests/i.test(error.message)) {
        return NextResponse.json(
          { error: 'A code was requested recently. Wait at least 60 seconds before trying again.' },
          { status: 429 },
        );
      }
      if (/error sending confirmation email|failed to send/i.test(error.message)) {
        console.error('Supabase signup OTP resend delivery failed:', {
          message: error.message,
          status: error.status,
          code: error.code,
          name: error.name,
        });
        return NextResponse.json(
          { error: 'Supabase could not deliver the code. Check your SMTP provider logs and sender verification.' },
          { status: 503 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'A new verification code was requested. Check your inbox and spam folder.' });
  } catch (error) {
    console.error('Signup OTP resend failed:', error);
    return NextResponse.json({ error: 'Could not request another code. Please try again later.' }, { status: 500 });
  }
}
