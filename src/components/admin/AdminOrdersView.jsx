import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  Clock,
  Phone,
  MapPin,
  Store,
  Bike,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Banknote,
  ExternalLink,
  ChevronRight,
  Eye,
  Check,
  X,
  MessageSquare,
  DollarSign
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ORDER_STATUS_CONFIG = {
  'Pending': { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
  'Confirmed': { label: 'Confirmed', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  'Preparing': { label: 'Preparing', bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
  'Ready for delivery': { label: 'Ready for Delivery', bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
  'Out for delivery': { label: 'Out for Delivery', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  'Delivered': { label: 'Delivered', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  'Cancelled': { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' }
};

const ALLOWED_STATUSES = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Ready for delivery',
  'Out for delivery',
  'Delivered',
  'Cancelled'
];

export const AdminOrdersView = () => {
  const { adminToken } = useCart();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        // If modal is open, refresh selected order details
        if (selectedOrder) {
          const updatedSelected = data.find(o => o.id === selectedOrder.id);
          if (updatedSelected) setSelectedOrder(updatedSelected);
        }
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

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updated);
        }
        setActionMessage(`Order ${orderId} status updated to ${newStatus}`);
        setTimeout(() => setActionMessage(null), 3000);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update order status');
      }
    } catch (err) {
      alert('Network error while updating status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTogglePayment = async (orderId, currentPaymentStatus) => {
    const nextStatus = currentPaymentStatus === 'Paid' ? 'Unpaid' : 'Paid';
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ paymentStatus: nextStatus })
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updated);
        }
        setActionMessage(`Order ${orderId} marked as ${nextStatus}`);
        setTimeout(() => setActionMessage(null), 3000);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update payment status');
      }
    } catch (err) {
      alert('Network error while updating payment');
    } finally {
      setIsUpdating(false);
    }
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
      const matchPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        order.id.toLowerCase().includes(q) ||
        (order.customerName && order.customerName.toLowerCase().includes(q)) ||
        (order.phone && order.phone.includes(q)) ||
        (order.locality && order.locality.toLowerCase().includes(q));

      return matchStatus && matchPayment && matchSearch;
    });
  }, [orders, statusFilter, paymentFilter, searchQuery]);

  // Order Financial Metrics
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Pending').length;
  const unpaidCODTotal = orders
    .filter(o => o.paymentStatus === 'Unpaid' && o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const collectedCODTotal = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="space-y-5 text-left">
      
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-forest-950">
            Cash on Delivery Orders
          </h3>
          <p className="text-xs text-charcoal-500">
            Manage incoming COD orders, update kitchen preparation stages, and track collected cash.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-cream-100 hover:bg-cream-200 text-charcoal-700 text-xs font-semibold rounded-lg border border-cream-300 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Action Notification Toast */}
      {actionMessage && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-3.5 bg-white border border-cream-200 rounded-lg shadow-2xs">
          <div className="text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider">
            Total Orders
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-extrabold font-heading text-forest-950 tabular-nums">
            {totalOrdersCount}
          </div>
        </div>

        <div className="p-3.5 bg-white border border-cream-200 rounded-lg shadow-2xs">
          <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
            Pending Orders
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-extrabold font-heading text-amber-800 tabular-nums">
            {pendingOrdersCount}
          </div>
        </div>

        <div className="p-3.5 bg-white border border-cream-200 rounded-lg shadow-2xs">
          <div className="text-[11px] font-semibold text-charcoal-600 uppercase tracking-wider">
            Unpaid COD Total
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-extrabold font-heading text-terracotta-700 tabular-nums">
            ₹{unpaidCODTotal}
          </div>
        </div>

        <div className="p-3.5 bg-white border border-cream-200 rounded-lg shadow-2xs">
          <div className="text-[11px] font-semibold text-green-700 uppercase tracking-wider">
            Collected Cash
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-extrabold font-heading text-green-800 tabular-nums">
            ₹{collectedCODTotal}
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-3.5 bg-white border border-cream-200 rounded-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-2xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, customer, phone, locality..."
            className="w-full pl-9 pr-3 py-1.5 bg-cream-50/50 border border-cream-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-forest-700"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-charcoal-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-cream-50/50 border border-cream-300 rounded-md font-semibold text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-forest-700"
            >
              <option value="all">All Statuses</option>
              {ALLOWED_STATUSES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-charcoal-500 font-medium">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-cream-50/50 border border-cream-300 rounded-md font-semibold text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-forest-700"
            >
              <option value="all">All Payments</option>
              <option value="Unpaid">Unpaid Only</option>
              <option value="Paid">Paid Only</option>
            </select>
          </div>
        </div>

      </div>

      {/* Orders List / Cards */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-charcoal-500">
          Loading orders database...
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const formattedDate = new Date(order.createdAt || order.timestamp).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short'
            });

            const statusStyle = ORDER_STATUS_CONFIG[order.orderStatus] || ORDER_STATUS_CONFIG['Pending'];
            const isPaid = order.paymentStatus === 'Paid';

            return (
              <div
                key={order.id}
                className="p-4 sm:p-5 bg-white border border-cream-200 rounded-xl shadow-xs space-y-3.5 text-xs transition-shadow hover:shadow-md"
              >
                {/* Header Row: ID, Time, Customer, Total */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-cream-200">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-cream-100 text-forest-950 px-2.5 py-1 rounded border border-cream-300">
                      {order.id}
                    </span>
                    <strong className="font-heading font-bold text-sm text-forest-950">
                      {order.customerName}
                    </strong>
                    {order.phone && (
                      <span className="text-charcoal-500">
                        ({order.phone})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-charcoal-500 flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" />
                      <span>{formattedDate}</span>
                    </span>
                    <span className="font-extrabold text-sm text-forest-950 tabular-nums">
                      ₹{order.total}
                    </span>
                  </div>
                </div>

                {/* Middle Row: Fulfillment, Items Summary, Status Badges */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                  
                  {/* Column 1: Fulfillment & Address */}
                  <div className="md:col-span-4 space-y-1 text-charcoal-700">
                    <div className="flex items-center gap-1.5 font-bold text-forest-900">
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
                    {order.fulfillmentType === 'delivery' && (
                      <div className="text-[11px] text-charcoal-600 leading-relaxed">
                        <span className="font-medium text-charcoal-800">{order.address}</span>
                        {order.locality && ` · ${order.locality}`}
                        {order.landmark && ` (Near ${order.landmark})`}
                      </div>
                    )}
                    {order.deliveryInstructions && (
                      <div className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200 mt-1">
                        <strong>Note:</strong> {order.deliveryInstructions}
                      </div>
                    )}
                  </div>

                  {/* Column 2: Items Summary */}
                  <div className="md:col-span-4 space-y-1">
                    <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider block">
                      Dishes Ordered ({order.items.length}):
                    </span>
                    <ul className="space-y-0.5 text-[11px] text-charcoal-700">
                      {order.items.map((it, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span className="truncate max-w-[200px]">
                            {it.quantity}x {it.name}
                          </span>
                          <span className="tabular-nums font-semibold text-charcoal-900">
                            ₹{it.subtotal || it.price * it.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Column 3: Status Controls & Badges */}
                  <div className="md:col-span-4 flex flex-col sm:items-end gap-2">
                    
                    {/* Order Status Select */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-charcoal-500">Status:</span>
                      <select
                        disabled={isUpdating}
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className={`px-2.5 py-1 rounded text-xs font-bold border focus:outline-none cursor-pointer ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                      >
                        {ALLOWED_STATUSES.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    {/* Payment Status Badge & Toggle */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1 ${
                        isPaid
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        <Banknote className="w-3 h-3" />
                        <span>COD: {isPaid ? 'Paid' : 'Unpaid'}</span>
                      </span>

                      <button
                        disabled={isUpdating}
                        onClick={() => handleTogglePayment(order.id, order.paymentStatus)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-colors cursor-pointer ${
                          isPaid
                            ? 'bg-cream-100 hover:bg-cream-200 text-charcoal-700 border-cream-300'
                            : 'bg-green-900 hover:bg-green-800 text-white border-green-950 shadow-2xs'
                        }`}
                        title="Mark payment status independently from delivery status"
                      >
                        {isPaid ? 'Mark Unpaid' : 'Mark as Paid'}
                      </button>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-forest-800 hover:text-forest-950 underline underline-offset-2 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Full Order Details</span>
                    </button>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 bg-white border border-cream-200 rounded-xl text-center text-xs text-charcoal-500 space-y-2">
          <ShoppingBag className="w-8 h-8 text-charcoal-300 mx-auto" />
          <p className="font-semibold text-charcoal-700">No matching orders found</p>
          <p className="text-charcoal-400 max-w-xs mx-auto">
            {searchQuery || statusFilter !== 'all' || paymentFilter !== 'all'
              ? 'Try adjusting your search query or status filter.'
              : 'When customers place Cash on Delivery orders, they will appear here.'}
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL ORDER DETAIL MODAL                                                    */}
      {/* ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-forest-950/60 backdrop-blur-xs"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="min-h-full flex items-center justify-center p-4 relative z-10">
            <div className="bg-white border border-cream-300 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden text-left space-y-5 p-6 sm:p-7">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-cream-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold bg-cream-100 text-forest-950 px-2.5 py-0.5 rounded border border-cream-300">
                      {selectedOrder.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      (ORDER_STATUS_CONFIG[selectedOrder.orderStatus] || ORDER_STATUS_CONFIG['Pending']).bg
                    } ${(ORDER_STATUS_CONFIG[selectedOrder.orderStatus] || ORDER_STATUS_CONFIG['Pending']).text}`}>
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                  <div className="text-[11px] text-charcoal-500 mt-1">
                    Placed on {new Date(selectedOrder.createdAt || selectedOrder.timestamp).toLocaleString('en-IN', {
                      dateStyle: 'full',
                      timeStyle: 'medium'
                    })}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-charcoal-400 hover:text-charcoal-700 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Customer Profile & Direct Contact */}
              <div className="p-4 bg-cream-50 rounded-xl border border-cream-200 space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-charcoal-500 text-[11px] block">Customer Name:</span>
                    <strong className="text-sm font-bold text-forest-950">{selectedOrder.customerName}</strong>
                    <div className="text-charcoal-700 font-mono mt-0.5">{selectedOrder.phone}</div>
                  </div>

                  {/* Call & WhatsApp Quick Buttons */}
                  <div className="flex items-center gap-2">
                    {selectedOrder.phone && (
                      <>
                        <a
                          href={`tel:${selectedOrder.phone}`}
                          className="px-2.5 py-1.5 bg-forest-900 hover:bg-forest-800 text-cream-50 rounded-md font-bold text-xs inline-flex items-center gap-1 shadow-2xs"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>

                        <a
                          href={`https://wa.me/91${selectedOrder.phone.replace(/\D/g, '').slice(-10)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-md font-bold text-xs inline-flex items-center gap-1 shadow-2xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-cream-200">
                  <span className="text-charcoal-500 text-[11px] block">Delivery Location:</span>
                  <div className="font-semibold text-charcoal-900">
                    {selectedOrder.fulfillmentType === 'delivery'
                      ? `${selectedOrder.address}, ${selectedOrder.locality}`
                      : 'Store Pickup / Counter Collection'}
                  </div>
                  {selectedOrder.landmark && (
                    <div className="text-charcoal-600 mt-0.5">
                      <strong>Landmark:</strong> {selectedOrder.landmark}
                    </div>
                  )}
                  {selectedOrder.deliveryInstructions && (
                    <div className="text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 mt-1.5">
                      <strong>Kitchen Instructions:</strong> {selectedOrder.deliveryInstructions}
                    </div>
                  )}
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2 text-xs">
                <h4 className="font-heading font-bold text-sm text-forest-950">
                  Ordered Items
                </h4>
                <div className="border border-cream-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-cream-100 text-charcoal-600 text-[11px] border-b border-cream-200">
                      <tr>
                        <th className="p-2.5">Dish</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Rate</th>
                        <th className="p-2.5 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-200">
                      {selectedOrder.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-cream-50/50">
                          <td className="p-2.5 font-medium text-charcoal-800">{it.name}</td>
                          <td className="p-2.5 text-center font-bold text-forest-950">{it.quantity}</td>
                          <td className="p-2.5 text-right tabular-nums text-charcoal-600">₹{it.price}</td>
                          <td className="p-2.5 text-right tabular-nums font-bold text-forest-950">
                            ₹{it.subtotal || it.price * it.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-cream-50 font-bold border-t border-cream-200">
                      <tr>
                        <td colSpan={3} className="p-2.5 text-right text-charcoal-600">Subtotal:</td>
                        <td className="p-2.5 text-right tabular-nums">₹{selectedOrder.subtotal}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="p-2.5 text-right text-charcoal-600">Delivery Fee:</td>
                        <td className="p-2.5 text-right tabular-nums">₹{selectedOrder.deliveryFee}</td>
                      </tr>
                      <tr className="text-sm bg-forest-900/5 text-forest-950 border-t border-cream-300">
                        <td colSpan={3} className="p-2.5 text-right font-extrabold">Final Payable Amount (COD):</td>
                        <td className="p-2.5 text-right tabular-nums font-extrabold text-forest-900 text-base">
                          ₹{selectedOrder.total}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Status and Payment Actions in Modal */}
              <div className="p-4 bg-cream-50 rounded-xl border border-cream-200 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-charcoal-500 uppercase block mb-1">
                      Update Order Stage:
                    </span>
                    <select
                      disabled={isUpdating}
                      value={selectedOrder.orderStatus}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                      className="px-3 py-1.5 bg-white border border-cream-300 rounded-md font-bold text-xs text-forest-950"
                    >
                      {ALLOWED_STATUSES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-charcoal-500 uppercase block mb-1">
                      COD Cash Status:
                    </span>
                    <button
                      disabled={isUpdating}
                      onClick={() => handleTogglePayment(selectedOrder.id, selectedOrder.paymentStatus)}
                      className={`px-3.5 py-1.5 rounded-md font-bold text-xs transition-colors cursor-pointer ${
                        selectedOrder.paymentStatus === 'Paid'
                          ? 'bg-cream-200 hover:bg-cream-300 text-charcoal-800'
                          : 'bg-green-800 hover:bg-green-700 text-white shadow-xs'
                      }`}
                    >
                      {selectedOrder.paymentStatus === 'Paid' ? 'Mark as Unpaid' : 'Mark as Paid (Cash Collected)'}
                    </button>
                  </div>
                </div>

                {/* Audit Trail Log */}
                {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                  <div className="pt-2 border-t border-cream-200">
                    <span className="text-[11px] font-semibold text-charcoal-500 uppercase block mb-1">
                      Status Change History:
                    </span>
                    <ul className="space-y-1 text-[11px] text-charcoal-600">
                      {selectedOrder.statusHistory.map((hist, hIdx) => (
                        <li key={hIdx} className="flex justify-between">
                          <span>
                            <strong className="text-forest-950">{hist.status}</strong>: {hist.note}
                          </span>
                          <span className="text-charcoal-400 font-mono">
                            {new Date(hist.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 bg-forest-900 hover:bg-forest-800 text-cream-50 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Close Details
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
