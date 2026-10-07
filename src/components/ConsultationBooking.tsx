'use client';

import React, { useState } from 'react';
import { CONSULTATION_PACKAGES, DOCTOR_INFO } from '@/data/healthData';
import { ConsultationPackage } from '@/types/health';
import { useCart } from '@/context/CartContext';
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  X, 
  FileText,
  User,
  Mail,
  Phone,
  CalendarCheck
} from 'lucide-react';

export const ConsultationBooking: React.FC = () => {
  const { addToast } = useCart();
  const [selectedPackage, setSelectedPackage] = useState<ConsultationPackage>(CONSULTATION_PACKAGES[1]);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-12');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM EST');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // Patient Intake State
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [primaryConcern, setPrimaryConcern] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const availableSlots = [
    { time: '09:00 AM EST', period: 'Morning' },
    { time: '10:30 AM EST', period: 'Morning' },
    { time: '02:00 PM EST', period: 'Afternoon' },
    { time: '03:30 PM EST', period: 'Afternoon' },
    { time: '05:00 PM EST', period: 'Evening' },
  ];

  const handleOpenBooking = (pkg: ConsultationPackage) => {
    setSelectedPackage(pkg);
    setIsBookingModalOpen(true);
    setIsConfirmed(false);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientEmail) return;

    setIsConfirmed(true);
    addToast(
      'Consultation Scheduled!',
      `Your session with Dr. Arif Chowdhury on ${selectedDate} at ${selectedSlot} is confirmed.`,
      'success'
    );
  };

  const handleDownloadCalendarInvite = () => {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Zelovita Health Academy//Dr. Arif Chowdhury//EN
BEGIN:VEVENT
SUMMARY:1-on-1 Health Consultation with Dr. Arif Chowdhury
DESCRIPTION:Consultation: ${selectedPackage.title}\\nPatient: ${patientName}\\nLocation: Secure Zoom Link (emailed)
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dr_Arif_Chowdhury_Consultation.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast('Calendar Saved', 'Consultation added to your calendar file.', 'info');
  };

  return (
    <section id="consultation" className="py-20 bg-slate-50 dark:bg-slate-950/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Video className="w-3.5 h-3.5" />
            <span>PRIVATE VIRTUAL CLINIC</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Book a 1-on-1 Consultation With Dr. Arif Chowdhury
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Work directly with Dr. Arif via high-definition video consultation. Review your blood work, uncover the root cause of fatigue or digestive distress, and receive a customized clinical roadmap.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CONSULTATION_PACKAGES.map(pkg => (
            <div
              key={pkg.id}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                pkg.popular
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 text-white shadow-2xl border-2 border-emerald-500 scale-[1.03] z-10'
                  : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                  Most Popular Choice ★
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className={pkg.popular ? 'text-emerald-400' : 'text-emerald-600 dark:text-emerald-400'}>
                      {pkg.duration}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Video className="w-3.5 h-3.5" />
                      HD Zoom
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{pkg.title}</h3>
                  <p className={`text-xs mt-2 leading-relaxed ${pkg.popular ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
                    {pkg.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold">${pkg.price}</span>
                  <span className={`text-xs ${pkg.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                    / all inclusive
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  {pkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.popular ? 'text-emerald-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                      <span className={pkg.popular ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleOpenBooking(pkg)}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                    pkg.popular
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25'
                      : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Select & Choose Time Slot</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold">
                  {isConfirmed ? 'Appointment Confirmed!' : `Book: ${selectedPackage.title}`}
                </h3>
                <p className="text-xs text-slate-400">
                  With {DOCTOR_INFO.name} ({selectedPackage.duration})
                </p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isConfirmed ? (
              <form onSubmit={handleSubmitBooking} className="p-6 sm:p-8 space-y-6">
                
                {/* 1. Date & Time Selection */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span>1. Select Preferred Date & Live Time Slot</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Select Consultation Date
                      </label>
                      <input
                        type="date"
                        required
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Select Time Slot (Your Local Time)
                      </label>
                      <select
                        value={selectedSlot}
                        onChange={e => setSelectedSlot(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 outline-none"
                      >
                        {availableSlots.map((s, idx) => (
                          <option key={idx} value={s.time}>
                            {s.time} ({s.period})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Medical Intake Details */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-500" />
                    <span>2. Patient Information & Health Goals</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={patientName}
                        onChange={e => setPatientName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address for Zoom Link
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="your.email@example.com"
                        value={patientEmail}
                        onChange={e => setPatientEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Primary Health Concern / Reason for Visit
                    </label>
                    <textarea
                      rows={3}
                      placeholder="E.g. Digestive bloating after meals, recent blood lab review, pre-diabetes reversal, fatigue..."
                      value={primaryConcern}
                      onChange={e => setPrimaryConcern(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>Confirm Consultation Appointment (${selectedPackage.price})</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Consultation Confirmed!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    Dr. Arif Chowdhury looks forward to meeting with you on{' '}
                    <strong className="text-emerald-600">{selectedDate}</strong> at{' '}
                    <strong className="text-emerald-600">{selectedSlot}</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                  <p><strong>Patient:</strong> {patientName}</p>
                  <p><strong>Package:</strong> {selectedPackage.title}</p>
                  <p><strong>Platform:</strong> Secure HD Zoom link sent to {patientEmail}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleDownloadCalendarInvite}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Add to Calendar (.ics)</span>
                  </button>

                  <button
                    onClick={() => setIsBookingModalOpen(false)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </section>
  );
};
