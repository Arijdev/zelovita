import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient, createSupabaseServerClient } from '@/lib/supabase-server';
import { paypalRequest, getPayPalAccessToken } from '@/lib/paypal';
import { CONSULTATION_PACKAGES } from '@/data/healthData';

type PayPalOrder = {
  id: string;
  status: string;
  purchase_units?: {
    custom_id?: string;
    invoice_id?: string;
    amount?: { currency_code?: string; value?: string };
    payments?: { captures?: { id: string; status: string; amount?: { currency_code?: string; value?: string } }[] };
  }[];
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Sign in to complete this payment.' }, { status: 401 });

    const { draftId } = await request.json();
    if (typeof draftId !== 'string') return NextResponse.json({ error: 'Missing payment reference.' }, { status: 400 });

    const admin = createSupabaseAdminClient();
    const { data: draft, error: draftError } = await admin
      .from('payment_orders')
      .select('*')
      .eq('id', draftId)
      .eq('user_id', user.id)
      .single();
    if (draftError || !draft || !draft.paypal_order_id) {
      return NextResponse.json({ error: 'This payment could not be found for your account.' }, { status: 404 });
    }

    if (draft.status === 'completed') {
      return NextResponse.json({ success: true, paymentType: draft.payment_type, details: draft.details });
    }

    const accessToken = await getPayPalAccessToken();
    let order = await paypalRequest<PayPalOrder>(`/v2/checkout/orders/${draft.paypal_order_id}`, accessToken);
    const purchaseUnit = order.purchase_units?.[0];
    if (purchaseUnit?.custom_id !== user.id || purchaseUnit.invoice_id !== draft.id ||
        purchaseUnit.amount?.currency_code !== 'USD' || Number(purchaseUnit.amount.value) !== Number(draft.amount_usd)) {
      return NextResponse.json({ error: 'The PayPal order does not match your payment.' }, { status: 400 });
    }

    if (order.status !== 'COMPLETED') {
      if (order.status !== 'APPROVED') {
        return NextResponse.json({ error: 'PayPal has not approved this payment yet.' }, { status: 409 });
      }
      order = await paypalRequest<PayPalOrder>(`/v2/checkout/orders/${draft.paypal_order_id}/capture`, accessToken, {
        method: 'POST',
        body: JSON.stringify({}),
      });
    }

    const capture = order.purchase_units?.[0]?.payments?.captures?.find((item) => item.status === 'COMPLETED');
    if (order.status !== 'COMPLETED' || !capture || capture.amount?.currency_code !== 'USD' ||
        Number(capture.amount.value) !== Number(draft.amount_usd)) {
      return NextResponse.json({ error: 'PayPal did not confirm the full payment.' }, { status: 402 });
    }

    const paidAt = new Date().toISOString();
    if (draft.payment_type === 'resources') {
      const details = draft.details as { items: { resourceId: string; title: string; unitPrice: number; quantity: number }[] };
      const items = details.items.map((item) => ({
        resourceId: item.resourceId,
        title: item.title,
        price: item.unitPrice * item.quantity,
        coverImage: '',
      }));
      const { error: purchaseError } = await admin.from('purchases').upsert({
        user_id: user.id,
        order_id: draft.paypal_order_id,
        items,
        total_paid: draft.amount_usd,
        payment_method: 'PayPal',
        status: 'completed',
        purchased_at: paidAt,
      }, { onConflict: 'order_id' });
      if (purchaseError) throw purchaseError;
    } else if (draft.payment_type === 'consultation') {
      const details = draft.details as {
        packageId: string; packageTitle: string; fullName: string; email: string; phone: string;
        primaryConcern: string; appointmentDate: string; appointmentTime: string;
      };
      const pkg = CONSULTATION_PACKAGES.find((item) => item.id === details.packageId);
      if (!pkg || pkg.price !== Number(draft.amount_usd)) throw new Error('Consultation package price validation failed.');

      const { data: existingBooking } = await admin.from('consultation_bookings')
        .select('id').eq('payment_order_id', draft.id).maybeSingle();
      if (!existingBooking) {
        const { error: bookingError } = await admin.from('consultation_bookings').insert({
          user_id: user.id,
          payment_order_id: draft.id,
          paypal_order_id: draft.paypal_order_id,
          paypal_capture_id: capture.id,
          payment_status: 'paid',
          paid_at: paidAt,
          full_name: details.fullName,
          email: details.email,
          phone: details.phone,
          package_title: details.packageTitle,
          package_price: draft.amount_usd,
          appointment_date: details.appointmentDate,
          appointment_time: details.appointmentTime,
          primary_concern: details.primaryConcern,
          notes: '',
          status: 'pending',
        });
        if (bookingError) throw bookingError;
      }

      const { error: purchaseError } = await admin.from('purchases').upsert({
        user_id: user.id,
        order_id: draft.paypal_order_id,
        items: [{
          resourceId: `consultation:${pkg.id}`,
          title: pkg.title,
          price: draft.amount_usd,
          coverImage: '',
          appointmentDate: details.appointmentDate,
          appointmentTime: details.appointmentTime,
        }],
        total_paid: draft.amount_usd,
        payment_method: 'PayPal',
        status: 'completed',
        purchased_at: paidAt,
      }, { onConflict: 'order_id' });
      if (purchaseError) throw purchaseError;
    } else {
      throw new Error('Unsupported payment record type.');
    }

    const { error: updateError } = await admin.from('payment_orders')
      .update({ status: 'completed', paypal_capture_id: capture.id, paid_at: paidAt })
      .eq('id', draft.id).eq('user_id', user.id);
    if (updateError) throw updateError;

    return NextResponse.json({ success: true, paymentType: draft.payment_type, details: draft.details });
  } catch (error) {
    console.error('PayPal capture/persistence failed:', error);
    return NextResponse.json({ error: 'Payment could not be verified or saved. Contact support with your PayPal receipt before paying again.' }, { status: 500 });
  }
}