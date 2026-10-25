import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'KES' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromUSD: number; // Conversion rate from USD
  label: string;
  flag: string;
  decimalPlaces: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  KES: {
    code: 'KES',
    symbol: 'KSh ',
    rateFromUSD: 130, // 1 USD ~ 130 KES
    label: 'KES (KSh)',
    flag: '🇰🇪',
    decimalPlaces: 0, // Clean whole shillings for restaurant menus (e.g., KSh 1,690)
  },
  USD: {
    code: 'USD',
    symbol: '$',
    rateFromUSD: 1.0,
    label: 'USD ($)',
    flag: '🇺🇸',
    decimalPlaces: 2,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    rateFromUSD: 0.92,
    label: 'EUR (€)',
    flag: '🇪🇺',
    decimalPlaces: 2,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    rateFromUSD: 0.78,
    label: 'GBP (£)',
    flag: '🇬🇧',
    decimalPlaces: 2,
  },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInUSD: number) => string;
  detectedCountry: string;
  isAutoDetected: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('KES');
  const [detectedCountry, setDetectedCountry] = useState<string>('Kenya (Auto)');
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(true);

  useEffect(() => {
    // 1. Check if user already manually chose a preferred currency
    const stored = localStorage.getItem('zeupreme_currency_preference');
    if (stored && stored in CURRENCIES) {
      setCurrencyState(stored as CurrencyCode);
      setIsAutoDetected(false);
      return;
    }

    // 2. Client-side Timezone & Locale Detection (instant, zero network latency)
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const languages = navigator.languages || [navigator.language || ''];

      const isKenyaTimezone = timeZone.includes('Nairobi') || timeZone.includes('Africa/Nairobi');
      const isKenyaLocale = languages.some((lang) => lang.toLowerCase().includes('-ke'));

      if (isKenyaTimezone || isKenyaLocale) {
        setCurrencyState('KES');
        setDetectedCountry('Kenya (Auto)');
        return;
      }

      const isUK = timeZone.includes('London') || languages.some((l) => l.toLowerCase().includes('en-gb'));
      if (isUK) {
        setCurrencyState('GBP');
        setDetectedCountry('United Kingdom (Auto)');
        return;
      }

      const isEurope = timeZone.includes('Europe');
      if (isEurope) {
        setCurrencyState('EUR');
        setDetectedCountry('Europe (Auto)');
        return;
      }

      // Default to USD for Americas / international
      setCurrencyState('USD');
      setDetectedCountry('International (USD)');
    } catch {
      // Fallback to KES for Zeupreme Deli's home base
      setCurrencyState('KES');
      setDetectedCountry('Nairobi');
    }

    // 3. Optional asynchronous IP geolocation enhancement
    const detectViaIp = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.country_code) {
          const cc = data.country_code.toUpperCase();
          if (cc === 'KE') {
            setCurrencyState('KES');
            setDetectedCountry(`Kenya · ${data.city || 'Nairobi'}`);
          } else if (cc === 'US') {
            setCurrencyState('USD');
            setDetectedCountry(`United States`);
          } else if (cc === 'GB') {
            setCurrencyState('GBP');
            setDetectedCountry(`United Kingdom`);
          } else if (['FR', 'DE', 'IT', 'ES', 'NL', 'BE'].includes(cc)) {
            setCurrencyState('EUR');
            setDetectedCountry(`Europe (${cc})`);
          }
        }
      } catch {
        // Quiet fallback to timezone detection
      }
    };

    detectViaIp();
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    setIsAutoDetected(false);
    localStorage.setItem('zeupreme_currency_preference', code);
  };

  const formatPrice = (amountInUSD: number): string => {
    const config = CURRENCIES[currency];
    const converted = amountInUSD * config.rateFromUSD;

    if (config.decimalPlaces === 0) {
      // Round to nearest 10 shillings for clean restaurant pricing (e.g., 1,690)
      const rounded = Math.round(converted / 10) * 10;
      return `${config.symbol}${rounded.toLocaleString()}`;
    }

    return `${config.symbol}${converted.toFixed(config.decimalPlaces)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        detectedCountry,
        isAutoDetected,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
