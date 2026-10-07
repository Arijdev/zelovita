'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  HeartPulse, 
  ShoppingBag, 
  BookOpen, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  Search, 
  User, 
  Stethoscope, 
  LogOut, 
  Plus,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import { DOCTOR_INFO } from '@/data/healthData';

interface HeaderProps {
  onOpenMyLibrary: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMyLibrary, onOpenSearch }) => {
  const { cartCount, setIsCartOpen, unlockedResources } = useCart();
  const { 
    user, 
    isAuthenticated, 
    isDoctor, 
    openAuthModal, 
    logout, 
    setIsCustomerDashboardOpen, 
    setIsDoctorPortalOpen 
  } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check local storage for user's explicit preference; default to clean Light Mode
    const savedTheme = localStorage.getItem('zelovita_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('zelovita_theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('zelovita_theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const navLinks = [
    { name: 'Health Guides', href: '/guides' },
    { name: 'Health Tools', href: '/calculators' },
    { name: 'Health Quiz', href: '/quiz' },
    { name: 'Articles', href: '/articles' },
    { name: 'About Dr. Arif', href: '/about' },
    { name: 'Consultations', href: '/consultation' },
  ];

  return (
    <>
      {/* Mobile Drawer Menu - Rendered OUTSIDE header for full-screen */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
          />
          {/* Drawer - Full Screen on Mobile */}
          <div className="lg:hidden fixed inset-0 z-50 bg-white dark:bg-slate-950 shadow-2xl animate-slideInRight overflow-y-auto flex flex-col">
            <div className="p-4 pb-6 space-y-3 flex-1">
              {/* Close button at top */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Nav Links */}
              <nav className="space-y-1">
                {navLinks.map(link => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (isDoctor) setIsDoctorPortalOpen(true);
                      else setIsCustomerDashboardOpen(true);
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-sm font-bold border border-emerald-300 flex items-center justify-center gap-2"
                  >
                    <User className="w-5 h-5" />
                    <span>{isDoctor ? 'Doctor Admin Portal' : 'My Account & History'}</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal('customer-login');
                      }}
                      className="py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold"
                    >
                      Patient Sign In
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal('doctor-login');
                      }}
                      className="py-3 rounded-xl bg-slate-900 text-white text-sm font-bold"
                    >
                      Doctor Login
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-slate-950/90 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800 py-3'
            : 'bg-white/90 dark:bg-slate-950/70 backdrop-blur-sm py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand / Doctor Title */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div className="flex flex-col hidden xs:flex">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-950 dark:text-white tracking-tight">
                  ZELOVITA
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60">
                  DR. ARIF MD
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 font-semibold">
                Clinical Health & Longevity Academy
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0 flex-wrap">
            {/* Quick Search */}
            <button
              onClick={onOpenSearch}
              aria-label="Search resources"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Auth & Account Button */}
            {isAuthenticated && user ? (
              <div className="relative">
                {isDoctor ? (
                  /* Doctor Badge Button */
                  <button
                    onClick={() => setIsDoctorPortalOpen(true)}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-emerald-950/80 text-white border border-emerald-500/40 text-xs font-bold shadow-md hover:bg-slate-800 transition-all"
                  >
                    <Stethoscope className="w-4 h-4 text-emerald-400" />
                    <span className="hidden sm:inline">Doctor Portal</span>
                  </button>
                ) : (
                  /* Customer Account Button */
                  <button
                    onClick={() => setIsCustomerDashboardOpen(true)}
                    className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all"
                  >
                    <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden shrink-0 border border-emerald-500">
                      <Image
                        src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                        alt={user.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                    <span className="hidden md:inline px-1.5 py-0.2 bg-emerald-500 text-white rounded-full text-[10px]">
                      History
                    </span>
                  </button>
                )}
              </div>
            ) : (
              /* Guest / Login Button */
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openAuthModal('customer-login')}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              </div>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart"
              className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-md shadow-emerald-600/25 hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900 animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors -ml-1"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
