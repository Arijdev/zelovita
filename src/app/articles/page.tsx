'use client';

import React from 'react';
import { HealthArticles } from '@/components/HealthArticles';
import { 
  FileText, 
  Sparkles, 
  ShieldCheck,
  BookOpen,
  Calendar,
  Stethoscope,
  FlaskConical,
  HeartPulse
} from 'lucide-react';

const articleCategories = [
  { icon: BookOpen, title: 'Nutrition Science', desc: 'Macro/micronutrient optimization, gut health, metabolic flexibility' },
  { icon: FlaskConical, title: 'Longevity Research', desc: 'Mitochondrial health, autophagy, senolytics, biomarkers' },
  { icon: HeartPulse, title: 'Cardiovascular Health', desc: 'Blood pressure, lipids, endothelial function, HRV' },
  { icon: Calendar, title: 'Fasting Protocols', desc: 'IF, TRF, prolonged fasting, refeeding strategies' },
  { icon: ShieldCheck, title: 'Detox & Biotransformation', desc: 'Phase I/II support, environmental toxins, heavy metals' },
  { icon: Stethoscope, title: 'Clinical Case Studies', desc: 'Real patient protocols, lab interpretation, outcomes' },
];

export default function ArticlesPage() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>EVIDENCE-BASED CLINICAL ARTICLES & MASTERCLASSES</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Clinical Knowledge Hub
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Peer-reviewed medical articles, research summaries, and protocol masterclasses by Dr. Arif Chowdhury MD.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {articleCategories.map((item, i) => (
            <div key={i} className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center hover:border-indigo-500/50 transition-colors">
              <item.icon className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
              <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Articles Component */}
        <HealthArticles />
      </div>
    </section>
  );
}