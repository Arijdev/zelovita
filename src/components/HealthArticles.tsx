'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { HEALTH_ARTICLES, DOCTOR_INFO } from '@/data/healthData';
import { HealthArticle } from '@/types/health';
import { 
  FileText, 
  Clock, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  BookOpen,
  Calendar
} from 'lucide-react';

export const HealthArticles: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<HealthArticle | null>(null);

  return (
    <section id="articles" className="py-20 bg-slate-50 dark:bg-slate-950/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>CLINICAL RESEARCH & ARTICLES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Evidence-Based Health Masterclasses
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Deep-dive medical breakdowns on gut microbiology, circadian endocrinology, and metabolic disease reversal by Dr. Arif Chowdhury.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {HEALTH_ARTICLES.map(article => (
            <div
              key={article.id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="p-6 space-y-4">
                {/* Tag & Read Time */}
                <div className="flex items-center justify-between text-xs">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/60">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    {article.readTime}
                  </span>
                </div>

                {/* Title & Summary */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                {/* Key Points */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {article.keyPoints.slice(0, 2).map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Read Full Article Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedArticle(article)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <span>Read Clinical Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Full Article Reading Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {selectedArticle.category} • {selectedArticle.readTime}
                </span>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Article Content */}
            <div className="p-6 sm:p-10 space-y-6 max-h-[75vh] overflow-y-auto">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {selectedArticle.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium">
                  <span>By {DOCTOR_INFO.name}</span>
                  <span>•</span>
                  <span>{selectedArticle.publishedDate}</span>
                </div>
              </div>

              {/* Key Takeaways Box */}
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Key Clinical Findings:</span>
                </h4>
                <ul className="space-y-1.5">
                  {selectedArticle.keyPoints.map((kp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span>{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Body */}
              <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-4 whitespace-pre-line font-serif">
                {selectedArticle.content}
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Published by <strong>Zelovita Health Academy</strong>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  Close Article
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
