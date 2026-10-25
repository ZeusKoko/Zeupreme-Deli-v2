import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Flame, 
  PackageCheck, 
  MapPin, 
  Receipt,
  Phone,
  Sparkles,
  FastForward
} from 'lucide-react';
import { OrderRecord, OrderStage } from '../types/deli';

interface OrderTrackerModalProps {
  order: OrderRecord | null;
  onClose: () => void;
  onNewOrder: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  order,
  onClose,
  onNewOrder,
}) => {
  if (!order) return null;

  const [currentStage, setCurrentStage] = useState<OrderStage>(order.currentStage);
  const [minutesRemaining, setMinutesRemaining] = useState<number>(order.estimatedMinutes);

  const stages: { id: OrderStage; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'order_received',
      label: 'Order Confirmed',
      desc: 'Ticket printed at 123 Flavor St Westlands kitchen counter',
      icon: <Receipt className="w-5 h-5" />,
    },
    {
      id: 'kitchen_prep',
      label: 'Kitchen Craft & Fryer',
      desc: 'Chefs preparing 24-hr crispy chicken, street tacos & dough',
      icon: <ChefHat className="w-5 h-5" />,
    },
    {
      id: 'grilling_packing',
      label: 'Stone Oven & Basting',
      desc: 'Melting mozzarella, blistering crusts, and boxing hot orders',
      icon: <Flame className="w-5 h-5" />,
    },
    {
      id: 'ready_for_pickup',
      label: order.fulfillmentType === 'pickup' ? 'Ready at Westlands Counter!' : 'Out with Westlands Courier!',
      desc: order.fulfillmentType === 'pickup' 
        ? 'Packed hot with dipping sauces ready in our pickup bay' 
        : 'On the way to your address with thermal bag delivery',
      icon: <PackageCheck className="w-5 h-5" />,
    },
  ];

  const currentIdx = stages.findIndex((s) => s.id === currentStage);

  // Auto-progress kitchen simulation every 12 seconds
  useEffect(() => {
    if (currentStage === 'ready_for_pickup') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D97706', '#1E3A2F', '#E69D45', '#FAF7F2'],
      });
      return;
    }

    const timer = setInterval(() => {
      if (currentStage === 'order_received') {
        setCurrentStage('kitchen_prep');
        setMinutesRemaining((prev) => Math.max(1, prev - 4));
      } else if (currentStage === 'kitchen_prep') {
        setCurrentStage('grilling_packing');
        setMinutesRemaining((prev) => Math.max(1, prev - 5));
      } else if (currentStage === 'grilling_packing') {
        setCurrentStage('ready_for_pickup');
        setMinutesRemaining(0);
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [currentStage]);

  // Fast forward button for instant testing
  const advanceStage = () => {
    if (currentStage === 'order_received') {
      setCurrentStage('kitchen_prep');
      setMinutesRemaining((m) => Math.max(1, m - 4));
    } else if (currentStage === 'kitchen_prep') {
      setCurrentStage('grilling_packing');
      setMinutesRemaining((m) => Math.max(1, m - 5));
    } else if (currentStage === 'grilling_packing') {
      setCurrentStage('ready_for_pickup');
      setMinutesRemaining(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#1E3A2F]/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Strip */}
        <div className="bg-[#1E3A2F] text-[#FAF7F2] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E69D45] text-[#1E3A2F] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[#E69D45] font-semibold">
                  Live Kitchen Tracker
                </span>
                <span className="font-mono text-xs bg-black/30 px-2 py-0.5 rounded text-white">
                  #{order.orderId}
                </span>
              </div>
              <h2 className="font-serif text-2xl font-bold">
                {currentStage === 'ready_for_pickup' ? 'Order Complete!' : 'Kitchen in Motion'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close order tracker"
            className="p-2 text-[#D8E2DC] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Callout Banner */}
        <div className="p-6 bg-[#F3EDE2] border-b border-[#1E3A2F]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-[#5A635B] uppercase tracking-wider font-semibold">
              Estimated Completion
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-serif text-3xl font-bold text-[#1E3A2F]">
                {minutesRemaining === 0 ? 'Ready Now!' : `${minutesRemaining} Minutes`}
              </span>
              <span className="text-xs text-[#5A635B]">
                ({order.fulfillmentType === 'pickup' ? 'Counter Pickup' : 'Courier Dispatch'})
              </span>
            </div>
          </div>

          {currentStage !== 'ready_for_pickup' && (
            <button
              onClick={advanceStage}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1E3A2F] bg-white hover:bg-[#FAF7F2] rounded-lg border border-[#1E3A2F]/15 transition-colors cursor-pointer shadow-2xs"
              title="Fast forward simulation step"
            >
              <FastForward className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Speed Up Prep</span>
            </button>
          )}
        </div>

        {/* Live Timeline Steps */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#1E3A2F]/15">
            {stages.map((stage, idx) => {
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              const isFuture = idx > currentIdx;

              return (
                <div key={stage.id} className="relative flex items-start gap-4">
                  {/* Timeline node */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-0.5 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                      isPast
                        ? 'bg-[#1E3A2F] text-white shadow-2xs'
                        : isCurrent
                        ? 'bg-[#D97706] text-white ring-4 ring-[#D97706]/20 shadow-md'
                        : 'bg-white border-2 border-[#1E3A2F]/20 text-[#7A857E]'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <span className="scale-75">{stage.icon}</span>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <h4 className={`font-serif text-base font-bold ${
                      isCurrent ? 'text-[#1E3A2F]' : isPast ? 'text-[#3E4A43]' : 'text-[#8A958E]'
                    }`}>
                      {stage.label}
                    </h4>
                    <p className="text-xs text-[#5A635B] leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Customer & Receipt Details Box */}
          <div className="mt-8 bg-white p-5 rounded-xl border border-[#1E3A2F]/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E3A2F]/10 text-xs">
              <div>
                <span className="text-[#7A857E]">Customer:</span>{' '}
                <span className="font-semibold text-[#1E3A2F]">{order.customerName}</span>
              </div>
              <div>
                <span className="text-[#7A857E]">Phone:</span>{' '}
                <span className="font-mono text-[#1E3A2F]">{order.customerPhone}</span>
              </div>
            </div>

            {/* Items summary */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#1E3A2F] uppercase tracking-wider">
                Kitchen Items ({order.items.length})
              </span>
              <div className="space-y-1.5 text-xs text-[#4A554E]">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span>
                      {item.quantity}x {item.name}
                      {item.selectedBread && ` (${item.selectedBread})`}
                    </span>
                    <span className="font-mono tabular-nums font-medium text-[#1E3A2F]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-[#1E3A2F]/10 flex justify-between items-center text-sm font-bold text-[#1E3A2F]">
              <span>Total Paid</span>
              <span className="font-mono text-[#D97706] tabular-nums">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-[#F3EDE2] border-t border-[#1E3A2F]/10 flex items-center justify-between gap-4">
          <p className="text-xs text-[#5A635B]">
            Need changes? Call Westlands kitchen at{' '}
            <a href="tel:+254712345678" className="font-mono font-bold text-[#FA7D09] hover:underline">
              +254 712 345 678
            </a>
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#1E3A2F] hover:bg-[#162B23] text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Keep Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
