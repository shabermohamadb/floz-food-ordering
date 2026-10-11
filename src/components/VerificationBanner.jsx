import React, { useState } from 'react';
import { CheckCircle2, Settings2, ShieldCheck, Info, ChevronUp, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const VerificationBanner = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { businessConfig, setIsSettingsOpen, navigateTo } = useCart();

  return (
    <aside aria-label="Client Demo Status" className="hidden md:block bg-forest-950 text-cream-100 text-xs border-b border-forest-800 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1 font-semibold bg-forest-800 text-cream-200 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
            FLOZ Tech Client Demo
          </span>
          <span className="text-cream-200 hidden md:inline flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            <span>Catalogue Verified: A-One Shawarma Spot (EASY BUY), Nagercoil</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('admin')}
            className="inline-flex items-center gap-1.5 text-cream-100 hover:text-white font-semibold text-[11px] bg-forest-900 hover:bg-forest-800 px-2.5 py-1 rounded border border-forest-700 transition-colors"
            title="Open Kitchen Admin Dashboard"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cream-200" />
            <span>Admin Portal</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="inline-flex items-center gap-1 text-cream-200 hover:text-white underline decoration-forest-600 underline-offset-4 transition-colors font-medium text-[11px]"
            title="Configure shop name and WhatsApp number"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Quick Pitch Setup</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 text-cream-300 hover:text-white text-[11px] transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Verified Source</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-forest-900 border-t border-forest-800 px-4 sm:px-6 py-3 text-cream-200 text-xs">
          <div className="max-w-7xl mx-auto space-y-1.5">
            <p className="leading-relaxed">
              <strong>Source Reference:</strong> WhatsApp Catalogue link <code className="bg-forest-950 px-1.5 py-0.5 rounded text-cream-100">{businessConfig.catalogueReference}</code> verified.
            </p>
            <p className="leading-relaxed text-cream-300">
              <strong>Verified Catalogue Match:</strong> All 16 dishes, categories, discounted prices, and real food photos have been matched directly to the shop's WhatsApp catalogue screenshots.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};
