import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Truck, CheckCircle2, Clock, XCircle, ChevronDown, ChevronUp, MapPin, CreditCard, RotateCcw, Star, Ban } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderApi } from '../../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface OrderItem {
  productId?: string;
  product?: any;
  title?: string;
  name?: string;
  image?: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

interface Order {
  _id: string;
  createdAt: string;
  updatedAt?: string;
  totalPrice: number;
  totalPriceAfterDiscount?: number;
  itemsPrice?: number;
  taxPrice?: number;
  shippingPrice?: number;
  discountPrice?: number;
  orderStatus?: string;
  status?: string;
  paymentMethod?: string;
  isPaid?: boolean;
  paidAt?: string;
  isDelivered?: boolean;
  deliveredAt?: string;
  orderItems?: OrderItem[];
  cartItems?: OrderItem[];
  shippingAddress?: {
    fullName?: string;
    street?: string;
    addressLine?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
  };
  deliveryPartner?: string;
  trackingId?: string;
  expectedDeliveryDate?: string;
  invoiceNumber?: string;
}

function getStatusConfig(status: string) {
  switch (status?.toUpperCase()) {
    case 'DELIVERED':
      return { icon: CheckCircle2, label: 'Delivered', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    case 'SHIPPED':
    case 'OUT_FOR_DELIVERY':
      return { icon: Truck, label: status === 'OUT_FOR_DELIVERY' ? 'Out for Delivery' : 'Shipped', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    case 'CANCELLED':
      return { icon: XCircle, label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    case 'PACKED':
      return { icon: Package, label: 'Packed', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' };
    case 'CONFIRMED':
      return { icon: CheckCircle2, label: 'Confirmed', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' };
    case 'PLACED':
    default:
      return { icon: Clock, label: status?.replace(/_/g, ' ') || 'Placed', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
  }
}

export function AccountMyOrders() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    if (!isAuthenticated) { setLoading(false); return; }
    try {
      const res = await orderApi.getMyOrders();
      if (res.success && Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch { /* API error */ }
    setLoading(false);
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancellingId(orderId);
    try {
      const res = await orderApi.cancel(orderId);
      if (res.success) {
        toast.success('Order cancelled successfully');
        await fetchOrders();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel order');
    }
    setCancellingId(null);
  };

  const tabs = [
    { key: 'all', label: 'All Orders' },
    { key: 'PLACED', label: 'Processing' },
    { key: 'SHIPPED', label: 'Shipped' },
    { key: 'DELIVERED', label: 'Delivered' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ];

  const getItems = (order: Order) => order.orderItems || order.cartItems || [];
  const getStatus = (order: Order) => (order.orderStatus || order.status || 'PLACED').toUpperCase();

  const filteredOrders = orders.filter(order => {
    const status = getStatus(order);
    const matchesTab = activeTab === 'all' || status === activeTab.toUpperCase() ||
      (activeTab === 'PLACED' && ['PLACED', 'CONFIRMED', 'PACKED'].includes(status));
    const matchesSearch = !searchQuery.trim() ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getItems(order).some(item =>
        (item.title || item.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesTab && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Package className="text-primary" size={24} /> My Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {orders.length === 0 ? 'No orders yet' : `${orders.length} order${orders.length !== 1 ? 's' : ''} placed`}
          </p>
        </div>
        {/* Search */}
        <div className="flex w-full sm:w-auto border border-gray-200 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all bg-white">
          <div className="px-3 py-2.5 flex items-center text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search by order ID or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 py-2.5 px-1 outline-none text-sm text-gray-700 font-medium bg-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 min-w-[90px] py-2 px-3 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-white text-foreground shadow-sm'
                : 'text-gray-500 hover:text-foreground hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground text-sm font-medium">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border shadow-sm py-16 text-center">
          <Package size={40} className="text-gray-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-foreground mb-2">
            {activeTab === 'all' ? 'No orders yet' : `No ${activeTab.toLowerCase()} orders`}
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            {activeTab === 'all' ? 'Start shopping to see your orders here' : 'No orders with this status'}
          </p>
          <Link to="/shop" className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status = getStatus(order);
            const statusConfig = getStatusConfig(status);
            const StatusIcon = statusConfig.icon;
            const items = getItems(order);
            const isExpanded = expandedOrder === order._id;
            const canCancel = ['PLACED', 'CONFIRMED'].includes(status);

            return (
              <div key={order._id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${isExpanded ? `${statusConfig.border} shadow-md` : 'border-border hover:shadow-md'}`}>
                {/* Header Bar */}
                <div className="bg-gray-50 px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-sm border-b border-gray-100">
                  <div className="flex flex-wrap gap-4 sm:gap-6">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Order Placed</p>
                      <p className="text-gray-700 font-medium text-xs">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total</p>
                      <p className="text-gray-800 font-bold text-xs">₹{(order.totalPrice || 0).toFixed(0)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Items</p>
                      <p className="text-gray-700 font-medium text-xs">{items.length}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Order #</p>
                    <p className="text-gray-500 font-mono text-xs">{order._id.slice(-10).toUpperCase()}</p>
                  </div>
                </div>

                {/* Status + Expand */}
                <div className="px-5 py-4 cursor-pointer" onClick={() => setExpandedOrder(isExpanded ? null : order._id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`${statusConfig.bg} p-2 rounded-xl`}>
                        <StatusIcon size={20} className={statusConfig.color} />
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${statusConfig.color}`}>{statusConfig.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {status === 'DELIVERED' && order.deliveredAt
                            ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                            : status === 'CANCELLED' ? 'This order was cancelled'
                            : 'Your order is being processed'}
                        </p>
                      </div>
                    </div>
                    <button className="flex items-center gap-1 text-primary text-sm font-medium">
                      {isExpanded ? 'Hide' : 'View'} {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-gray-100">
                        {/* Items */}
                        <div className="mt-4 space-y-2">
                          {items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                              <div className="w-14 h-14 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                {item.image ? (
                                  <img src={item.image} alt={item.title || item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Package size={20} />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-800 text-sm line-clamp-1">{item.title || item.name || `Item #${idx + 1}`}</p>
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-bold text-sm text-gray-800">₹{(item.price * item.quantity).toFixed(0)}</p>
                            </div>
                          ))}
                        </div>

                        {/* Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                          {order.shippingAddress && (
                            <div className="bg-gray-50 rounded-xl p-4">
                              <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                <MapPin size={12} /> Shipping Address
                              </h5>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {order.shippingAddress.fullName && <>{order.shippingAddress.fullName}<br /></>}
                                {(order.shippingAddress.street || order.shippingAddress.addressLine) && <>{order.shippingAddress.street || order.shippingAddress.addressLine}<br /></>}
                                {order.shippingAddress.city && <>{order.shippingAddress.city}, </>}
                                {order.shippingAddress.state} {order.shippingAddress.pincode}
                                {order.shippingAddress.phone && <><br />Phone: {order.shippingAddress.phone}</>}
                              </p>
                            </div>
                          )}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                              <CreditCard size={12} /> Payment
                            </h5>
                            <p className="text-sm text-gray-700">
                              Method: <strong>{order.paymentMethod || 'COD'}</strong>
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                              Status: <strong className={order.isPaid ? 'text-emerald-600' : 'text-amber-600'}>{order.isPaid ? 'Paid' : 'Pending'}</strong>
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Link to={`/account/orders/${order._id}`} className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors">
                            View Details
                          </Link>
                          {['SHIPPED', 'OUT_FOR_DELIVERY'].includes(status) && (
                            <Link to={`/account/track-order/${order._id}`} className="flex items-center gap-1.5 bg-primary/10 text-primary px-4 py-2 rounded-xl font-medium text-sm hover:bg-primary/20 transition-colors">
                              <Truck size={15} /> Track Order
                            </Link>
                          )}
                          {canCancel && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCancel(order._id); }}
                              disabled={cancellingId === order._id}
                              className="flex items-center gap-1.5 bg-red-50 text-red-500 px-4 py-2 rounded-xl font-medium text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                              <Ban size={15} /> {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                            </button>
                          )}
                          {status === 'DELIVERED' && (
                            <button className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors">
                              <RotateCcw size={15} /> Return / Replace
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
