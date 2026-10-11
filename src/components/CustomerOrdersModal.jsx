import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, CheckCircle2, AlertCircle, ShoppingBag, Search, Bike, Store, ArrowRight, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '../context/CartContext';

const STATUS_STEPS = [
  { key: 'Pending', label: 'Order Placed', desc: 'Received by kitchen' },
  { key: 'Preparing', label: 'Preparing', desc: 'Cooking fresh' },
  { key: 'Ready for delivery', label: 'Ready', desc: 'Packed & ready' },
  { key: 'Out for delivery', label: 'Dispatched', desc: 'On the way' },
  { key: 'Delivered', label: 'Delivered', desc: 'Completed' }
];

const getStepIndex = (status) => {
  if (!status) return 0;
  const s = status.toLowerCase();
  if (s.includes('deliver') && !s.includes('ready') && !s.includes('out')) return 4;
  if (s.includes('out')) return 3;
  if (s.includes('ready')) return 2;
  if (s.includes('prepar') || s.includes('confirm')) return 1;
  return 0;
};

export const CustomerOrdersModal = () => {
  const { isOrdersOpen, setIsOrdersOpen, customerOrders, businessConfig } = useCart();
  const [lookupId, setLookupId] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOrdersOpen) {
        setIsOrdersOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOrdersOpen, setIsOrdersOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOrdersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOrdersOpen]);

  const handleLookup = async (e) => {
    e.preventDefault();
    const cleanId = lookupId.trim();
    if (!cleanId) return;

    try {
      setIsSearching(true);
      setSearchError(null);
      setLookupResult(null);

      // Fetch from backend
      const res = await fetch('/api/orders');
      if (res.ok) {
        const orders = await res.json();
        const found = orders.find(
          o => o.id.toLowerCase() === cleanId.toLowerCase() ||
               (o.phone && o.phone.replace(/[^\d]/g, '').slice(-10) === cleanId.replace(/[^\d]/g, '').slice(-10))
        );
        if (found) {
          setLookupResult(found);
          setExpandedOrderId(found.id);
        } else {
          setSearchError('No order found matching that reference or phone number.');
        }
      } else {
        setSearchError('Unable to connect to order server. Please try again.');
      }
    } catch (err) {
      setSearchError('Connection error while fetching order.');
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOrdersOpen) return null;

  // Combine orders list: lookup result if any, plus stored orders
  const displayOrders = [...(customerOrders || [])];
  if (lookupResult && !displayOrders.some(o => o.id === lookupResult.id)) {
    displayOrders.unshift(lookupResult);
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="Order History & Tracking"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-xs"
          onClick={() => setIsOrdersOpen(false)}
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col border border-cream-200"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-cream-100 border-b border-cream-200 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-forest-900 text-cream-50 flex items-center justify-center shadow-xs">
                <Clock className="w-4 h-4 text-terracotta-300" />
              </div>
              <div className="text-left">
                <h2 className="font-heading text-base sm:text-lg font-bold text-forest-950 leading-tight">
                  Order Tracking & History
                </h2>
                <span className="text-[11px] text-charcoal-500">
                  Live Cash on Delivery Orders
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOrdersOpen(false)}
              className="p-1.5 text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-200 rounded-md transition-colors"
              aria-label="Close orders modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 flex-1 overflow-y-auto space-y-5 text-left">
            {/* Search / Lookup Form */}
            <form onSubmit={handleLookup} className="space-y-2">
              <label htmlFor="orderLookup" className="text-xs font-bold text-charcoal-700 uppercase tracking-wide">
                Track by Order Reference or Mobile
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
                  <input
                    id="orderLookup"
                    type="text"
                    value={lookupId}
                    onChange={(e) => setLookupId(e.target.value)}
                    placeholder="e.g. COD-423427-795 or phone number"
                    className="w-full pl-9 pr-3 py-2 bg-cream-50 border border-cream-300 rounded-md text-xs text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-forest-700"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching || !lookupId.trim()}
                  className="px-3.5 py-2 bg-forest-900 text-cream-50 font-semibold text-xs rounded-md shadow-2xs hover:bg-forest-800 disabled:opacity-50 transition-colors"
                >
                  {isSearching ? 'Searching...' : 'Track'}
                </button>
              </div>
              {searchError && (
                <p className="text-xs text-red-600 flex items-center gap-1 pt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{searchError}</span>
                </p>
              )}
            </form>

            {/* Orders List */}
            {displayOrders.length > 0 ? (
              <div className="space-y-4">
                <div className="text-xs font-bold text-charcoal-700 uppercase tracking-wide flex items-center justify-between">
                  <span>Recent Orders ({displayOrders.length})</span>
                </div>

                {displayOrders.map((order) => {
                  const currentStepIdx = getStepIndex(order.status);
                  const isExpanded = expandedOrderId === order.id;

                  return (
                    <div
                      key={order.id}
                      className="border border-cream-200 rounded-xl bg-white shadow-2xs overflow-hidden"
                    >
                      {/* Top Bar of Order Card */}
                      <div
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="p-4 bg-cream-50/60 flex items-center justify-between cursor-pointer hover:bg-cream-100/50 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-xs text-forest-950">
                              {order.id}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              order.status === 'Delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {order.status || 'Pending'}
                            </span>
                          </div>
                          <span className="text-[11px] text-charcoal-500">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-sm text-forest-950 tabular-nums">
                            ₹{order.total}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-charcoal-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-charcoal-400" />
                          )}
                        </div>
                      </div>

                      {/* Live Progress Stepper */}
                      <div className="px-4 py-3 border-t border-cream-200/80 bg-white">
                        <div className="grid grid-cols-5 gap-1 text-center relative mb-2">
                          {STATUS_STEPS.map((step, idx) => {
                            const isCompleted = idx <= currentStepIdx;
                            const isCurrent = idx === currentStepIdx;

                            return (
                              <div key={step.key} className="flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 ${
                                  isCompleted
                                    ? 'bg-forest-900 text-cream-50'
                                    : 'bg-cream-200 text-charcoal-400'
                                }`}>
                                  {isCompleted ? '✓' : idx + 1}
                                </div>
                                <span className={`text-[9px] leading-tight ${
                                  isCurrent ? 'font-bold text-forest-950' : 'text-charcoal-500'
                                }`}>
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Expandable Order Details */}
                      {isExpanded && (
                        <div className="p-4 bg-cream-50/30 border-t border-cream-200 text-xs space-y-3">
                          <div className="space-y-1.5">
                            <span className="font-bold text-charcoal-700 uppercase text-[10px] tracking-wide">
                              Items Ordered
                            </span>
                            {order.items && order.items.map((item, i) => (
                              <div key={i} className="flex justify-between items-center text-charcoal-800">
                                <span>{item.quantity} × {item.name}</span>
                                <span className="font-semibold tabular-nums">₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-cream-200/60 flex justify-between items-center text-charcoal-700">
                            <span>Payment Method:</span>
                            <span className="font-bold text-forest-950">Cash on Delivery (₹{order.total})</span>
                          </div>

                          {order.address && (
                            <div className="text-[11px] text-charcoal-600">
                              <span className="font-semibold">Delivery Address: </span>
                              <span>{order.address}, {order.locality || 'Nagercoil'}</span>
                            </div>
                          )}

                          {/* WhatsApp Chat Inquiry Button */}
                          <div className="pt-2">
                            <a
                              href={`https://wa.me/${businessConfig.whatsAppOrderingNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                                `Hello ${businessConfig.shopName}, I would like to check on my order ${order.id} for Rs. ${order.total}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-forest-100 hover:bg-forest-200/70 text-forest-950 font-semibold text-xs rounded-md transition-colors"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-forest-700" />
                              <span>Message Kitchen on WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-charcoal-500 space-y-2">
                <ShoppingBag className="w-10 h-10 mx-auto text-charcoal-300 stroke-[1.5]" />
                <h4 className="text-sm font-bold text-charcoal-700">No Orders Placed Yet</h4>
                <p className="text-xs text-charcoal-500 max-w-xs mx-auto">
                  When you place an order with Cash on Delivery, your order tracking status and kitchen updates will appear here automatically.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
