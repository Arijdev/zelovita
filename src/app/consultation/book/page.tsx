'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CalendarCheck, Clock3, Stethoscope } from 'lucide-react';
import { CONSULTATION_PACKAGES } from '@/data/healthData';
import { useCountryCurrency } from '@/context/CountryCurrencyContext';
import { useAuth } from '@/context/AuthContext';

const BOOKING_WINDOWS = [
  { start: 11 * 60, end: 13 * 60 },
  { start: 15 * 60, end: 17 * 60 },
];

function formatTime(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, '0')} ${period} IST`;
}

function getAvailableSlots(durationMinutes: number) {
  return BOOKING_WINDOWS.flatMap(({ start, end }) => {
    const slots: string[] = [];
    for (let time = start; time + durationMinutes <= end; time += durationMinutes) {
      slots.push(formatTime(time));
    }
    return slots;
  });
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function ConsultationBookingContent() {
  const { formatPrice } = useCountryCurrency();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const searchParams = useSearchParams();
  const packageIdFromUrl = searchParams.get('package') || CONSULTATION_PACKAGES[1]?.id || CONSULTATION_PACKAGES[0]?.id;

  const [selectedPackageId, setSelectedPackageId] = useState(packageIdFromUrl);
  const [selectedDate, setSelectedDate] = useState(() => formatDateKey(new Date(Date.now() + 86400000)));
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM IST');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [primaryConcern, setPrimaryConcern] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
    }
  }, [user]);

  const availableDates = useMemo(() => {
    const dates: { value: string; label: string }[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i += 1) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      dates.push({ value: formatDateKey(nextDate), label: formatDateLabel(nextDate) });
    }
    return dates;
  }, []);

  const selectedPackage = CONSULTATION_PACKAGES.find((pkg) => pkg.id === selectedPackageId) || CONSULTATION_PACKAGES[1];
  const availableSlots = useMemo(
    () => getAvailableSlots(selectedPackage.durationMinutes),
    [selectedPackage.durationMinutes],
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!isAuthenticated) {
      openAuthModal('customer-login', 'Sign in or create an account before paying for a consultation.');
      return;
    }

    if (!fullName.trim() || !email.trim()) {
      setError('Please provide your name and email address.');
      return;
    }

    if (!selectedDate || !selectedSlot) {
      setError('Please choose an available date and time slot.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'consultation',
          packageId: selectedPackage.id,
          appointmentDate: selectedDate,
          appointmentTime: selectedSlot,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          primaryConcern: primaryConcern.trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.approvalUrl) {
        throw new Error(result.error || 'Could not start PayPal checkout.');
      }
      window.location.assign(result.approvalUrl);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not start PayPal checkout.');
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-16 pt-28 dark:bg-slate-950 sm:px-6 sm:pt-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-3 text-sm text-emerald-700 dark:text-emerald-400">
          <Stethoscope className="h-5 w-5" />
          <span>1-on-1 Consultation Booking</span>
        </div>

        <div className="mb-8 text-center sm:mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Book Your Private Consultation
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base text-slate-600 dark:text-slate-300">
            Select a 15-minute, 30-minute, or 1-hour session, then choose an available time. All times are India Standard Time.
          </p>
        </div>

        <div className="grid items-start gap-6 md:grid-cols-[minmax(235px,0.82fr)_minmax(0,1.3fr)] lg:gap-8">
          <aside className="grid gap-3 sm:grid-cols-3 md:grid-cols-1 md:gap-4">
            {CONSULTATION_PACKAGES.map((pkg) => {
              const isSelected = selectedPackage.id === pkg.id;

              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => {
                    setSelectedPackageId(pkg.id);
                    setSelectedSlot(getAvailableSlots(pkg.durationMinutes)[0]);
                  }}
                  className={`w-full rounded-2xl border p-3 text-left transition-all sm:p-4 lg:p-5 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10 dark:border-emerald-400 dark:bg-emerald-950/30'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white lg:text-xl">{pkg.title}</h2>
                  </div>

                  <div className="mb-3 flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white lg:text-3xl">{formatPrice(pkg.price)}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 lg:text-sm">{pkg.duration}</span>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 lg:text-sm">{pkg.description}</p>
                </button>
              );
            })}
          </aside>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Choose your session</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Selected package: {selectedPackage.title}</p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Full name
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800"
                    required
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Email address
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800"
                    required
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Phone (optional)
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800"
                  />
                </label>

                <div className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Booking price
                  <div className="mt-2 flex h-[46px] items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-base font-bold text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-400">
                    {formatPrice(selectedPackage.price)}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Preferred date
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800"
                  >
                    {availableDates.map((date) => (
                      <option key={date.value} value={date.value}>
                        {date.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Available start times (IST)</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                          selectedSlot === slot
                            ? 'border-emerald-500 bg-emerald-500 text-white shadow-md'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-emerald-500'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Primary health concern
                <textarea
                  value={primaryConcern}
                  onChange={(e) => setPrimaryConcern(e.target.value)}
                  rows={3}
                  placeholder="Tell us the main goal or health concern for the consultation"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800"
                />
              </label>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Clock3 className="h-4 w-4 text-emerald-500" />
                  <span>
                    Selected: {selectedDate} at {selectedSlot}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 sm:ml-auto">
                  Local price is an estimate. PayPal charges in USD ({new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedPackage.price)}).
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Connecting to PayPal…' : 'Continue to PayPal'}
                </button>
              </div>
            </form>
          </section>
        </div>

      </div>
    </main>
  );
}

export default function ConsultationBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 px-4 py-16 dark:bg-slate-950" /> }>
      <ConsultationBookingContent />
    </Suspense>
  );
}
