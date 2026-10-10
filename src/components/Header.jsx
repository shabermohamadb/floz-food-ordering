import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MessageSquare, MapPin, Menu as MenuIcon, X, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Header = () => {
  const { businessConfig, itemCount, subtotal, setIsCartOpen, navigateTo } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-cream-50/95 backdrop-blur-md shadow-sm border-b border-cream-200 py-0'
          : 'bg-cream-50/90 backdrop-blur-xs border-b border-cream-200/70 py-1'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Identity / Wordmark with Verified Logo */}
          <div className="flex items-center gap-3">
            <a
              href="#hero"
              className="group flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-forest-700 rounded-md transition-transform duration-200 hover:scale-[1.01]"
            >
              {businessConfig.logoUrl && (
                <div className="w-12 h-12 rounded-full overflow-hidden border border-cream-300 bg-white p-0.5 shrink-0 shadow-xs transition-shadow duration-200 group-hover:shadow-sm">
                  <img
                    src={businessConfig.logoUrl}
                    alt={businessConfig.shopName}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div>
                <span className="block font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-forest-950 group-hover:text-forest-800 transition-colors">
                  {businessConfig.shopName}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-charcoal-500 font-medium tracking-wide">
                  <span className="text-terracotta-600 font-semibold">{businessConfig.brandSubtitle}</span>
                  <span>·</span>
                  <MapPin className="w-3 h-3 text-forest-700" />
                  <span>Nagercoil</span>
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
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

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            
            {/* WhatsApp Quick Action CTA */}
            <button
              onClick={() => scrollToSection('menu')}
              className="hidden lg:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-forest-900 bg-forest-100 hover:bg-forest-100/80 rounded-md border border-forest-600/30 transition-all hover:shadow-xs active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-forest-700" />
              <span>Direct WhatsApp Orders</span>
            </button>

            {/* Shopping Cart Button with Animated Bounce */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              aria-label={`View Shopping Cart with ${itemCount} items`}
              className="relative inline-flex items-center gap-2.5 px-4 py-2 bg-forest-900 hover:bg-forest-800 text-cream-50 rounded-md transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-forest-600 focus:ring-offset-2"
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
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="absolute -top-2.5 -right-2.5 bg-terracotta-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center tabular-nums shadow-xs"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <span className="text-xs font-semibold tracking-wide">
                Cart {itemCount > 0 && <span className="text-cream-200 ml-0.5">· ₹{subtotal}</span>}
              </span>
            </motion.button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-charcoal-700 hover:text-forest-900 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-700"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer with Smooth Animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden border-t border-cream-200 bg-cream-50"
            >
              <div className="py-4 space-y-2">
                <button
                  onClick={() => scrollToSection('hero')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-charcoal-700 hover:bg-cream-100 rounded transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('menu')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-charcoal-700 hover:bg-cream-100 rounded transition-colors"
                >
                  Menu
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-charcoal-700 hover:bg-cream-100 rounded transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-charcoal-700 hover:bg-cream-100 rounded transition-colors"
                >
                  Contact
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateTo('admin');
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-semibold text-forest-900 hover:bg-cream-100 rounded flex items-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-forest-700" />
                  <span>Owner Admin Portal</span>
                </button>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 bg-forest-900 text-cream-50 rounded text-sm font-semibold shadow-xs"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span>View Order Cart</span>
                    </span>
                    <span>{itemCount} items · ₹{subtotal}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
