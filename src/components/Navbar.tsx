import React, { useState } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, Clock, MapPin } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencySwitcher } from './CurrencySwitcher';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  hasActiveOrder: boolean;
  onOpenTracker: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  activeSection,
  onNavigate,
  hasActiveOrder,
  onOpenTracker,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'specialties', label: 'Specialties' },
    { id: 'offers', label: 'Current Offers' },
    { id: 'menu', label: 'Full Menu' },
    { id: 'location', label: 'Find Us' },
  ];

  const { formatPrice } = useCurrency();

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#FA7D09]/15 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, single line */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('hero')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-[#161E1A] group-hover:text-[#FA7D09] transition-colors whitespace-nowrap">
                <span className="text-[#FA7D09]">Zeupreme</span> Deli
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono tracking-widest text-[#FA7D09] font-bold border-l border-[#161E1A]/20 pl-2 uppercase">
                Westlands · Nairobi
              </span>
            </div>
            <p className="text-[11px] text-[#5A635B] hidden md:block font-medium">
              Where Flavor Meets Passion
            </p>
          </button>
        </div>

        {/* Zone 2: 4 nav links, 1-2 word labels, single-line */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-[#2F3A33]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 relative py-2 ${
                  isActive
                    ? 'text-[#FA7D09] font-bold'
                    : 'text-[#4A554E] hover:text-[#FA7D09]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FA7D09] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (Cart & active order tracker + Currency Switcher) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Automatic Location-Based Currency Switcher */}
          <CurrencySwitcher />

          {hasActiveOrder && (
            <button
              onClick={onOpenTracker}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#161E1A] bg-[#FFE8D6] hover:bg-[#FFDCC2] rounded-lg transition-colors whitespace-nowrap shrink-0 border border-[#FA7D09]/30"
            >
              <Clock className="w-3.5 h-3.5 text-[#FA7D09]" />
              <span>Track Live Order</span>
            </button>
          )}

          <button
            onClick={onOpenCart}
            aria-label={`View shopping cart with ${cartCount} items`}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-white bg-[#FA7D09] hover:bg-[#E06700] rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0 hover:shadow"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#161E1A] text-white text-[10px] font-mono flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </div>
            <span>Cart</span>
            {cartTotal > 0 && (
              <span className="font-mono text-xs text-white/90 border-l border-white/30 pl-2">
                {formatPrice(cartTotal)}
              </span>
            )}
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#161E1A] hover:bg-[#FFE8D6] rounded-lg focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#FA7D09]/15 bg-[#FAF7F2] px-6 py-5 shadow-lg space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="text-left py-2 text-base font-semibold text-[#161E1A] hover:text-[#FA7D09] border-b border-[#161E1A]/5"
              >
                {link.label}
              </button>
            ))}
          </div>

          {hasActiveOrder && (
            <button
              onClick={() => {
                onOpenTracker();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-[#161E1A] bg-[#FFE8D6] rounded-lg"
            >
              <Clock className="w-4 h-4 text-[#FA7D09]" />
              Track Active Kitchen Order
            </button>
          )}

          <div className="pt-2 text-xs text-[#5A635B] flex flex-col gap-1 border-t border-[#FA7D09]/10">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FA7D09]" /> 123 Flavor Street, Westlands, Nairobi
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FA7D09]" /> Mon-Sat: 10am - 10pm · Sun: 11am - 8pm
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
