'use client';

import React from 'react';
import { Hero } from '@/components/Hero';
import { StatsBar } from '@/components/StatsBar';
import { ResourceLibrary } from '@/components/ResourceLibrary';
import { Testimonials } from '@/components/Testimonials';
import {
  BookOpen,
  Calculator,
  Brain,
  FileText,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  HeartPulse,
  Users,
  Award,
  BookOpenCheck,
  HeartHandshake
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: BookOpen,
    title: 'Clinical Health Guides',
    description: 'Evidence-based PDF guides on nutrition, longevity, heart health, fasting & detox by Dr. Arif Chowdhury',
    href: '/guides',
    color: 'emerald',
  },
  {
    icon: Calculator,
    title: 'Health Calculators',
    description: 'Interactive clinical tools for BMI, BMR, body fat, macro tracking, hydration & cardiovascular risk',
    href: '/calculators',
    color: 'teal',
  },
  {
    icon: Brain,
    title: 'Health Assessment Quiz',
    description: '60-second personalized health assessment with tailored recommendations & action plans',
    href: '/quiz',
    color: 'cyan',
  },
  {
    icon: FileText,
    title: 'Clinical Articles',
    description: 'Peer-reviewed medical articles, research summaries & protocol masterclasses',
    href: '/articles',
    color: 'indigo',
  },
  {
    icon: Stethoscope,
    title: 'Virtual Consultations',
    description: 'Book 1-on-1 video consultations with Dr. Arif for personalized clinical guidance',
    href: '/consultation',
    color: 'rose',
  },
  {
    icon: HeartPulse,
    title: 'About Dr. Arif',
    description: 'Learn about Dr. Arif Chowdhury\'s clinical philosophy, credentials & patient success stories',
    href: '/about',
    color: 'amber',
  },
];

const trustMarkers = [
  { icon: Users, value: '12,480+', label: 'Patients Guided', desc: 'Across 42+ Countries' },
  { icon: BookOpenCheck, value: '54,820+', label: 'Free Guides Downloaded', desc: 'Evidence-Based PDFs' },
  { icon: Award, value: '28', label: 'Clinical Protocols', desc: 'Published & Peer-Reviewed' },
  { icon: HeartHandshake, value: '4.96/5', label: 'Patient Rating', desc: 'Verified Clinical Outcomes' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Trust Markers */}
      <StatsBar stats={trustMarkers} />

      {/* Features Grid - Quick Access to All Pages */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950/50" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EXPLORE ZELOVITA ACADEMY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Your Complete Clinical Health Platform
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
              Access science-backed medical protocols, interactive tools, and personalized guidance — all curated by Dr. Arif Chowdhury.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link
                key={feature.title}
                href={feature.href}
                className={`group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-${feature.color}-500/50 hover:shadow-xl hover:shadow-${feature.color}-500/10 transition-all duration-300 overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />

                <div className="relative space-y-4">
                  <div className={`w-14 h-14 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-950/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-7 h-7 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 pt-2">
                    <span>Explore →</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guides Preview */}
      <section className="py-20 bg-white dark:bg-slate-950" id="featured-guides">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>FEATURED GUIDES</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
                Popular Free & Premium Guides
              </h2>
            </div>
            <Link
              href="/guides"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
            >
              View All Guides →
            </Link>
          </div>

          <ResourceLibrary />
        </div>
      </section>

      {/* Patient Success Stories */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>MEDICAL DISCLAIMER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Ready to Transform Your Health?
          </h2>
          <p className="text-emerald-100 text-lg sm:text-xl max-w-2xl mx-auto">
            Join 12,000+ patients using Dr. Arif&apos;s clinical protocols. Start with free guides or book a personalized consultation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/guides"
              className="px-8 py-3.5 rounded-xl bg-white text-emerald-800 font-bold text-sm hover:bg-emerald-50 transition-all shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4 inline mr-2" />
              Browse Free Guides
            </Link>
            <Link
              href="/consultation"
              className="px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold text-sm hover:bg-white/20 transition-all"
            >
              <Stethoscope className="w-4 h-4 inline mr-2" />
              Book Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}