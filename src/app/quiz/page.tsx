'use client';

import React from 'react';
import { HealthQuiz } from '@/components/HealthQuiz';
import { 
  Brain, 
  Sparkles, 
  ShieldCheck,
  ClipboardList,
  Target,
  Zap,
  HeartPulse
} from 'lucide-react';

const quizBenefits = [
  { icon: Brain, title: 'Personalized Protocol', desc: 'Tailored nutrition, supplement & lifestyle plan' },
  { icon: Target, title: 'Root Cause Analysis', desc: 'Identifies primary health bottlenecks' },
  { icon: Zap, title: '60-Second Completion', desc: 'Evidence-based adaptive questioning' },
  { icon: ClipboardList, title: 'Actionable Steps', desc: 'Immediate 7-day implementation plan' },
  { icon: ShieldCheck, title: 'Clinical Validity', desc: 'Based on functional medicine principles' },
  { icon: HeartPulse, title: 'Progress Tracking', desc: 'Re-assess monthly to measure improvement' },
];

export default function QuizPage() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Brain className="w-3.5 h-3.5" />
            <span>60-SECOND TAILORED HEALTH ASSESSMENT</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Discover Your Personalized Health Blueprint
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Answer 12 clinical questions. Get a complete protocol targeting your #1 health bottleneck with nutrition, supplements & lifestyle steps.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {quizBenefits.map((item, i) => (
            <div key={i} className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center hover:border-cyan-500/50 transition-colors">
              <item.icon className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
              <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Quiz Component */}
        <HealthQuiz />
      </div>
    </section>
  );
}