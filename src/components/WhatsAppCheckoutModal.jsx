import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, AlertCircle, CheckCircle2, Eye, MapPin, Store, Bike, Settings2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { generateWhatsAppOrderLink } from '../utils/whatsappFormatter';

export const WhatsAppCheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    businessConfig,
    setIsSettingsOpen,
    cartItems,
    subtotal,
    deliveryFee,
    total,
    fulfillmentType,
    setFulfillmentType,
    customerDetails,
    setCustomerDetails,
    logWhatsAppOrder
  } = useCart();

  const [formErrors, setFormErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [orderSentStatus, setOrderSentStatus] = useState(null); // null | 'opened' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  // Lock body scroll
  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.style.overflow = 'hidden';
      setOrderSentStatus(null);
      setFormErrors({});
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCheckoutOpen]);

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!customerDetails.name || !customerDetails.name.trim()) {
      errors.name = 'Please enter your name so the kitchen can identify your order';
    }
    if (fulfillmentType === 'delivery') {
      if (!customerDetails.address || !customerDetails.address.trim()) {
        errors.address = 'Please provide your delivery street address or landmark in Nagercoil';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendWhatsAppOrder = () => {
    if (!validateForm()) return;

    const result = generateWhatsAppOrderLink({
      phoneNumber: businessConfig.whatsAppOrderingNumber,
      shopName: businessConfig.shopName,
      cartItems,
      subtotal,
      deliveryFee,
      total,
      fulfillmentType,
      customerDetails
    });

    if (!result.success) {
      setOrderSentStatus('error');
      setErrorMessage(result.error);
      return;
    }

    // Log order to persistent backend
    if (logWhatsAppOrder) {
      logWhatsAppOrder({
        customerName: customerDetails.name,
        phone: customerDetails.phone,
        fulfillmentType,
        address: customerDetails.address,
        notes: customerDetails.notes,
        items: cartItems.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
        total
      });
    }

    // Open WhatsApp in a new tab/window
    window.open(result.url, '_blank', 'noopener,noreferrer');
    setOrderSentStatus('opened');
  };

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-xs"
            onClick={() => setIsCheckoutOpen(false)}
          />

          <div className="min-h-full flex items-center justify-center p-4 sm:p-6 text-center">
            {/* Modal Dialog with Spring Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-xl bg-cream-50 rounded-xl shadow-2xl border border-cream-200 overflow-hidden text-left my-8 z-10"
            >
              
              {/* Header */}
              <div className="px-6 py-4 bg-cream-100 border-b border-cream-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-forest-900 text-cream-50 rounded-lg shadow-xs">
                    <MessageSquare className="w-4 h-4 text-terracotta-300" />
                  </div>
                  <div>
                    <h2 id="checkout-title" className="font-heading text-lg font-bold text-forest-950">
                      Complete WhatsApp Order
                    </h2>
                    <p className="text-xs text-charcoal-500">
                      Direct kitchen transmission to {businessConfig.shopName}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="p-1.5 text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-200/60 rounded-md transition-colors focus:outline-none cursor-pointer"
                  aria-label="Close checkout modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                
                {/* Post-Click Guidance Alert */}
                {orderSentStatus === 'opened' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-forest-50 border border-forest-600 rounded-lg text-left space-y-2 shadow-xs"
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-forest-950">
                      <CheckCircle2 className="w-4 h-4 text-forest-700" />
                      <span>WhatsApp Opened with Your Pre-Formatted Order</span>
                    </div>
                    <p className="text-xs text-charcoal-700 leading-relaxed">
                      Please tap <strong>Send</strong> inside your WhatsApp chat window to deliver your order to the kitchen.
                    </p>
                    <div className="text-[11px] text-charcoal-600 bg-white/80 p-2.5 rounded border border-forest-200 leading-relaxed">
                      <strong>Important Confirmation Notice:</strong> Opening WhatsApp initiates your order. The kitchen staff will review your message and reply with confirmation and pickup/dispatch timing.
                    </div>
                  </motion.div>
                )}

                {/* Error Message Alert */}
                {orderSentStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-300 rounded-lg text-left space-y-2"
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-red-900">
                      <AlertCircle className="w-4 h-4 text-red-700" />
                      <span>Setup Required</span>
                    </div>
                    <p className="text-xs text-red-800 leading-relaxed">
                      {errorMessage}
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSettingsOpen(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-900 underline underline-offset-4 cursor-pointer"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                      <span>Configure Verified WhatsApp Number Now</span>
                    </button>
                  </motion.div>
                )}

                {/* Order Items Overview Box */}
                <div className="bg-cream-100/70 border border-cream-200 rounded-lg p-3.5 text-xs space-y-2">
                  <div className="flex justify-between font-bold text-forest-950 border-b border-cream-200 pb-1.5">
                    <span>Order Summary ({cartItems.length} items)</span>
                    <span className="tabular-nums">Total: ₹{total}</span>
                  </div>
                  <ul className="space-y-1 text-charcoal-700 max-h-28 overflow-y-auto pr-1">
                    {cartItems.map(item => (
                      <li key={item.id} className="flex justify-between items-center text-[11px]">
                        <span className="truncate max-w-[280px]">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="tabular-nums font-medium text-forest-950">
                          ₹{item.price * item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Fulfillment Toggle */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-charcoal-700 uppercase tracking-wider">
                    Fulfillment Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('pickup')}
                      className={`p-2.5 rounded-lg border text-left flex items-center gap-2 text-xs transition-all cursor-pointer ${
                        fulfillmentType === 'pickup'
                          ? 'border-forest-800 bg-forest-50 text-forest-950 font-bold ring-2 ring-forest-800/30'
                          : 'border-cream-300 bg-white text-charcoal-700 hover:border-cream-400'
                      }`}
                    >
                      <Store className="w-4 h-4 text-forest-700 shrink-0" />
                      <span>Store Pickup (Free)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFulfillmentType('delivery')}
                      className={`p-2.5 rounded-lg border text-left flex items-center gap-2 text-xs transition-all cursor-pointer ${
                        fulfillmentType === 'delivery'
                          ? 'border-forest-800 bg-forest-50 text-forest-950 font-bold ring-2 ring-forest-800/30'
                          : 'border-cream-300 bg-white text-charcoal-700 hover:border-cream-400'
                      }`}
                    >
                      <Bike className="w-4 h-4 text-forest-700 shrink-0" />
                      <span>Delivery (Nagercoil)</span>
                    </button>
                  </div>
                </div>

                {/* Customer Details Form */}
                <div className="space-y-3 pt-1">
                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 mb-1">
                      Your Full Name <span className="text-terracotta-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerDetails.name}
                      onChange={(e) => {
                        setCustomerDetails(prev => ({ ...prev, name: e.target.value }));
                        if (formErrors.name) setFormErrors(prev => ({ ...prev, name: null }));
                      }}
                      placeholder="e.g. Ramesh Kumar"
                      className={`w-full px-3 py-2 text-xs sm:text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-800 ${
                        formErrors.name ? 'border-red-600 bg-red-50/20' : 'border-cream-300'
                      }`}
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-[11px] text-red-700 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        <span>{formErrors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Customer Phone (Optional / Recommended) */}
                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 mb-1">
                      Contact Phone Number <span className="text-charcoal-400 font-normal">(Optional for delivery calls)</span>
                    </label>
                    <input
                      type="tel"
                      value={customerDetails.phone}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="e.g. 94420 12345"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-800"
                    />
                  </div>

                  {/* Delivery Address (Conditional) */}
                  {fulfillmentType === 'delivery' && (
                    <div>
                      <label className="block text-xs font-bold text-charcoal-800 mb-1">
                        Delivery Address in Nagercoil <span className="text-terracotta-600">*</span>
                      </label>
                      <textarea
                        rows={2}
                        value={customerDetails.address}
                        onChange={(e) => {
                          setCustomerDetails(prev => ({ ...prev, address: e.target.value }));
                          if (formErrors.address) setFormErrors(prev => ({ ...prev, address: null }));
                        }}
                        placeholder="House/Door no., Street name, Landmark, Area in Nagercoil"
                        className={`w-full px-3 py-2 text-xs sm:text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-800 ${
                          formErrors.address ? 'border-red-600 bg-red-50/20' : 'border-cream-300'
                        }`}
                      />
                      {formErrors.address && (
                        <p className="mt-1 text-[11px] text-red-700 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3" />
                          <span>{formErrors.address}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Special Instructions */}
                  <div>
                    <label className="block text-xs font-bold text-charcoal-800 mb-1">
                      Special Kitchen Instructions <span className="text-charcoal-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={customerDetails.notes}
                      onChange={(e) => setCustomerDetails(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="e.g. Extra salna packet, mild spice, etc."
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-800"
                    />
                  </div>

                </div>

                {/* Target WhatsApp Info & Live Message Preview Accordion */}
                <div className="pt-2 border-t border-cream-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-charcoal-600">
                      Target: <code className="font-mono text-forest-900 bg-cream-200/60 px-1.5 py-0.5 rounded font-semibold">{businessConfig.whatsAppOrderingNumber}</code>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="inline-flex items-center gap-1 text-forest-800 hover:text-forest-950 font-bold underline underline-offset-2 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{showPreview ? 'Hide Message Preview' : 'Preview Message Text'}</span>
                    </button>
                  </div>

                  {showPreview && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 bg-charcoal-900 text-cream-100 rounded-lg font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-all overflow-x-auto max-h-48 border border-charcoal-800 shadow-inner"
                    >
                      {generateWhatsAppOrderLink({
                        phoneNumber: businessConfig.whatsAppOrderingNumber,
                        shopName: businessConfig.shopName,
                        cartItems,
                        subtotal,
                        deliveryFee,
                        total,
                        fulfillmentType,
                        customerDetails
                      }).messageText}
                    </motion.div>
                  )}
                </div>

              </div>

              {/* Modal Actions */}
              <div className="px-6 py-4 bg-cream-100 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-charcoal-700 hover:text-charcoal-900 order-2 sm:order-1 cursor-pointer"
                >
                  Back to Cart
                </button>

                <motion.button
                  whileTap={{ scale: 0.985 }}
                  type="button"
                  onClick={handleSendWhatsAppOrder}
                  className="w-full sm:w-auto px-6 py-3 bg-forest-900 hover:bg-forest-800 active:bg-forest-950 text-cream-50 font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-forest-700 order-1 sm:order-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-terracotta-300" />
                  <span>Send Order via WhatsApp (₹{total})</span>
                </motion.button>
              </div>

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
