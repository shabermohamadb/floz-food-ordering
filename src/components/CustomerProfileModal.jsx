import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, MapPin, MessageSquare, ShieldCheck, Check, Clock, HeartHandshake } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CustomerProfileModal = () => {
  const {
    isProfileOpen,
    setIsProfileOpen,
    customerDetails,
    setCustomerDetails,
    businessConfig,
    navigateTo,
    selectedLocality,
    setIsLocalityPickerOpen
  } = useCart();

  const [name, setName] = useState(customerDetails.name || '');
  const [phone, setPhone] = useState(customerDetails.phone || '');
  const [address, setAddress] = useState(customerDetails.address || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isProfileOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setCustomerDetails(prev => ({
      ...prev,
      name,
      phone,
      address
    }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1200);
  };

  const handleOpenAdmin = () => {
    setIsProfileOpen(false);
    navigateTo('admin');
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="Account and Profile Settings"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-xs"
          onClick={() => setIsProfileOpen(false)}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col border border-cream-200"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-cream-100 border-b border-cream-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-forest-900 text-cream-50 flex items-center justify-center shadow-xs">
                <User className="w-4 h-4 text-terracotta-300" />
              </div>
              <div className="text-left">
                <h2 className="font-heading text-base sm:text-lg font-bold text-forest-950 leading-tight">
                  Customer Account
                </h2>
                <span className="text-[11px] text-charcoal-500">
                  Delivery Details & Shop Support
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsProfileOpen(false)}
              className="p-1.5 text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-200 rounded-md transition-colors"
              aria-label="Close profile modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 flex-1 overflow-y-auto space-y-5 text-left">
            {/* Quick Delivery Details Form */}
            <form onSubmit={handleSave} className="space-y-3.5 bg-cream-50/60 p-4 rounded-xl border border-cream-200">
              <div className="text-xs font-bold text-forest-950 uppercase tracking-wide flex items-center justify-between">
                <span>Default Delivery Info</span>
                {isSaved && (
                  <span className="text-[11px] font-semibold text-green-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-charcoal-600 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Karthik Raja"
                  className="w-full px-3 py-2 bg-white border border-cream-300 rounded-md text-xs text-charcoal-900 focus:outline-none focus:border-forest-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-charcoal-600 mb-1">
                  10-Digit Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9442012345"
                  className="w-full px-3 py-2 bg-white border border-cream-300 rounded-md text-xs text-charcoal-900 focus:outline-none focus:border-forest-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-charcoal-600 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Door No, Street Name"
                  className="w-full px-3 py-2 bg-white border border-cream-300 rounded-md text-xs text-charcoal-900 focus:outline-none focus:border-forest-700"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-[11px] text-charcoal-600">
                  <span className="font-semibold">Locality: </span>
                  <span className="text-forest-900 font-bold">{selectedLocality}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLocalityPickerOpen(true)}
                  className="text-[11px] text-terracotta-600 font-semibold hover:underline"
                >
                  Change Locality
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-forest-900 hover:bg-forest-800 text-cream-50 font-semibold text-xs rounded-md shadow-2xs transition-colors"
              >
                Save Details
              </button>
            </form>

            {/* Shop WhatsApp Support Card */}
            <div className="p-4 rounded-xl bg-forest-50 border border-forest-100 space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-forest-700" />
                <h4 className="text-xs font-bold text-forest-950 uppercase tracking-wide">
                  Direct Kitchen Hotline
                </h4>
              </div>
              <p className="text-xs text-charcoal-700 leading-relaxed">
                Need help with your order or catering for an event in Nagercoil? Chat directly with {businessConfig.shopName}.
              </p>
              <a
                href={`https://wa.me/${businessConfig.whatsAppOrderingNumber.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs rounded-lg transition-colors shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Kitchen Admin Portal Entry */}
            <div className="pt-2 border-t border-cream-200">
              <button
                onClick={handleOpenAdmin}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-cream-200 hover:bg-cream-100/60 transition-colors text-charcoal-800"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-forest-700" />
                  <span className="text-xs font-semibold">Kitchen Admin Portal</span>
                </div>
                <span className="text-[11px] text-charcoal-500 font-mono">Login &rarr;</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
