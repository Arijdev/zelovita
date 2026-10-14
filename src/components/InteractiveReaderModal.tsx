'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { HealthResource } from '@/types/health';
import { 
  X, 
  BookOpen, 
  Download, 
  ShoppingBag, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  ZoomIn, 
  ZoomOut, 
  Sun, 
  Moon, 
  Coffee,
  Bookmark,
  Share2,
  Lock,
  Printer
} from 'lucide-react';

export const InteractiveReaderModal: React.FC = () => {
  const { 
    activeReaderResource: resource, 
    closeReader, 
    isResourceUnlocked, 
    addToCart, 
    downloadResourceDoc 
  } = useCart();

  const [activeTab, setActiveTab] = useState<'reader' | 'toc' | 'protocol'>('reader');
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [readerTheme, setReaderTheme] = useState<'light' | 'sepia' | 'dark'>('light');

  if (!resource) return null;

  const isUnlocked = isResourceUnlocked(resource.id);
  const chapters = resource.fullContent.chapters;
  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose'
  };

  const themeClasses = {
    light: 'bg-white text-slate-900 border-slate-200',
    sepia: 'bg-[#fbf0d9] text-[#433422] border-[#e6d5b8]',
    dark: 'bg-slate-900 text-slate-100 border-slate-800'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Top App Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {resource.isFree ? 'Free Digital Guide' : isUnlocked ? 'Unlocked Masterclass' : 'Sample Preview'}
                </span>
                <span className="text-[11px] text-slate-400">• Dr. Arif Chowdhury</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {resource.title}
              </h3>
            </div>
          </div>

          {/* Reader Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Font Size Adjusters */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-1 text-xs rounded font-bold ${fontSize === 'sm' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Small text"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-1 text-xs rounded font-bold ${fontSize === 'base' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Default text"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-1 text-xs rounded font-bold ${fontSize === 'lg' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Large text"
              >
                A+
              </button>
            </div>

            {/* Reading Theme Switcher */}
            <div className="hidden md:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={() => setReaderTheme('light')}
                className={`p-1.5 rounded ${readerTheme === 'light' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Light Mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReaderTheme('sepia')}
                className={`p-1.5 rounded ${readerTheme === 'sepia' ? 'bg-amber-800/60 text-amber-200' : 'text-slate-400 hover:text-white'}`}
                title="Sepia Mode"
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReaderTheme('dark')}
                className={`p-1.5 rounded ${readerTheme === 'dark' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Dark Mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Download Button */}
            {(resource.isFree || isUnlocked) && (
              <button
                onClick={() => downloadResourceDoc(resource)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Save PDF</span>
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={closeReader}
              aria-label="Close reader"
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation in Reader */}
        <div className="flex items-center gap-1 px-4 sm:px-6 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('reader')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'reader'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            📖 Book Reader
          </button>
          <button
            onClick={() => setActiveTab('toc')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'toc'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            📋 Table of Contents ({resource.tableOfContents.length})
          </button>
          <button
            onClick={() => setActiveTab('protocol')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'protocol'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            ⭐ Action Checklist
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Chapter Sidebar (Desktop) */}
          <div className="hidden lg:flex flex-col w-72 bg-slate-50 dark:bg-slate-900/60 border-r border-slate-200 dark:border-slate-800 p-4 overflow-y-auto">
            <div className="flex items-center gap-3 mb-4 p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="relative w-12 h-16 rounded overflow-hidden shrink-0 shadow">
                <Image
                  src={resource.coverImage}
                  alt={resource.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2">
                  {resource.title}
                </h4>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                  {chapters.length} Clinical Chapters
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Chapters Navigation
            </span>

            <div className="space-y-1">
              {chapters.map((ch, idx) => {
                const isLockedChapter = !isUnlocked && idx > 0;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isLockedChapter) {
                        setActiveChapterIndex(idx);
                        setActiveTab('reader');
                      }
                    }}
                    disabled={isLockedChapter}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-start gap-2 ${
                      activeChapterIndex === idx && activeTab === 'reader'
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : isLockedChapter
                        ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-70'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    {isLockedChapter ? (
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                        {idx + 1}
                      </span>
                    )}
                    <span className="line-clamp-2">{ch.title}</span>
                  </button>
                );
              })}
            </div>

            {!isUnlocked && (
              <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-center space-y-2">
                  <Lock className="w-5 h-5 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Unlock All {chapters.length} Chapters
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Instant lifetime access + complete PDF download
                  </p>
                  <button
                    onClick={() => {
                      addToCart(resource);
                      closeReader();
                    }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow transition-all"
                  >
                    Unlock for ${resource.price.toFixed(2)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Reading View Pane */}
          <div className={`flex-1 overflow-y-auto p-6 sm:p-10 ${themeClasses[readerTheme]} transition-colors duration-300`}>
            
            {/* View 1: Reader */}
            {activeTab === 'reader' && (
              <div className="max-w-2xl mx-auto space-y-8 pb-12">
                
                {/* Introduction Callout on Chapter 1 */}
                {activeChapterIndex === 0 && (
                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Author's Clinical Introduction</span>
                    </h4>
                    <p className="text-sm font-serif italic leading-relaxed text-slate-700 dark:text-slate-300">
                      &ldquo;{resource.fullContent.introduction}&rdquo;
                    </p>
                  </div>
                )}

                {/* Chapter Title */}
                <div>
                  <div className="inline-block text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">
                    Section {activeChapterIndex + 1} of {chapters.length}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {currentChapter.title}
                  </h2>
                </div>

                {/* Chapter Body Content */}
                <div className={`font-serif space-y-4 ${fontSizeClasses[fontSize]}`}>
                  <p className="leading-relaxed">
                    {currentChapter.content}
                  </p>
                </div>

                {/* Key Clinical Takeaways */}
                {currentChapter.keyTakeaways && currentChapter.keyTakeaways.length > 0 && (
                  <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-3">
                    <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Action Steps & Clinical Pearls:</span>
                    </h4>
                    <ul className="space-y-2">
                      {currentChapter.keyTakeaways.map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Doctor's Signature Tip Callout */}
                {currentChapter.doctorTip && (
                  <div className="p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs sm:text-sm font-semibold flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                      <span className="font-bold block text-teal-800 dark:text-teal-300 mb-0.5">
                        Dr. Arif's Practitioner Insight:
                      </span>
                      {currentChapter.doctorTip}
                    </div>
                  </div>
                )}

                {/* Locked Chapter Notice for Paid Guides */}
                {!isUnlocked && (
                  <div className="mt-10 p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 text-white text-center space-y-4 shadow-xl border border-slate-800">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">
                      You are previewing Chapter 1 of &ldquo;{resource.title}&rdquo;
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                      Unlock the remaining {chapters.length - 1} comprehensive chapters, 30-day meal plans, supplement dosages, and get the complete high-res printable PDF.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          addToCart(resource);
                          closeReader();
                        }}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart — ${resource.price.toFixed(2)}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Navigation Between Chapters */}
                <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setActiveChapterIndex(prev => Math.max(0, prev - 1))}
                    disabled={activeChapterIndex === 0}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Chapter</span>
                  </button>

                  <span className="text-xs text-slate-400 font-medium">
                    {activeChapterIndex + 1} of {chapters.length}
                  </span>

                  <button
                    onClick={() => {
                      if (isUnlocked || activeChapterIndex < 0) {
                        setActiveChapterIndex(prev => Math.min(chapters.length - 1, prev + 1));
                      }
                    }}
                    disabled={!isUnlocked || activeChapterIndex >= chapters.length - 1}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors"
                  >
                    <span>Next Chapter</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* View 2: Table of Contents */}
            {activeTab === 'toc' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <h3 className="text-xl font-bold">Complete Table of Contents</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {resource.title} ({resource.pages} Total Pages)
                  </p>
                </div>

                <div className="space-y-3">
                  {resource.tableOfContents.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm font-medium"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {item}
                      </span>
                      <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                        Sec {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View 3: Daily Action Protocol */}
            {activeTab === 'protocol' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                  <h3 className="text-xl font-bold">Dr. Arif’s Actionable Protocol Checklist</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Daily practical non-negotiable habits to implement from this guide.
                  </p>
                </div>

                <div className="space-y-3">
                  {resource.fullContent.protocolSummary.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-center">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Need personalized clinical adjustments?
                  </p>
                  <a
                    href="#consultation"
                    onClick={closeReader}
                    className="inline-block mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Schedule a 1-on-1 Consultation with Dr. Arif →
                  </a>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
