'use client';

import React, { useState } from 'react';
import '@/app/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InteractiveReaderModal } from '@/components/InteractiveReaderModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { MyLibraryModal } from '@/components/MyLibraryModal';
import { SearchModal } from '@/components/SearchModal';
import { AuthModal } from '@/components/AuthModal';
import { CustomerDashboardModal } from '@/components/CustomerDashboardModal';
import { DoctorPortalModal } from '@/components/DoctorPortalModal';
import { ToastContainer } from '@/components/Toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedSearchQuery, setSelectedSearchQuery] = useState('');

  const handleSelectSearch = (query: string) => {
    setSelectedSearchQuery(query);
    setIsSearchOpen(false);
  };

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body 
        className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white font-sans antialiased transition-colors duration-300"
        suppressHydrationWarning
      >
        <AuthProvider>
          <CartProvider>
            {/* Navigation Header */}
            <Header
              onOpenMyLibrary={() => setIsLibraryOpen(true)}
              onOpenSearch={() => setIsSearchOpen(true)}
            />

            {/* Main Content */}
            <main>
              {children}
            </main>

            {/* Footer */}
            <Footer />

            {/* Interactive Overlays & Modals */}
            <InteractiveReaderModal />
            <CartDrawer />
            <CheckoutModal />
            <AuthModal />
            <CustomerDashboardModal />
            <DoctorPortalModal />
            <MyLibraryModal
              isOpen={isLibraryOpen}
              onClose={() => setIsLibraryOpen(false)}
            />
            <SearchModal
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              onSelectResourceSearch={handleSelectSearch}
            />
            <ToastContainer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}