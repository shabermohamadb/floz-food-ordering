import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const MobileCartBar = () => {
  const { itemCount, subtotal, setIsCartOpen } = useCart();

  if (itemCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="fixed inset-x-3 md:hidden z-35 pointer-events-auto"
        style={{ bottom: 'calc(4rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          onClick={() => setIsCartOpen(true)}
          className="w-full py-3 px-4 bg-forest-900 hover:bg-forest-800 active:bg-forest-950 text-cream-50 rounded-xl font-bold text-xs flex items-center justify-between shadow-xl border border-forest-800/80 transition-all cursor-pointer"
        >
          {/* Left: Item Count & Preview */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-cream-100" />
              <span className="absolute -top-2 -right-2.5 bg-terracotta-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold shadow-xs">
                {itemCount}
              </span>
            </div>
            <div className="text-left">
              <span className="block text-xs font-extrabold leading-tight">
                {itemCount} {itemCount === 1 ? 'item added' : 'items added'}
              </span>
              <span className="text-[10px] text-cream-200 font-medium">
                Tap to review order
              </span>
            </div>
          </div>

          {/* Right: Subtotal & Action */}
          <div className="flex items-center gap-2 font-extrabold">
            <span className="text-sm tabular-nums text-white">₹{subtotal}</span>
            <div className="w-6 h-6 rounded-full bg-forest-800 flex items-center justify-center">
              <ArrowRight className="w-3.5 h-3.5 text-cream-100" />
            </div>
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
