import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const MobileCartBar = () => {
  const { itemCount, subtotal, setIsCartOpen } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 p-3 sm:hidden bg-cream-50/90 backdrop-blur-md border-t border-cream-200 shadow-lg">
      <button
        onClick={() => setIsCartOpen(true)}
        className="w-full py-3 px-4 bg-forest-900 text-cream-50 rounded-md font-semibold text-xs flex items-center justify-between shadow-md active:bg-forest-950 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <ShoppingBag className="w-4 h-4 text-cream-100" />
            <span className="absolute -top-2 -right-2 bg-terracotta-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
              {itemCount}
            </span>
          </div>
          <span>View Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
        </div>

        <div className="flex items-center gap-1.5 font-bold tabular-nums">
          <span>₹{subtotal}</span>
          <ArrowRight className="w-3.5 h-3.5 text-cream-200" />
        </div>
      </button>
    </div>
  );
};
