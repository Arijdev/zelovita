'use client';

import React from 'react';
import { HealthArticles } from '@/components/HealthArticles';

export default function ArticlesPage() {
  return (
    <section className="min-h-screen bg-slate-50 pb-12 pt-28 dark:bg-slate-950 sm:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 max-w-3xl">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Articles & research</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Clear guidance for better health decisions
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
            Browse practical, evidence-informed explainers. Search a topic or choose a subject to find a useful place to start.
          </p>
        </div>

        <HealthArticles />
      </div>
    </section>
  );
}