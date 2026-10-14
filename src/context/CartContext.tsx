'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HealthResource, CartItem, Coupon } from '@/types/health';
import { DISCOUNT_COUPONS, HEALTH_RESOURCES } from '@/data/healthData';
import { useAuth } from './AuthContext';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'cart' | 'error';
}

interface CartContextType {
  resources: HealthResource[];
  loading: boolean;
  addCustomResource: (newResource: HealthResource) => void;
  updateResource: (id: string, updated: Partial<HealthResource>) => void;
  deleteResource: (id: string) => void;
  cart: CartItem[];
  addToCart: (resource: HealthResource) => void;
  removeFromCart: (resourceId: string) => void;
  updateQuantity: (resourceId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  total: number;
  cartCount: number;
  unlockedResources: string[];
  unlockResource: (resourceId: string) => void;
  isResourceUnlocked: (resourceId: string) => boolean;
  activeReaderResource: HealthResource | null;
  openReader: (resource: HealthResource) => void;
  closeReader: () => void;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: 'success' | 'info' | 'cart' | 'error') => void;
  removeToast: (id: string) => void;
  downloadResourceDoc: (resource: HealthResource) => void;
  refreshResources: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, openAuthModal, recordDownload } = useAuth();
  const [resources, setResources] = useState<HealthResource[]>(HEALTH_RESOURCES);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [unlockedResources, setUnlockedResources] = useState<string[]>([]);
  const [activeReaderResource, setActiveReaderResource] = useState<HealthResource | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Fetch resources from Supabase API
  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');
      if (response.ok) {
        const data = await response.json();
        if (data.resources && data.resources.length > 0) {
          const mappedResources: HealthResource[] = data.resources.map((r: Record<string, unknown>) => ({
            id: r.id,
            title: r.title,
            subtitle: r.subtitle || 'A Clinical Protocol by Dr. Arif Chowdhury',
            category: r.category as HealthResource['category'],
            isFree: r.is_free,
            price: r.price || 0,
            originalPrice: r.original_price || 29.99,
            rating: r.rating || 5.0,
            reviewCount: r.review_count || 0,
            pages: r.pages || 80,
            readingTime: r.reading_time || '2 hours',
            coverImage: r.cover_image_url || r.thumbnail_url || '/images/book_nutrition.jpg',
            pdfFileName: r.pdf_url || `doc_guide_${r.id}`,
            badge: r.badge || (r.is_free ? '100% Free Guide 🎁' : "Doctor's Special Edition"),
            badgeColor: r.badge_color || 'emerald',
            description: r.description || '',
            highlights: r.highlights || [],
            tableOfContents: r.table_of_contents || [],
            fullContent: (r.full_content as HealthResource['fullContent']) || {},
            uploadedBy: 'Dr. Arif Chowdhury',
            publishedAt: r.published_at ? new Date(r.published_at as string).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
          }));
          setResources(mappedResources);
        }
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load resources on mount
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    fetchResources();
  }, []);

  // Save custom resources
  const saveResourcesToStorage = (newList: HealthResource[]) => {
    setResources(newList);
    try {
      localStorage.setItem('zelovita_resources', JSON.stringify(newList));
    } catch (e) {
      console.error('Error saving resources', e);
    }
  };

  const addCustomResource = (newRes: HealthResource) => {
    const updated = [newRes, ...resources];
    saveResourcesToStorage(updated);
    addToast('Published Successfully! 🎉', `"${newRes.title}" is now live in the health library.`, 'success');
  };

  const updateResource = (id: string, updatedFields: Partial<HealthResource>) => {
    const updated = resources.map(r => (r.id === id ? { ...r, ...updatedFields } : r));
    saveResourcesToStorage(updated);
    addToast('Updated Guide', 'Resource changes saved successfully.', 'info');
  };

  const deleteResource = (id: string) => {
    const updated = resources.filter(r => r.id !== id);
    saveResourcesToStorage(updated);
    addToast('Resource Removed', 'Guide has been removed from the academy.', 'info');
  };

  // Load cart and unlocked resources from localStorage on mount
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('zelovita_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedUnlocked = localStorage.getItem('zelovita_unlocked');
      if (savedUnlocked) {
        setUnlockedResources(JSON.parse(savedUnlocked));
      } else {
        // Automatically unlock all free guides by default
        const freeIds = HEALTH_RESOURCES.filter(r => r.isFree).map(r => r.id);
        setUnlockedResources(freeIds);
        localStorage.setItem('zelovita_unlocked', JSON.stringify(freeIds));
      }
    } catch (e) {
      console.error('Error loading cart from storage', e);
    }
  }, []);

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem('zelovita_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to storage', e);
    }
  }, [cart]);

  // Save unlocked changes
  useEffect(() => {
    try {
      if (unlockedResources.length > 0) {
        localStorage.setItem('zelovita_unlocked', JSON.stringify(unlockedResources));
      }
    } catch (e) {
      console.error('Error saving unlocked resources', e);
    }
  }, [unlockedResources]);

  let toastIdCounter = 0;

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'cart' | 'error' = 'success') => {
    const id = `toast_${++toastIdCounter}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToCart = (resource: HealthResource) => {
    if (resource.isFree) {
      if (!isAuthenticated) {
        openAuthModal('customer-login', `Please log in or create a free patient account to read & download "${resource.title}".`);
        return;
      }
      unlockResource(resource.id);
      addToast('Free Guide Ready!', `"${resource.title}" is ready in your library.`, 'info');
      openReader(resource);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.resource.id === resource.id);
      if (existing) {
        addToast('Cart Updated', `Added another copy of "${resource.title}".`, 'cart');
        return prev.map(item =>
          item.resource.id === resource.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        addToast('Added to Cart', `"${resource.title}" was added to your cart.`, 'cart');
        return [...prev, { resource, quantity: 1 }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (resourceId: string) => {
    setCart(prev => prev.filter(item => item.resource.id !== resourceId));
    addToast('Removed', 'Item removed from your cart.', 'info');
  };

  const updateQuantity = (resourceId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.resource.id === resourceId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = DISCOUNT_COUPONS.find(c => c.code.toUpperCase() === clean);
    if (found) {
      setAppliedCoupon(found);
      addToast('Promo Code Applied!', `${found.description}`, 'success');
      return { success: true, message: `Promo code ${found.code} applied successfully!` };
    }
    return { success: false, message: 'Invalid coupon code. Try ARIF50 or HEALTH20.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon Removed', 'Standard pricing restored.', 'info');
  };

  const unlockResource = (resourceId: string) => {
    setUnlockedResources(prev => {
      if (!prev.includes(resourceId)) {
        return [...prev, resourceId];
      }
      return prev;
    });
  };

  const isResourceUnlocked = (resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource?.isFree) return true;
    return unlockedResources.includes(resourceId);
  };

  const openReader = (resource: HealthResource) => {
    setActiveReaderResource(resource);
  };

  const closeReader = () => {
    setActiveReaderResource(null);
  };

  // Pricing calculations
  const subtotal = cart.reduce((sum, item) => sum + item.resource.price * item.quantity, 0);
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = (subtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountAmount) {
      discountAmount = Math.min(subtotal, appliedCoupon.discountAmount);
    }
  }

  const total = Math.max(0, subtotal - discountAmount);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Download PDF Document with strict Auth Guard
  const downloadResourceDoc = async (resource: HealthResource) => {
    if (!isAuthenticated) {
      openAuthModal('customer-login', `Please sign in or create a free patient account to download "${resource.title}".`);
      return;
    }

    // If real PDF URL is available (from Supabase Storage), open/download it directly
    if (resource.pdfFileName && (resource.pdfFileName.startsWith('http') || resource.pdfFileName.startsWith('/'))) {
      const link = document.createElement('a');
      link.href = resource.pdfFileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = `${resource.title.replace(/[^a-zA-Z0-9]/g, '_')}_Dr_Arif_Chowdhury.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Record download to Supabase
      try {
        await fetch('/api/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resourceId: resource.id,
            resourceTitle: resource.title,
            resourceCategory: resource.category,
            coverImageUrl: resource.coverImage,
            isFree: resource.isFree,
          }),
        });
      } catch (err) {
        console.error('Failed to record download:', err);
      }
      
      recordDownload(resource);
      unlockResource(resource.id);
      addToast('Download Started!', `"${resource.title}" PDF is opening from Zelovita Vault.`, 'success');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${resource.title} — Dr. Arif Chowdhury (Zelovita Health Academy)</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
          body {
            font-family: 'Lora', Georgia, serif;
            line-height: 1.7;
            color: #1a202c;
            max-width: 800px;
            margin: 40px auto;
            padding: 40px;
            background: #ffffff;
          }
          h1, h2, h3, h4 {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #0f172a;
          }
          .header {
            border-bottom: 3px solid #10b981;
            padding-bottom: 24px;
            margin-bottom: 32px;
            text-align: center;
          }
          .badge {
            display: inline-block;
            background: #ecfdf5;
            color: #059669;
            padding: 4px 14px;
            border-radius: 9999px;
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 12px;
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .title {
            font-size: 32px;
            font-weight: 800;
            margin: 8px 0;
            color: #064e3b;
          }
          .subtitle {
            font-size: 18px;
            color: #4b5563;
            font-style: italic;
          }
          .author {
            margin-top: 16px;
            font-weight: 700;
            color: #0f766e;
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
          .chapter {
            margin: 36px 0;
            padding: 24px;
            background: #f8fafc;
            border-radius: 12px;
            border-left: 5px solid #10b981;
          }
          .chapter-title {
            font-size: 22px;
            font-weight: 700;
            margin-top: 0;
            color: #0f172a;
          }
          .takeaways {
            background: #ecfdf5;
            padding: 16px 20px;
            border-radius: 8px;
            margin-top: 16px;
          }
          .takeaways h4 {
            margin-top: 0;
            color: #065f46;
          }
          .doctor-tip {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            color: #1e40af;
            padding: 14px 18px;
            border-radius: 8px;
            margin-top: 16px;
            font-weight: 600;
            font-size: 14px;
          }
          .footer {
            margin-top: 60px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            padding-top: 24px;
            font-size: 13px;
            color: #64748b;
            font-family: 'Plus Jakarta Sans', sans-serif;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="badge">ZELOVITA HEALTH ACADEMY • OFFICIAL CLINICAL GUIDE</div>
          <h1 class="title">${resource.title}</h1>
          <div class="subtitle">${resource.subtitle}</div>
          <div class="author">Authored by Dr. Arif Chowdhury, MBBS, M.S. Clinical Nutrition</div>
        </div>

        <div>
          <h2>Introduction</h2>
          <p>${resource.fullContent.introduction}</p>
        </div>

        <div>
          <h2>Core Clinical Protocol & Chapters</h2>
          ${resource.fullContent.chapters.map(ch => `
            <div class="chapter">
              <h3 class="chapter-title">${ch.title}</h3>
              <p>${ch.content}</p>
              
              <div class="takeaways">
                <h4>Key Action Steps:</h4>
                <ul>
                  ${ch.keyTakeaways.map(t => `<li>${t}</li>`).join('')}
                </ul>
              </div>

              ${ch.doctorTip ? `
                <div class="doctor-tip">
                  💡 <strong>Clinical Pearl:</strong> ${ch.doctorTip}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <div>
          <h2>Dr. Arif's Actionable Daily Checklist</h2>
          <ul>
            ${resource.fullContent.protocolSummary.map(p => `<li><strong>✔</strong> ${p}</li>`).join('')}
          </ul>
        </div>

        <div>
          <h2>Conclusion</h2>
          <p>${resource.fullContent.conclusion}</p>
        </div>

        <div class="footer">
          <p><strong>Medical Disclaimer:</strong> This publication is for educational purposes and is not a substitute for individualized clinical diagnosis. Always consult your qualified healthcare practitioner before implementing new protocols.</p>
          <p>© ${new Date().getFullYear()} Zelovita Health Academy — Dr. Arif Chowdhury. All Rights Reserved.</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resource.title.replace(/[^a-zA-Z0-9]/g, '_')}_Dr_Arif_Chowdhury.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Record in user's download history
    recordDownload(resource);
    unlockResource(resource.id);

    addToast('Download Started!', `"${resource.title}" guide downloaded and saved to your account history.`, 'success');
  };

  return (
    <CartContext.Provider
      value={{
        resources,
        loading,
        addCustomResource,
        updateResource,
        deleteResource,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        total,
        cartCount,
        unlockedResources,
        unlockResource,
        isResourceUnlocked,
        activeReaderResource,
        openReader,
        closeReader,
        toasts,
        addToast,
        removeToast,
        downloadResourceDoc,
        refreshResources: fetchResources
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
