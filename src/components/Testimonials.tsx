'use client';

import React from 'react';
import Image from 'next/image';
import { TESTIMONIALS } from '@/data/healthData';
import { Star, ShieldCheck, HeartHandshake, Quote, CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>REAL PATIENT TRANSFORMATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Verified Clinical Success Stories
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            See how individuals transformed their health, reversed metabolic markers, and reclaimed natural vitality through Dr. Arif Chowdhury's protocols.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map(t => (
            <div
              key={t.id}
              className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                {/* Top: Avatar & Stars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 shrink-0">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {t.name}
                        </h4>
                        <span className="text-[11px] text-slate-400">({t.age} yrs)</span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {t.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Clinical Result Pill */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Clinical Outcome:</span>
                  </div>
                  <p className="text-emerald-950 dark:text-emerald-200 font-semibold mt-0.5">
                    {t.result}
                  </p>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic font-serif">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Verified Marker */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>Initial Condition: <strong>{t.condition}</strong></span>
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Patient
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
