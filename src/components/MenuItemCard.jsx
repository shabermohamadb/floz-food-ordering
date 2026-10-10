import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, UtensilsCrossed, CheckCircle2, AlertCircle, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const MenuItemCard = ({ item }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(item.id);
  const [imageError, setImageError] = useState(false);
  const [isJustAdded, setIsJustAdded] = useState(false);

  const isAvailable = item.isAvailable !== false;
  const discountPercent =
    item.originalPrice && item.originalPrice > item.price
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : 0;

  const handleAddClick = () => {
    addToCart(item);
    setIsJustAdded(true);
    setTimeout(() => setIsJustAdded(false), 900);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={isAvailable ? { y: -3 } : {}}
      className={`bg-white border rounded-lg overflow-hidden flex flex-col justify-between transition-shadow duration-300 hover:shadow-md ${
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

        {/* Veg / Non-Veg Standard Indian Dietary Marker */}
        <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm p-1 rounded shadow-xs" title={item.isVeg ? "Vegetarian" : "Non-Vegetarian"}>
          <div className={`w-3.5 h-3.5 border flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-700'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-700'}`} />
          </div>
        </div>

        {/* Discount & Popular Badges */}
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

        {/* Out of Stock Overlay Badge */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-charcoal-900 text-cream-100 font-semibold text-xs px-3 py-1 rounded shadow-sm flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-cream-300" />
              <span>Out of Stock</span>
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between text-left space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-heading text-sm sm:text-base font-bold text-forest-950 leading-snug group-hover:text-forest-800 transition-colors">
              {item.name}
            </h3>
            
            {/* Price block */}
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

        {/* Action Bar / Quantity Controls */}
        <div className="pt-2.5 border-t border-cream-200/80 flex items-center justify-between">
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
                  <motion.span
                    key="added"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Added</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ) : (
            <motion.div
              layout
              className="inline-flex items-center bg-forest-900 text-cream-50 rounded border border-forest-800 overflow-hidden shadow-xs"
            >
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => updateQuantity(item.id, quantity - 1)}
                aria-label={`Decrease quantity of ${item.name}`}
                className="px-2.5 py-1 hover:bg-forest-800 text-cream-100 focus:outline-none transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </motion.button>
              <span className="px-2 text-xs font-bold tabular-nums text-white min-w-[1.5rem] text-center">
                {quantity}
              </span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => updateQuantity(item.id, quantity + 1)}
                aria-label={`Increase quantity of ${item.name}`}
                className="px-2.5 py-1 hover:bg-forest-800 text-cream-100 focus:outline-none transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          )}
        </div>

      </div>

    </motion.article>
  );
};
