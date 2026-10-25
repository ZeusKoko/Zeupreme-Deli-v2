import React, { useState } from 'react';
import { X, Plus, Minus, Check, Flame, ShoppingBag, Sparkles } from 'lucide-react';
import { MenuItem, BreadOption, IngredientModifier, CartItem } from '../types/deli';

interface ItemCustomizerModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (cartItem: CartItem) => void;
}

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  if (!item) return null;

  const [selectedBread, setSelectedBread] = useState<BreadOption | undefined>(
    item.breadOptions && item.breadOptions.length > 0 ? item.breadOptions[0] : undefined
  );
  const [toastLevel, setToastLevel] = useState('Golden Pressed & Grilled');
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  const toggleModifier = (modId: string) => {
    setSelectedModifiers((prev) =>
      prev.includes(modId) ? prev.filter((id) => id !== modId) : [...prev, modId]
    );
  };

  // Price Calculation
  const breadDelta = selectedBread ? selectedBread.priceDelta : 0;
  const modifiersDelta = (item.availableModifiers || [])
    .filter((mod) => selectedModifiers.includes(mod.id))
    .reduce((sum, mod) => sum + mod.priceDelta, 0);
  const unitPrice = item.price + breadDelta + modifiersDelta;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    const modNames = (item.availableModifiers || [])
      .filter((m) => selectedModifiers.includes(m.id))
      .map((m) => m.name);

    const cartItem: CartItem = {
      cartId: `${item.id}-${Date.now()}`,
      menuItemId: item.id,
      name: item.name,
      price: unitPrice,
      quantity,
      image: item.image,
      selectedBread: selectedBread ? selectedBread.name : undefined,
      toastLevel: item.breadOptions ? toastLevel : undefined,
      selectedModifiers: modNames,
      specialInstructions: specialInstructions.trim() || undefined,
    };

    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl shadow-2xl overflow-hidden border border-[#1E3A2F]/15 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header with Food Picture */}
        <div className="relative h-48 sm:h-56 w-full bg-[#161E1A] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1F18] via-[#0E1F18]/50 to-transparent" />
          
          <button
            onClick={onClose}
            aria-label="Close customizer"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#E69D45] uppercase tracking-wider mb-1">
              <span>{item.prepTime} Prep</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{item.calories} kcal</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FAF7F2]">
              {item.name}
            </h3>
          </div>
        </div>

        {/* Modal Body / Customization Form */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-[#4A554E] leading-relaxed">
            {item.description}
          </p>

          {/* Bread Choice */}
          {item.breadOptions && item.breadOptions.length > 0 && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#1E3A2F] uppercase tracking-wider">
                1. Select Hearth Bread
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.breadOptions.map((bread) => {
                  const isSelected = selectedBread?.id === bread.id;
                  return (
                    <button
                      key={bread.id}
                      onClick={() => setSelectedBread(bread)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all text-left ${
                        isSelected
                          ? 'border-[#1E3A2F] bg-[#1E3A2F]/5 text-[#1E3A2F] font-semibold'
                          : 'border-[#1E3A2F]/15 hover:border-[#1E3A2F]/40 text-[#4A554E] bg-white'
                      }`}
                    >
                      <span>{bread.name}</span>
                      <span className="font-mono text-[#D97706]">
                        {bread.priceDelta > 0 ? `+$${bread.priceDelta.toFixed(2)}` : 'Included'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Toasting Option */}
          {item.breadOptions && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#1E3A2F] uppercase tracking-wider">
                2. Toasting & Heat
              </label>
              <div className="flex flex-wrap gap-2">
                {['Golden Pressed & Grilled', 'Warm Hearth Toast', 'Fresh Untoasted'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setToastLevel(option)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      toastLevel === option
                        ? 'bg-[#1E3A2F] border-[#1E3A2F] text-white'
                        : 'bg-white border-[#1E3A2F]/15 text-[#4A554E] hover:border-[#1E3A2F]/40'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Available Modifiers */}
          {item.availableModifiers && item.availableModifiers.length > 0 && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-[#1E3A2F] uppercase tracking-wider">
                3. Artisanal Add-ons & Spreads
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.availableModifiers.map((mod) => {
                  const isChecked = selectedModifiers.includes(mod.id);
                  return (
                    <button
                      key={mod.id}
                      onClick={() => toggleModifier(mod.id)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all text-left ${
                        isChecked
                          ? 'bg-[#E8DCC4]/50 border-[#D97706] text-[#1E3A2F] font-medium'
                          : 'bg-white border-[#1E3A2F]/10 text-[#5A635B] hover:border-[#1E3A2F]/30'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-[#D97706] border-[#D97706] text-white' : 'border-[#1E3A2F]/30'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{mod.name}</span>
                      </div>
                      <span className="font-mono text-[#D97706]">
                        {mod.priceDelta > 0 ? `+$${mod.priceDelta.toFixed(2)}` : 'Free'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Kitchen Instructions */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#1E3A2F] uppercase tracking-wider">
              Special Kitchen Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Cut diagonally in half, extra spicy mustard on the side"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#1E3A2F]/20 rounded-lg text-[#1E3A2F] placeholder-[#8A958E] focus:outline-none focus:border-[#1E3A2F]"
            />
          </div>
        </div>

        {/* Modal Footer with Quantity and Add Button */}
        <div className="p-4 sm:p-6 bg-[#F3EDE2] border-t border-[#1E3A2F]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-[#1E3A2F]/15">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-1 text-[#1E3A2F] hover:bg-[#FAF7F2] rounded disabled:opacity-30 cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono text-sm font-bold w-6 text-center text-[#1E3A2F]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 text-[#1E3A2F] hover:bg-[#FAF7F2] rounded cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Total & Confirm Button */}
          <button
            onClick={handleConfirm}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-[#1E3A2F] hover:bg-[#162B23] text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#E69D45]" />
            <span>Add {quantity} to Order · ${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
