import React from 'react';
import { useCart } from '../context/CartContext';
import { Utensils, Flame, Sparkles, ChefHat, Drumstick, Soup, Sandwich } from 'lucide-react';

const CATEGORY_ICONS = {
  'all': Utensils,
  'shawarma-spot': Flame,
  'starters-chicken': Drumstick,
  'gravy-variety': Soup,
  'indian-variety': ChefHat,
  'chinese-variety': Sparkles,
  'sandwich-snacks': Sandwich
};

export const MobileCategoryRail = () => {
  const { categories, menuItems, activeCategory, setActiveCategory } = useCart();

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="md:hidden py-3 px-4 bg-cream-50 border-b border-cream-200/80">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-700">
          Explore Categories
        </span>
        <span className="text-[10px] text-charcoal-500 font-medium">
          {menuItems.length} Verified Dishes
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = cat.id === 'all'
            ? menuItems.length
            : menuItems.filter(i => i.category === cat.id).length;
          const IconComponent = CATEGORY_ICONS[cat.id] || Utensils;

          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full whitespace-nowrap text-xs transition-all shrink-0 active:scale-95 shadow-2xs ${
                isActive
                  ? 'bg-forest-900 text-cream-50 font-bold shadow-xs'
                  : 'bg-white text-charcoal-700 hover:bg-cream-100 border border-cream-200/90 font-medium'
              }`}
            >
              <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-terracotta-400' : 'text-forest-700'}`} />
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                isActive ? 'bg-forest-800 text-cream-100' : 'bg-cream-100 text-charcoal-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
