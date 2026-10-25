import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  MapPin, 
  CheckCircle2,
  Gift
} from 'lucide-react';
import { CartItem, OrderRecord } from '../types/deli';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: OrderRecord) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
}) => {
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>('pickup');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08875; // NYC sales tax
  const deliveryFee = fulfillmentType === 'delivery' ? (subtotal >= 40 ? 0 : 3.99) : 0;
  const total = subtotal + tax + deliveryFee;

  // Free Pickle Spear / House Jar Threshold ($35)
  const freeThreshold = 35;
  const progressToFree = Math.min(100, (subtotal / freeThreshold) * 100);
  const amountToFree = Math.max(0, freeThreshold - subtotal);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Please provide your name and phone number for order updates.');
      return;
    }
    if (fulfillmentType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMsg('Please enter your delivery address in Westlands or Nairobi.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    // Generate real tracked order record
    const newOrder: OrderRecord = {
      orderId: `ZEU-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      fulfillmentType,
      deliveryAddress: fulfillmentType === 'delivery' ? deliveryAddress.trim() : undefined,
      items: [...items],
      subtotal,
      tax,
      deliveryFee,
      total,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedMinutes: fulfillmentType === 'pickup' ? 15 : 30,
      currentStage: 'order_received',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onPlaceOrder(newOrder);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-lg bg-[#FAF7F2] h-full shadow-2xl flex flex-col justify-between border-l border-[#1E3A2F]/15 animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="p-6 bg-white border-b border-[#1E3A2F]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1E3A2F] text-[#FAF7F2] rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1E3A2F]">
                Your Deli Bag
              </h2>
              <p className="text-xs text-[#5A635B]">
                {items.length} {items.length === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close cart drawer"
            className="p-2 text-[#5A635B] hover:text-[#1E3A2F] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Perks Milestone Progress Bar */}
        <div className="bg-[#F3EDE2] px-6 py-3 border-b border-[#1E3A2F]/10">
          <div className="flex items-center justify-between text-xs text-[#1E3A2F] font-medium mb-1.5">
            <span className="flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-[#D97706]" />
              {amountToFree === 0 ? (
                <span className="font-semibold text-[#1E3A2F]">Free House Garlic Pickle Jar Unlocked!</span>
              ) : (
                <span>Add ${amountToFree.toFixed(2)} for Free House Pickle Jar</span>
              )}
            </span>
            <span className="font-mono text-[11px] text-[#7A857E]">{Math.round(progressToFree)}%</span>
          </div>
          <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#D97706] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressToFree}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#5A635B]">
              <div className="w-16 h-16 rounded-full bg-[#EFE8DA] flex items-center justify-center text-[#1E3A2F] mb-4">
                <ShoppingBag className="w-8 h-8 opacity-40" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1E3A2F]">Your bag is hungry</h3>
              <p className="text-xs text-[#7A857E] mt-1 max-w-xs">
                Browse our slow-cured pastramis and hot grilled paninis, or build a one-of-a-kind creation in the 3D Studio.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartId}
                className="bg-white p-4 rounded-xl border border-[#1E3A2F]/10 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-base font-bold text-[#1E3A2F]">
                        {item.name}
                      </h4>
                      {item.isCustom3D && (
                        <span className="text-[10px] bg-[#1E3A2F] text-[#E69D45] font-mono px-1.5 py-0.5 rounded font-semibold">
                          3D Custom Build
                        </span>
                      )}
                    </div>

                    {/* Selected Options / Modifiers */}
                    <div className="text-xs text-[#5A635B] mt-1 space-y-0.5">
                      {item.selectedBread && (
                        <p><span className="text-[#1E3A2F] font-medium">Bread:</span> {item.selectedBread}</p>
                      )}
                      {item.toastLevel && (
                        <p><span className="text-[#1E3A2F] font-medium">Toast:</span> {item.toastLevel}</p>
                      )}
                      {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                        <p><span className="text-[#1E3A2F] font-medium">Add-ons:</span> {item.selectedModifiers.join(', ')}</p>
                      )}
                      {item.custom3DDetails && (
                        <p className="text-[11px] text-[#7A857E]">
                          {item.custom3DDetails.layersSummary.join(' · ')}
                        </p>
                      )}
                      {item.specialInstructions && (
                        <p className="italic text-[11px] text-[#D97706]">
                          "{item.specialInstructions}"
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="font-mono text-sm font-bold text-[#1E3A2F] tabular-nums shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Quantity and Delete Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-[#1E3A2F]/5">
                  <button
                    onClick={() => onRemoveItem(item.cartId)}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>

                  <div className="flex items-center gap-2 bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#1E3A2F]/10">
                    <button
                      onClick={() => onUpdateQuantity(item.cartId, -1)}
                      className="p-1 text-[#1E3A2F] hover:bg-white rounded cursor-pointer"
                      aria-label="Decrease item quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs font-bold w-5 text-center text-[#1E3A2F]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.cartId, 1)}
                      className="p-1 text-[#1E3A2F] hover:bg-white rounded cursor-pointer"
                      aria-label="Increase item quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout Panel */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-[#1E3A2F]/10 space-y-4">
            {/* Fulfillment Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#F3EDE2] rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setFulfillmentType('pickup')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  fulfillmentType === 'pickup'
                    ? 'bg-white text-[#1E3A2F] font-semibold shadow-2xs'
                    : 'text-[#5A635B] hover:text-[#1E3A2F]'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Counter Pickup (15m)</span>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('delivery')}
                className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  fulfillmentType === 'delivery'
                    ? 'bg-white text-[#1E3A2F] font-semibold shadow-2xs'
                    : 'text-[#5A635B] hover:text-[#1E3A2F]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Local Delivery (35m)</span>
              </button>
            </div>

            {/* Quick Customer Info Inputs */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="px-3 py-2 text-xs bg-[#FAF7F2] border border-[#1E3A2F]/15 rounded-lg text-[#1E3A2F] placeholder-[#8A958E] focus:outline-none focus:border-[#1E3A2F]"
                />
                <input
                  type="tel"
                  placeholder="Mobile Phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="px-3 py-2 text-xs bg-[#FAF7F2] border border-[#1E3A2F]/15 rounded-lg text-[#1E3A2F] placeholder-[#8A958E] focus:outline-none focus:border-[#1E3A2F]"
                />
              </div>

              {fulfillmentType === 'delivery' && (
                <input
                  type="text"
                  placeholder="Street Address, Building / Estate, Westlands, Nairobi"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#FA7D09]/20 rounded-lg text-[#161E1A] placeholder-[#8A958E] focus:outline-none focus:border-[#FA7D09]"
                />
              )}
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                {errorMsg}
              </p>
            )}

            {/* Subtotal & Totals Breakout */}
            <div className="space-y-1.5 text-xs text-[#5A635B] pt-2 border-t border-[#1E3A2F]/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>NYC Sales Tax (8.875%)</span>
                <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
              </div>
              {fulfillmentType === 'delivery' && (
                <div className="flex justify-between">
                  <span>Courier Delivery</span>
                  <span className="font-mono tabular-nums">
                    {deliveryFee === 0 ? 'Free (over $40)' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-[#1E3A2F] pt-1 border-t border-[#1E3A2F]/10">
                <span>Total Due</span>
                <span className="font-mono tabular-nums text-[#D97706]">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1E3A2F] hover:bg-[#162B23] text-white font-semibold rounded-xl text-sm shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Dispatching to Kitchen...</span>
              ) : (
                <>
                  <span>Place Order & Track Kitchen</span>
                  <ArrowRight className="w-4 h-4 text-[#E69D45]" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
