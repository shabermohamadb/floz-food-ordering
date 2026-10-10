import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Store, Bike, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemCount,
    subtotal,
    deliveryFee,
    total,
    fulfillmentType,
    setFulfillmentType,
    setIsCheckoutOpen
  } = useCart();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Cart"
        >
          {/* Backdrop with fade-in / fade-out */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-xs"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Sliding Drawer Container with Spring Physics */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-cream-50 shadow-2xl flex flex-col justify-between border-l border-cream-200 z-10"
            >
              
              {/* Header */}
              <div className="px-6 py-5 bg-cream-100 border-b border-cream-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-md bg-forest-900 text-cream-50 flex items-center justify-center shadow-xs">
                    <ShoppingBag className="w-4 h-4 text-terracotta-300" />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-bold text-forest-950 leading-tight">
                      Your Order Cart
                    </h2>
                    <span className="text-[11px] text-charcoal-500">
                      {itemCount === 1 ? '1 item selected' : `${itemCount} items selected`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="bg-forest-900 text-cream-50 text-xs font-bold px-2 py-0.5 rounded-full tabular-nums"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1.5 text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-200/60 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-forest-700"
                    aria-label="Close cart drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Cart Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                
                {cartItems.length > 0 ? (
                  <>
                    {/* Fulfillment Mode Selection */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-bold text-charcoal-700 uppercase tracking-wider">
                        Fulfillment Preference
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setFulfillmentType('pickup')}
                          className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                            fulfillmentType === 'pickup'
                              ? 'border-forest-800 bg-forest-50 text-forest-950 font-bold ring-2 ring-forest-800/30'
                              : 'border-cream-300 bg-white text-charcoal-700 hover:border-cream-400'
                          }`}
                        >
                          <Store className="w-4 h-4 text-forest-700 mt-0.5 shrink-0" />
                          <div>
                            <div className="text-xs">Takeaway Pickup</div>
                            <div className="text-[10px] text-charcoal-500 font-normal">Direct shop counter</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFulfillmentType('delivery')}
                          className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                            fulfillmentType === 'delivery'
                              ? 'border-forest-800 bg-forest-50 text-forest-950 font-bold ring-2 ring-forest-800/30'
                              : 'border-cream-300 bg-white text-charcoal-700 hover:border-cream-400'
                          }`}
                        >
                          <Bike className="w-4 h-4 text-forest-700 mt-0.5 shrink-0" />
                          <div>
                            <div className="text-xs">Home Delivery</div>
                            <div className="text-[10px] text-charcoal-500 font-normal">Nagercoil & nearby</div>
                          </div>
                        </button>
                      </div>

                      {fulfillmentType === 'delivery' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-start gap-2 p-2.5 bg-cream-100 border border-cream-200 rounded-md text-[11px] text-charcoal-600"
                        >
                          <Info className="w-3.5 h-3.5 text-forest-700 mt-0.5 shrink-0" />
                          <span>
                            Delivery radius and distance fee will be confirmed directly by the shop on WhatsApp prior to dispatch.
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Items List */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-xs text-charcoal-500">
                        <span className="font-semibold uppercase tracking-wider text-[11px]">Selected Dishes</span>
                        <button
                          onClick={clearCart}
                          className="text-terracotta-600 hover:text-terracotta-800 font-medium text-xs underline underline-offset-2 transition-colors cursor-pointer"
                        >
                          Clear all
                        </button>
                      </div>

                      <ul className="divide-y divide-cream-200 border-y border-cream-200">
                        <AnimatePresence initial={false}>
                          {cartItems.map((item) => (
                            <motion.li
                              key={item.id}
                              layout
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="py-3.5 flex items-center justify-between gap-3 text-left overflow-hidden"
                            >
                              
                              {/* Thumbnail & Info */}
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <img
                                  src={item.image}
                                  alt=""
                                  className="w-12 h-12 rounded-lg object-cover bg-cream-200 shrink-0 border border-cream-200 shadow-2xs"
                                />
                                <div className="min-w-0">
                                  <h4 className="font-heading text-xs sm:text-sm font-bold text-forest-950 truncate">
                                    {item.name}
                                  </h4>
                                  <div className="text-xs text-charcoal-500 tabular-nums">
                                    ₹{item.price} each
                                  </div>
                                </div>
                              </div>

                              {/* Quantity Stepper & Price */}
                              <div className="flex items-center gap-3 shrink-0">
                                <div className="inline-flex items-center border border-cream-300 rounded-md bg-white shadow-2xs overflow-hidden">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    aria-label={`Decrease ${item.name}`}
                                    className="px-2 py-1.5 text-charcoal-600 hover:bg-cream-100 transition-colors cursor-pointer"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="px-2 text-xs font-bold text-forest-950 tabular-nums min-w-[1.25rem] text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    aria-label={`Increase ${item.name}`}
                                    className="px-2 py-1.5 text-charcoal-600 hover:bg-cream-100 transition-colors cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>

                                <div className="text-xs font-bold text-forest-950 tabular-nums w-14 text-right">
                                  ₹{item.price * item.quantity}
                                </div>

                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  aria-label={`Remove ${item.name}`}
                                  className="p-1 text-charcoal-400 hover:text-red-700 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </ul>
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-16 text-center space-y-3"
                  >
                    <div className="w-14 h-14 bg-cream-200/80 rounded-full flex items-center justify-center mx-auto text-charcoal-400">
                      <ShoppingBag className="w-7 h-7" />
                    </div>
                    <h3 className="font-heading text-base font-bold text-forest-950">
                      Your cart is empty
                    </h3>
                    <p className="text-xs text-charcoal-500 max-w-xs mx-auto leading-relaxed font-normal">
                      Explore our authentic Nagercoil Shawarma and fast food menu to add your favourite items.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-3 px-4 py-2 bg-forest-900 text-cream-50 text-xs font-bold rounded-lg hover:bg-forest-800 transition-all shadow-xs cursor-pointer"
                    >
                      Browse Menu Dishes
                    </button>
                  </motion.div>
                )}

              </div>

              {/* Footer / Summary & Checkout Trigger */}
              {cartItems.length > 0 && (
                <div className="p-6 bg-cream-100 border-t border-cream-200 space-y-4">
                  
                  {/* Calculation Breakdown */}
                  <div className="space-y-1.5 text-xs text-charcoal-700">
                    <div className="flex justify-between">
                      <span>Items Subtotal</span>
                      <span className="font-semibold tabular-nums">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        Fulfillment ({fulfillmentType === 'pickup' ? 'Self Pickup' : 'Direct Delivery'})
                      </span>
                      <span className="font-semibold text-forest-800">
                        {fulfillmentType === 'pickup' ? 'Free' : 'To be confirmed on WhatsApp'}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-cream-300 flex justify-between text-sm font-bold text-forest-950">
                      <span>Total Order Amount</span>
                      <span className="tabular-nums">₹{total}</span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <motion.button
                    whileTap={{ scale: 0.985 }}
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-3.5 px-4 bg-forest-900 hover:bg-forest-800 text-cream-50 font-bold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-2 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-forest-700 cursor-pointer"
                  >
                    <span>Proceed to WhatsApp Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <p className="text-[11px] text-charcoal-500 text-center leading-normal">
                    No payment required upfront. Review order details before sending via WhatsApp.
                  </p>

                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
