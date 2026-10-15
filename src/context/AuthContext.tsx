'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Session, User as SupabaseUser, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User, UserRole, DownloadHistoryItem, PurchaseHistoryItem, HealthResource } from '@/types/health';

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthTab = 'customer-login' | 'customer-register' | 'doctor-login' | 'reset-password';

// Tracks which recovery session has already been completed so the
// set-new-password form isn't re-opened after the user finishes.
const PASSWORD_RESET_GUARD_KEY = 'zelovita_password_reset_handled_at';

// Snapshot of auth params in the URL at module load. The Supabase client
// processes a recovery redirect (PKCE ?code= / hash tokens) during init and
// then cleans the URL, so we capture the markers before that happens.
const RECOVERY_URL_MARKERS: { code: string | null; tokenHash: string | null; type: string | null } | null =
  typeof window !== 'undefined'
    ? (() => {
        const search = new URLSearchParams(window.location.search);
        const hash = new URLSearchParams(window.location.hash.slice(1));
        return {
          code: search.get('code') || hash.get('code'),
          tokenHash: search.get('token_hash') || hash.get('token_hash'),
          type: search.get('type') || hash.get('type'),
        };
      })()
    : null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole;
  isAuthenticated: boolean;
  isDoctor: boolean;
  isAuthModalOpen: boolean;
  authModalTab: AuthTab;
  authModalReason: string;
  authModalInitialView: 'login' | 'forgot';
  authLoading: boolean;

  openAuthModal: (tab?: AuthTab, reason?: string, initialView?: 'login' | 'forgot') => void;
  closeAuthModal: () => void;

  // Auth actions
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  signUpWithPassword: (name: string, email: string, password: string, phone?: string) => Promise<{ error: string | null; needsOtp?: boolean }>;
  verifyOtp: (email: string, token: string, password?: string, fullName?: string, role?: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInAsDoctor: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;

  // History
  downloadHistory: DownloadHistoryItem[];
  purchaseHistory: PurchaseHistoryItem[];
  recordDownload: (resource: HealthResource) => Promise<void>;
  recordPurchase: (purchase: PurchaseHistoryItem) => Promise<void>;

  // Modals
  isCustomerDashboardOpen: boolean;
  setIsCustomerDashboardOpen: (open: boolean) => void;
  isDoctorPortalOpen: boolean;
  setIsDoctorPortalOpen: (open: boolean) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthTab>('customer-login');
  const [authModalReason, setAuthModalReason] = useState('');
  const [authModalInitialView, setAuthModalInitialView] = useState<'login' | 'forgot'>('login');
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistoryItem[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryItem[]>([]);
  const [isCustomerDashboardOpen, setIsCustomerDashboardOpen] = useState(false);
  const [isDoctorPortalOpen, setIsDoctorPortalOpen] = useState(false);

  // ── Build User from Supabase session ────────────────────────────────────────
  const buildUserFromProfile = useCallback(async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (profile) {
        return {
          id: supabaseUser.id,
          name: profile.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
          email: supabaseUser.email || '',
          role: profile.role as UserRole,
          avatar: profile.avatar_url || supabaseUser.user_metadata?.avatar_url,
          phone: profile.phone,
          createdAt: new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        };
      }

      // Fallback: create profile row if missing
      const newProfile = {
        id: supabaseUser.id,
        full_name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
        email: supabaseUser.email,
        role: 'customer' as const,
        avatar_url: supabaseUser.user_metadata?.avatar_url || null,
      };
      await supabase.from('profiles').insert(newProfile);

      return {
        id: supabaseUser.id,
        name: newProfile.full_name,
        email: newProfile.email || '',
        role: 'customer',
        avatar: newProfile.avatar_url || undefined,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      };
    } catch {
      return null;
    }
  }, []);

  // ── Load download/purchase history from Supabase ─────────────────────────────
  const loadHistory = useCallback(async (userId: string) => {
    try {
      const [{ data: downloads }, { data: purchases }] = await Promise.all([
        supabase
          .from('download_history')
          .select('*')
          .eq('user_id', userId)
          .order('downloaded_at', { ascending: false })
          .limit(50),
        supabase
          .from('purchases')
          .select('*')
          .eq('user_id', userId)
          .order('purchased_at', { ascending: false })
          .limit(50),
      ]);

      if (downloads) {
        setDownloadHistory(downloads.map((d: { id: string; resource_id: string | null; resource_title: string; resource_category: string; cover_image_url: string | null; downloaded_at: string; is_free: boolean }) => ({
          id: d.id,
          resourceId: d.resource_id || '',
          resourceTitle: d.resource_title,
          resourceCategory: d.resource_category,
          coverImage: d.cover_image_url || '/images/book_nutrition.jpg',
          downloadedAt: new Date(d.downloaded_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
          }),
          fileFormat: 'PDF Document',
          isFree: d.is_free,
        })));
      }

      if (purchases) {
        setPurchaseHistory(purchases.map((p: { order_id: string; items: unknown; total_paid: number | string; payment_method: string | null; purchased_at: string }) => ({
          orderId: p.order_id,
          items: p.items || [],
          totalPaid: Number(p.total_paid),
          paymentMethod: p.payment_method || 'card',
          purchasedAt: new Date(p.purchased_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          }),
        })));
      }
    } catch (err) {
      console.error('Error loading history:', err);
    }
  }, []);

  // ── Open the set-new-password form after a recovery-link redirect ────────────
  const promptPasswordReset = useCallback((supabaseUser: SupabaseUser | null) => {
    try {
      const sentAt = supabaseUser?.recovery_sent_at || '';
      if (sentAt && typeof sessionStorage !== 'undefined' && sessionStorage.getItem(PASSWORD_RESET_GUARD_KEY) === sentAt) {
        return; // This recovery was already completed in this browser
      }
    } catch {
      // sessionStorage unavailable — proceed without the guard
    }

    setAuthModalTab('reset-password');
    setAuthModalReason('');
    setIsAuthModalOpen(true);
  }, []);

  // ── Initialize: listen for auth state changes ─────────────────────────────────
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, newSession: Session | null) => {
      setSession(newSession);
      setAuthLoading(true);

      // Recovery link clicked → open the set-new-password form
      if (event === 'PASSWORD_RECOVERY') {
        promptPasswordReset(newSession?.user ?? null);
      }

      if (newSession?.user) {
        const builtUser = await buildUserFromProfile(newSession.user);
        setUser(builtUser);
        if (builtUser) {
          await loadHistory(newSession.user.id);
        }
      } else {
        setUser(null);
        setDownloadHistory([]);
        setPurchaseHistory([]);
      }
      setAuthLoading(false);
    });

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }: { data: { session: Session | null } }) => {
      setSession(initialSession);
      if (initialSession?.user) {
        const builtUser = await buildUserFromProfile(initialSession.user);
        setUser(builtUser);
        if (builtUser) {
          await loadHistory(initialSession.user.id);
        }
      }

      // ── Password-recovery link landed on this page ─────────────────────────
      // The client library auto-exchanges a PKCE ?code= (and hash tokens) and
      // fires PASSWORD_RECOVERY; RECOVERY_URL_MARKERS snapshots the URL before
      // the library cleans it, so we can still recognise the redirect here.
      const markers = RECOVERY_URL_MARKERS;
      const isRecoveryUrl =
        markers !== null &&
        (markers.type === 'recovery' || markers.tokenHash !== null || markers.code !== null);

      if (initialSession?.user) {
        // A session exists. Offer the reset form when a recovery email was
        // recently sent or the URL clearly came from a recovery link.
        const sentAt = initialSession.user.recovery_sent_at;
        const sentRecently = !!sentAt && Date.now() - Date.parse(sentAt) < 24 * 60 * 60 * 1000;
        if (sentRecently || isRecoveryUrl) {
          promptPasswordReset(initialSession.user);
        }
      } else if (isRecoveryUrl) {
        // Link clicked but no session could be established. Older templates
        // deliver ?token_hash=…&type=recovery links — verify those manually.
        if (markers?.tokenHash && (markers.type === 'recovery' || markers.type === null)) {
          const { error: tokenHashError } = await supabase.auth.verifyOtp({
            token_hash: markers.tokenHash,
            type: 'recovery',
          });
          if (!tokenHashError) {
            const { data: { session: recoveredSession } } = await supabase.auth.getSession();
            if (recoveredSession?.user) {
              setSession(recoveredSession);
              const builtUser = await buildUserFromProfile(recoveredSession.user);
              setUser(builtUser);
              promptPasswordReset(recoveredSession.user);
              setAuthLoading(false);
              return;
            }
          }
        }

        // The code was expired, already used, or opened in a different
        // browser — tell the user instead of silently showing the homepage.
        setAuthModalTab('customer-login');
        setAuthModalReason('This password reset link is invalid, expired, or has already been used — reset links only work once, in the same browser. Please request a new one below.');
        setAuthModalInitialView('forgot');
        setIsAuthModalOpen(true);
      }

      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [buildUserFromProfile, loadHistory, promptPasswordReset]);

  // ── Modal helpers ─────────────────────────────────────────────────────────────
  const openAuthModal = useCallback((tab: AuthTab = 'customer-login', reason = '', initialView: 'login' | 'forgot' = 'login') => {
    setAuthModalTab(tab);
    setAuthModalReason(reason);
    setAuthModalInitialView(initialView);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalReason('');
  }, []);

  // ── Customer Sign-in with password ────────────────────────────────────────────
  const signInWithPassword = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    closeAuthModal();
    return { error: null };
  };

  // ── Password Reset (email recovery link) ──────────────────────────────────────
  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    try {
      // Land on the site root — the client detects the recovery token from the
      // URL anywhere in the app and opens the reset form automatically.
      const redirectTo = typeof window !== 'undefined'
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) return { error: error.message };
      return { error: null };
    } catch {
      return { error: 'Network error. Please try again.' };
    }
  };

  // ── Customer Registration (OTP-based) ──────────────────────────────────────────
  const signUpWithPassword = async (name: string, email: string, password: string, phone?: string): Promise<{ error: string | null; needsOtp?: boolean }> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName: name, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || data.message || 'Signup failed' };
      }

      if (data.needsOtp) {
        return { error: null, needsOtp: true };
      }

      closeAuthModal();
      return { error: null };
    } catch (err) {
      return { error: 'Network error. Please try again.' };
    }
  };

  // ── OTP Verification (for email confirmation + signup completion) ──────────────
  const verifyOtp = async (email: string, token: string, password?: string, fullName?: string, role?: string): Promise<{ error: string | null }> => {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password, fullName, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || data.message || 'Verification failed' };
      }

      closeAuthModal();
      return { error: null };
    } catch (err) {
      return { error: 'Network error. Please try again.' };
    }
  };

  // ── Set a new password during an active recovery session ──────────────────────
  const updatePassword = async (password: string): Promise<{ error: string | null }> => {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) return { error: error.message };

    try {
      sessionStorage.setItem(
        PASSWORD_RESET_GUARD_KEY,
        data.user?.recovery_sent_at || String(Date.now())
      );
    } catch {
      // sessionStorage unavailable — guard is best-effort
    }

    return { error: null };
  };

  // ── Google OAuth ──────────────────────────────────────────────────────────────
  const signInWithGoogle = async (): Promise<{ error: string | null }> => {
    try {
      const redirectTo = typeof window !== 'undefined' 
        ? `${window.location.origin}/auth/callback`
        : `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Supabase Google OAuth error:', error);
        return { 
          error: error.message.includes('provider is not enabled')
            ? 'Google Sign-in is not enabled in your Supabase dashboard yet. Please enable Google in Supabase > Authentication > Providers.'
            : error.message 
        };
      }

      if (data?.url && typeof window !== 'undefined') {
        window.location.href = data.url;
      }

      return { error: null };
    } catch (err: unknown) {
      console.error('Unexpected Google OAuth error:', err);
      const message = err instanceof Error ? err.message : 'Failed to connect to authentication server';
      return { 
        error: message.includes('Failed to fetch') || message.includes('NetworkError')
          ? 'Cannot reach Supabase Auth server. Please verify NEXT_PUBLIC_SUPABASE_URL in .env.local or use Email/Password sign-in.'
          : message 
      };
    }
  };

  // ── Doctor Login ──────────────────────────────────────────────────────────────
  const signInAsDoctor = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    // Verify the role is 'doctor' in profiles table
    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (!profile || profile.role !== 'doctor') {
        await supabase.auth.signOut();
        return { error: 'Access denied. This account does not have Doctor privileges.' };
      }

      closeAuthModal();
      setIsDoctorPortalOpen(true);
      return { error: null };
    }

    return { error: 'Authentication failed.' };
  };

  // ── Logout ────────────────────────────────────────────────────────────────────
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setDownloadHistory([]);
    setPurchaseHistory([]);
    setIsCustomerDashboardOpen(false);
    setIsDoctorPortalOpen(false);
  };

  // ── Record Download ───────────────────────────────────────────────────────────
  const recordDownload = async (resource: HealthResource) => {
    if (!session?.user) return;

    const historyItem: DownloadHistoryItem = {
      id: 'dl_' + Date.now(),
      resourceId: resource.id,
      resourceTitle: resource.title,
      resourceCategory: resource.category,
      coverImage: resource.coverImage,
      downloadedAt: new Date().toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
      }),
      fileFormat: 'PDF Document',
      isFree: resource.isFree,
    };

    // Optimistic update
    setDownloadHistory(prev => [historyItem, ...prev.filter(d => d.resourceId !== resource.id)]);

    // Persist to Supabase
    try {
      await supabase.from('download_history').insert({
        user_id: session.user.id,
        resource_id: resource.id.startsWith('doc_guide_') || resource.id.startsWith('seed_') ? null : resource.id,
        resource_title: resource.title,
        resource_category: resource.category,
        cover_image_url: resource.coverImage,
        is_free: resource.isFree,
      });

      // Increment download count on resource
      if (!resource.id.startsWith('doc_guide_')) {
        await supabase.rpc('increment_download_count', { resource_id: resource.id }).maybeSingle();
      }
    } catch (err) {
      console.error('Error recording download:', err);
    }
  };

  // ── Record Purchase ───────────────────────────────────────────────────────────
  const recordPurchase = async (purchase: PurchaseHistoryItem) => {
    setPurchaseHistory(prev => [purchase, ...prev]);

    if (!session?.user) return;

    try {
      await supabase.from('purchases').insert({
        user_id: session.user.id,
        order_id: purchase.orderId,
        items: purchase.items,
        total_paid: purchase.totalPaid,
        payment_method: purchase.paymentMethod,
      });
    } catch (err) {
      console.error('Error recording purchase:', err);
    }
  };

  const role: UserRole = user ? user.role : 'guest';
  const isAuthenticated = !!user;
  const isDoctor = role === 'doctor';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        isAuthenticated,
        isDoctor,
        isAuthModalOpen,
        authModalTab,
        authModalReason,
        authModalInitialView,
        authLoading,
        openAuthModal,
        closeAuthModal,
        signInWithPassword,
        resetPassword,
        updatePassword,
        signUpWithPassword,
        verifyOtp,
        signInWithGoogle,
        signInAsDoctor,
        logout,
        downloadHistory,
        purchaseHistory,
        recordDownload,
        recordPurchase,
        isCustomerDashboardOpen,
        setIsCustomerDashboardOpen,
        isDoctorPortalOpen,
        setIsDoctorPortalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
