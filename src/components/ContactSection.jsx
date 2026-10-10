import React from 'react';
import { MapPin, Clock, MessageSquare, Phone, CheckCircle2, Settings2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ContactSection = () => {
  const { businessConfig, setIsSettingsOpen } = useCart();

  return (
    <section id="contact" className="py-16 md:py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-left max-w-2xl mb-12">
          <div className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600 mb-1">
            Shop Information
          </div>
          <h2 className="text-section-title text-forest-950">
            Location, Hours & Direct Contact
          </h2>
          <p className="mt-2 text-sm text-charcoal-600">
            Details for customer pickup and direct kitchen communication in Nagercoil.
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          {/* Card 1: Shop Location in Nagercoil */}
          <div className="p-6 bg-cream-100 border border-cream-200 rounded-lg space-y-3">
            <div className="w-10 h-10 rounded bg-forest-900 text-cream-50 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-forest-950">
              Shop Location
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-medium">
              {businessConfig.shopName}
            </p>
            <p className="text-xs text-charcoal-600">
              {businessConfig.brandSubtitle}, {businessConfig.city}, {businessConfig.region}
            </p>
            <div className="pt-2 border-t border-cream-200/80">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-forest-800 bg-forest-100 px-2 py-0.5 rounded border border-forest-600/20">
                <CheckCircle2 className="w-3 h-3 text-forest-700" />
                <span>Nagercoil, Kanyakumari District</span>
              </span>
            </div>
          </div>

          {/* Card 2: Kitchen Hours */}
          <div className="p-6 bg-cream-100 border border-cream-200 rounded-lg space-y-3">
            <div className="w-10 h-10 rounded bg-forest-900 text-cream-50 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-forest-950">
              Service Timings
            </h3>
            <div className="text-xs sm:text-sm text-charcoal-700 space-y-1">
              <div><strong>Lunch:</strong> {businessConfig.operatingHours.lunch}</div>
              <div><strong>Dinner / Night:</strong> {businessConfig.operatingHours.dinner}</div>
              <div className="text-charcoal-500 text-xs">{businessConfig.operatingHours.days}</div>
            </div>
            <div className="pt-2 border-t border-cream-200/80">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-forest-800 bg-forest-100 px-2 py-0.5 rounded border border-forest-600/20">
                <CheckCircle2 className="w-3 h-3 text-forest-700" />
                <span>Daily Kitchen Service</span>
              </span>
            </div>
          </div>

          {/* Card 3: WhatsApp Ordering Channel */}
          <div className="p-6 bg-cream-100 border border-cream-200 rounded-lg space-y-3">
            <div className="w-10 h-10 rounded bg-forest-900 text-cream-50 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-lg font-bold text-forest-950">
              WhatsApp Ordering
            </h3>
            <div className="text-xs sm:text-sm text-charcoal-700 space-y-1">
              <div className="font-mono text-forest-900 font-bold">
                {businessConfig.whatsAppOrderingNumber}
              </div>
              <div className="text-xs text-charcoal-500">
                Direct kitchen order receiver line
              </div>
            </div>

            <div className="pt-2 border-t border-cream-200/80 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-forest-900 hover:text-forest-700 underline underline-offset-4"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>Update in Demo Settings</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
