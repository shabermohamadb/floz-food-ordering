import React from 'react';
import { MapPin, Phone, MessageSquare, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { FLOZ_AGENCY_CONFIG } from '../config/flozAgencyConfig';

export const Footer = () => {
  const { businessConfig, setIsSettingsOpen } = useCart();

  return (
    <footer className="bg-forest-950 text-cream-200 border-t border-forest-900 pt-12 pb-28 sm:pb-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-forest-900">
          
          {/* Shop Column */}
          <div className="md:col-span-5 space-y-3">
            <h3 className="font-heading text-xl font-bold text-cream-50">
              {businessConfig.shopName}
            </h3>
            <p className="text-xs text-cream-300 max-w-sm leading-relaxed">
              {businessConfig.tagline}. Order authentic regional tiffin, biryani, and gravies directly through WhatsApp with transparent pricing.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-cream-300 pt-1">
              <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Nagercoil, Kanyakumari District, Tamil Nadu</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-2">
            <div className="text-xs font-semibold text-cream-50 uppercase tracking-wider mb-2">
              Navigation
            </div>
            <ul className="space-y-1.5 text-xs text-cream-300">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#menu" className="hover:text-white transition-colors">Full Food Menu</a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">Kitchen Philosophy</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Shop Location & Timings</a>
              </li>
            </ul>
          </div>

          {/* FLOZ Tech Agency Presentation Credit */}
          <div className="md:col-span-4 space-y-2.5">
            <div className="text-xs font-semibold text-cream-50 uppercase tracking-wider">
              {FLOZ_AGENCY_CONFIG.agencyName} Demo Proposal
            </div>
            <p className="text-xs text-cream-300 leading-relaxed">
              This high-performance ordering solution was developed specifically for presentation to local food businesses in Nagercoil by <strong>{FLOZ_AGENCY_CONFIG.agencyName}</strong>.
            </p>
            <div className="pt-1 flex items-center gap-3">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-xs text-cream-100 hover:text-white font-medium underline underline-offset-4"
              >
                Configure Demo Settings
              </button>
              <span className="text-forest-800">|</span>
              <a
                href={`mailto:${FLOZ_AGENCY_CONFIG.contactEmail}`}
                className="text-xs text-cream-300 hover:text-white"
              >
                {FLOZ_AGENCY_CONFIG.contactEmail}
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-cream-400">
          <div>
            &copy; {new Date().getFullYear()} {businessConfig.shopName}. Direct Kitchen Ordering Platform.
          </div>
          <div className="text-[11px] text-cream-400">
            Powered by {FLOZ_AGENCY_CONFIG.agencyName} Digital Commerce Architecture
          </div>
        </div>

      </div>
    </footer>
  );
};
