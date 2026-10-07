'use client';

import React from 'react';
import { Users, BookOpenCheck, Award, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import { DOCTOR_INFO } from '@/data/healthData';
import type { LucideIcon } from 'lucide-react';

interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
  desc: string;
}

interface StatsBarProps {
  stats?: StatItem[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats: customStats }) => {
  const defaultStats: StatItem[] = [
    {
      icon: Users,
      value: DOCTOR_INFO.patientsTransformed,
      label: "Patients & Students Mentored",
      desc: "Across 42+ Countries Worldwide"
    },
    {
      icon: Award,
      value: DOCTOR_INFO.yearsExperience,
      label: "Years Clinical Experience",
      desc: "Hospital & Functional Medicine"
    },
    {
      icon: BookOpenCheck,
      value: "8+ Best-Selling",
      label: "Clinical Health Guides",
      desc: "Free & Premium Medical Manuals"
    },
    {
      icon: HeartHandshake,
      value: "98.4%",
      label: "Clinical Satisfaction",
      desc: "Verified Patient Outcomes"
    }
  ];

  const stats = customStats || defaultStats;

  return (
    <section className="border-y border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 hover:border-emerald-500/40 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1">
                  {stat.label}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {stat.desc}
                </span>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
