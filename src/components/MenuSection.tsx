import React, { useState } from 'react';
import { Search, Plus, Sparkles, Tag, Flame, Clock } from 'lucide-react';
import { MenuItem, MenuCategory, CartItem } from '../types/deli';
import { ZEUPREME_SPECIALTIES, CURRENT_OFFERS, DELI_MENU_ITEMS } from '../data/deliMenu';
import { useCurrency } from '../context/CurrencyContext';

interface MenuSectionProps {
  onSelectItem: (item: MenuItem) => void;
  onQuickAdd: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  onSelectItem,
  onQuickAdd,
}) => {
  const { formatPrice } = useCurrency();
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: MenuCategory; label: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'specialties', label: 'Our Specialties' },
    { id: 'current_offers', label: 'Current Offers' },
    { id: 'signature_sandwiches', label: 'Sandwiches & Deli' },
    { id: 'sides_drinks', label: 'Sides & Craft Drinks' },
  ];

  const filteredItems = DELI_MENU_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dietaryTags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-[#FAF7F2] text-[#161E1A] space-y-24 py-16">
      {/* ---------------- 1. OUR SPECIALTIES SECTION ---------------- */}
      <section id="specialties" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase text-[#FA7D09] mb-2">
            <span>Crowd Favorites</span>
            <span aria-hidden="true">·</span>
            <span>Crafted Daily</span>
            <span aria-hidden="true">·</span>
            <span>Westlands Sensation</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#161E1A]">
            Our Specialties
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#5A635B]">
            Handcrafted with bold flavors, high-grade ingredients, and our signature 24-hour recipes.
          </p>
        </div>

        {/* 3-Column Grid for Specialties (Matching original project cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ZEUPREME_SPECIALTIES.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col bg-white rounded-2xl border border-[#FA7D09]/15 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div 
                onClick={() => onSelectItem(item)}
                className="relative aspect-4/3 w-full bg-[#161E1A] overflow-hidden cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 
                    onClick={() => onSelectItem(item)}
                    className="font-serif text-xl font-black text-[#FA7D09] uppercase tracking-wide cursor-pointer hover:underline"
                  >
                    {item.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#5A635B] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Price and Orange Add to Cart Button */}
                <div className="mt-6 pt-4 border-t border-[#161E1A]/10 flex items-center justify-between">
                  <span className="font-mono text-xl font-black text-[#161E1A] tabular-nums">
                    {formatPrice(item.price)}
                  </span>

                  <button
                    onClick={() => onQuickAdd(item)}
                    className="px-5 py-2.5 bg-[#FA7D09] hover:bg-[#E06700] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer hover:scale-105"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- 2. CURRENT OFFERS SECTION ---------------- */}
      <section id="offers" className="w-full py-16 bg-[#F3EDE2] border-y border-[#FA7D09]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-serif text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#FA7D09]">
              Current Offers
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#5A635B]">
              Limited time deals — grab them while they last!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CURRENT_OFFERS.map((offer) => (
              <div
                key={offer.id}
                className="group flex flex-col bg-white rounded-2xl border border-[#FA7D09]/15 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
              >
                {/* Badge (HOT, NEW, 30% OFF) */}
                {offer.badge && (
                  <div className="absolute top-3 right-3 z-10 bg-[#E02424] text-white text-[11px] font-bold font-mono uppercase px-2.5 py-1 rounded-full shadow-md">
                    {offer.badge}
                  </div>
                )}

                {/* Offer Image */}
                <div 
                  onClick={() => onSelectItem(offer)}
                  className="relative aspect-4/3 w-full bg-[#161E1A] overflow-hidden cursor-pointer"
                >
                  <img
                    src={offer.image}
                    alt={offer.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />
                </div>

                {/* Offer Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 
                      onClick={() => onSelectItem(offer)}
                      className="font-serif text-xl font-black text-[#161E1A] group-hover:text-[#FA7D09] transition-colors cursor-pointer"
                    >
                      {offer.name}
                    </h3>
                    <p className="text-xs text-[#FA7D09] font-bold mt-1">
                      {offer.tagline}
                    </p>
                    <p className="mt-2 text-xs text-[#5A635B] leading-relaxed">
                      {offer.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#161E1A]/10 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xl font-black text-[#FA7D09] tabular-nums">
                        {formatPrice(offer.price)}
                      </span>
                      {offer.originalPrice && (
                        <span className="font-mono text-xs text-[#8A958E] line-through tabular-nums">
                          {formatPrice(offer.originalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onQuickAdd(offer)}
                      className="px-5 py-2.5 bg-[#FA7D09] hover:bg-[#E06700] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer hover:scale-105"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 3. FULL MENU & FILTER SECTION ---------------- */}
      <section id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-[#161E1A]/10 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#FA7D09] mb-2">
              <span>Kitchen Catalog</span>
              <span aria-hidden="true">·</span>
              <span>Online Ordering</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-black tracking-tight text-[#161E1A]">
              Full Zeupreme Menu
            </h2>
            <p className="mt-1 text-sm text-[#5A635B]">
              Order fried chicken, street tacos, artisan pizzas, and heritage pastrami delivered piping hot.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A857E]" />
            <input
              type="text"
              placeholder="Search chicken, tacos, pizza..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#FA7D09]/20 rounded-xl text-[#161E1A] placeholder-[#8A958E] focus:outline-none focus:border-[#FA7D09] shadow-2xs"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#FA7D09] text-white shadow-sm font-bold'
                    : 'bg-white text-[#4A554E] hover:text-[#FA7D09] hover:bg-[#FFE8D6]/30 border border-[#161E1A]/10'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Filtered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col bg-white rounded-2xl border border-[#161E1A]/10 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div 
                onClick={() => onSelectItem(item)}
                className="relative aspect-4/3 w-full bg-[#161E1A] overflow-hidden cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#FA7D09]" />
                    {item.prepTime}
                  </span>
                  <span className="font-mono tabular-nums text-[#FAF7F2] font-semibold">
                    {item.calories} kcal
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#7A857E] mb-2 font-medium">
                    {item.dietaryTags.map((tag, idx) => (
                      <React.Fragment key={tag}>
                        {idx > 0 && <span aria-hidden="true">·</span>}
                        <span>{tag}</span>
                      </React.Fragment>
                    ))}
                  </div>

                  <h3 
                    onClick={() => onSelectItem(item)}
                    className="font-serif text-lg font-bold text-[#161E1A] group-hover:text-[#FA7D09] transition-colors cursor-pointer"
                  >
                    {item.name}
                  </h3>

                  <p className="mt-2 text-xs text-[#5A635B] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#161E1A]/10 flex items-center justify-between gap-3">
                  <span className="font-mono text-lg font-bold text-[#161E1A] tabular-nums">
                    {formatPrice(item.price)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectItem(item)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#161E1A] bg-[#FAF7F2] hover:bg-[#FFE8D6] rounded-lg border border-[#161E1A]/15 transition-colors cursor-pointer"
                    >
                      Customize
                    </button>

                    <button
                      onClick={() => onQuickAdd(item)}
                      className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold text-white bg-[#FA7D09] hover:bg-[#E06700] rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
