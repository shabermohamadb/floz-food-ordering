import React from 'react';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Check, Flame } from 'lucide-react';

export const FeaturedDishesRail = () => {
  const { menuItems, addToCart, updateQuantity, getItemQuantity, setSelectedDetailItem } = useCart();

  // Pick real bestsellers from verified menu items
  const featured = menuItems.filter(item => item.isBestseller && item.isAvailable !== false).slice(0, 6);
  if (featured.length === 0) return null;

  return (
    <div className="md:hidden py-4 px-4 bg-white border-b border-cream-200">
      <div className="flex items-center justify-between mb-3 text-left">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-terracotta-600">
            <Flame className="w-3.5 h-3.5" />
            <span>Popular in Nagercoil</span>
          </div>
          <h3 className="font-heading text-base font-extrabold text-forest-950">
            Most Ordered Specials
          </h3>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
        {featured.map((item) => {
          const qty = getItemQuantity(item.id);
          const discountPercent =
            item.originalPrice && item.originalPrice > item.price
              ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
              : 0;

          return (
            <div
              key={item.id}
              className="w-40 shrink-0 bg-cream-50/70 border border-cream-200 rounded-xl overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
            >
              {/* Image with tap to open details */}
              <div
                onClick={() => setSelectedDetailItem(item)}
                className="relative aspect-square w-full bg-cream-100 overflow-hidden cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Dietary Marker */}
                <div className="absolute top-2 left-2 bg-white/95 p-0.5 rounded shadow-2xs">
                  <div className={`w-3 h-3 border flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-700'}`}>
                    <div className={`w-1 h-1 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-700'}`} />
                  </div>
                </div>

                {discountPercent > 0 && (
                  <span className="absolute bottom-2 left-2 bg-terracotta-500 text-white font-extrabold text-[9px] px-1.5 py-0.2 rounded shadow-2xs">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="p-2.5 flex-1 flex flex-col justify-between text-left">
                <div onClick={() => setSelectedDetailItem(item)} className="cursor-pointer">
                  <h4 className="font-heading text-xs font-bold text-forest-950 line-clamp-1 mb-1">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="font-extrabold text-xs text-forest-950 tabular-nums">
                      ₹{item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="text-[10px] text-charcoal-400 line-through tabular-nums">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add / Stepper Button */}
                {qty === 0 ? (
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full py-1.5 bg-white hover:bg-forest-900 hover:text-white border border-forest-800 text-forest-950 font-extrabold text-[11px] rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1 active:scale-95"
                  >
                    <Plus className="w-3 h-3 text-terracotta-500" />
                    <span>ADD</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-forest-900 text-cream-50 rounded-lg p-0.5 shadow-2xs">
                    <button
                      onClick={() => updateQuantity(item.id, qty - 1)}
                      className="w-6 h-6 flex items-center justify-center text-cream-200 hover:text-white"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold tabular-nums px-1">
                      {qty}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, qty + 1)}
                      className="w-6 h-6 flex items-center justify-center text-cream-200 hover:text-white"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
