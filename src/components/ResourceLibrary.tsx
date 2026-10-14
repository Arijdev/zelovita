'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { HealthResource } from '@/types/health';
import { HEALTH_RESOURCES } from '@/data/healthData';
import { 
  BookOpen, 
  Download, 
  ShoppingBag, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  FileText, 
  Search, 
  Filter, 
  Check, 
  Tag, 
  ExternalLink,
  ShieldCheck,
  Eye,
  Lock
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { PdfPreviewModal } from './PdfPreviewModal';

interface ResourceLibraryProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ 
  searchQuery: externalQuery = '', 
  onClearSearch 
}) => {
  const { resources, addToCart, isResourceUnlocked, openReader, downloadResourceDoc } = useCart();
  const { isDoctor, setIsDoctorPortalOpen, isAuthenticated } = useAuth();
  const [internalQuery, setInternalQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-low' | 'price-high'>('popular');
  const [pdfPreviewResource, setPdfPreviewResource] = useState<HealthResource | null>(null);

  const activeSearch = externalQuery || internalQuery;

  const freeCount = resources.filter(r => r.isFree).length;
  const paidCount = resources.filter(r => !r.isFree).length;

  const categories = [
    { id: 'all', label: `All Guides (${resources.length})` },
    { id: 'free', label: `Free Downloads 🎁 (${freeCount})` },
    { id: 'paid', label: `Premium eBooks 🛒 (${paidCount})` },
    { id: 'nutrition', label: 'Nutrition & Gut' },
    { id: 'longevity', label: 'Longevity & Cellular' },
    { id: 'heart', label: 'Heart & Blood Pressure' },
    { id: 'fasting', label: 'Intermittent Fasting' },
    { id: 'detox', label: 'Metabolic Reset' },
  ];

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      // Category filter
      if (activeCategory === 'free' && !resource.isFree) return false;
      if (activeCategory === 'paid' && resource.isFree) return false;
      if (
        activeCategory !== 'all' && 
        activeCategory !== 'free' && 
        activeCategory !== 'paid' && 
        resource.category !== activeCategory
      ) {
        return false;
      }

      // Search filter
      if (activeSearch.trim()) {
        const query = activeSearch.toLowerCase();
        const matchesTitle = resource.title.toLowerCase().includes(query);
        const matchesSubtitle = resource.subtitle.toLowerCase().includes(query);
        const matchesDesc = resource.description.toLowerCase().includes(query);
        const matchesHighlights = resource.highlights.some(h => h.toLowerCase().includes(query));
        return matchesTitle || matchesSubtitle || matchesDesc || matchesHighlights;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.reviewCount - a.reviewCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });
  }, [resources, activeCategory, activeSearch, sortBy]);

  return (
    <section id="guides" className="py-20 bg-slate-50 dark:bg-slate-950/50 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>CLINICAL RESOURCE LIBRARY & STORE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Medical Health Guides & eBooks by Dr. Arif Chowdhury
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
            Dive into science-backed medical protocols. Access our complimentary free PDF guides or purchase comprehensive clinical masterclasses with instant lifetime digital access.
          </p>
        </div>

        {/* Controls Bar: Search, Category Tabs, Sort */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search guides, gut health, fasting..."
                value={activeSearch}
                onChange={e => setInternalQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {activeSearch && (
                <button
                  onClick={() => {
                    setInternalQuery('');
                    if (onClearSearch) onClearSearch();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated ★</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-thin pt-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No health guides found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Try adjusting your search query or switching category filter.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setInternalQuery('');
                if (onClearSearch) onClearSearch();
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredResources.map(resource => {
              const unlocked = isResourceUnlocked(resource.id);

              return (
                <div
                  key={resource.id}
                  className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/90 dark:border-slate-800/90 hover:border-emerald-500/50 transition-all duration-300 group"
                >
                  {/* Book Cover Area */}
                  <div className="relative w-full aspect-[3/4] max-h-80 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-950 p-4 sm:p-6 flex items-center justify-center overflow-hidden">
                    
                    {/* Badge */}
                    {resource.isFree ? (
                      <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-extrabold tracking-wider uppercase shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>100% Free Guide</span>
                      </div>
                    ) : (
                      <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-slate-900/85 dark:bg-emerald-950/85 text-emerald-300 text-[11px] font-extrabold tracking-wider uppercase shadow-md border border-emerald-500/30">
                        {resource.badge || 'Premium Masterclass'}
                      </div>
                    )}

                    {/* Unlocked status badge */}
                    {unlocked && (
                      <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-teal-500/90 text-white text-[11px] font-bold shadow-md flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Unlocked</span>
                      </div>
                    )}

                    {/* 3D Cover Image with tilt effect */}
                    <div className="relative w-full max-w-48 h-full max-h-64 rounded-lg overflow-hidden shadow-2xl group-hover:scale-105 group-hover:-rotate-1 transition-transform duration-500">
                      <Image
                        src={resource.coverImage}
                        alt={resource.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Quick Preview Hover Overlay */}
                    <button
                      onClick={() => openReader(resource)}
                      className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-white font-semibold text-xs transition-opacity duration-300"
                    >
                      <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center gap-2 hover:bg-white/30">
                        <Eye className="w-4 h-4" />
                        <span>Quick Look & Chapters</span>
                      </div>
                    </button>
                  </div>

                  {/* Book Details Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Meta Info: Rating & Pages */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span>{resource.rating}</span>
                          <span className="text-slate-400 font-normal">({resource.reviewCount.toLocaleString()})</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-emerald-500" />
                            {resource.pages} pgs
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-teal-500" />
                            {resource.readingTime}
                          </span>
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {resource.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {resource.subtitle}
                        </p>
                      </div>

                      {/* Highlights checklist */}
                      <div className="space-y-1.5 pt-1">
                        {resource.highlights.slice(0, 3).map((hl, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price & Action Area */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          {resource.isFree ? (
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                FREE
                              </span>
                              <span className="text-xs text-slate-400 line-through">
                                ${resource.originalPrice?.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                ${resource.price.toFixed(2)}
                              </span>
                              {resource.originalPrice && (
                                <span className="text-xs text-slate-400 line-through">
                                  ${resource.originalPrice.toFixed(2)}
                                </span>
                              )}
                              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 rounded">
                                SAVE 50%
                              </span>
                            </div>
                          )}
                        </div>

                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          Digital PDF + Web Reader
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Button 1: Read Online / Preview */}
                        <button
                          onClick={() => openReader(resource)}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{unlocked ? 'Read Full' : 'Read Preview'}</span>
                        </button>

                        {/* Button 2: Free Download OR Add to Cart / Unlocked Download */}
                        {resource.isFree ? (
                          <button
                            onClick={() => downloadResourceDoc(resource)}
                            disabled={!isAuthenticated}
                            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-white text-xs font-bold shadow-md active:scale-95 transition-all ${
                              isAuthenticated
                                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                                : 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed opacity-70'
                            }`}
                            title={isAuthenticated ? '' : 'Please log in to download'}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{isAuthenticated ? 'Download PDF' : 'Login to Download'}</span>
                            {!isAuthenticated && <Lock className="w-3.5 h-3.5" />}
                          </button>
                        ) : unlocked ? (
                          <button
                            onClick={() => downloadResourceDoc(resource)}
                            disabled={!isAuthenticated}
                            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-white text-xs font-bold shadow-md active:scale-95 transition-all ${
                              isAuthenticated
                                ? 'bg-teal-600 hover:bg-teal-700'
                                : 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed opacity-70'
                            }`}
                            title={isAuthenticated ? '' : 'Please log in to download'}
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{isAuthenticated ? 'Download' : 'Login to Download'}</span>
                            {!isAuthenticated && <Lock className="w-3.5 h-3.5" />}
                          </button>
                        ) : (
                          <button
                            onClick={() => addToCart(resource)}
                            disabled={!isAuthenticated}
                            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-white text-xs font-bold shadow-md active:scale-95 transition-all ${
                              isAuthenticated
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/25'
                                : 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed opacity-70'
                            }`}
                            title={isAuthenticated ? '' : 'Please log in to add to cart'}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{isAuthenticated ? 'Add to Cart' : 'Login to Add'}</span>
                            {!isAuthenticated && <Lock className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Promo Code Banner in Store */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-bold">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>SPECIAL ACADEMY DISCOUNT</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              Get 50% Off Any Premium Guide Today
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm">
              Use promo code <strong className="underline text-amber-300 tracking-wider">ARIF50</strong> at checkout for instant savings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/25 text-sm font-mono font-bold tracking-widest text-amber-300">
              ARIF50
            </div>
            <a
              href="#guides"
              className="px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-sm"
            >
              Browse Books
            </a>
          </div>
        </div>

</div>

      {pdfPreviewResource && pdfPreviewResource.pdfFileName && (
        <PdfPreviewModal
          pdfUrl={pdfPreviewResource.pdfFileName}
          title={pdfPreviewResource.title}
          onClose={() => setPdfPreviewResource(null)}
          onDownload={() => downloadResourceDoc(pdfPreviewResource!)}
        />
      )}
      </section>
    );
  };
