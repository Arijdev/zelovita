'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, CircleAlert, LoaderCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

type PaymentDetails = {
  items?: { resourceId: string }[];
};

function PaymentReturnContent() {
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draft_id');
  const started = useRef(false);
  const { refreshHistory, setIsCustomerDashboardOpen } = useAuth();
  const { clearCart, unlockResource } = useCart();
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your payment with PayPal…');

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const capturePayment = async () => {
      if (!draftId) {
        setState('error');
        setMessage('Payment reference is missing. Contact support if PayPal charged you.');
        return;
      }

      try {
        const response = await fetch('/api/payments/paypal/capture-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ draftId }),
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'PayPal could not verify this payment.');
        }

        if (result.paymentType === 'resources') {
          const details = result.details as PaymentDetails;
          for (const item of details.items || []) unlockResource(item.resourceId);
          clearCart();
          setMessage('Payment confirmed. Your purchased guides are now available in your library and purchase history.');
        } else {
          setMessage('Payment confirmed. Your consultation appointment and receipt are saved in your account history.');
        }
        await refreshHistory();
        setState('success');
      } catch (error) {
        setState('error');
        setMessage(error instanceof Error ? error.message : 'Payment verification failed.');
      }
    };

    void capturePayment();
  }, [clearCart, draftId, refreshHistory, unlockResource]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {state === 'loading' ? <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-emerald-600" /> : null}
        {state === 'success' ? <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" /> : null}
        {state === 'error' ? <CircleAlert className="mx-auto h-10 w-10 text-rose-600" /> : null}
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          {state === 'loading' ? 'Confirming payment' : state === 'success' ? 'Payment complete' : 'Payment needs attention'}
        </h1>
        <p role="status" className="mt-3 text-sm text-slate-600 dark:text-slate-300">{message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {state === 'success' ? (
            <button
              onClick={() => setIsCustomerDashboardOpen(true)}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
            >
              View purchase history
            </button>
          ) : null}
          <Link href="/guides" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            Return to health guides
          </Link>
        </div>
        {state === 'error' ? (
          <p className="mt-5 text-xs text-slate-500">Do not pay again if your PayPal activity already shows a completed charge. Contact support with your PayPal receipt.</p>
        ) : null}
      </section>
    </main>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <PaymentReturnContent />
    </Suspense>
  );
}
