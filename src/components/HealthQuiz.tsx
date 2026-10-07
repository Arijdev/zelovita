'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { QUIZ_QUESTIONS, HEALTH_RESOURCES } from '@/data/healthData';
import { useCart } from '@/context/CartContext';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  BookOpen, 
  ShoppingBag,
  HeartPulse,
  Flame,
  Zap,
  Leaf,
  Activity,
  BatteryLow,
  Moon,
  Scale,
  Salad,
  ShieldCheck,
  Clock,
  Calendar,
  FileQuestion,
  Shield,
  TrendingUp
} from 'lucide-react';

// Icon map helper
const iconMap: Record<string, any> = {
  Leaf,
  Zap,
  HeartPulse,
  Flame,
  BatteryLow,
  Activity,
  Moon,
  CheckCircle2,
  ShoppingBag,
  Scale,
  Salad,
  ShieldCheck,
  TrendingUp,
  Shield,
  FileQuestion,
  Clock,
  Calendar,
  Award
};

export const HealthQuiz: React.FC = () => {
  const { addToCart, openReader } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    nutrition: 0,
    longevity: 0,
    heart: 0,
    fasting: 0,
    detox: 0
  });
  const [isFinished, setIsFinished] = useState(false);

  const handleSelectOption = (points: { category: string; score: number }) => {
    setScores(prev => ({
      ...prev,
      [points.category]: (prev[points.category] || 0) + points.score
    }));

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setScores({
      nutrition: 0,
      longevity: 0,
      heart: 0,
      fasting: 0,
      detox: 0
    });
    setIsFinished(false);
  };

  // Find top category
  const getDominantCategory = () => {
    let topCat = 'nutrition';
    let maxVal = -1;
    Object.entries(scores).forEach(([cat, val]) => {
      if (val > maxVal) {
        maxVal = val;
        topCat = cat;
      }
    });
    return topCat;
  };

  const dominantCat = getDominantCategory();
  
  // Recommend books matching dominant category
  const recommendedPaidResource = HEALTH_RESOURCES.find(r => !r.isFree && (r.category === dominantCat || r.category === 'nutrition')) || HEALTH_RESOURCES[0];
  const recommendedFreeResource = HEALTH_RESOURCES.find(r => r.isFree) || HEALTH_RESOURCES[2];

  const currentQ = QUIZ_QUESTIONS[currentStep];

  return (
    <section id="quiz" className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DR. ARIF'S 60-SECOND HEALTH ASSESSMENT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Discover Your Personalized Wellness Protocol
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Answer 5 quick clinical questions to diagnose your metabolic profile and uncover the optimal guide tailored to your unique biology.
          </p>
        </div>

        {/* Quiz Card Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 dark:border-slate-800">
          
          {!isFinished ? (
            <div className="space-y-6">
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
                  <span className="font-bold text-emerald-600">
                    {Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}% Completed
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-1.5 pt-2">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {currentQ.question}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {currentQ.subtitle}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentQ.options.map((opt, idx) => {
                  const Icon = iconMap[opt.icon] || CheckCircle2;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(opt.points)}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 text-left transition-all duration-200 flex items-start gap-3 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-900 dark:group-hover:text-emerald-200 leading-snug pt-1">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>
          ) : (
            /* Quiz Results Display */
            <div className="space-y-8 animate-fadeIn">
              
              {/* Result Header */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Your Personalized Health Blueprint is Ready
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Based on your metabolic audit, Dr. Arif Chowdhury recommends the following primary protocol for rapid results:
                </p>
              </div>

              {/* Recommended Guides Pair */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Free Recommended Guide */}
                <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase mb-2">
                      FREE FOUNDATIONAL COMPONENT
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {recommendedFreeResource.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                      {recommendedFreeResource.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-emerald-600">100% FREE</span>
                    <button
                      onClick={() => openReader(recommendedFreeResource)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                    >
                      Read Now
                    </button>
                  </div>
                </div>

                {/* 2. Premium Recommended Masterclass */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300 text-[10px] font-extrabold uppercase mb-2">
                      RECOMMENDED CLINICAL MASTERCLASS
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {recommendedPaidResource.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                      {recommendedPaidResource.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      ${recommendedPaidResource.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(recommendedPaidResource)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:from-emerald-700 transition-colors shadow-sm flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Reset / Retake */}
              <div className="text-center pt-2">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Health Quiz</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
