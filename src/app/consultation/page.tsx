'use client';

import React from 'react';
import { ConsultationBooking } from '@/components/ConsultationBooking';
import { 
  Stethoscope, 
  ShieldCheck,
  HeartPulse,
  Video,
  Calendar,
  Clock,
  Shield,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

const consultationTypes = [
  { 
    icon: Video, 
    title: 'Virtual Consultation', 
    desc: '45-min video call with Dr. Arif', 
    duration: '45 min',
    price: '$297',
    features: ['Root cause analysis', 'Lab review & interpretation', 'Personalized protocol', '7-day action plan', 'Email follow-up (14 days)']
  },
  { 
    icon: Calendar, 
    title: 'Follow-Up Session', 
    desc: '30-min progress review & protocol adjustment', 
    duration: '30 min',
    price: '$147',
    features: ['Progress assessment', 'Protocol optimization', 'New lab review', 'Updated action plan', 'Email support (7 days)']
  },
  { 
    icon: Shield, 
    title: 'Comprehensive Package', 
    desc: 'Initial + 3 follow-ups over 90 days', 
    duration: '45 + 3×30 min',
    price: '$597',
    features: ['Everything in Virtual', '3 follow-up sessions', 'Priority email access', 'Supplement discount (15%)', 'Lab ordering guidance']
  },
];

const processSteps = [
  { step: '01', title: 'Book Your Slot', desc: 'Choose consultation type & pick a convenient time' },
  { step: '02', title: 'Complete Intake', desc: 'Fill detailed health history & upload recent labs' },
  { step: '03', title: 'Virtual Session', desc: '45-min video call with Dr. Arif via secure platform' },
  { step: '04', title: 'Receive Protocol', desc: 'Get personalized PDF protocol within 24 hours' },
  { step: '05', title: 'Implement & Track', desc: 'Follow 7-day action plan with email support' },
  { step: '06', title: 'Follow-Up', desc: 'Review progress, adjust protocol, order new labs' },
];

export default function ConsultationPage() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>1-ON-1 VIRTUAL CONSULTATIONS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Personalized Clinical Guidance with Dr. Arif
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Book a secure video consultation for root cause analysis, lab interpretation, and a personalized health protocol.
          </p>
        </div>

        {/* Consultation Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {consultationTypes.map((item, i) => (
            <div key={i} className={`p-6 sm:p-8 rounded-2xl border bg-white dark:bg-slate-900 ${
              i === 2 
                ? 'border-rose-500 shadow-xl shadow-rose-500/10 relative' 
                : 'border-slate-200 dark:border-slate-800'
            }`}>
              {i === 2 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full">
                  Most Popular
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <item.icon className={`w-10 h-10 rounded-xl bg-${i === 2 ? 'rose' : 'emerald'}-100 dark:bg-${i === 2 ? 'rose' : 'emerald'}-950/30 flex items-center justify-center text-${i === 2 ? 'rose' : 'emerald'}-600`} />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              </div>
              
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{item.price}</span>
                <span className="text-slate-500 dark:text-slate-400">/ {item.duration}</span>
              </div>

              <ul className="space-y-2 mb-6">
                {item.features.map((feat, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                i === 2
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/25'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
              }`}>
                Book {item.title} →
              </button>
            </div>
          ))}
        </div>

        {/* Process Steps */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              How It Works
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              From booking to protocol implementation in 6 simple steps
            </p>
          </div>
          <div className="space-y-4">
            {processSteps.map((item, i) => (
              <div key={i} className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-rose-100 dark:bg-rose-950/30 flex items-center justify-center">
                  <span className="text-rose-600 dark:text-rose-400 font-bold text-lg">{item.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Component */}
        <ConsultationBooking />
      </div>
    </section>
  );
}