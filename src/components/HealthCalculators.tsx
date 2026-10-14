'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  Droplet, 
  Flame, 
  Moon, 
  Sparkles, 
  CheckCircle2, 
  Scale, 
  HeartPulse, 
  Plus, 
  Minus,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { HEALTH_RESOURCES } from '@/data/healthData';

export const HealthCalculators: React.FC = () => {
  const { openReader } = useCart();
  const [activeTab, setActiveTab] = useState<'bmi' | 'water' | 'macros' | 'sleep'>('bmi');

  // --- BMI State ---
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState<number>(70); // kg or lbs
  const [heightCm, setHeightCm] = useState<number>(175);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);
  const [age, setAge] = useState<number>(35);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  // Calculate BMI
  const calculateBmi = () => {
    let heightInMeters = 0;
    let weightInKg = 0;

    if (unit === 'metric') {
      heightInMeters = heightCm / 100;
      weightInKg = weight;
    } else {
      const totalInches = heightFt * 12 + heightIn;
      heightInMeters = totalInches * 0.0254;
      weightInKg = weight * 0.453592;
    }

    if (heightInMeters <= 0) return { bmi: 0, category: 'N/A', minHealthy: 0, maxHealthy: 0 };

    const bmi = +(weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
    const minHealthy = +(18.5 * heightInMeters * heightInMeters).toFixed(1);
    const maxHealthy = +(24.9 * heightInMeters * heightInMeters).toFixed(1);

    let category = 'Normal Weight';
    let color = 'text-emerald-500';
    let recommendation = 'Maintain your balanced nutrient intake and resistance training routines.';

    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-amber-500';
      recommendation = 'Focus on nutrient-dense healthy fats, quality proteins, and digestive enzyme support.';
    } else if (bmi >= 25 && bmi < 29.9) {
      category = 'Overweight';
      color = 'text-amber-500';
      recommendation = 'Implement 16:8 time-restricted feeding and eliminate ultra-processed carbohydrates.';
    } else if (bmi >= 30) {
      category = 'Obesity (Elevated Risk)';
      color = 'text-rose-500';
      recommendation = 'Consider a 7-day metabolic reset followed by our Clinical Nutrition & Gut Mastery protocol.';
    }

    return { bmi, category, color, minHealthy, maxHealthy, recommendation };
  };

  const bmiResult = calculateBmi();

  // --- Water Hydration State ---
  const [waterWeightKg, setWaterWeightKg] = useState<number>(70);
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'moderate' | 'intense'>('moderate');
  const [climate, setClimate] = useState<'normal' | 'hot'>('normal');
  const [glassesDrank, setGlassesDrank] = useState<number>(3);

  const calculateWaterTarget = () => {
    let baseLiters = waterWeightKg * 0.035; // 35ml per kg
    if (activityLevel === 'moderate') baseLiters += 0.5;
    if (activityLevel === 'intense') baseLiters += 1.0;
    if (climate === 'hot') baseLiters += 0.5;

    const totalGlasses = Math.round(baseLiters / 0.25); // 250ml per glass
    return { liters: baseLiters.toFixed(1), glasses: totalGlasses };
  };

  const waterTarget = calculateWaterTarget();

  // --- Macro State ---
  const [goal, setGoal] = useState<'loss' | 'maintenance' | 'muscle'>('loss');
  const [calorieIntake, setCalorieIntake] = useState<number>(2000);

  const calculateMacros = () => {
    let targetCalories = calorieIntake;
    let proteinPct = 0.3; // 30%
    let fatPct = 0.35; // 35%
    let carbPct = 0.35; // 35%

    if (goal === 'loss') {
      targetCalories = calorieIntake - 400;
      proteinPct = 0.35;
      fatPct = 0.35;
      carbPct = 0.30;
    } else if (goal === 'muscle') {
      targetCalories = calorieIntake + 300;
      proteinPct = 0.30;
      fatPct = 0.25;
      carbPct = 0.45;
    }

    const proteinGrams = Math.round((targetCalories * proteinPct) / 4);
    const fatGrams = Math.round((targetCalories * fatPct) / 9);
    const carbGrams = Math.round((targetCalories * carbPct) / 4);

    return { targetCalories, proteinGrams, fatGrams, carbGrams, proteinPct, fatPct, carbPct };
  };

  const macroResult = calculateMacros();

  // --- Sleep Cycle State ---
  const [wakeHour, setWakeHour] = useState<string>('06:30');

  const calculateSleepTimes = () => {
    const [h, m] = wakeHour.split(':').map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(h, m, 0, 0);

    const times: { cycles: number; hours: string; timeString: string; quality: string }[] = [];

    // Cycles 6, 5, 4 (90 mins each + 15 min falling asleep)
    [6, 5, 4].forEach(cycles => {
      const totalMinutes = cycles * 90 + 15;
      const sleepDate = new Date(wakeDate.getTime() - totalMinutes * 60000);
      const hours = sleepDate.getHours().toString().padStart(2, '0');
      const mins = sleepDate.getMinutes().toString().padStart(2, '0');

      times.push({
        cycles,
        hours: (cycles * 1.5).toString(),
        timeString: `${hours}:${mins}`,
        quality: cycles === 5 || cycles === 6 ? 'Optimal Sleep' : 'Minimum Recovery'
      });
    });

    return times;
  };

  const sleepTimes = calculateSleepTimes();

  return (
    <section id="calculators" className="py-20 bg-white dark:bg-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>INTERACTIVE CLINICAL DIAGNOSTICS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Personalized Health & Metabolism Calculators
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Input your personal biometrics to receive instant science-backed targets for body composition, hydration, daily macronutrients, and circadian sleep cycles.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl">
            <button
              onClick={() => setActiveTab('bmi')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'bmi'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Smart BMI & Body</span>
            </button>

            <button
              onClick={() => setActiveTab('water')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'water'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Droplet className="w-4 h-4" />
              <span>Hydration Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('macros')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'macros'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>TDEE & Macros</span>
            </button>

            <button
              onClick={() => setActiveTab('sleep')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'sleep'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Sleep Cycles</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SMART BMI CALCULATOR */}
        {activeTab === 'bmi' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 dark:bg-slate-950/60 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800">
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Biometric Parameters
                </h3>
                <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-bold">
                  <button
                    onClick={() => setUnit('metric')}
                    className={`px-3 py-1 rounded ${unit === 'metric' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}
                  >
                    Metric (kg / cm)
                  </button>
                  <button
                    onClick={() => setUnit('imperial')}
                    className={`px-3 py-1 rounded ${unit === 'imperial' ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}
                  >
                    Imperial (lbs / ft)
                  </button>
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as 'male' | 'female')}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>
              </div>

              {/* Weight Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-400">Weight</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {weight} {unit === 'metric' ? 'kg' : 'lbs'}
                  </span>
                </div>
                <input
                  type="range"
                  min={unit === 'metric' ? 35 : 80}
                  max={unit === 'metric' ? 180 : 400}
                  value={weight}
                  onChange={e => setWeight(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              {/* Height Inputs */}
              {unit === 'metric' ? (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-400">Height</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{heightCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min={120}
                    max={220}
                    value={heightCm}
                    onChange={e => setHeightCm(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Feet</label>
                    <input
                      type="number"
                      value={heightFt}
                      onChange={e => setHeightFt(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Inches</label>
                    <input
                      type="number"
                      value={heightIn}
                      onChange={e => setHeightIn(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* BMI Output Card */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Calculated Body Mass Index
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
                      {bmiResult.bmi}
                    </span>
                    <span className={`text-base font-bold ${bmiResult.color}`}>
                      {bmiResult.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Healthy Weight Range */}
              <div className="space-y-1">
                <span className="text-xs text-slate-500">Ideal Healthy Weight for Your Height:</span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {bmiResult.minHealthy} kg — {bmiResult.maxHealthy} kg
                </p>
              </div>

              {/* Dr. Arif's recommendation */}
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs leading-relaxed">
                <strong className="text-emerald-900 dark:text-emerald-300 block mb-1">
                  🩺 Dr. Arif's Clinical Action Advice:
                </strong>
                {bmiResult.recommendation}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    const freeGuide = HEALTH_RESOURCES.find(r => r.id === '7-day-metabolic-reset');
                    if (freeGuide) openReader(freeGuide);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Open Free 7-Day Reset Guide for This Range</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WATER HYDRATION TRACKER */}
        {activeTab === 'water' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 dark:bg-slate-950/60 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800">
            <div className="lg:col-span-6 space-y-5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Hydration Factors
              </h3>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-400">Your Body Weight</span>
                  <span className="font-bold text-cyan-600">{waterWeightKg} kg</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={140}
                  value={waterWeightKg}
                  onChange={e => setWaterWeightKg(Number(e.target.value))}
                  className="w-full accent-cyan-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Daily Exercise Intensity
                  </label>
                  <select
                    value={activityLevel}
                    onChange={e => setActivityLevel(e.target.value as 'sedentary' | 'moderate' | 'intense')}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="sedentary">Light / Desk Work</option>
                    <option value="moderate">Moderate (30-45m exercise)</option>
                    <option value="intense">Intense (60m+ heavy cardio/weights)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Climate / Weather
                  </label>
                  <select
                    value={climate}
                    onChange={e => setClimate(e.target.value as 'normal' | 'hot')}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 outline-none"
                  >
                    <option value="normal">Normal / Air Conditioned</option>
                    <option value="hot">Hot, Humid or Dry Summer</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-xs text-cyan-900 dark:text-cyan-200 leading-relaxed">
                💡 <strong>Clinical Tip:</strong> Add a pinch of unrefined Celtic or Himalayan salt to your morning 500ml water to optimize cellular electrolyte absorption.
              </div>
            </div>

            <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6 text-center">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Target Daily Fluid Volume
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-2">
                  {waterTarget.liters} Liters
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Equivalent to approx. {waterTarget.glasses} standard glasses (250ml each)
                </p>
              </div>

              {/* Interactive Glass Counter */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Track Today's Intake:
                </span>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setGlassesDrank(prev => Math.max(0, prev - 1))}
                    className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white flex items-center justify-center font-bold"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-2xl font-extrabold text-cyan-600">
                    {glassesDrank} / {waterTarget.glasses}
                  </span>
                  <button
                    onClick={() => setGlassesDrank(prev => prev + 1)}
                    className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (glassesDrank / waterTarget.glasses) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TDEE & MACRO BREAKDOWN */}
        {activeTab === 'macros' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 dark:bg-slate-950/60 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800">
            <div className="lg:col-span-6 space-y-5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Nutritional Goal & Intake
              </h3>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Select Primary Health Objective
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setGoal('loss')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      goal === 'loss'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Fat Loss
                  </button>
                  <button
                    onClick={() => setGoal('maintenance')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      goal === 'maintenance'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Vitality / Maintain
                  </button>
                  <button
                    onClick={() => setGoal('muscle')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      goal === 'muscle'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Lean Muscle
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-400">Estimated Maintenance Energy</span>
                  <span className="font-bold text-emerald-600">{calorieIntake} kcal/day</span>
                </div>
                <input
                  type="range"
                  min={1400}
                  max={3500}
                  step={50}
                  value={calorieIntake}
                  onChange={e => setCalorieIntake(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                🥑 <strong>Dr. Arif's Rule:</strong> Never sacrifice protein quality. Target 1.6g to 2.2g of high-bioavailability protein per kilogram of ideal lean body mass.
              </div>
            </div>

            <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-5">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Target Daily Energy
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {macroResult.targetCalories} <span className="text-lg font-medium text-slate-500">kcal/day</span>
                </div>
              </div>

              {/* Macro Bars */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-blue-600 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    Clean Protein ({macroResult.proteinGrams}g)
                  </span>
                  <span className="text-slate-500">{Math.round(macroResult.proteinPct * 100)}%</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-600 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Healthy Fats ({macroResult.fatGrams}g)
                  </span>
                  <span className="text-slate-500">{Math.round(macroResult.fatPct * 100)}%</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Complex Carbs & Fiber ({macroResult.carbGrams}g)
                  </span>
                  <span className="text-slate-500">{Math.round(macroResult.carbPct * 100)}%</span>
                </div>
              </div>

              <div className="h-3 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800">
                <div style={{ width: `${macroResult.proteinPct * 100}%` }} className="bg-blue-500 h-full" />
                <div style={{ width: `${macroResult.fatPct * 100}%` }} className="bg-amber-500 h-full" />
                <div style={{ width: `${macroResult.carbPct * 100}%` }} className="bg-emerald-500 h-full" />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SLEEP CYCLE OPTIMIZER */}
        {activeTab === 'sleep' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 dark:bg-slate-950/60 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800">
            <div className="lg:col-span-6 space-y-5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Circadian Rhythm Synchronization
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Human sleep consists of 90-minute ultradian cycles transitioning through Light Sleep, Deep Slow-Wave Sleep (Stage 3/4), and REM. Waking in the middle of a deep cycle causes sleep inertia and morning grogginess.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  What time do you need to wake up?
                </label>
                <input
                  type="time"
                  value={wakeHour}
                  onChange={e => setWakeHour(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base font-bold border border-slate-200 dark:border-slate-700 outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
                🌙 <strong>Dr. Arif's Sleep Rule:</strong> Allow 15 minutes to fall asleep and avoid all screen blue light 60 minutes before your target bedtime.
              </div>
            </div>

            <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Recommended Bedtimes for {wakeHour} Wakeup:
              </h4>

              <div className="space-y-3">
                {sleepTimes.map((t, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      idx === 0
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-extrabold font-mono">
                          {t.timeString}
                        </span>
                        {idx === 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                            BEST (9.0h)
                          </span>
                        )}
                        {idx === 1 && (
                          <span className="px-2 py-0.5 rounded-full bg-teal-600 text-white text-[10px] font-bold">
                            RECOMMENDED (7.5h)
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {t.cycles} Full Cycles ({t.hours} hours of restorative sleep)
                      </span>
                    </div>

                    <Clock className="w-5 h-5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
