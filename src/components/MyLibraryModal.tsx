'use client';

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { HEALTH_RESOURCES } from '@/data/healthData';
import { 
  X, 
  BookOpen, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

interface MyLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyLibraryModal: React.FC<MyLibraryModalProps> = ({ isOpen, onClose }) => {
  const { unlockedResources, openReader, downloadResourceDoc } = useCart();

  if (!isOpen) return null;

  const unlockedList = HEALTH_RESOURCES.filter(r => 
    r.isFree || unlockedResources.includes(r.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                My Unlocked Health Library ({unlockedList.length})
              </h3>
              <p className="text-xs text-slate-400">
                Lifetime digital access & instant PDF downloads
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close my library"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-4 max-h-[75vh] overflow-y-auto">
          {unlockedList.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                No guides unlocked yet
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our free downloads or purchase clinical masterclasses to build your library.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {unlockedList.map(resource => (
                <div
                  key={resource.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="flex gap-3">
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 shadow">
                      <Image
                        src={resource.coverImage}
                        alt={resource.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          resource.isFree ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                        }`}>
                          {resource.isFree ? 'Free Guide' : 'Purchased Masterclass'}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                        {resource.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {resource.pages} Pages • Full Access
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <button
                      onClick={() => {
                        openReader(resource);
                        onClose();
                      }}
                      className="py-2 px-3 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 border border-slate-200 dark:border-slate-600 transition-colors flex items-center justify-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read Online</span>
                    </button>

                    <button
                      onClick={() => downloadResourceDoc(resource)}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
            <span>All downloads are free from DRM and print-ready.</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold"
            >
              Close Library
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
