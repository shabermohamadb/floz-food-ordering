import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MenuItemCard } from './MenuItemCard';

export const MenuSection = () => {
  const {
    menuItems,
    categories,
    activeCategory,
    setActiveCategory,
    mobileSearchQuery,
    setMobileSearchQuery
  } = useCart();

  const [dietaryFilter, setDietaryFilter] = useState('all'); // 'all' | 'veg' | 'nonveg'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'price-low' | 'price-high'

  // Sync searchQuery with mobileSearchQuery
  useEffect(() => {
    if (mobileSearchQuery !== undefined) {
      setSearchQuery(mobileSearchQuery);
    }
  }, [mobileSearchQuery]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setMobileSearchQuery(val);
  };

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
    <section id="menu" className="py-8 md:py-16 bg-cream-50 scroll-mt-14 md:scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-left max-w-2xl mb-6 md:mb-8">
          <div className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600 mb-1">
            Kitchen Food Menu
          </div>
          <h2 className="text-section-title text-forest-950">
            Explore Fresh Grills, Shawarma & Fast Foods
          </h2>
          <p className="mt-1.5 text-xs sm:text-base text-charcoal-600 leading-relaxed font-normal">
            Authentic charcoal grilled chicken, fresh shawarma, spicy gravies, Hyderabad dum biryani, and crispy snacks prepared to order with official catalogue rates.
          </p>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="space-y-4 mb-6">
          
          {/* Top Row: Desktop Search, Dietary, and Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search Input (visible on desktop, or secondary on mobile) */}
            <div className="relative flex-1 max-w-md hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search shawarma, grill chicken, biryani, momos..."
                className="w-full pl-10 pr-9 py-2.5 bg-cream-100 border border-cream-300 focus:border-forest-700 focus:bg-white rounded-md text-xs sm:text-sm text-charcoal-900 placeholder:text-charcoal-500 focus:outline-none transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-wrap w-full sm:w-auto">
              {/* Dietary Preference Filter Buttons */}
              <div className="inline-flex items-center p-1 bg-cream-100 border border-cream-300 rounded-lg text-xs shadow-2xs">
                <button
                  onClick={() => setDietaryFilter('all')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    dietaryFilter === 'all'
                      ? 'bg-forest-900 text-cream-50 font-bold shadow-xs'
                      : 'text-charcoal-700 hover:text-forest-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setDietaryFilter('veg')}
                  className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                    dietaryFilter === 'veg'
                      ? 'bg-forest-900 text-cream-50 font-bold shadow-xs'
                      : 'text-charcoal-700 hover:text-forest-900'
                  }`}
                >
                  <div className="w-2.5 h-2.5 border border-green-600 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-green-600" />
                  </div>
                  <span>Veg</span>
                </button>
                <button
                  onClick={() => setDietaryFilter('nonveg')}
                  className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                    dietaryFilter === 'nonveg'
                      ? 'bg-forest-900 text-cream-50 font-bold shadow-xs'
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
                className="px-2.5 py-2 bg-cream-100 border border-cream-300 rounded-lg text-xs text-charcoal-800 focus:outline-none shadow-2xs"
              >
                <option value="default">Default Order</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

          </div>

          {/* Sticky Category Tabs Bar */}
          <div className="sticky top-14 md:top-20 z-20 -mx-4 px-4 sm:mx-0 sm:px-0 py-2 bg-cream-50/95 backdrop-blur-md border-y sm:border-y-0 sm:border-b border-cream-200">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map(category => {
                const isActive = activeCategory === category.id;
                const count = category.id === 'all'
                  ? menuItems.length
                  : menuItems.filter(i => i.category === category.id).length;

                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-3 py-1.5 text-xs sm:text-sm rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'bg-forest-900 text-cream-50 shadow-xs font-bold'
                        : 'bg-white hover:bg-cream-100 text-charcoal-700 border border-cream-200 font-medium'
                    }`}
                  >
                    <span>{category.label}</span>
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
                  handleSearchChange('');
                  setSortBy('default');
                }}
                className="text-terracotta-600 hover:text-terracotta-700 font-semibold underline underline-offset-2"
              >
                Reset all filters
              </button>
            )}
          </div>

        </div>

        {/* Product Cards List / Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filteredItems.map(item => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-cream-100 border border-cream-300 rounded-xl p-8 sm:p-12 text-center max-w-md mx-auto my-6">
            <SlidersHorizontal className="w-8 h-8 text-charcoal-400 mx-auto mb-3" />
            <h3 className="font-heading text-base sm:text-lg font-bold text-forest-950 mb-1">
              No matching dishes found
            </h3>
            <p className="text-xs text-charcoal-600 mb-4">
              We couldn't find any dishes matching your current filter criteria.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setDietaryFilter('all');
                handleSearchChange('');
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
