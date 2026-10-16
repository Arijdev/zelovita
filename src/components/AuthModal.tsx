'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  X, User, Stethoscope, Lock, Mail, ArrowRight, Sparkles,
  HeartPulse, CheckCircle2, Eye, EyeOff, Shield, AlertCircle,
  Loader2, KeyRound
} from 'lucide-react';

// ─── Password Strength Checker ────────────────────────────────────────────────
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Very Weak', color: 'bg-red-500' };
  if (score === 2) return { score, label: 'Weak', color: 'bg-orange-500' };
  if (score === 3) return { score, label: 'Fair', color: 'bg-yellow-500' };
  if (score === 4) return { score, label: 'Strong', color: 'bg-emerald-500' };
  return { score: 5, label: 'Very Strong', color: 'bg-teal-500' };
}

// ─── Google Button ────────────────────────────────────────────────────────────
const GoogleButton: React.FC<{ onSignIn: () => void; loading: boolean }> = ({ onSignIn, loading }) => (
  <button
    type="button"
    onClick={onSignIn}
    disabled={loading}
    className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-xs font-semibold text-slate-800 dark:text-slate-200 disabled:opacity-50"
  >
    {loading ? (
      <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
    ) : (
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    )}
    <span>Continue with Google</span>
  </button>
);

// ─── Divider ──────────────────────────────────────────────────────────────────
const Divider = () => (
  <div className="flex items-center gap-3 my-4">
    <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
    <span className="text-[11px] text-slate-400 font-medium">or</span>
    <div className="flex-1 border-t border-slate-200 dark:border-slate-700" />
  </div>
);

// ─── Password Input ───────────────────────────────────────────────────────────
const PasswordInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  showStrength?: boolean;
}> = ({ value, onChange, placeholder = 'Password', showStrength = false }) => {
  const [show, setShow] = useState(false);
  const strength = showStrength ? getPasswordStrength(value) : null;

  return (
    <div>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type={show ? 'text' : 'password'}
          required
          minLength={8}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {showStrength && value && strength && (
        <div className="mt-1.5 space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  i <= strength.score ? strength.color : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
          <p className={`text-[10px] font-semibold ${
            strength.score <= 2 ? 'text-red-500' : strength.score === 3 ? 'text-yellow-600' : 'text-emerald-600'
          }`}>
            {strength.label} — {strength.score <= 2 ? 'Add uppercase, numbers & symbols' : strength.score === 3 ? 'Add symbols for stronger password' : 'Great password!'}
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Main AuthModal ───────────────────────────────────────────────────────────
export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    authModalReason,
    authModalInitialView,
    signInWithPassword,
    resetPassword,
    updatePassword,
    signUpWithPassword,
    verifyOtp,
    signInWithGoogle,
    signInAsDoctor,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'customer-login' | 'customer-register' | 'doctor-login' | 'reset-password'>(authModalTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpResendCooldown, setOtpResendCooldown] = useState(0);

  // Customer login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Forgot password (email → link)
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [forgotStep, setForgotStep] = useState<'email' | 'sent'>('email');
  const [forgotEmail, setForgotEmail] = useState('');

  // Set new password (active recovery session)
  const [resetDone, setResetDone] = useState(false);
  const [resetPasswordValue, setResetPasswordValue] = useState('');
  const [resetConfirmValue, setResetConfirmValue] = useState('');

  // Customer register
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Doctor
  const [doctorEmail, setDoctorEmail] = useState('');
  const [doctorPassword, setDoctorPassword] = useState('');

  useEffect(() => {
    setActiveTab(authModalTab);
    setError('');
    setSuccess('');
    setOtpSent(false);
    setView(authModalInitialView);
    setForgotStep('email');
    setForgotEmail('');
    setResetDone(false);
    setResetPasswordValue('');
    setResetConfirmValue('');
  }, [authModalTab, authModalInitialView, isAuthModalOpen]);

  useEffect(() => {
    if (otpResendCooldown <= 0) return;
    const timer = window.setTimeout(() => setOtpResendCooldown((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [otpResendCooldown]);

  if (!isAuthModalOpen) return null;

  const clearErrors = () => { setError(''); setSuccess(''); };

  // ── Customer Login ─────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setLoading(true);
    const { error: err } = await signInWithPassword(loginEmail, loginPassword);
    setLoading(false);
    if (err) setError(err);
  };

  // ── Forgot Password: send reset link ───────────────────────────────────────
  const handleForgotSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setLoading(true);
    const { error: err } = await resetPassword(forgotEmail);
    setLoading(false);
    if (err) setError(err);
    else setForgotStep('sent');
  };

  // ── Forgot Password: resend link ───────────────────────────────────────────
  const handleForgotResend = async () => {
    clearErrors();
    setLoading(true);
    const { error: err } = await resetPassword(forgotEmail);
    setLoading(false);
    if (err) setError(err);
  };

  // ── Set New Password (recovery session) ────────────────────────────────────
  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const strength = getPasswordStrength(resetPasswordValue);
    if (strength.score < 3) {
      setError('Please use a stronger password (at least 8 chars with uppercase, numbers, and symbols).');
      return;
    }
    if (resetPasswordValue !== resetConfirmValue) {
      setError('Passwords do not match. Please re-enter them.');
      return;
    }

    setLoading(true);
    const { error: err } = await updatePassword(resetPasswordValue);
    setLoading(false);
    if (err) setError(err);
    else setResetDone(true);
  };

  // ── Customer Register ──────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    const strength = getPasswordStrength(regPassword);
    if (strength.score < 3) {
      setError('Please use a stronger password (at least 8 chars with uppercase, numbers, and symbols).');
      return;
    }
    setLoading(true);
    const { error: err, needsOtp } = await signUpWithPassword(regName, regEmail, regPassword, regPhone);
    setLoading(false);
    if (err) {
      setError(err);
    } else if (needsOtp) {
      setOtpEmail(regEmail);
      setOtpSent(true);
      setOtpResendCooldown(60);
      setSuccess(`A 6-digit verification code has been sent to ${regEmail}. If the email contains a link instead, the Supabase Confirm signup template needs to use {{ .Token }}.`);
    }
  };

  const handleResendSignupOtp = async () => {
    clearErrors();
    setLoading(true);
    try {
      const response = await fetch('/api/auth/resend-signup-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not resend the verification code.');
      setSuccess(result.message || `A new code was requested for ${otpEmail}.`);
      setOtpCode('');
      setOtpResendCooldown(60);
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : 'Could not resend the verification code.');
    } finally {
      setLoading(false);
    }
  };

  // ── OTP Verify ────────────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setLoading(true);
    const { error: err } = await verifyOtp(otpEmail, otpCode, regName, regPhone);
    setLoading(false);
    if (err) setError(err);
  };

  // ── Google Sign-in ─────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    clearErrors();
    setLoading(true);
    const { error: err } = await signInWithGoogle();
    setLoading(false);
    if (err) setError(err);
  };

  // ── Doctor Login ───────────────────────────────────────────────────────────
  const handleDoctorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    setLoading(true);
    const { error: err } = await signInAsDoctor(doctorEmail, doctorPassword);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 my-auto">

        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/20 text-white/80 hover:text-white hover:bg-black/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs uppercase tracking-widest font-extrabold text-emerald-200">
              ZELOVITA HEALTH ACADEMY
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-white">
            {activeTab === 'customer-login' && view === 'forgot'
              ? '🔐 Reset Your Password'
              : activeTab === 'reset-password'
              ? '🔐 Set a New Password'
              : activeTab === 'doctor-login'
              ? 'Doctor & Medical Staff Portal'
              : activeTab === 'customer-register'
              ? otpSent ? '📧 Verify Your Email' : 'Create Your Health Account'
              : 'Welcome Back'}
          </h3>
          <p className="text-xs text-emerald-100 mt-1">
            {activeTab === 'reset-password'
              ? 'Complete your password recovery securely'
              : activeTab === 'doctor-login'
              ? 'Publish guides, manage pricing & analytics'
              : 'Access your library, download PDFs & view history'}
          </p>
        </div>

        {/* Reason Banner */}
        {authModalReason && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{authModalReason}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 p-1.5 bg-slate-100 dark:bg-slate-800 text-xs font-bold border-b border-slate-200 dark:border-slate-800">
          {([
            { key: 'customer-login', label: 'Sign In', icon: <User className="w-3.5 h-3.5" /> },
            { key: 'customer-register', label: 'Register', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { key: 'doctor-login', label: 'Doctor', icon: <Stethoscope className="w-3.5 h-3.5" /> },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); clearErrors(); setOtpSent(false); setView('login'); setForgotStep('email'); }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Error / Success Alerts */}
        <div className="px-6 pt-4 space-y-2">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">

          {/* ─── CUSTOMER SIGN IN ──────────────────────────────── */}
          {activeTab === 'customer-login' && view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <GoogleButton onSignIn={handleGoogle} loading={loading} />
              <Divider />

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => { setView('forgot'); clearErrors(); }}
                    className="text-[11px] font-semibold text-emerald-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <PasswordInput value={loginPassword} onChange={setLoginPassword} placeholder="Your password" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-1.5"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Sign In to Account</span><ArrowRight className="w-4 h-4" /></>}
              </button>

              <p className="text-[11px] text-center text-slate-500">
                No account?{' '}
                <button type="button" onClick={() => { setActiveTab('customer-register'); clearErrors(); }} className="text-emerald-600 font-bold hover:underline">
                  Register free →
                </button>
              </p>
            </form>
          )}

          {/* ─── FORGOT PASSWORD ─────────────────────────────── */}
          {activeTab === 'customer-login' && view === 'forgot' && (
            forgotStep === 'email' ? (
              <form onSubmit={handleForgotSendLink} className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mx-auto">
                    <Mail className="w-8 h-8 text-emerald-600" />
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Forgot your password?</p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Enter the email linked to your account and we&apos;ll send you a secure link to set a new password.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      autoFocus
                      placeholder="you@example.com"
                      value={forgotEmail}
                      onChange={e => { setForgotEmail(e.target.value); clearErrors(); }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-700 dark:text-blue-300">
                  <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>The reset link is single-use and expires shortly after it&apos;s sent for your protection.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-1.5"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Send Reset Link</span><ArrowRight className="w-4 h-4" /></>}
                </button>

                <button
                  type="button"
                  onClick={() => { setView('login'); clearErrors(); }}
                  className="w-full text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  ← Back to sign in
                </button>
              </form>
            ) : (
              <div className="space-y-4 text-center py-2">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  We&apos;ve sent a password reset link to<br />
                  <strong className="text-slate-900 dark:text-white">{forgotEmail}</strong>
                </p>
                <p className="text-xs text-slate-500">
                  Open the email and click the link to continue — it will open right here in this browser.
                </p>

                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>No email after a few minutes? Check your spam folder, or resend it below.</span>
                </div>

                <button
                  type="button"
                  onClick={handleForgotResend}
                  disabled={loading}
                  className="w-full text-xs font-semibold text-emerald-600 hover:underline disabled:opacity-50"
                >
                  {loading ? 'Sending…' : 'Resend link'}
                </button>

                <button
                  type="button"
                  onClick={() => { setView('login'); setForgotStep('email'); clearErrors(); }}
                  className="w-full text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  ← Back to sign in
                </button>
              </div>
            )
          )}

          {/* ─── SET NEW PASSWORD (recovery session) ─────────── */}
          {activeTab === 'reset-password' && (
            resetDone ? (
              <div className="space-y-4 text-center py-2">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your password has been updated successfully. You&apos;re now signed in — welcome back!
                </p>
                <button
                  type="button"
                  onClick={closeAuthModal}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <><span>Continue</span><ArrowRight className="w-4 h-4" /></>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSetNewPassword} className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mx-auto">
                    <KeyRound className="w-8 h-8 text-emerald-600" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Choose a new password for your account.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                  <PasswordInput value={resetPasswordValue} onChange={setResetPasswordValue} showStrength placeholder="Create a strong password" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                  <PasswordInput value={resetConfirmValue} onChange={setResetConfirmValue} placeholder="Re-enter new password" />
                </div>

                <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-700 dark:text-blue-300">
                  <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>After updating, you&apos;ll stay signed in on this device — no need to log in again.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-1.5"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /><span>Update Password</span></>}
                </button>
              </form>
            )
          )}

          {/* ─── CUSTOMER REGISTER ─────────────────────────────── */}
          {activeTab === 'customer-register' && !otpSent && (
            <form onSubmit={handleRegister} className="space-y-4">
              <GoogleButton onSignIn={handleGoogle} loading={loading} />
              <Divider />

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Jane Smith"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <PasswordInput value={regPassword} onChange={setRegPassword} showStrength placeholder="Create a strong password" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone (Optional)</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-700 dark:text-blue-300">
                <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>A verification code will be sent to your email to confirm your account.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-1.5"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Create Account & Send OTP</span><CheckCircle2 className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          {/* ─── OTP VERIFICATION ──────────────────────────────── */}
          {activeTab === 'customer-register' && otpSent && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Enter the 6-digit code sent to <strong className="text-slate-900 dark:text-white">{otpEmail}</strong>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Verification Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-9 pr-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-lg font-mono font-bold tracking-[0.5em] border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none text-center"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /><span>Verify & Activate Account</span></>}
              </button>

              <button
                type="button"
                onClick={handleResendSignupOtp}
                disabled={loading || otpResendCooldown > 0}
                className="w-full text-xs font-semibold text-emerald-700 transition-colors hover:text-emerald-900 disabled:cursor-not-allowed disabled:text-slate-400 dark:text-emerald-400 dark:hover:text-emerald-300 dark:disabled:text-slate-500"
              >
                {loading ? 'Requesting code…' : otpResendCooldown > 0 ? `Resend code in ${otpResendCooldown}s` : 'Resend verification code'}
              </button>

              <button
                type="button"
                onClick={() => { setOtpSent(false); clearErrors(); }}
                className="w-full text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                ← Back to registration
              </button>
            </form>
          )}

          {/* ─── DOCTOR PORTAL LOGIN ───────────────────────────── */}
          {activeTab === 'doctor-login' && (
            <form onSubmit={handleDoctorLogin} className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Doctor Verification:</strong> Authenticate with your registered physician credentials to access the publishing console, pricing controls, and clinic analytics.</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Doctor Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="dr.arif@zelovita.health"
                    value={doctorEmail}
                    onChange={e => { setDoctorEmail(e.target.value); clearErrors(); }}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <PasswordInput value={doctorPassword} onChange={setDoctorPassword} placeholder="Doctor account password" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Stethoscope className="w-4 h-4" /><span>Sign In as Doctor</span></>}
              </button>

              <p className="text-[11px] text-slate-500 text-center">
                Doctor accounts are pre-registered by system admin only.
              </p>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
