import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useCurrency, CURRENCIES, CurrencyCode } from '../context/CurrencyContext';

export const CurrencySwitcher: React.FC = () => {
  const { currency, setCurrency, detectedCountry, isAutoDetected } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentConfig = CURRENCIES[currency];

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#161E1A] bg-[#FAF7F2] hover:bg-[#FFE8D6] border border-[#FA7D09]/20 transition-colors cursor-pointer"
        title={`Current Currency: ${currentConfig.label} (${detectedCountry})`}
        aria-label="Change currency"
      >
        <span className="text-sm">{currentConfig.flag}</span>
        <span className="font-mono font-bold text-[#FA7D09]">{currentConfig.symbol.trim()}</span>
        <ChevronDown className="w-3.5 h-3.5 text-[#5A635B]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-[#FA7D09]/20 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] text-[#5A635B] flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-[#FA7D09]" />
              <span>Location Currency</span>
            </span>
            {isAutoDetected && (
              <span className="text-[#FA7D09] font-mono font-semibold">Auto</span>
            )}
          </div>

          <div className="py-1">
            {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
              const cfg = CURRENCIES[code];
              const isSelected = currency === code;

              return (
                <button
                  key={code}
                  onClick={() => {
                    setCurrency(code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors text-left cursor-pointer ${
                    isSelected ? 'bg-[#FFE8D6]/60 text-[#FA7D09] font-bold' : 'text-[#161E1A] hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{cfg.flag}</span>
                    <span>{cfg.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#FA7D09]" />}
                </button>
              );
            })}
          </div>

          <div className="px-3 pt-1.5 border-t border-slate-100 text-[10px] text-[#8A958E]">
            Detected: {detectedCountry}
          </div>
        </div>
      )}
    </div>
  );
};
