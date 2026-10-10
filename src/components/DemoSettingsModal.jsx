import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings2, Check, RotateCcw, Phone, Store, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { INITIAL_BUSINESS_CONFIG } from '../config/businessConfig';

export const DemoSettingsModal = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    businessConfig,
    updateBusinessConfig,
    resetBusinessConfig
  } = useCart();

  const [formShopName, setFormShopName] = useState(businessConfig.shopName);
  const [formWhatsAppNumber, setFormWhatsAppNumber] = useState(businessConfig.whatsAppOrderingNumber);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateBusinessConfig({
      shopName: formShopName.trim() || INITIAL_BUSINESS_CONFIG.shopName,
      whatsAppOrderingNumber: formWhatsAppNumber.trim()
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 900);
  };

  const handleReset = () => {
    resetBusinessConfig();
    setFormShopName(INITIAL_BUSINESS_CONFIG.shopName);
    setFormWhatsAppNumber(INITIAL_BUSINESS_CONFIG.whatsAppOrderingNumber);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 900);
  };

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-xs"
            onClick={() => setIsSettingsOpen(false)}
          />

          <div className="min-h-full flex items-center justify-center p-4 text-center">
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-cream-50 rounded-xl shadow-2xl border border-cream-200 overflow-hidden text-left my-8 z-10"
            >
              
              {/* Header */}
              <div className="px-6 py-4 bg-cream-100 border-b border-cream-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-forest-900 text-cream-50 rounded-lg shadow-xs">
                    <Settings2 className="w-4 h-4 text-terracotta-300" />
                  </div>
                  <div>
                    <h2 id="settings-title" className="font-heading text-lg font-bold text-forest-950">
                      FLOZ Tech Demo Configuration
                    </h2>
                    <p className="text-xs text-charcoal-500">
                      Real-time configuration tool for client presentation in Nagercoil
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1.5 text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-200/60 rounded-md transition-colors focus:outline-none cursor-pointer"
                  aria-label="Close settings modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSave} className="p-6 space-y-4">
                
                {savedSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-forest-50 border border-forest-600 rounded-lg text-xs text-forest-950 font-bold flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-forest-700" />
                    <span>Configuration updated successfully!</span>
                  </motion.div>
                )}

                {/* Shop Name Input */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1 uppercase tracking-wider">
                    Shop / Restaurant Name
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                    <input
                      type="text"
                      value={formShopName}
                      onChange={(e) => setFormShopName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-800"
                      placeholder="Enter official shop name"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-charcoal-500">
                    Verified from WhatsApp Catalogue as <strong>A-One Shawarma Spot (EASY BUY)</strong>.
                  </p>
                </div>

                {/* WhatsApp Number Input */}
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1 uppercase tracking-wider">
                    Shop WhatsApp Ordering Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                    <input
                      type="text"
                      value={formWhatsAppNumber}
                      onChange={(e) => setFormWhatsAppNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-800 font-mono"
                      placeholder="+91 94420 12345"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-charcoal-500">
                    Enter the shop owner's active WhatsApp phone number to receive live orders during the pitch.
                  </p>
                </div>

                {/* Catalogue Reference Card */}
                <div className="p-3 bg-cream-100 border border-cream-200 rounded-lg text-xs space-y-1.5">
                  <div className="font-bold text-forest-950 flex items-center justify-between">
                    <span>Verified WhatsApp Catalogue</span>
                    <span className="font-mono text-[10px] text-charcoal-500">ID: {businessConfig.catalogueId}</span>
                  </div>
                  <p className="text-[11px] text-charcoal-600">
                    Supplied reference: <a href={businessConfig.catalogueReference} target="_blank" rel="noopener noreferrer" className="underline text-forest-800 font-mono">{businessConfig.catalogueReference}</a>
                  </p>
                  <p className="text-[11px] text-forest-800 font-medium">
                    Synchronized with 16 verified catalogue items, prices & high-res dishes.
                  </p>
                </div>

                {/* Modal Actions */}
                <div className="pt-3 border-t border-cream-200 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-charcoal-600 hover:text-charcoal-900 border border-cream-300 hover:bg-cream-100 rounded-lg cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Defaults</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSettingsOpen(false)}
                      className="px-3 py-2 text-xs font-bold text-charcoal-700 hover:text-charcoal-900 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-4 py-2 bg-forest-900 hover:bg-forest-800 text-cream-50 text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                    >
                      Apply & Save
                    </motion.button>
                  </div>
                </div>

              </form>

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
