import React from 'react';
import { Home, UtensilsCrossed, Clock, User, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const MobileBottomNav = ({ activeTab = 'home', onTabChange }) => {
  const {
    customerOrders,
    setIsOrdersOpen,
    setIsProfileOpen,
    itemCount
  } = useCart();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onTabChange) onTabChange('home');
  };

  const handleMenuClick = () => {
    scrollToSection('menu');
    if (onTabChange) onTabChange('menu');
  };

  const handleOrdersClick = () => {
    setIsOrdersOpen(true);
    if (onTabChange) onTabChange('orders');
  };

  const handleAccountClick = () => {
    setIsProfileOpen(true);
    if (onTabChange) onTabChange('account');
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-cream-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-4 h-15 items-center px-2">
        {/* 1. Home Tab */}
        <button
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center py-1 rounded-md transition-colors ${
            activeTab === 'home'
              ? 'text-terracotta-600 font-bold'
              : 'text-charcoal-500 hover:text-charcoal-900 font-medium'
          }`}
          aria-label="Navigate to Home"
        >
          <Home className={`w-5 h-5 mb-0.5 ${activeTab === 'home' ? 'text-terracotta-600 stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* 2. Menu / Explore Tab */}
        <button
          onClick={handleMenuClick}
          className={`flex flex-col items-center justify-center py-1 rounded-md transition-colors ${
            activeTab === 'menu'
              ? 'text-terracotta-600 font-bold'
              : 'text-charcoal-500 hover:text-charcoal-900 font-medium'
          }`}
          aria-label="Browse Food Menu"
        >
          <UtensilsCrossed className={`w-5 h-5 mb-0.5 ${activeTab === 'menu' ? 'text-terracotta-600 stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight">Menu</span>
        </button>

        {/* 3. Orders Tab with Badge */}
        <button
          onClick={handleOrdersClick}
          className={`relative flex flex-col items-center justify-center py-1 rounded-md transition-colors ${
            activeTab === 'orders'
              ? 'text-terracotta-600 font-bold'
              : 'text-charcoal-500 hover:text-charcoal-900 font-medium'
          }`}
          aria-label="View Order History and Status"
        >
          <div className="relative">
            <Clock className={`w-5 h-5 mb-0.5 ${activeTab === 'orders' ? 'text-terracotta-600 stroke-[2.4]' : 'stroke-[1.8]'}`} />
            {customerOrders && customerOrders.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-forest-900 text-cream-50 text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {customerOrders.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Orders</span>
        </button>

        {/* 4. Account / Profile Tab */}
        <button
          onClick={handleAccountClick}
          className={`flex flex-col items-center justify-center py-1 rounded-md transition-colors ${
            activeTab === 'account'
              ? 'text-terracotta-600 font-bold'
              : 'text-charcoal-500 hover:text-charcoal-900 font-medium'
          }`}
          aria-label="Customer Profile and Support"
        >
          <User className={`w-5 h-5 mb-0.5 ${activeTab === 'account' ? 'text-terracotta-600 stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight">Account</span>
        </button>
      </div>
    </nav>
  );
};
