import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { VerificationBanner } from './components/VerificationBanner';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MobileCategoryRail } from './components/MobileCategoryRail';
import { FeaturedDishesRail } from './components/FeaturedDishesRail';
import { MenuSection } from './components/MenuSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CODCheckoutModal } from './components/CODCheckoutModal';
import { DemoSettingsModal } from './components/DemoSettingsModal';
import { MobileCartBar } from './components/MobileCartBar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FoodDetailBottomSheet } from './components/FoodDetailBottomSheet';
import { CustomerOrdersModal } from './components/CustomerOrdersModal';
import { CustomerProfileModal } from './components/CustomerProfileModal';
import { LocalityPickerModal } from './components/LocalityPickerModal';
import { AdminPortal } from './components/admin/AdminPortal';

function AppContent() {
  const { currentView } = useCart();
  const [activeNavTab, setActiveNavTab] = useState('home');

  if (currentView === 'admin') {
    return <AdminPortal />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-charcoal-900 selection:bg-forest-100 selection:text-forest-900 overflow-x-hidden">
      {/* Client Demo Status Banner (Hidden on Mobile) */}
      <VerificationBanner />

      {/* Main Navigation Header (Compact App Header on Mobile) */}
      <Header />

      {/* Main Page Content */}
      <main className="flex-1 pb-16 md:pb-0">
        <Hero />
        
        {/* Mobile Discovery Modules */}
        <MobileCategoryRail />
        <FeaturedDishesRail />

        {/* Full Interactive Menu */}
        <MenuSection />
        
        {/* Information & Contact Sections */}
        <AboutSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals, Drawers & Mobile Overlays */}
      <FoodDetailBottomSheet />
      <CartDrawer />
      <CODCheckoutModal />
      <CustomerOrdersModal />
      <CustomerProfileModal />
      <LocalityPickerModal />
      <DemoSettingsModal />

      {/* Floating Mobile Cart Summary Pill */}
      <MobileCartBar />

      {/* Fixed Mobile Bottom Navigation Bar */}
      <MobileBottomNav activeTab={activeNavTab} onTabChange={setActiveNavTab} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
