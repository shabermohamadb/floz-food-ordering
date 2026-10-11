import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Check, UtensilsCrossed, AlertCircle, ShoppingBag, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FoodDetailBottomSheet = () => {
  const {
    selectedDetailItem,
    setSelectedDetailItem,
    addToCart,
    updateQuantity,
    getItemQuantity,
    setIsCartOpen
  } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [isJustAdded, setIsJustAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Sync quantity with existing cart quantity when item opens
  useEffect(() => {
    if (selectedDetailItem) {
      const currentInCart = getItemQuantity(selectedDetailItem.id);
      setQuantity(currentInCart > 0 ? currentInCart : 1);
      setIsJustAdded(false);
      setImageError(false);
    }
  }, [selectedDetailItem]);

  // Lock body scroll when bottom sheet is open
  useEffect(() => {
    if (selectedDetailItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedDetailItem]);

  if (!selectedDetailItem) return null;

  const isAvailable = selectedDetailItem.isAvailable !== false;
  const currentInCart = getItemQuantity(selectedDetailItem.id);
  const discountPercent =
    selectedDetailItem.originalPrice && selectedDetailItem.originalPrice > selectedDetailItem.price
      ? Math.round(((selectedDetailItem.originalPrice - selectedDetailItem.price) / selectedDetailItem.originalPrice) * 100)
      : 0;

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    if (!isAvailable) return;
    if (currentInCart > 0) {
      updateQuantity(selectedDetailItem.id, quantity);
    } else {
      addToCart(selectedDetailItem);
      if (quantity > 1) {
        updateQuantity(selectedDetailItem.id, quantity);
      }
    }
    setIsJustAdded(true);
    setTimeout(() => {
      setIsJustAdded(false);
      setSelectedDetailItem(null);
    }, 600);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label={selectedDetailItem.name}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-xs"
          onClick={() => setSelectedDetailItem(null)}
        />

        {/* Bottom Sheet Modal Container */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col border border-cream-200"
        >
          {/* Grab Handle for Mobile */}
          <div className="sm:hidden w-full pt-3 pb-1 flex justify-center bg-white cursor-pointer" onClick={() => setSelectedDetailItem(null)}>
            <div className="w-12 h-1.5 bg-cream-300 rounded-full" />
          </div>

          {/* Close Button */}
          <button
            onClick={() => setSelectedDetailItem(null)}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-cream-300 text-charcoal-700 hover:text-charcoal-950 flex items-center justify-center shadow-xs transition-colors focus:outline-none"
            aria-label="Close food details"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Food Image Banner */}
          <div className="relative aspect-[16/10] w-full bg-cream-100 overflow-hidden border-b border-cream-200 shrink-0">
            {!imageError ? (
              <img
                src={selectedDetailItem.image}
                alt={selectedDetailItem.name}
                onError={() => setImageError(true)}
                className={`w-full h-full object-cover ${!isAvailable ? 'grayscale-[40%]' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-cream-200 text-charcoal-500">
                <UtensilsCrossed className="w-10 h-10 text-forest-700/40 mb-2" />
                <span className="text-xs font-semibold text-charcoal-700">{selectedDetailItem.name}</span>
              </div>
            )}

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Dietary Marker & Category Badge */}
            <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
              <div
                className="bg-white/95 backdrop-blur-sm p-1 rounded shadow-xs"
                title={selectedDetailItem.isVeg ? "Vegetarian" : "Non-Vegetarian"}
              >
                <div className={`w-3.5 h-3.5 border flex items-center justify-center ${selectedDetailItem.isVeg ? 'border-green-600' : 'border-red-700'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${selectedDetailItem.isVeg ? 'bg-green-600' : 'bg-red-700'}`} />
                </div>
              </div>

              {selectedDetailItem.isBestseller && (
                <span className="bg-forest-900 text-cream-50 font-bold text-[10px] px-2 py-0.5 rounded tracking-wide uppercase shadow-xs flex items-center gap-1">
                  <Flame className="w-3 h-3 text-terracotta-400" />
                  <span>Bestseller</span>
                </span>
              )}
            </div>

            {/* Discount Badge */}
            {discountPercent > 0 && (
              <div className="absolute bottom-3 left-3.5">
                <span className="bg-terracotta-500 text-white font-extrabold text-[11px] px-2 py-0.5 rounded shadow-xs">
                  {discountPercent}% OFF
                </span>
              </div>
            )}

            {/* Out of Stock Overlay */}
            {!isAvailable && (
              <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-charcoal-900 text-cream-100 font-semibold text-xs px-3 py-1.5 rounded shadow-sm flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-cream-300" />
                  <span>Currently Out of Stock</span>
                </span>
              </div>
            )}
          </div>

          {/* Dish Information Content */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4 text-left">
            <div>
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <h3 className="font-heading text-lg sm:text-xl font-extrabold text-forest-950 leading-tight">
                  {selectedDetailItem.name}
                </h3>
              </div>

              <div className="flex items-center gap-2 mb-2.5">
                <span className="font-sans font-extrabold text-xl sm:text-2xl text-forest-950 tabular-nums">
                  ₹{selectedDetailItem.price}
                </span>
                {selectedDetailItem.originalPrice && selectedDetailItem.originalPrice > selectedDetailItem.price && (
                  <span className="text-sm font-medium text-charcoal-400 line-through tabular-nums">
                    ₹{selectedDetailItem.originalPrice}
                  </span>
                )}
                <span className="text-[11px] font-medium text-charcoal-500 bg-cream-100 px-2 py-0.5 rounded border border-cream-200">
                  {selectedDetailItem.categoryLabel || 'Kitchen Special'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-normal">
                {selectedDetailItem.description}
              </p>
            </div>

            {/* Preparation & Service Guarantee */}
            <div className="bg-cream-100/70 rounded-lg p-3 border border-cream-200/80 text-xs text-charcoal-700 space-y-1">
              <div className="font-semibold text-forest-950 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-forest-700" />
                <span>Prepared Fresh to Order</span>
              </div>
              <p className="text-[11px] text-charcoal-500">
                Official catalogue recipe with authentic seasonings and fast kitchen dispatch in Nagercoil.
              </p>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 bg-cream-50 border-t border-cream-200 flex items-center gap-3">
            {/* Quantity Stepper */}
            {isAvailable ? (
              <div className="flex items-center border border-cream-300 bg-white rounded-lg p-1 shadow-2xs shrink-0">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="w-9 h-9 flex items-center justify-center text-charcoal-700 hover:text-forest-950 hover:bg-cream-100 rounded transition-colors active:scale-95"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-forest-950 tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-9 h-9 flex items-center justify-center text-charcoal-700 hover:text-forest-950 hover:bg-cream-100 rounded transition-colors active:scale-95"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : null}

            {/* Primary Action Button */}
            {!isAvailable ? (
              <button
                disabled
                className="flex-1 py-3 px-4 bg-cream-200 text-charcoal-400 font-semibold text-xs rounded-lg cursor-not-allowed text-center"
              >
                Item Unavailable
              </button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-4 font-bold text-xs sm:text-sm rounded-lg flex items-center justify-between shadow-sm transition-all focus:outline-none ${
                  isJustAdded
                    ? 'bg-green-700 text-white'
                    : 'bg-forest-900 hover:bg-forest-800 active:bg-forest-950 text-cream-50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {isJustAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart</span>
                    </>
                  ) : currentInCart > 0 ? (
                    <>
                      <ShoppingBag className="w-4 h-4 text-cream-200" />
                      <span>Update in Cart</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </span>
                <span className="tabular-nums font-extrabold text-sm sm:text-base">
                  ₹{selectedDetailItem.price * quantity}
                </span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
