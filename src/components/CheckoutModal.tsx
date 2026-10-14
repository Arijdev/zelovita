'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';
import { 
  X, 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  BookOpen, 
  ArrowRight, 
  Sparkles, 
  Printer, 
  Mail, 
  HeartPulse,
  Smartphone,
  Globe
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    total, 
    subtotal, 
    discountAmount, 
    appliedCoupon, 
    clearCart, 
    unlockResource, 
    downloadResourceDoc,
    openReader
  } = useCart();

  const { user, isAuthenticated, signUpWithPassword, recordPurchase, openAuthModal } = useAuth();

  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'applepay'>('card');
  
  // Customer info
  const [name, setName] = useState(user ? user.name : 'Alex Rahman');
  const [email, setEmail] = useState(user ? user.email : 'alex.rahman@example.com');
  const [phone, setPhone] = useState('+1 (555) 349-2810');
  const [country, setCountry] = useState('United States');

  // Sync user details if logged in
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Card details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Completed order snapshot
  const [completedOrder, setCompletedOrder] = useState<{
    orderId: string;
    items: typeof cart;
    totalPaid: number;
    email: string;
    date: string;
  } | null>(null);

  if (!isCheckoutOpen) return null;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    // If guest, prompt them to create an account
    if (!isAuthenticated) {
      openAuthModal('customer-register', `Create an account to complete your purchase and access your guides.`);
      return;
    }

    setStep('processing');

    setTimeout(() => {
      // Unlock all resources in cart
      cart.forEach(item => {
        unlockResource(item.resource.id);
      });

      const orderId = 'ZLV-' + Math.floor(100000 + Math.random() * 900000);
      const dateString = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const orderData = {
        orderId: orderId,
        items: [...cart],
        totalPaid: total,
        email: email,
        date: dateString
      };

      // Record in permanent purchase history
      recordPurchase({
        orderId: orderId,
        items: cart.map(c => ({
          resourceId: c.resource.id,
          title: c.resource.title,
          price: c.resource.price * c.quantity,
          coverImage: c.resource.coverImage
        })),
        totalPaid: total,
        paymentMethod: paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'paypal' ? 'PayPal' : 'Apple/Google Pay',
        purchasedAt: dateString
      });

      setCompletedOrder(orderData);
      clearCart();
      setStep('success');

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log('Confetti triggered');
      }
    }, 1800);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStep('details');
    setCompletedOrder(null);
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
              <h3 className="text-base font-bold">
                {step === 'success' ? 'Order Confirmed & Downloads Unlocked!' : 'Secure 256-Bit Checkout'}
              </h3>
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
        {step === 'details' && (
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
                <span>2. Select Payment Method</span>
              </h4>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span>Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span>PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('applepay')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'applepay'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  <span>Apple / Google Pay</span>
                </button>
              </div>

              {/* Card Inputs Mock */}
              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono border border-slate-200 dark:border-slate-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Security CVC
                      </label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={e => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono border border-slate-200 dark:border-slate-700 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Pill */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <div className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300">
                <span>Items in Order:</span>
                <span className="font-bold">{cart.length} eBooks / Guides</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between items-center text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                  <span>Coupon ({appliedCoupon.code}):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-emerald-200 dark:border-emerald-800">
                <span>Total Amount Due:</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-base">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Complete Purchase & Unlock eBooks (${total.toFixed(2)})</span>
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
        )}

        {/* STEP 2: Processing Loader */}
        {step === 'processing' && (
          <div className="p-16 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border-2 border-emerald-500/30 animate-spin">
              <HeartPulse className="w-10 h-10 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                Verifying Transaction with Bank...
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Generating your personalized download tokens and adding medical resources to your library.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Order Confirmation & Download Hub */}
        {step === 'success' && completedOrder && (
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Success Banner */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Payment Successful!
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Receipt and PDF download links have been dispatched to{' '}
                <strong className="text-emerald-600 dark:text-emerald-400">{completedOrder.email}</strong>.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-xs space-y-2">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Order ID:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{completedOrder.orderId}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Transaction Date:</span>
                <span>{completedOrder.date}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Total Paid:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">${completedOrder.totalPaid.toFixed(2)}</span>
              </div>
            </div>

            {/* Download Your Unlocked Books */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Your Unlocked Health Guides (Ready to Download):</span>
              </h5>

              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {completedOrder.items.map(item => (
                  <div
                    key={item.resource.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 gap-3"
                  >
                    <div className="min-w-0">
                      <h6 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.resource.title}
                      </h6>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                        Complete {item.resource.pages} Pages • Printable PDF & Web Access
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          openReader(item.resource);
                          handleClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Read</span>
                      </button>

                      <button
                        onClick={() => downloadResourceDoc(item.resource)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Save PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Close / Return Button */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold transition-all"
              >
                Return to Health Academy
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
