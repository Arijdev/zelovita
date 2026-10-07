'use client';

import React from 'react';
import { HealthCalculators } from '@/components/HealthCalculators';
import { 
  Calculator, 
  Sparkles, 
  ShieldCheck,
  Brain,
  Heart,
  Droplet,
  Weight,
  Activity
} from 'lucide-react';

const calculatorTypes = [
  { icon: Weight, title: 'BMI Calculator', desc: 'Body Mass Index with clinical interpretation' },
  { icon: Activity, title: 'BMR & TDEE', desc: 'Basal Metabolic Rate & Total Daily Energy Expenditure' },
  { icon: Heart, title: 'Body Fat %', desc: 'Navy Method & Clinical Estimation' },
  { icon: Brain, title: 'Macro Calculator', desc: 'Protein, Carbs, Fat targets by goal' },
  { icon: ShieldCheck, title: 'Hydration Needs', desc: 'Daily water intake by weight & activity' },
  { icon: Droplet, title: 'Cardiovascular Risk', desc: '10-year ASCVD Risk Estimation' },
  { icon: Calculator, title: 'Ideal Body Weight', desc: 'Devine, Robinson, Miller formulas' },
  { icon: Sparkles, title: 'Waist-to-Hip Ratio', desc: 'Metabolic Health Risk Indicator' },
];

export default function CalculatorsPage() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>INTERACTIVE CLINICAL HEALTH CALCULATORS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Precision Health Diagnostics
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Clinical-grade calculators for metabolic health, body composition, cardiovascular risk & nutrition planning.
          </p>
        </div>

        {/* Calculator Types Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {calculatorTypes.map((item, i) => (
            <div key={i} className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center hover:border-teal-500/50 transition-colors">
              <item.icon className="w-6 h-6 text-teal-600 mx-auto mb-2" />
              <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Calculators */}
        <HealthCalculators />
      </div>
    </section>
  );
}