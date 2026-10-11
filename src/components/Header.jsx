import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MessageSquare, MapPin, Search, X, ShieldCheck, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Header = () => {
  const {
    businessConfig,
    itemCount,
    subtotal,
    setIsCartOpen,
    navigateTo,
    selectedLocality,
    setIsLocalityPickerOpen,
    mobileSearchQuery,
    setMobileSearchQuery
  } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchFocus = () => {
    const menuEl = document.getElementById('menu');
    if (menuEl && window.scrollY < 180) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 bg-white/95 backdrop-blur-md border-b border-cream-200 shadow-2xs ${
        isScrolled ? 'py-0' : 'py-0.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        
        {/* ========================================================================= */}
        {/* 1. TOP HEADER ROW (Compact on Mobile, Spacious on Desktop)               */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between h-14 sm:h-20">
          
          {/* Brand Identity & Location Selector */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {businessConfig.logoUrl && (
              <a href="#hero" className="shrink-0">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-cream-300 bg-white p-0.5 shadow-2xs">
                  <img
                    src={businessConfig.logoUrl}
                    alt={businessConfig.shopName}
                    className="w-full h-full object-contain"
                  />
                </div>
              </a>
            )}

            <div className="text-left min-w-0">
              <a href="#hero" className="block focus:outline-none">
                <span className="block font-heading text-sm sm:text-2xl font-extrabold tracking-tight text-forest-950 truncate">
                  {businessConfig.shopName}
                </span>
              </a>

              {/* Delivery Location Pill (Interactive Zomato Pattern) */}
              <button
                type="button"
                onClick={() => setIsLocalityPickerOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-charcoal-600 hover:text-forest-900 font-medium transition-colors cursor-pointer group"
                title="Change delivery location"
              >
                <MapPin className="w-3 h-3 text-terracotta-500 shrink-0" />
                <span className="font-semibold text-forest-950 truncate max-w-[140px] sm:max-w-none">
                  {selectedLocality || 'Nagercoil'}
                </span>
                <span className="text-charcoal-400">·</span>
                <span className="text-charcoal-500 hidden xs:inline">Nagercoil</span>
                <ChevronDown className="w-3 h-3 text-charcoal-400 group-hover:text-charcoal-700 shrink-0" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-sm font-medium text-charcoal-700 hover:text-forest-900 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-forest-900 hover:after:w-full after:transition-all after:duration-200"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('menu')}
              className="text-sm font-medium text-charcoal-700 hover:text-forest-900 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-forest-900 hover:after:w-full after:transition-all after:duration-200"
            >
              Menu
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-sm font-medium text-charcoal-700 hover:text-forest-900 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-forest-900 hover:after:w-full after:transition-all after:duration-200"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-sm font-medium text-charcoal-700 hover:text-forest-900 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-forest-900 hover:after:w-full after:transition-all after:duration-200"
            >
              Contact
            </button>
            <button
              onClick={() => navigateTo('admin')}
              className="text-xs font-semibold text-forest-800 hover:text-forest-950 flex items-center gap-1 bg-cream-100 hover:bg-cream-200 px-2.5 py-1 rounded border border-cream-300 transition-colors shadow-2xs hover:shadow-xs active:scale-95"
              title="Shop Owner Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* WhatsApp Quick Action CTA (Desktop) */}
            <button
              onClick={() => scrollToSection('menu')}
              className="hidden lg:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-forest-900 bg-forest-100 hover:bg-forest-100/80 rounded-md border border-forest-600/30 transition-all hover:shadow-xs active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-forest-700" />
              <span>Direct WhatsApp Orders</span>
            </button>

            {/* Shopping Cart Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              aria-label={`View Shopping Cart with ${itemCount} items`}
              className="relative inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-forest-900 hover:bg-forest-800 text-cream-50 rounded-lg transition-all shadow-sm focus:outline-none"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-cream-100" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="absolute -top-2 -right-2.5 bg-terracotta-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center tabular-nums shadow-xs"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <span className="text-xs font-bold tracking-wide">
                <span className="hidden sm:inline">Cart </span>
                {itemCount > 0 && <span className="text-cream-200">₹{subtotal}</span>}
              </span>
            </motion.button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MOBILE QUICK SEARCH BAR (Sticky directly under compact header)         */}
        {/* ========================================================================= */}
        <div className="md:hidden pb-2.5 pt-0.5">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
            <input
              type="text"
              value={mobileSearchQuery || ''}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              onFocus={handleSearchFocus}
              placeholder="Search shawarma, grill chicken, biryani..."
              className="w-full pl-9 pr-8 py-2 bg-cream-100/80 focus:bg-white border border-cream-200 focus:border-forest-700 rounded-xl text-xs text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none transition-all shadow-2xs"
            />
            {mobileSearchQuery && (
              <button
                onClick={() => setMobileSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-charcoal-400 hover:text-charcoal-700"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
