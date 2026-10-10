import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, Phone, MapPin, Store, Bike, RotateCcw } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const AdminOrdersView = () => {
  const { adminToken } = useCart();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.warn('Failed to fetch orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-bold text-forest-950">
            Recent WhatsApp Order Dispatches
          </h3>
          <p className="text-xs text-charcoal-500">
            Customer order summaries generated from the website checkout
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream-100 hover:bg-cream-200 text-charcoal-700 text-xs font-semibold rounded border border-cream-300 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-charcoal-500">Loading order records...</div>
      ) : orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => {
            const formattedDate = new Date(order.timestamp).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short'
            });

            return (
              <div key={order.id} className="p-4 bg-white border border-cream-200 rounded-lg shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cream-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-forest-950 bg-cream-100 px-2 py-0.5 rounded">
                      {order.id}
                    </span>
                    <span className="font-semibold text-xs text-charcoal-800">
                      {order.customerName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-charcoal-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formattedDate}</span>
                    </span>
                    <span className="font-bold text-forest-900 tabular-nums">
                      ₹{order.total}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-charcoal-700">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-medium">
                      {order.fulfillmentType === 'delivery' ? (
                        <>
                          <Bike className="w-3.5 h-3.5 text-forest-700" />
                          <span>Home Delivery (Nagercoil)</span>
                        </>
                      ) : (
                        <>
                          <Store className="w-3.5 h-3.5 text-forest-700" />
                          <span>Store Pickup / Takeaway</span>
                        </>
                      )}
                    </div>
                    {order.phone && (
                      <div className="text-charcoal-600 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-charcoal-400" />
                        <span>{order.phone}</span>
                      </div>
                    )}
                    {order.address && (
                      <div className="text-charcoal-600 flex items-start gap-1">
                        <MapPin className="w-3 h-3 text-charcoal-400 mt-0.5 shrink-0" />
                        <span className="truncate">{order.address}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider mb-1">
                      Ordered Items:
                    </div>
                    <ul className="space-y-0.5 text-xs text-charcoal-800">
                      {order.items.map((it, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span className="truncate max-w-[200px]">
                            {it.quantity}x {it.name}
                          </span>
                          <span className="tabular-nums font-medium">
                            ₹{it.price * it.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {order.notes && (
                  <div className="text-[11px] text-charcoal-600 bg-cream-50 p-2 rounded border border-cream-200">
                    <strong>Kitchen Notes:</strong> {order.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 bg-white border border-cream-200 rounded-lg text-center text-xs text-charcoal-500 space-y-2">
          <ShoppingBag className="w-8 h-8 text-charcoal-300 mx-auto" />
          <p className="font-semibold text-charcoal-700">No orders logged yet</p>
          <p className="text-charcoal-400 max-w-xs mx-auto">
            When customers place an order through the WhatsApp checkout on the website, dispatch summaries will appear here.
          </p>
        </div>
      )}
    </div>
  );
};
