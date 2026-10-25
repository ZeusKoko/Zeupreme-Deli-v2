import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroVideo } from './components/HeroVideo';
import { MenuSection } from './components/MenuSection';
import { ItemCustomizerModal } from './components/ItemCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { DeliStorySection } from './components/DeliStorySection';
import { Footer } from './components/Footer';
import { MenuItem, CartItem, OrderRecord } from './types/deli';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zeupreme_deli_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeOrder, setActiveOrder] = useState<OrderRecord | null>(() => {
    try {
      const saved = localStorage.getItem('zeupreme_deli_active_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [customizerItem, setCustomizerItem] = useState<MenuItem | null>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Smooth entrance reveal
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('zeupreme_deli_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  // Save active order to local storage
  useEffect(() => {
    try {
      if (activeOrder) {
        localStorage.setItem('zeupreme_deli_active_order', JSON.stringify(activeOrder));
      } else {
        localStorage.removeItem('zeupreme_deli_active_order');
      }
    } catch {}
  }, [activeOrder]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Cart operations
  const handleAddToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) =>
          i.menuItemId === newItem.menuItemId &&
          i.selectedBread === newItem.selectedBread &&
          i.toastLevel === newItem.toastLevel &&
          JSON.stringify(i.selectedModifiers) === JSON.stringify(newItem.selectedModifiers) &&
          i.specialInstructions === newItem.specialInstructions
      );

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += newItem.quantity;
        return copy;
      }
      return [...prev, newItem];
    });

    showToast(`Added ${newItem.name} to your bag`);
  };

  const handleQuickAdd = (menuItem: MenuItem) => {
    const defaultBread = menuItem.breadOptions?.[0]?.name;
    const item: CartItem = {
      cartId: `${menuItem.id}-${Date.now()}`,
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
      image: menuItem.image,
      selectedBread: defaultBread,
      toastLevel: menuItem.breadOptions ? 'Fresh Hearth Baked' : undefined,
    };
    handleAddToCart(item);
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartId === cartId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (cartId: string) => {
    setCart((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePlaceOrder = (order: OrderRecord) => {
    setActiveOrder(order);
    setCart([]);
    setIsTrackerOpen(true);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#161E1A] flex flex-col font-sans selection:bg-[#FA7D09] selection:text-white">
      {/* Subtle Refined Entrance Curtain */}
      {isInitialLoading && (
        <div className="fixed inset-0 z-50 bg-[#161E1A] flex flex-col items-center justify-center transition-opacity duration-700 pointer-events-none">
          <div className="text-center space-y-3 animate-in fade-in zoom-in-95 duration-500">
            <span className="font-serif text-4xl sm:text-5xl font-black tracking-tight text-[#FAF7F2] uppercase">
              <span className="text-[#FA7D09]">ZEUPREME</span> DELI
            </span>
            <p className="text-xs uppercase tracking-widest text-[#FA7D09] font-mono">
              Where Flavor Meets Passion · Nairobi
            </p>
          </div>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        hasActiveOrder={Boolean(activeOrder)}
        onOpenTracker={() => setIsTrackerOpen(true)}
      />

      {/* Main Experience Stream */}
      <main className="flex-1">
        {/* Hero with Subtle Ambient Video and Supporting 3D Floating Ingredients Canvas */}
        <HeroVideo
          onOrderNow={() => handleNavigate('menu')}
          onViewMenu={() => handleNavigate('specialties')}
        />

        {/* Menu Section (Specialties, Current Offers, and Full Menu) */}
        <MenuSection
          onSelectItem={(item) => setCustomizerItem(item)}
          onQuickAdd={handleQuickAdd}
        />

        {/* Find Us (Westlands Nairobi) and Follow Us Sections */}
        <DeliStorySection />
      </main>

      {/* Original Project Footer */}
      <Footer />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161E1A] text-white px-4 py-3 rounded-xl shadow-xl border border-[#FA7D09]/30 flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <span className="w-2 h-2 rounded-full bg-[#FA7D09]" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-[#FA7D09] underline font-bold ml-1 cursor-pointer"
          >
            View Bag
          </button>
        </div>
      )}

      {/* Item Customizer Modal */}
      {customizerItem && (
        <ItemCustomizerModal
          item={customizerItem}
          onClose={() => setCustomizerItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Live Order Tracker Modal */}
      {isTrackerOpen && (
        <OrderTrackerModal
          order={activeOrder}
          onClose={() => setIsTrackerOpen(false)}
          onNewOrder={() => {
            setActiveOrder(null);
            setIsTrackerOpen(false);
          }}
        />
      )}
    </div>
  );
}
