'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DOCTOR_INFO, FAQS } from '@/data/healthData';
import { useCart } from '@/context/CartContext';
import { 
  HeartPulse, 
  ChevronDown, 
  Mail, 
  Send, 
  ShieldAlert, 
  CheckCircle2, 
  Phone, 
  MapPin,
  ExternalLink,
  Radio,
  Globe
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { addToast } = useCart();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribed(true);
    addToast('Subscribed!', 'Welcome to Dr. Arif Chowdhury’s Weekly Longevity Protocol.', 'success');
  };

  return (
    <footer className="bg-slate-100/70 dark:bg-slate-950 text-slate-700 dark:text-slate-300 pt-20 pb-12 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Clinical, Guide & Purchase Details
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Clear answers regarding our health guides, digital access, and consultation procedures.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  suppressHydrationWarning
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-emerald-600 dark:text-emerald-400 transition-transform duration-200 shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 font-serif">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-950 dark:via-teal-950 dark:to-slate-900 border border-emerald-500/30 dark:border-emerald-800/40 text-center space-y-4 max-w-4xl mx-auto text-white shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 dark:bg-emerald-500/20 text-white dark:text-emerald-300 text-xs font-bold uppercase backdrop-blur-sm">
            <Mail className="w-3.5 h-3.5" />
            <span>WEEKLY CLINICAL INSIGHTS</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold">
            Join 35,000+ Readers on Dr. Arif’s Longevity Protocol
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Get an actionable 3-minute medical breakdown every Sunday morning on reversing biological age, gut microbiome optimization, and free health PDF updates.
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                suppressHydrationWarning
                className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs border border-white/40 dark:border-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white shadow-inner"
              />
              <button
                type="submit"
                suppressHydrationWarning
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Subscribe Free</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="p-3 bg-white/20 dark:bg-emerald-500/20 border border-white/30 dark:border-emerald-500/40 rounded-xl text-white dark:text-emerald-300 text-xs font-bold inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Thank you! You are now subscribed to the Sunday Protocol.</span>
            </div>
          )}
        </div>

        {/* Footer Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-xs">
          
          {/* Col 1: Doctor Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-extrabold text-slate-900 dark:text-white block leading-tight">
                  ZELOVITA HEALTH ACADEMY
                </span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                  {DOCTOR_INFO.name}, MD
                </span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
              {DOCTOR_INFO.tagline}
            </p>
            <div className="pt-2 text-slate-600 dark:text-slate-400 space-y-1">
              <p>📍 {DOCTOR_INFO.clinicLocation}</p>
              <p>✉️ {DOCTOR_INFO.email}</p>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 font-medium">
              <li><a href="#guides" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Free PDF Downloads</a></li>
              <li><a href="#guides" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Premium Health eBooks</a></li>
              <li><a href="/calculators" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">BMI & Hydration Calculators</a></li>
              <li><a href="/quiz" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Health Diagnostic Quiz</a></li>
              <li><a href="/consultation" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">1-on-1 Consultation Booking</a></li>
            </ul>
          </div>

          {/* Col 3: Medical Topics */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Health Focus Areas
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400 font-medium">
              <li>Clinical Nutrition & Leaky Gut</li>
              <li>Autophagy & Intermittent Fasting</li>
              <li>Mitochondria & Cellular Biohacking</li>
              <li>Cardiometabolic & Nitric Oxide</li>
              <li>Circadian Sleep Alignment</li>
            </ul>
          </div>

        </div>

        {/* Medical Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed">
          <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-slate-900/60 border border-amber-200/80 dark:border-slate-800/80 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-900 dark:text-slate-200">Medical Disclaimer:</strong> The content, PDF guides, calculators, and protocols published on this website are authored for educational and informative purposes only. They are not intended as a substitute for individualized clinical diagnosis, medical evaluation, or treatment by a licensed physician. Always seek the advice of your personal physician or other qualified healthcare provider before initiating any new dietary, fasting, or supplement regimen.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
            <p className="text-slate-600 dark:text-slate-500 font-medium">
              © {new Date().getFullYear()} Zelovita Health Academy — Dr. Arif Chowdhury. All Rights Reserved.
            </p>
            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
              <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-slate-800 dark:hover:text-white cursor-pointer">Digital Product Refund Policy</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
