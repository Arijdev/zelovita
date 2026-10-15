'use client';

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type CountryCurrency = {
  country: string;
  currency: string;
  locale: string;
  usdRate: number;
};

export const COUNTRY_CURRENCIES: CountryCurrency[] = [
  { country: 'United States', currency: 'USD', locale: 'en-US', usdRate: 1 },
  { country: 'Canada', currency: 'CAD', locale: 'en-CA', usdRate: 1.37 },
  { country: 'United Kingdom', currency: 'GBP', locale: 'en-GB', usdRate: 0.79 },
  { country: 'Germany', currency: 'EUR', locale: 'de-DE', usdRate: 0.92 },
  { country: 'France', currency: 'EUR', locale: 'fr-FR', usdRate: 0.92 },
  { country: 'Spain', currency: 'EUR', locale: 'es-ES', usdRate: 0.92 },
  { country: 'Italy', currency: 'EUR', locale: 'it-IT', usdRate: 0.92 },
  { country: 'Netherlands', currency: 'EUR', locale: 'nl-NL', usdRate: 0.92 },
  { country: 'Ireland', currency: 'EUR', locale: 'en-IE', usdRate: 0.92 },
  { country: 'Australia', currency: 'AUD', locale: 'en-AU', usdRate: 1.53 },
  { country: 'New Zealand', currency: 'NZD', locale: 'en-NZ', usdRate: 1.67 },
  { country: 'India', currency: 'INR', locale: 'en-IN', usdRate: 83.5 },
  { country: 'Bangladesh', currency: 'BDT', locale: 'en-BD', usdRate: 121.5 },
  { country: 'Pakistan', currency: 'PKR', locale: 'en-PK', usdRate: 278 },
  { country: 'United Arab Emirates', currency: 'AED', locale: 'en-AE', usdRate: 3.6725 },
  { country: 'Saudi Arabia', currency: 'SAR', locale: 'en-SA', usdRate: 3.75 },
  { country: 'Qatar', currency: 'QAR', locale: 'en-QA', usdRate: 3.64 },
  { country: 'Singapore', currency: 'SGD', locale: 'en-SG', usdRate: 1.34 },
  { country: 'Malaysia', currency: 'MYR', locale: 'en-MY', usdRate: 4.45 },
  { country: 'Japan', currency: 'JPY', locale: 'ja-JP', usdRate: 149 },
  { country: 'China', currency: 'CNY', locale: 'zh-CN', usdRate: 7.1 },
  { country: 'South Korea', currency: 'KRW', locale: 'ko-KR', usdRate: 1370 },
  { country: 'Indonesia', currency: 'IDR', locale: 'id-ID', usdRate: 15700 },
  { country: 'Philippines', currency: 'PHP', locale: 'en-PH', usdRate: 56 },
  { country: 'Thailand', currency: 'THB', locale: 'th-TH', usdRate: 36.5 },
  { country: 'Vietnam', currency: 'VND', locale: 'vi-VN', usdRate: 25400 },
  { country: 'Switzerland', currency: 'CHF', locale: 'de-CH', usdRate: 0.88 },
  { country: 'South Africa', currency: 'ZAR', locale: 'en-ZA', usdRate: 18 },
  { country: 'Nigeria', currency: 'NGN', locale: 'en-NG', usdRate: 1600 },
  { country: 'Mexico', currency: 'MXN', locale: 'es-MX', usdRate: 17.5 },
  { country: 'Brazil', currency: 'BRL', locale: 'pt-BR', usdRate: 5.5 },
  { country: 'Sri Lanka', currency: 'LKR', locale: 'en-LK', usdRate: 300 },
];

interface CountryCurrencyContextValue {
  selectedCountry: string;
  currency: string;
  countries: CountryCurrency[];
  setSelectedCountry: (country: string) => void;
  formatPrice: (usdAmount: number) => string;
}

const CountryCurrencyContext = createContext<CountryCurrencyContextValue | undefined>(undefined);

const COUNTRY_BY_REGION: Record<string, string> = {
  US: 'United States', CA: 'Canada', GB: 'United Kingdom', DE: 'Germany', FR: 'France',
  ES: 'Spain', IT: 'Italy', NL: 'Netherlands', IE: 'Ireland', AU: 'Australia',
  NZ: 'New Zealand', IN: 'India', BD: 'Bangladesh', PK: 'Pakistan', AE: 'United Arab Emirates',
  SA: 'Saudi Arabia', QA: 'Qatar', SG: 'Singapore', MY: 'Malaysia', JP: 'Japan', CN: 'China',
  KR: 'South Korea', ID: 'Indonesia', PH: 'Philippines', TH: 'Thailand', VN: 'Vietnam',
  CH: 'Switzerland', ZA: 'South Africa', NG: 'Nigeria', MX: 'Mexico', BR: 'Brazil', LK: 'Sri Lanka',
};

const COUNTRY_BY_TIME_ZONE: Record<string, string> = {
  'Asia/Kolkata': 'India',
  'Asia/Calcutta': 'India',
  'Asia/Dhaka': 'Bangladesh',
  'Asia/Karachi': 'Pakistan',
  'Asia/Dubai': 'United Arab Emirates',
  'Asia/Riyadh': 'Saudi Arabia',
  'Asia/Qatar': 'Qatar',
  'Asia/Singapore': 'Singapore',
  'Asia/Kuala_Lumpur': 'Malaysia',
  'Asia/Tokyo': 'Japan',
  'Asia/Shanghai': 'China',
  'Asia/Seoul': 'South Korea',
  'Asia/Jakarta': 'Indonesia',
  'Asia/Manila': 'Philippines',
  'Asia/Bangkok': 'Thailand',
  'Asia/Ho_Chi_Minh': 'Vietnam',
  'Europe/London': 'United Kingdom',
  'Europe/Zurich': 'Switzerland',
  'Africa/Johannesburg': 'South Africa',
  'Africa/Lagos': 'Nigeria',
  'America/Toronto': 'Canada',
  'America/Mexico_City': 'Mexico',
  'America/Sao_Paulo': 'Brazil',
  'Australia/Sydney': 'Australia',
  'Pacific/Auckland': 'New Zealand',
};

function detectBrowserCountry() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (COUNTRY_BY_TIME_ZONE[timeZone]) return COUNTRY_BY_TIME_ZONE[timeZone];

  for (const locale of navigator.languages) {
    const region = locale.match(/-([A-Za-z]{2})(?:-|$)/)?.[1]?.toUpperCase();
    if (region && COUNTRY_BY_REGION[region]) return COUNTRY_BY_REGION[region];
  }

  return undefined;
}

export function CountryCurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCountry, setSelectedCountry] = useState('United States');
  const [hasLoadedPreference, setHasLoadedPreference] = useState(false);
  const countryConfig = COUNTRY_CURRENCIES.find((item) => item.country === selectedCountry) || COUNTRY_CURRENCIES[0];

  useEffect(() => {
    const manualCountry = localStorage.getItem('zelovita_country_manual');
    const savedCountry = localStorage.getItem('zelovita_country');
    const detectedCountry = detectBrowserCountry();
    const preferredCountry = manualCountry || detectedCountry || savedCountry;
    if (preferredCountry && COUNTRY_CURRENCIES.some((item) => item.country === preferredCountry)) {
      setSelectedCountry(preferredCountry);
    }
    setHasLoadedPreference(true);
  }, []);

  useEffect(() => {
    if (hasLoadedPreference) {
      localStorage.setItem('zelovita_country', selectedCountry);
    }
  }, [hasLoadedPreference, selectedCountry]);

  const chooseCountry = (country: string) => {
    if (COUNTRY_CURRENCIES.some((item) => item.country === country)) {
      localStorage.setItem('zelovita_country_manual', country);
      setSelectedCountry(country);
    }
  };

  const formatPrice = (usdAmount: number) => new Intl.NumberFormat(countryConfig.locale, {
    style: 'currency',
    currency: countryConfig.currency,
    maximumFractionDigits: countryConfig.currency === 'JPY' ? 0 : 2,
  }).format(usdAmount * countryConfig.usdRate);

  return (
    <CountryCurrencyContext.Provider
      value={{
        selectedCountry,
        currency: countryConfig.currency,
        countries: COUNTRY_CURRENCIES,
        setSelectedCountry: chooseCountry,
        formatPrice,
      }}
    >
      {children}
    </CountryCurrencyContext.Provider>
  );
}

export function useCountryCurrency() {
  const context = useContext(CountryCurrencyContext);
  if (!context) {
    throw new Error('useCountryCurrency must be used within CountryCurrencyProvider');
  }
  return context;
}
