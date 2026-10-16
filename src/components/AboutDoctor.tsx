'use client';

import React from 'react';
import Image from 'next/image';
import { DOCTOR_INFO } from '@/data/healthData';
import { 
  Award, 
  CheckCircle2, 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  HeartHandshake, 
  BookOpen, 
  Sparkles,
  Stethoscope,
  ShieldCheck
} from 'lucide-react';

export const AboutDoctor: React.FC = () => {
  const pillars = [
    {
      title: "Root-Cause Functional Medicine",
      desc: "Investigating deep metabolic, cellular, and endocrine imbalances rather than simply prescribing temporary symptom-suppressing drugs."
    },
    {
      title: "Microbiome & Gut Restoration",
      desc: "Rebuilding mucosal endothelial barriers, microbial diversity, and digestive enzyme pathways that fuel 70% of human immunity."
    },
    {
      title: "Mitochondrial Biohacking & Longevity",
      desc: "Utilizing Zone 2 cardio, thermal hormesis (sauna & cold), and NAD+ optimization to multiply cellular ATP energy output."
    },
    {
      title: "Circadian Alignment & Deep Sleep",
      desc: "Synchronizing hypothalamic suprachiasmatic nucleus rhythms through natural morning sunlight and blue-light blocking protocols."
    }
  ];

  return (
    <section id="about-doctor" className="py-20 bg-white dark:bg-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Doctor Visual & Accreditations */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative w-full h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
              <Image
                src="/images/dr_arif.jpg"
                alt="Dr. Arif Chowdhury MD"
                fill
                className="object-cover object-top"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  Senior Health Tutor & Physician
                </span>
                <h3 className="text-2xl font-extrabold">{DOCTOR_INFO.name}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{DOCTOR_INFO.title}</p>
              </div>
            </div>

            {/* Certifications Box */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-500" />
                <span>Verified Medical Credentials</span>
              </h4>
              <div className="space-y-2">
                {DOCTOR_INFO.certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Bio & Clinical Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>MEET YOUR HEALTH TUTOR</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                A Mission to Democratize Science-Based Longevity
              </h2>
            </div>

            <div className="prose dark:prose-invert text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-4">
              <p>
                {DOCTOR_INFO.bio}
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>The 4 Pillars of Dr. Arif’s Clinical Approach:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1"
                  >
                    <h5 className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      {idx + 1}. {pillar.title}
                    </h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinic Details */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{DOCTOR_INFO.clinicLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{DOCTOR_INFO.hours}</span>
              </div>
            </div>

            {/* Consultation Anchor Button */}
            <div className="pt-2">
              <a
                href="/consultation"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-md"
              >
                <span>Schedule a Clinical Consultation With Dr. Arif</span>
                <HeartHandshake className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
