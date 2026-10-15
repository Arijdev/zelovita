'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { 
  X, 
  CreditCard, 
  Lock, 
  ShieldCheck,
  ArrowRight, 
  Mail, 
  Globe
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCountryCurrency } from '@/context/CountryCurrencyContext';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    total, 
    discountAmount, 
    appliedCoupon, 
  } = useCart();

  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { formatPrice } = useCountryCurrency();

  // Customer info
  const [name, setName] = useState(user ? user.name : 'Alex Rahman');
  const [email, setEmail] = useState(user ? user.email : 'alex.rahman@example.com');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Sync user details if logged in
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  if (!isCheckoutOpen) return null;

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    // If guest, prompt them to create an account
    if (!isAuthenticated) {
      openAuthModal('customer-register', `Create an account to complete your purchase and access your guides.`);
      return;
    }

    setIsSubmitting(true);
    setPaymentError('');

    try {
      const response = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'resources',
          items: cart.map((item) => ({ resourceId: item.resource.id, quantity: item.quantity })),
          couponCode: appliedCoupon?.code,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.approvalUrl) {
        throw new Error(result.error || 'Could not start PayPal checkout.');
      }
      window.location.assign(result.approvalUrl);
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Could not start PayPal checkout.');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Secure PayPal Checkout</h3>
              <p className="text-xs text-slate-400">
                Dr. Arif Chowdhury — Zelovita Health Academy
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close checkout"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Details & Payment Form */}
        <form onSubmit={handleProcessPayment} className="p-6 sm:p-8 space-y-6">
            
            {/* Customer Information */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-emerald-500" />
                <span>1. Digital Delivery Details</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g. Alex Rahman"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email for Instant PDF Delivery
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="alex@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-500" />
                <span>2. Pay securely with PayPal</span>
              </h4>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800">
                <Globe className="h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">PayPal</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Secure payment approval through your PayPal account.</p>
                </div>
              </div>
            </div>

            {paymentError && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                {paymentError}
              </p>
            )}

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Local currency is an estimate. PayPal currently charges the order in USD ({new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}).
            </p>

            {/* Order Summary Pill */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300">
                <span>Items in Order:</span>
                <span className="font-bold">{cart.length} eBooks / Guides</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between items-center text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span>Coupon ({appliedCoupon.code}):</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-emerald-200 dark:border-emerald-800">
                <span>Total Amount Due:</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-base">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? 'Connecting to PayPal…' : `Continue to PayPal (${formatPrice(total)})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                256-Bit SSL Encrypted
              </span>
              <span>•</span>
              <span>30-Day Money Back Guarantee</span>
            </div>
          </form>

      </div>
    </div>
  );
};
