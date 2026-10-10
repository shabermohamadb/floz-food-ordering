import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MenuItemCard } from './MenuItemCard';

export const MenuSection = () => {
  const { menuItems, categories } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');
  const [dietaryFilter, setDietaryFilter] = useState('all'); // 'all' | 'veg' | 'nonveg'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'price-low' | 'price-high'

  // Filter & sort logic
  const filteredItems = useMemo(() => {
    let items = menuItems.filter(item => {
      // Category match
      const categoryMatch = activeCategory === 'all' || item.category === activeCategory;
      
      // Dietary match
      const dietaryMatch =
        dietaryFilter === 'all' ||
        (dietaryFilter === 'veg' && item.isVeg) ||
        (dietaryFilter === 'nonveg' && !item.isVeg);

      // Search match
      const searchLower = searchQuery.toLowerCase().trim();
      const searchMatch =
        !searchLower ||
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        (item.categoryLabel && item.categoryLabel.toLowerCase().includes(searchLower));

      return categoryMatch && dietaryMatch && searchMatch;
    });

    if (sortBy === 'price-low') {
      items = [...items].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      items = [...items].sort((a, b) => b.price - a.price);
    }

    return items;
  }, [menuItems, activeCategory, dietaryFilter, searchQuery, sortBy]);

  return (
    <section id="menu" className="py-12 md:py-16 bg-cream-50 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-left max-w-2xl mb-8">
          <div className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600 mb-1">
            Kitchen Food Menu
          </div>
          <h2 className="text-section-title text-forest-950">
            Explore Fresh Grills, Shawarma & Fast Foods
          </h2>
          <p className="mt-2 text-sm sm:text-base text-charcoal-600 leading-relaxed font-normal">
            Authentic charcoal grilled chicken, fresh shawarma, spicy gravies, Hyderabad dum biryani, and crispy snacks prepared to order with official catalogue rates.
          </p>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="space-y-4 mb-8">
          
          {/* Top Row: Search, Dietary, and Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shawarma, grill chicken, biryani, momos..."
                className="w-full pl-10 pr-9 py-2.5 bg-cream-100 border border-cream-300 focus:border-forest-700 focus:bg-white rounded-md text-xs sm:text-sm text-charcoal-900 placeholder:text-charcoal-500 focus:outline-none transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Controls Row */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Dietary Preference Filter Buttons */}
              <div className="inline-flex items-center p-1 bg-cream-100 border border-cream-300 rounded-md text-xs">
                <button
                  onClick={() => setDietaryFilter('all')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors ${
                    dietaryFilter === 'all'
                      ? 'bg-forest-900 text-cream-50 font-semibold shadow-xs'
                      : 'text-charcoal-700 hover:text-forest-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setDietaryFilter('veg')}
                  className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition-colors ${
                    dietaryFilter === 'veg'
                      ? 'bg-forest-900 text-cream-50 font-semibold shadow-xs'
                      : 'text-charcoal-700 hover:text-forest-900'
                  }`}
                >
                  <div className="w-2.5 h-2.5 border border-green-600 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-green-600" />
                  </div>
                  <span>Veg Only</span>
                </button>
                <button
                  onClick={() => setDietaryFilter('nonveg')}
                  className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 transition-colors ${
                    dietaryFilter === 'nonveg'
                      ? 'bg-forest-900 text-cream-50 font-semibold shadow-xs'
                      : 'text-charcoal-700 hover:text-forest-900'
                  }`}
                >
                  <div className="w-2.5 h-2.5 border border-red-700 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-red-700" />
                  </div>
                  <span>Non-Veg</span>
                </button>
              </div>

              {/* Price Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-2 bg-cream-100 border border-cream-300 rounded-md text-xs text-charcoal-800 focus:outline-none"
              >
                <option value="default">Default Order</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

          </div>

          {/* Dynamic Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-1 border-b border-cream-200 scrollbar-none">
            {categories.map(category => {
              const isActive = activeCategory === category.id;
              const count = category.id === 'all'
                ? menuItems.length
                : menuItems.filter(i => i.category === category.id).length;

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-forest-900 text-cream-50 shadow-xs font-semibold'
                      : 'bg-cream-100 hover:bg-cream-200 text-charcoal-700'
                  }`}
                >
                  <span>{category.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                    isActive ? 'bg-forest-800 text-cream-200' : 'bg-cream-200 text-charcoal-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results Summary & Reset Trigger */}
          <div className="flex items-center justify-between text-xs text-charcoal-500 pt-1">
            <span>
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'}
              {activeCategory !== 'all' && ` in ${categories.find(c => c.id === activeCategory)?.label}`}
              {dietaryFilter !== 'all' && ` (${dietaryFilter === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'})`}
            </span>

            {(activeCategory !== 'all' || dietaryFilter !== 'all' || searchQuery || sortBy !== 'default') && (
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setDietaryFilter('all');
                  setSearchQuery('');
                  setSortBy('default');
                }}
                className="text-terracotta-600 hover:text-terracotta-700 font-semibold underline underline-offset-2"
              >
                Reset all filters
              </button>
            )}
          </div>

        </div>

        {/* Product Cards Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-cream-100 border border-cream-300 rounded-lg p-12 text-center max-w-md mx-auto my-8">
            <SlidersHorizontal className="w-8 h-8 text-charcoal-400 mx-auto mb-3" />
            <h3 className="font-heading text-lg font-bold text-forest-950 mb-1">
              No matching food items found
            </h3>
            <p className="text-xs text-charcoal-600 mb-4">
              We couldn't find any dishes matching your current filter criteria.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setDietaryFilter('all');
                setSearchQuery('');
                setSortBy('default');
              }}
              className="px-4 py-2 bg-forest-900 text-cream-50 text-xs font-semibold rounded-md hover:bg-forest-800"
            >
              Show All Menu Items
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
