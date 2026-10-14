'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  HeartPulse,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Calendar,
  Star,
  Play,
  Award,
  CheckCircle2,
  ArrowRight,
  Flame,
  Volume2,
  X
} from 'lucide-react';
import { DOCTOR_INFO } from '@/data/healthData';

export const Hero: React.FC = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleAudioTeaser = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Hero Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Super Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-300 text-xs font-bold tracking-wide shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>ZELOVITA HEALTH ACADEMY • DR. ARIF CHOWDHURY</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Master Your Health with{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                Dr. Arif Chowdhury
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Functional medicine, clinical nutrition, and longevity biohacking simplified. Access verified medical guides, download free eBooks, optimize your metabolism, and book private 1-on-1 health consultations.
            </p>

            {/* Key Clinical Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Evidence-Based Medicine</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <Award className="w-4 h-4 text-teal-500" />
                <span>1+ Years Clinical Practice</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>4.95/5 Rating (2k+ Reviews)</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#guides"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold text-base shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <BookOpen className="w-5 h-5" />
                <span>Explore Health Guides & Store</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#quiz"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-semibold text-base border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-sm transition-all"
              >
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Take 60s Health Quiz</span>
              </a>
            </div>

            {/* Audio Quote Banner */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-700 dark:text-slate-300">
                <button
                  onClick={toggleAudioTeaser}
                  className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors shrink-0"
                  aria-label="Play Dr. Arif audio message"
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-amber-300' : ''}`} />
                </button>
                <span className="italic">
                  {isPlayingAudio
                    ? '“Your genes load the gun, but lifestyle pulls the trigger. You have the power to heal.” — Dr. Arif Chowdhury'
                    : 'Listen to Dr. Arif’s 10-second daily clinical mindset rule'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Doctor Spotlight Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden group">

              {/* Doctor Portrait Image Container */}
              <div className="relative w-full h-[420px] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src="/images/dr_arif.jpg"
                  alt="Dr. Arif Chowdhury - Health Tutor & Cardiometabolic Physician"
                  fill
                  sizes="(max-width: 768px) 100vw, 450px"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  priority
                />

                {/* Floating Video Preview Button */}
                <button
                  onClick={() => setIsVideoModalOpen(true)}
                  className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-950 text-white backdrop-blur-md text-xs font-semibold border border-white/20 shadow-lg transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                    <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                  </div>
                  <span>Watch Dr. Arif Intro (2 Min)</span>
                </button>

                {/* Floating Status Badge */}
                <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold shadow-md backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>Accepting Consultations</span>
                </div>
              </div>

              {/* Doctor Details Bar */}
              <div className="p-4 pt-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {DOCTOR_INFO.name}
                    </h3>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      {DOCTOR_INFO.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{DOCTOR_INFO.rating}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">2k+ reviews</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {DOCTOR_INFO.tagline}
                </p>

                {/* Quick Consultation CTA */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    Next slot: Tomorrow
                  </span>
                  <a
                    href="#consultation"
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1"
                  >
                    <span>Book 1-on-1</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Video Greeting Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">A Message from Dr. Arif Chowdhury</span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-emerald-500 shadow-lg">
                <Image
                  src="/images/dr_arif.jpg"
                  alt="Dr. Arif Chowdhury"
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>

              <div className="space-y-3">
                <h4 className="text-xl font-bold text-white">
                  “Welcome to Your Health Transformation”
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
                  “I founded this Academy because traditional medicine waits until you are sick to treat you. Here, we believe in proactive cellular longevity, gut health restoration, and targeted nutrition that empowers you every single day.”
                </p>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 text-xs text-emerald-400 font-mono">
                🎬 Video Presentation Session #VHA-01: Available to all Academy members
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all"
                >
                  Start Exploring Guides
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
