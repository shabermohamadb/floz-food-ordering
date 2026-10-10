import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  MapPin,
  Phone,
  User,
  Store,
  Bike,
  Banknote,
  Clock,
  MessageSquare,
  Plus,
  Minus,
  Trash2,
  FileText,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { generateWhatsAppOrderLink } from '../utils/whatsappFormatter';

const NAGERCOIL_LOCALITIES = [
  'Vadasery',
  'Kottar',
  'Asambu Road',
  'Chettikulam',
  'Meenakshipuram',
  'Ramavarmapuram',
  'Tower Junction',
  'Ozhuginasery',
  'Veerapathiran Street',
  'Derrick Junction',
  'Kollancode Road',
  'Other Area in Nagercoil'
];

export const CODCheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    businessConfig,
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    total,
    fulfillmentType,
    setFulfillmentType,
    customerDetails,
    setCustomerDetails,
    placedOrder,
    isPlacingOrder,
    orderError,
    setOrderError,
    placeCODOrder,
    resetCheckout
  } = useCart();

  // Active Wizard Step: 1: Cart, 2: Details, 3: Payment, 4: Confirm
  const [currentStep, setCurrentStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [waLinkOpened, setWaLinkOpened] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.style.overflow = 'hidden';
      if (!placedOrder) {
        setCurrentStep(1);
        setFormErrors({});
      }
    } else {
      document.body.style.overflow = '';
      setWaLinkOpened(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCheckoutOpen, placedOrder]);

  if (!isCheckoutOpen) return null;

  // Validation for Step 2
  const validateCustomerDetails = () => {
    const errors = {};
    if (!customerDetails.name || !customerDetails.name.trim() || customerDetails.name.trim().length < 2) {
      errors.name = 'Please enter your full name';
    }

    const cleanPhone = (customerDetails.phone || '').replace(/[^\d]/g, '').slice(-10);
    if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)';
    }

    if (fulfillmentType === 'delivery') {
      if (!customerDetails.address || !customerDetails.address.trim() || customerDetails.address.trim().length < 5) {
        errors.address = 'Please enter your street address or building details';
      }
      if (!customerDetails.locality || !customerDetails.locality.trim()) {
        errors.locality = 'Please select or enter your area in Nagercoil';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextFromDetails = () => {
    if (validateCustomerDetails()) {
      setCurrentStep(3);
    }
  };

  const handlePlaceOrderSubmit = async () => {
    if (isPlacingOrder) return;
    const res = await placeCODOrder();
    if (res.success) {
      // Order placed, placedOrder state is set, automatically moves to confirmation view
    }
  };

  const handleSendWhatsApp = () => {
    if (!placedOrder) return;

    const result = generateWhatsAppOrderLink({
      phoneNumber: businessConfig.whatsAppOrderingNumber,
      shopName: businessConfig.shopName,
      orderId: placedOrder.id,
      cartItems: placedOrder.items,
      subtotal: placedOrder.subtotal,
      deliveryFee: placedOrder.deliveryFee,
      total: placedOrder.total,
      fulfillmentType: placedOrder.fulfillmentType,
      customerDetails: {
        name: placedOrder.customerName,
        phone: placedOrder.phone,
        address: placedOrder.address,
        locality: placedOrder.locality,
        landmark: placedOrder.landmark,
        notes: placedOrder.deliveryInstructions
      }
    });

    if (result.success) {
      window.open(result.url, '_blank', 'noopener,noreferrer');
      setWaLinkOpened(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={resetCheckout}
        className="fixed inset-0 bg-forest-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-4 md:p-6 relative z-10 text-charcoal-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-white border border-cream-200 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden text-left"
        >

          {/* ========================================================================= */}
          {/* HEADER BAR                                                                */}
          {/* ========================================================================= */}
          <div className="px-5 py-4 bg-forest-950 text-cream-50 flex items-center justify-between border-b border-forest-900">
            <div>
              <div className="text-[11px] font-semibold text-terracotta-300 uppercase tracking-wider">
                {placedOrder ? 'Order Confirmation' : 'Cash on Delivery Checkout'}
              </div>
              <h2 className="text-base sm:text-lg font-bold font-heading text-white">
                {placedOrder ? 'Thank You for Your Order' : businessConfig.shopName}
              </h2>
            </div>

            <button
              onClick={resetCheckout}
              className="p-1.5 rounded-lg text-cream-300 hover:text-white hover:bg-forest-900 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ========================================================================= */}
          {/* VIEW A: DEDICATED ORDER CONFIRMATION SCREEN (When placedOrder exists)     */}
          {/* ========================================================================= */}
          {placedOrder ? (
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Success Badge */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h3 className="text-xl font-bold font-heading text-forest-950">
                  Order Placed Successfully
                </h3>
                <p className="text-xs text-charcoal-600 max-w-md mx-auto leading-relaxed">
                  Your order has been recorded in our kitchen system. Payment will be collected in cash upon delivery.
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cream-100 border border-cream-300 rounded-md font-mono text-xs font-bold text-forest-950">
                    <span>Order Reference:</span>
                    <span className="text-terracotta-700">{placedOrder.id}</span>
                  </span>
                </div>
              </div>

              {/* Order Highlights Box */}
              <div className="p-4 bg-cream-50 border border-cream-200 rounded-xl space-y-3 text-xs">
                
                {/* Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-cream-200">
                  <div>
                    <span className="text-charcoal-500 block text-[11px]">Customer:</span>
                    <strong className="text-forest-950 font-bold">{placedOrder.customerName}</strong>
                    <div className="text-charcoal-600">{placedOrder.phone}</div>
                  </div>
                  <div>
                    <span className="text-charcoal-500 block text-[11px]">Fulfillment:</span>
                    <strong className="text-forest-950 font-bold capitalize">
                      {placedOrder.fulfillmentType === 'delivery' ? 'Home Delivery (Nagercoil)' : 'Store Pickup / Takeaway'}
                    </strong>
                    {placedOrder.fulfillmentType === 'delivery' && (
                      <div className="text-charcoal-600 truncate">{placedOrder.address}, {placedOrder.locality}</div>
                    )}
                  </div>
                </div>

                {/* Items Breakdown */}
                <div>
                  <span className="text-charcoal-500 block text-[11px] mb-1 font-semibold uppercase tracking-wider">
                    Ordered Dishes:
                  </span>
                  <ul className="divide-y divide-cream-200/80">
                    {placedOrder.items.map((it, idx) => (
                      <li key={idx} className="py-1.5 flex justify-between items-center">
                        <span className="text-charcoal-800">
                          <strong className="font-semibold">{it.quantity}x</strong> {it.name}
                        </span>
                        <span className="tabular-nums font-semibold text-forest-950">
                          ₹{it.subtotal}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Financial Totals */}
                <div className="pt-2 border-t border-cream-200 space-y-1">
                  <div className="flex justify-between text-charcoal-600">
                    <span>Items Subtotal:</span>
                    <span className="tabular-nums">₹{placedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-600">
                    <span>Delivery Fee:</span>
                    <span className="tabular-nums font-medium text-forest-800">
                      {placedOrder.deliveryFee === 0 ? 'Free' : `₹${placedOrder.deliveryFee}`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-cream-300 flex justify-between text-sm font-bold text-forest-950">
                    <span>Total Payable Amount (COD):</span>
                    <span className="tabular-nums text-forest-900 text-base">₹{placedOrder.total}</span>
                  </div>
                </div>

                {/* COD Specific Banner */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 flex items-start gap-2.5">
                  <Banknote className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-950">Payment Method: Cash on Delivery</div>
                    <div className="text-[11px] text-amber-800 font-normal">
                      Please keep exact cash of ₹{placedOrder.total} ready when our delivery partner arrives at your address.
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleSendWhatsApp}
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>
                    {waLinkOpened ? 'Resend Order Details on WhatsApp' : 'Send Order Details on WhatsApp'}
                  </span>
                </button>

                <p className="text-[11px] text-charcoal-500 text-center leading-normal">
                  Your order is already saved in the shop system. Sending order details on WhatsApp notifies the shop counter immediately.
                </p>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={resetCheckout}
                    className="px-6 py-2.5 bg-cream-100 hover:bg-cream-200 text-charcoal-800 text-xs font-bold rounded-lg border border-cream-300 transition-colors cursor-pointer"
                  >
                    Back to Menu / Order More
                  </button>
                </div>
              </div>

            </div>
          ) : (

            /* ========================================================================= */
            /* VIEW B: 4-STEP STREAMLINED CHECKOUT WIZARD                                 */
            /* ========================================================================= */
            <div>
              {/* Stepper Tabs Bar */}
              <div className="bg-cream-100 border-b border-cream-200 px-5 py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                      currentStep === 1 ? 'text-forest-950 font-bold' : 'text-charcoal-500 hover:text-forest-900'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                      currentStep === 1 ? 'bg-forest-900 text-white' : 'bg-cream-300 text-charcoal-700'
                    }`}>1</span>
                    <span className="hidden sm:inline">Review</span> Cart
                  </button>

                  <span className="text-cream-300">/</span>

                  <button
                    onClick={() => {
                      if (currentStep > 2 || cartItems.length > 0) setCurrentStep(2);
                    }}
                    className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                      currentStep === 2 ? 'text-forest-950 font-bold' : 'text-charcoal-500 hover:text-forest-900'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                      currentStep === 2 ? 'bg-forest-900 text-white' : 'bg-cream-300 text-charcoal-700'
                    }`}>2</span>
                    Details
                  </button>

                  <span className="text-cream-300">/</span>

                  <button
                    onClick={() => {
                      if (currentStep >= 3) setCurrentStep(3);
                      else handleNextFromDetails();
                    }}
                    className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                      currentStep === 3 ? 'text-forest-950 font-bold' : 'text-charcoal-500 hover:text-forest-900'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                      currentStep === 3 ? 'bg-forest-900 text-white' : 'bg-cream-300 text-charcoal-700'
                    }`}>3</span>
                    Payment
                  </button>

                  <span className="text-cream-300">/</span>

                  <button
                    onClick={() => {
                      if (validateCustomerDetails()) setCurrentStep(4);
                    }}
                    className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                      currentStep === 4 ? 'text-forest-950 font-bold' : 'text-charcoal-500 hover:text-forest-900'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                      currentStep === 4 ? 'bg-forest-900 text-white' : 'bg-cream-300 text-charcoal-700'
                    }`}>4</span>
                    Confirm
                  </button>
                </div>

                <div className="text-[11px] font-bold text-forest-900 bg-white px-2.5 py-1 rounded border border-cream-300">
                  Total: ₹{total}
                </div>
              </div>

              {/* Error Alert Box (if placement failed) */}
              {orderError && (
                <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <strong className="font-semibold">Unable to place order:</strong> {orderError}
                  </div>
                  <button
                    onClick={() => setOrderError(null)}
                    className="text-red-500 hover:text-red-800 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* STEP 1: REVIEW CART */}
              {currentStep === 1 && (
                <div className="p-5 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                    <span className="font-heading font-bold text-sm text-forest-950">
                      Dishes in Your Order ({cartItems.length})
                    </span>
                    <span className="text-xs text-charcoal-500">
                      Cash on Delivery
                    </span>
                  </div>

                  {cartItems.length === 0 ? (
                    <div className="py-8 text-center text-xs text-charcoal-500">
                      Your cart is empty. Please add items from the menu first.
                    </div>
                  ) : (
                    <ul className="divide-y divide-cream-200">
                      {cartItems.map((item) => (
                        <li key={item.id} className="py-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <img
                              src={item.image}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover bg-cream-200 shrink-0 border border-cream-200"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs sm:text-sm text-forest-950 truncate">
                                {item.name}
                              </h4>
                              <div className="text-xs text-charcoal-500 tabular-nums">
                                ₹{item.price} each
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="inline-flex items-center border border-cream-300 rounded bg-white overflow-hidden shadow-2xs">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2 py-1 text-charcoal-600 hover:bg-cream-100 transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold tabular-nums min-w-[1.25rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-1 text-charcoal-600 hover:bg-cream-100 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="text-xs font-bold tabular-nums w-14 text-right text-forest-950">
                              ₹{item.price * item.quantity}
                            </span>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 text-charcoal-400 hover:text-red-700 transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Pricing Breakdown */}
                  <div className="pt-3 border-t border-cream-200 space-y-1.5 text-xs text-charcoal-700">
                    <div className="flex justify-between">
                      <span>Items Subtotal</span>
                      <span className="font-semibold tabular-nums">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Delivery Fee</span>
                      <span className="font-semibold text-forest-800">
                        {fulfillmentType === 'delivery' ? '₹30' : 'Free (Pickup)'}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-cream-300 flex justify-between text-sm font-bold text-forest-950">
                      <span>Total Payable in Cash</span>
                      <span className="tabular-nums text-forest-900 text-base">₹{total}</span>
                    </div>
                  </div>

                  {/* Footer CTAs */}
                  <div className="pt-3 flex items-center justify-between gap-3">
                    <button
                      onClick={resetCheckout}
                      className="px-4 py-2.5 text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={cartItems.length === 0}
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-2.5 bg-forest-900 hover:bg-forest-800 disabled:opacity-50 text-cream-50 font-bold text-xs sm:text-sm rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <span>Customer Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: CUSTOMER DETAILS */}
              {currentStep === 2 && (
                <div className="p-5 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                  <div className="pb-1">
                    <h3 className="font-heading font-bold text-sm text-forest-950">
                      Customer & Delivery Address
                    </h3>
                    <p className="text-xs text-charcoal-500">
                      Enter your contact information so our delivery rider can reach you.
                    </p>
                  </div>

                  {/* Fulfillment Type Toggle */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-forest-950">
                      Fulfillment Option
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setFulfillmentType('delivery')}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                          fulfillmentType === 'delivery'
                            ? 'bg-forest-900/5 border-forest-900 ring-1 ring-forest-900 text-forest-950'
                            : 'bg-white border-cream-300 text-charcoal-700 hover:bg-cream-50'
                        }`}
                      >
                        <Bike className="w-4 h-4 text-forest-800 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold">Home Delivery</div>
                          <div className="text-[11px] text-charcoal-500">Nagercoil (₹30 fee)</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFulfillmentType('pickup')}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                          fulfillmentType === 'pickup'
                            ? 'bg-forest-900/5 border-forest-900 ring-1 ring-forest-900 text-forest-950'
                            : 'bg-white border-cream-300 text-charcoal-700 hover:bg-cream-50'
                        }`}
                      >
                        <Store className="w-4 h-4 text-forest-800 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold">Store Takeaway</div>
                          <div className="text-[11px] text-charcoal-500">Self Pickup (Free)</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-charcoal-800 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                        <input
                          type="text"
                          value={customerDetails.name}
                          onChange={(e) => {
                            setCustomerDetails({ ...customerDetails, name: e.target.value });
                            if (formErrors.name) setFormErrors({ ...formErrors, name: null });
                          }}
                          placeholder="e.g. Anand Kumar"
                          className={`w-full pl-9 pr-3 py-2 bg-cream-50/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-700 ${
                            formErrors.name ? 'border-red-400 bg-red-50/30' : 'border-cream-300'
                          }`}
                        />
                      </div>
                      {formErrors.name && (
                        <p className="text-[11px] text-red-600 mt-1 font-medium">{formErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-charcoal-800 mb-1">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
                        <input
                          type="tel"
                          maxLength={10}
                          value={customerDetails.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setCustomerDetails({ ...customerDetails, phone: val });
                            if (formErrors.phone) setFormErrors({ ...formErrors, phone: null });
                          }}
                          placeholder="10-digit number (e.g. 9876543210)"
                          className={`w-full pl-9 pr-3 py-2 bg-cream-50/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-700 ${
                            formErrors.phone ? 'border-red-400 bg-red-50/30' : 'border-cream-300'
                          }`}
                        />
                      </div>
                      {formErrors.phone && (
                        <p className="text-[11px] text-red-600 mt-1 font-medium">{formErrors.phone}</p>
                      )}
                    </div>

                    {fulfillmentType === 'delivery' && (
                      <>
                        <div>
                          <label className="block font-bold text-charcoal-800 mb-1">
                            Complete Street Address <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <MapPin className="w-4 h-4 absolute left-3 top-3 text-charcoal-400" />
                            <textarea
                              rows={2}
                              value={customerDetails.address}
                              onChange={(e) => {
                                setCustomerDetails({ ...customerDetails, address: e.target.value });
                                if (formErrors.address) setFormErrors({ ...formErrors, address: null });
                              }}
                              placeholder="House/Door no., building name, street name"
                              className={`w-full pl-9 pr-3 py-2 bg-cream-50/50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-700 ${
                                formErrors.address ? 'border-red-400 bg-red-50/30' : 'border-cream-300'
                              }`}
                            />
                          </div>
                          {formErrors.address && (
                            <p className="text-[11px] text-red-600 mt-1 font-medium">{formErrors.address}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-charcoal-800 mb-1">
                              Area / Locality in Nagercoil <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={customerDetails.locality}
                              onChange={(e) => {
                                setCustomerDetails({ ...customerDetails, locality: e.target.value });
                                if (formErrors.locality) setFormErrors({ ...formErrors, locality: null });
                              }}
                              className="w-full px-3 py-2 bg-cream-50/50 border border-cream-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-700"
                            >
                              {NAGERCOIL_LOCALITIES.map((loc) => (
                                <option key={loc} value={loc}>{loc}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block font-bold text-charcoal-800 mb-1">
                              Nearby Landmark (Optional)
                            </label>
                            <input
                              type="text"
                              value={customerDetails.landmark}
                              onChange={(e) => setCustomerDetails({ ...customerDetails, landmark: e.target.value })}
                              placeholder="e.g. Near St. Joseph Church"
                              className="w-full px-3 py-2 bg-cream-50/50 border border-cream-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-700"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block font-bold text-charcoal-800 mb-1">
                        Kitchen / Delivery Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        value={customerDetails.notes}
                        onChange={(e) => setCustomerDetails({ ...customerDetails, notes: e.target.value })}
                        placeholder="e.g. Less spicy, extra mayonnaise, call when nearby"
                        className="w-full px-3 py-2 bg-cream-50/50 border border-cream-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-700"
                      />
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="pt-3 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2.5 text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Cart</span>
                    </button>
                    <button
                      onClick={handleNextFromDetails}
                      className="px-6 py-2.5 bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs sm:text-sm rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <span>Payment Method</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT METHOD (STRICTLY CASH ON DELIVERY ONLY) */}
              {currentStep === 3 && (
                <div className="p-5 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                  <div className="pb-1">
                    <h3 className="font-heading font-bold text-sm text-forest-950">
                      Payment Method
                    </h3>
                    <p className="text-xs text-charcoal-500">
                      Select your preferred payment method.
                    </p>
                  </div>

                  {/* The Only Active Option: Cash on Delivery */}
                  <div className="p-4 bg-forest-950/5 border-2 border-forest-900 rounded-xl relative shadow-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-forest-900 text-cream-50 flex items-center justify-center shrink-0 shadow-2xs">
                          <Banknote className="w-5 h-5 text-terracotta-300" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-sm text-forest-950">
                              Cash on Delivery (COD)
                            </span>
                            <span className="px-2 py-0.5 bg-forest-900 text-cream-50 text-[10px] font-bold rounded">
                              Selected
                            </span>
                          </div>
                          <p className="text-xs text-charcoal-700 mt-1 leading-relaxed">
                            {fulfillmentType === 'delivery'
                              ? 'Pay in cash when your order is delivered to your doorstep.'
                              : 'Pay in cash at the restaurant counter when collecting your food.'}
                          </p>
                        </div>
                      </div>

                      <div className="w-5 h-5 rounded-full bg-forest-900 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-forest-900/15 flex items-center gap-2 text-[11px] text-charcoal-600 font-medium">
                      <ShieldCheck className="w-4 h-4 text-forest-800" />
                      <span>No online payments, UPI gateways, or advance card details required.</span>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-3.5 bg-cream-50 border border-cream-200 rounded-lg text-xs space-y-1.5">
                    <div className="flex justify-between text-charcoal-600">
                      <span>Order Subtotal:</span>
                      <span className="tabular-nums font-semibold">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-charcoal-600">
                      <span>Delivery Charge:</span>
                      <span className="tabular-nums font-semibold text-forest-800">
                        {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-cream-300 flex justify-between font-bold text-sm text-forest-950">
                      <span>Total Cash to Pay:</span>
                      <span className="tabular-nums text-forest-900 text-base">₹{total}</span>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="pt-3 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2.5 text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Details</span>
                    </button>
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="px-6 py-2.5 bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs sm:text-sm rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <span>Review & Confirm</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: FINAL ORDER CONFIRMATION & PLACE ORDER */}
              {currentStep === 4 && (
                <div className="p-5 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                  <div className="pb-1">
                    <h3 className="font-heading font-bold text-sm text-forest-950">
                      Confirm Cash on Delivery Order
                    </h3>
                    <p className="text-xs text-charcoal-500">
                      Review all details before submitting to our kitchen.
                    </p>
                  </div>

                  {/* Review Cards */}
                  <div className="space-y-3 text-xs">
                    
                    {/* Customer & Address Card */}
                    <div className="p-3 bg-cream-50 border border-cream-200 rounded-lg space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-forest-950">Customer Information</span>
                        <button
                          onClick={() => setCurrentStep(2)}
                          className="text-terracotta-700 hover:text-terracotta-900 text-[11px] font-semibold underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="text-charcoal-800 font-medium">
                        {customerDetails.name} · {customerDetails.phone}
                      </div>
                      <div className="text-charcoal-600">
                        {fulfillmentType === 'delivery' ? (
                          <>
                            <span className="font-semibold text-forest-900">Delivery Address: </span>
                            {customerDetails.address}, {customerDetails.locality}
                            {customerDetails.landmark && ` (Near ${customerDetails.landmark})`}
                          </>
                        ) : (
                          <span className="font-semibold text-forest-900">Self Pickup at A-One Shawarma Spot</span>
                        )}
                      </div>
                      {customerDetails.notes && (
                        <div className="text-charcoal-500 italic">
                          Notes: {customerDetails.notes}
                        </div>
                      )}
                    </div>

                    {/* Items Card */}
                    <div className="p-3 bg-cream-50 border border-cream-200 rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-forest-950">Items Ordered ({cartItems.length})</span>
                        <button
                          onClick={() => setCurrentStep(1)}
                          className="text-terracotta-700 hover:text-terracotta-900 text-[11px] font-semibold underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                      <ul className="divide-y divide-cream-200/80">
                        {cartItems.map((it) => (
                          <li key={it.id} className="py-1 flex justify-between items-center">
                            <span className="text-charcoal-800 truncate max-w-[320px]">
                              {it.quantity}x {it.name}
                            </span>
                            <span className="tabular-nums font-semibold text-forest-950">
                              ₹{it.price * it.quantity}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Payment Summary */}
                    <div className="p-3 bg-forest-900/5 border border-forest-900/20 rounded-lg space-y-1.5">
                      <div className="flex justify-between text-charcoal-700">
                        <span>Payment Method</span>
                        <span className="font-bold text-forest-950">Cash on Delivery (COD)</span>
                      </div>
                      <div className="flex justify-between text-charcoal-700">
                        <span>Items Subtotal</span>
                        <span className="tabular-nums font-semibold">₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-charcoal-700">
                        <span>Delivery Fee</span>
                        <span className="tabular-nums font-semibold text-forest-800">
                          {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-forest-900/20 flex justify-between font-bold text-sm text-forest-950">
                        <span>Total Payable Amount</span>
                        <span className="tabular-nums text-forest-900 text-lg">₹{total}</span>
                      </div>
                    </div>

                  </div>

                  {/* Submit CTA */}
                  <div className="pt-3 flex items-center justify-between gap-3">
                    <button
                      disabled={isPlacingOrder}
                      onClick={() => setCurrentStep(3)}
                      className="px-4 py-2.5 text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>

                    <button
                      disabled={isPlacingOrder}
                      onClick={handlePlaceOrderSubmit}
                      className="flex-1 max-w-sm py-3 px-6 bg-forest-900 hover:bg-forest-800 disabled:opacity-60 text-cream-50 font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      {isPlacingOrder ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Placing Order Securely...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Place Order (Cash on Delivery)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
};
