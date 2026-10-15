import Link from 'next/link';
import { CircleX } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CircleX className="mx-auto h-10 w-10 text-slate-400" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Payment cancelled</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">No payment was captured. You can return to your cart or choose a consultation slot again.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/guides" className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">Return to health guides</Link>
          <Link href="/consultation" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Consultations</Link>
        </div>
      </section>
    </main>
  );
}
