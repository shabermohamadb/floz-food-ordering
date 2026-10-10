import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { VerificationBanner } from './components/VerificationBanner';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CODCheckoutModal } from './components/CODCheckoutModal';
import { DemoSettingsModal } from './components/DemoSettingsModal';
import { MobileCartBar } from './components/MobileCartBar';
import { AdminPortal } from './components/admin/AdminPortal';

function AppContent() {
  const { currentView } = useCart();

  if (currentView === 'admin') {
    return <AdminPortal />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-charcoal-900 selection:bg-forest-100 selection:text-forest-900">
      {/* Client Demo Status Banner */}
      <VerificationBanner />

      {/* Main Navigation Header */}
      <Header />

      {/* Main Page Content */}
      <main className="flex-1">
        <Hero />
        <MenuSection />
        <AboutSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Overlays & Drawers */}
      <CartDrawer />
      <CODCheckoutModal />
      <DemoSettingsModal />
      <MobileCartBar />
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
