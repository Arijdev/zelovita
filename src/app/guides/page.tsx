'use client';

import React from 'react';
import { ResourceLibrary } from '@/components/ResourceLibrary';
import { 
  BookOpen, 
  Sparkles, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export default function GuidesPage() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>CLINICAL RESOURCE LIBRARY & STORE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Medical Health Guides & eBooks
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Dive into science-backed medical protocols. Access our complimentary free PDF guides or purchase comprehensive clinical masterclasses with instant lifetime digital access.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Sparkles, label: 'Evidence-Based', desc: 'Peer-reviewed protocols' },
            { icon: ShieldCheck, label: 'Doctor Authored', desc: 'By Dr. Arif Chowdhury MD' },
            { icon: BookOpen, label: 'Instant Access', desc: 'PDF + Web Reader' },
            { icon: ArrowRight, label: 'Lifetime Updates', desc: 'Free future revisions' },
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <item.icon className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <h3 className="font-bold text-slate-900 dark:text-white">{item.label}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Resource Library */}
        <ResourceLibrary />
      </div>
    </section>
  );
}