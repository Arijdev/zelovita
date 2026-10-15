'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { HEALTH_RESOURCES, HEALTH_ARTICLES } from '@/data/healthData';
import { useCart } from '@/context/CartContext';
import { useCountryCurrency } from '@/context/CountryCurrencyContext';
import { 
  Search, 
  X, 
  BookOpen, 
  FileText, 
  ArrowRight, 
  ShoppingBag, 
  Download,
  Sparkles
} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResourceSearch: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ 
  isOpen, 
  onClose,
  onSelectResourceSearch 
}) => {
  const { openReader, addToCart } = useCart();
  const { formatPrice } = useCountryCurrency();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredGuides = query.trim()
    ? HEALTH_RESOURCES.filter(r => 
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        r.highlights.some(h => h.toLowerCase().includes(query.toLowerCase()))
      )
    : HEALTH_RESOURCES.slice(0, 3);

  const filteredArticles = query.trim()
    ? HEALTH_ARTICLES.filter(a => 
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.summary.toLowerCase().includes(query.toLowerCase())
      )
    : HEALTH_ARTICLES;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-20 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-500 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search health topics: gut, fasting, longevity, heart, detox..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 dark:text-white text-base font-medium outline-none placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 p-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="p-5 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* Quick Filter Tags */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold shrink-0">Suggestions:</span>
            {['Gut Health', 'Autophagy', 'Mitochondria', 'Blood Pressure', 'Free PDF'].map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 transition-colors whitespace-nowrap"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Health Guides Match */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span>Medical Guides & Books ({filteredGuides.length})</span>
            </h4>

            <div className="space-y-2">
              {filteredGuides.map(r => (
                <div
                  key={r.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-14 rounded overflow-hidden shrink-0 shadow">
                      <Image
                        src={r.coverImage}
                        alt={r.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                          r.isFree ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                        }`}>
                          {r.isFree ? 'Free PDF' : formatPrice(r.price)}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {r.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 truncate">
                        {r.subtitle}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      openReader(r);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Articles Match */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-500" />
              <span>Health Articles & Clinical Posts</span>
            </h4>

            <div className="space-y-2">
              {filteredArticles.map(a => (
                <a
                  key={a.id}
                  href="#articles"
                  onClick={onClose}
                  className="block p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                    <span>{a.category}</span>
                    <span>{a.readTime}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                    {a.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {a.summary}
                  </p>
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
