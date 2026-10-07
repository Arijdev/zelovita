'use client';

import React from 'react';
import { AboutDoctor } from '@/components/AboutDoctor';
import { 
  Award, 
  ShieldCheck,
  HeartPulse,
  BookOpen,
  Users,
  GraduationCap,
  Stethoscope,
  Clock
} from 'lucide-react';

const credentials = [
  { icon: GraduationCap, title: 'MBBS', desc: 'Bachelor of Medicine, Bachelor of Surgery' },
  { icon: Award, title: 'M.S. Clinical Nutrition', desc: 'Master of Science in Clinical Nutrition' },
  { icon: Stethoscope, title: '15+ Years Practice', desc: 'Internal Medicine & Functional Nutrition' },
  { icon: Users, title: '12,000+ Patients', desc: 'Successfully guided through clinical protocols' },
  { icon: BookOpen, title: '28 Published Protocols', desc: 'Evidence-based clinical guides & masterclasses' },
  { icon: Clock, title: 'Ongoing Research', desc: 'Active in longevity & metabolic health research' },
];

const philosophy = [
  'Root Cause Over Symptom Management: Identify and address the fundamental drivers of dysfunction rather than masking symptoms.',
  'Food as Information: Nutrients are signaling molecules that regulate gene expression, hormone function, and cellular repair.',
  'Mitochondria First: Cellular energy production is the foundation of all physiological function and longevity.',
  'Personalization Over Protocols: Every patient has unique genetics, epigenetics, and environmental exposures requiring tailored approaches.',
  'Measurement Drives Management: Track biomarkers, subjective metrics, and functional outcomes to guide clinical decisions.',
  'Sustainable Systems Over Quick Fixes: Build resilient daily habits that compound over decades, not 30-day challenges.',
];

export default function AboutPage() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>ABOUT DR. ARIF CHOWDHURY MD</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Clinical Excellence Meets Root Cause Medicine
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Bridging conventional internal medicine with cutting-edge functional nutrition for sustainable health transformation.
          </p>
        </div>

        {/* Credentials */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {credentials.map((item, i) => (
            <div key={i} className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center hover:border-amber-500/50 transition-colors">
              <item.icon className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Clinical Philosophy */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Clinical Philosophy
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Six pillars that guide every patient interaction and protocol design
            </p>
          </div>
          <div className="space-y-4">
            {philosophy.map((item, i) => (
              <div key={i} className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold text-lg">{i + 1}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 pt-1">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About Doctor Component */}
        <AboutDoctor />
      </div>
    </section>
  );
}