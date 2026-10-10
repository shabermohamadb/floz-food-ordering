import React from 'react';
import { Flame, CheckCircle2, Utensils, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const AboutSection = () => {
  const { businessConfig } = useCart();

  return (
    <section id="about" className="py-16 md:py-20 bg-cream-100 border-t border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Natural, Honest Narrative */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="text-xs font-semibold uppercase tracking-wider text-terracotta-600">
              About Our Kitchen
            </div>
            
            <h2 className="text-section-title text-forest-950">
              {businessConfig.shopName} — Quality Food & Grills in Nagercoil.
            </h2>

            <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed">
              Operating under <strong>{businessConfig.brandSubtitle}</strong> in Nagercoil, <strong>{businessConfig.shopName}</strong> is loved for its tender, slow-roasted chicken shawarma, succulent full charcoal grill chicken, and spicy Indo-Chinese and Indian gravies.
            </p>

            <p className="text-sm text-charcoal-600 leading-relaxed">
              We prepare each order fresh when requested. By connecting directly with our customers via WhatsApp ordering, we skip third-party aggregator markups, ensuring you get the exact catalogue prices and the fastest kitchen turnaround in town.
            </p>

            {/* Principles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="p-4 bg-cream-50 border border-cream-200 rounded-md">
                <div className="font-semibold text-xs text-forest-950 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                  <span>Fresh Charcoal & Spit Grills</span>
                </div>
                <p className="text-xs text-charcoal-500">
                  Marinated chicken roasted daily, served with signature garlic mayonnaise and warm kubboos.
                </p>
              </div>

              <div className="p-4 bg-cream-50 border border-cream-200 rounded-md">
                <div className="font-semibold text-xs text-forest-950 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                  <span>Direct WhatsApp Kitchen Ordering</span>
                </div>
                <p className="text-xs text-charcoal-500">
                  Orders go straight to the kitchen staff counter on WhatsApp for instant confirmation.
                </p>
              </div>
            </div>

            <div className="text-[11px] text-charcoal-500 italic pt-2">
              (FLOZ Tech Solution: Commission-free, lightweight web ordering built specifically for independent eateries in Tamil Nadu.)
            </div>
          </div>

          {/* Right Column: Culinary Presentation Card */}
          <div className="lg:col-span-5">
            <div className="bg-cream-50 border border-cream-300 rounded-lg p-5 shadow-xs text-left space-y-4">
              <div className="aspect-[4/3] rounded overflow-hidden bg-cream-200">
                <img
                  src="/images/dishes/shawarma_roll.jpg"
                  alt="A-One Special Chicken Shawarma Roll"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-heading text-base font-bold text-forest-950">
                  A-One Special Chicken Shawarma
                </h3>
                <p className="text-xs text-charcoal-600 leading-relaxed font-normal">
                  Our house favorite: slow roasted chicken with creamy garlic sauce and fresh crunchy pickles wrapped hot. Only <span className="font-bold tabular-nums text-forest-950">₹100</span>.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
