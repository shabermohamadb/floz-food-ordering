import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, UtensilsCrossed, AlertCircle, Check, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const MenuItemCard = ({ item }) => {
  const { addToCart, updateQuantity, getItemQuantity, setSelectedDetailItem } = useCart();
  const quantity = getItemQuantity(item.id);
  const [imageError, setImageError] = useState(false);
  const [isJustAdded, setIsJustAdded] = useState(false);

  const isAvailable = item.isAvailable !== false;
  const discountPercent =
    item.originalPrice && item.originalPrice > item.price
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : 0;

  const handleAddClick = (e) => {
    e.stopPropagation();
    addToCart(item);
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 800);
  };

  const handleUpdateQty = (e, newQty) => {
    e.stopPropagation();
    updateQuantity(item.id, newQty);
  };

  const handleOpenDetail = () => {
    setSelectedDetailItem(item);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE LAYOUT (Zomato-Inspired Horizontal Row: < sm)                    */}
      {/* ========================================================================= */}
      <motion.article
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={`sm:hidden bg-white border rounded-xl p-3.5 flex items-start justify-between gap-3 shadow-2xs hover:shadow-xs transition-shadow text-left ${
          isAvailable ? 'border-cream-200' : 'border-cream-200 opacity-70'
        }`}
      >
        {/* Left: Dish Information */}
        <div className="flex-1 min-w-0 pr-1 cursor-pointer" onClick={handleOpenDetail}>
          {/* Dietary Marker & Badges */}
          <div className="flex items-center gap-1.5 mb-1">
            <div
              className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 ${
                item.isVeg ? 'border-green-600' : 'border-red-700'
              }`}
              title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-700'}`} />
            </div>

            {item.isBestseller && (
              <span className="text-[10px] font-bold text-terracotta-600 uppercase tracking-tight flex items-center gap-0.5">
                <Flame className="w-3 h-3" />
                <span>Bestseller</span>
              </span>
            )}
          </div>

          {/* Dish Name */}
          <h3 className="font-heading text-sm font-bold text-forest-950 leading-snug line-clamp-2 mb-1">
            {item.name}
          </h3>

          {/* Price & Discounts */}
          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className="font-sans font-extrabold text-sm text-forest-950 tabular-nums">
              ₹{item.price}
            </span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-[11px] text-charcoal-400 line-through tabular-nums">
                ₹{item.originalPrice}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-[10px] font-extrabold text-terracotta-600 bg-terracotta-50 px-1 py-0.2 rounded border border-terracotta-200/50">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-[11px] text-charcoal-600 line-clamp-2 leading-relaxed font-normal mb-1">
            {item.description}
          </p>

          <span className="text-[10px] font-medium text-charcoal-400">
            {item.categoryLabel}
          </span>
        </div>

        {/* Right: Square Photo with Overlapping + ADD Button */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div
            onClick={handleOpenDetail}
            className="w-24 h-24 rounded-xl bg-cream-100 overflow-hidden cursor-pointer border border-cream-200/90 relative"
          >
            {!imageError ? (
              <img
                src={item.image}
                alt={item.name}
                onError={() => setImageError(true)}
                className={`w-full h-full object-cover ${!isAvailable ? 'grayscale-[40%]' : ''}`}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-cream-200 text-charcoal-500 text-center">
                <UtensilsCrossed className="w-6 h-6 text-forest-700/50" />
              </div>
            )}

            {!isAvailable && (
              <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-xs flex items-center justify-center p-1 text-center">
                <span className="text-[9px] font-bold text-white uppercase">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Overlapping ADD / Stepper Button */}
          <div className="-mt-3.5 z-10 w-20">
            {!isAvailable ? (
              <span className="block text-center text-[10px] font-semibold text-charcoal-400 bg-cream-100 py-1 rounded-md border border-cream-200">
                Unavailable
              </span>
            ) : quantity === 0 ? (
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={handleAddClick}
                aria-label={`Add ${item.name} to cart`}
                className={`w-full py-1.5 rounded-lg font-extrabold text-xs transition-all shadow-xs border flex items-center justify-center gap-1 ${
                  isJustAdded
                    ? 'bg-green-700 text-white border-green-700'
                    : 'bg-white hover:bg-forest-900 text-forest-950 hover:text-white border-forest-800/80'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isJustAdded ? (
                    <motion.span key="added" initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center gap-0.5">
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Added</span>
                    </motion.span>
                  ) : (
                    <span className="flex items-center gap-0.5">
                      <Plus className="w-3.5 h-3.5 text-terracotta-500 font-black" />
                      <span>ADD</span>
                    </span>
                  )}
                </AnimatePresence>
              </motion.button>
            ) : (
              <div className="flex items-center justify-between bg-forest-900 text-cream-50 rounded-lg p-0.5 shadow-sm border border-forest-800">
                <button
                  type="button"
                  onClick={(e) => handleUpdateQty(e, quantity - 1)}
                  className="w-6 h-6 flex items-center justify-center text-cream-200 hover:text-white"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-bold tabular-nums text-white px-1">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleUpdateQty(e, quantity + 1)}
                  className="w-6 h-6 flex items-center justify-center text-cream-200 hover:text-white"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.article>

      {/* ========================================================================= */}
      {/* 2. DESKTOP / TABLET LAYOUT (Grid Card: >= sm)                             */}
      {/* ========================================================================= */}
      <motion.article
        layout
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        whileHover={isAvailable ? { y: -3 } : {}}
        onClick={handleOpenDetail}
        className={`hidden sm:flex bg-white border rounded-xl overflow-hidden flex-col justify-between transition-shadow duration-300 hover:shadow-md cursor-pointer text-left ${
          isAvailable ? 'border-cream-300 hover:border-forest-700/40' : 'border-cream-200 opacity-75'
        }`}
      >
        {/* Product Image Container */}
        <div className="relative aspect-[4/3] bg-cream-100 overflow-hidden border-b border-cream-200 group">
          {!imageError ? (
            <img
              src={item.image}
              alt={item.name}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
                !isAvailable ? 'grayscale-[40%]' : ''
              }`}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-cream-200 text-charcoal-500 text-center">
              <UtensilsCrossed className="w-8 h-8 text-forest-700/50 mb-1" />
              <span className="text-xs font-semibold text-charcoal-700">{item.name}</span>
            </div>
          )}

          {/* Veg / Non-Veg Indicator */}
          <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm p-1 rounded shadow-xs" title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}>
            <div className={`w-3.5 h-3.5 border flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-700'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-700'}`} />
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            {item.isBestseller && (
              <span className="bg-forest-900 text-cream-50 font-semibold text-[10px] px-2 py-0.5 rounded tracking-wide uppercase shadow-xs">
                Popular
              </span>
            )}
            {discountPercent > 0 && (
              <span className="bg-terracotta-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow-xs tracking-tight">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {!isAvailable && (
            <div className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-charcoal-900 text-cream-100 font-semibold text-xs px-3 py-1 rounded shadow-sm flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-cream-300" />
                <span>Out of Stock</span>
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-heading text-sm sm:text-base font-bold text-forest-950 leading-snug group-hover:text-forest-800 transition-colors">
                {item.name}
              </h3>
              
              <div className="text-right shrink-0">
                <span className="font-sans font-bold text-base sm:text-lg text-forest-900 tabular-nums">
                  ₹{item.price}
                </span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="block text-[11px] font-normal text-charcoal-400 line-through tabular-nums">
                    ₹{item.originalPrice}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed font-normal">
              {item.description}
            </p>
          </div>

          {/* Controls */}
          <div className="pt-2.5 border-t border-cream-200/80 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
            <span className="text-[11px] text-charcoal-500 font-medium">
              {item.categoryLabel}
            </span>

            {!isAvailable ? (
              <span className="text-xs font-medium text-charcoal-400 py-1 px-2 bg-cream-100 rounded">
                Unavailable
              </span>
            ) : quantity === 0 ? (
              <motion.button
                whileTap={{ scale: 0.94 }}
                onClick={handleAddClick}
                aria-label={`Add ${item.name} to cart`}
                className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded font-semibold text-xs transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-forest-700 ${
                  isJustAdded
                    ? 'bg-green-700 text-white'
                    : 'bg-forest-900 hover:bg-forest-800 text-cream-50'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isJustAdded ? (
                    <motion.span key="added" initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Added</span>
                    </motion.span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </span>
                  )}
                </AnimatePresence>
              </motion.button>
            ) : (
              <div className="inline-flex items-center bg-forest-900 text-cream-50 rounded border border-forest-800 overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={(e) => handleUpdateQty(e, quantity - 1)}
                  aria-label={`Decrease quantity of ${item.name}`}
                  className="px-2.5 py-1 hover:bg-forest-800 text-cream-100 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-xs font-bold tabular-nums text-white min-w-[1.5rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleUpdateQty(e, quantity + 1)}
                  aria-label={`Increase quantity of ${item.name}`}
                  className="px-2.5 py-1 hover:bg-forest-800 text-cream-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.article>
    </>
  );
};
