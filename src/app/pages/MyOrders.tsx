import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Truck, CheckCircle2, Clock, XCircle, ChevronDown, ChevronUp, User, MapPin, CreditCard, RotateCcw, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';

interface OrderItem {
  productId: string;
  title?: string;
  name?: string;
  image?: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
  onPayment?: (price: number, itemName: string) => void;
}

interface Order {
  _id: string;
  createdAt: string;
  updatedAt?: string;
  totalPrice: number;
  totalPriceAfterDiscount?: number;
  status?: string;
  paymentMethod?: string;
  isPaid?: boolean;
  paidAt?: string;
  isDelivered?: boolean;
  deliveredAt?: string;
  cartItems?: OrderItem[];
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    phone?: string;
  };
}

function getStatusConfig(status: string) {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return { icon: CheckCircle2, label: 'Delivered', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', progress: 100 };
    case 'shipped':
    case 'on the way':
      return { icon: Truck, label: 'Shipped', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', progress: 66 };
    case 'cancelled':
      return { icon: XCircle, label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', progress: 0 };
    case 'processing':
    default:
      return { icon: Clock, label: status || 'Processing', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', progress: 33 };
  }
}

export function MyOrders() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const res = await orderApi.getAll();
        if (res.success && Array.isArray(res.data)) {
          setOrders(res.data);
        }
      } catch {
        // No orders or API unavailable
      }
      setLoading(false);
    };
    fetchOrders();
  }, [isAuthenticated]);

  // If not logged in
  if (!isAuthenticated) {
    return (
      <main className="container mx-auto px-4 py-32 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-border text-center">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={36} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Sign in to view your orders</h1>
          <p className="text-muted-foreground mb-8">Track your orders, view delivery details, and manage returns.</p>
          <Link
            to="/login"
            className="block w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  const tabs = [
    { key: 'all', label: 'All Orders' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || (order.status?.toLowerCase() || 'processing') === activeTab;
    const matchesSearch = !searchQuery.trim() ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.cartItems?.some(item =>
        (item.title || item.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesTab && matchesSearch;
  });

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Package className="text-primary" /> Your Orders
          </h1>
          <p className="text-muted-foreground mt-1">
            {orders.length === 0 ? 'No orders yet' : `${orders.length} order${orders.length !== 1 ? 's' : ''} placed`}
          </p>
        </div>

        {/* Search Orders */}
        <div className="flex w-full sm:w-auto border border-gray-300 rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
          <div className="px-3 py-2.5 flex items-center justify-center bg-white text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search by order ID or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-72 py-2.5 px-2 outline-none text-sm text-gray-700 font-medium"
          />
        </div>
      </div>

      {/* Order Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-100 rounded-xl p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 min-w-[100px] py-2.5 px-4 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${activeTab === tab.key
              ? 'bg-white text-foreground shadow-sm'
              : 'text-gray-500 hover:text-foreground hover:bg-white/50'
              }`}
          >
            {tab.label}
            {tab.key !== 'all' && (
              <span className="ml-1.5 text-[11px] opacity-60">
                ({orders.filter(o => (o.status?.toLowerCase() || 'processing') === tab.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">Loading your orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-border shadow-sm py-20 text-center">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={40} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            {activeTab === 'all' ? 'No orders yet' : `No ${activeTab} orders`}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {activeTab === 'all'
              ? 'Start shopping and discover our premium wellness products.'
              : 'You don\'t have any orders with this status.'
            }
          </p>
          <Link
            to="/shop"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status || 'processing');
            const StatusIcon = statusConfig.icon;
            const date = new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            });
            const itemCount = order.cartItems?.length || 0;
            const isExpanded = expandedOrder === order._id;

            return (
              <div key={order._id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 ${isExpanded ? `${statusConfig.border} shadow-md` : 'border-border hover:shadow-md'}`}>
                {/* Order Header Bar */}
                <div className="bg-gray-50 px-5 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-sm border-b border-gray-200">
                  <div className="flex flex-wrap gap-4 sm:gap-8">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Order Placed</p>
                      <p className="text-gray-700 font-medium text-[13px]">{date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total</p>
                      <p className="text-gray-800 font-bold text-[13px]">${(order.totalPriceAfterDiscount || order.totalPrice || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Items</p>
                      <p className="text-gray-700 font-medium text-[13px]">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
                    </div>
                    {order.shippingAddress?.city && (
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Ship To</p>
                        <p className="text-gray-700 font-medium text-[13px]">{order.shippingAddress.city}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Order #</p>
                    <p className="text-gray-500 font-mono text-xs">{order._id.slice(-10).toUpperCase()}</p>
                  </div>
                </div>

                {/* Order Summary Row */}
                <div className="px-5 sm:px-6 py-5" onClick={() => toggleExpand(order._id)} style={{ cursor: 'pointer' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Status Badge */}
                      <div className={`${statusConfig.bg} p-2.5 rounded-xl`}>
                        <StatusIcon size={22} className={statusConfig.color} />
                      </div>
                      <div>
                        <p className={`font-bold text-base ${statusConfig.color}`}>{statusConfig.label}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {order.isDelivered && order.deliveredAt
                            ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                            : order.status?.toLowerCase() === 'shipped'
                              ? 'Your package is on its way'
                              : order.status?.toLowerCase() === 'cancelled'
                                ? 'This order has been cancelled'
                                : 'Your order is being prepared'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Expand/Collapse */}
                    <button className="flex items-center gap-1.5 text-primary text-sm font-medium hover:underline">
                      {isExpanded ? 'Hide' : 'View'} Details
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {/* Delivery Progress Bar (for non-cancelled orders) */}
                  {order.status?.toLowerCase() !== 'cancelled' && (
                    <div className="mt-4">
                      <div className="flex justify-between text-[11px] font-medium text-gray-400 mb-1.5">
                        <span className={statusConfig.progress >= 33 ? 'text-gray-700' : ''}>Placed</span>
                        <span className={statusConfig.progress >= 33 ? 'text-gray-700' : ''}>Processing</span>
                        <span className={statusConfig.progress >= 66 ? 'text-gray-700' : ''}>Shipped</span>
                        <span className={statusConfig.progress >= 100 ? 'text-gray-700' : ''}>Delivered</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-[#6B5344] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${statusConfig.progress}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 border-t border-gray-100">

                        {/* Items List */}
                        <div className="mt-5">
                          <h4 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                            <Package size={15} className="text-gray-400" />
                            Items in this order
                          </h4>
                          <div className="space-y-3">
                            {order.cartItems && order.cartItems.length > 0 ? (
                              order.cartItems.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
                                  {/* Item Image */}
                                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                                    {item.image ? (
                                      <img src={item.image} alt={item.title || item.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <Package size={24} />
                                      </div>
                                    )}
                                  </div>
                                  {/* Item Details */}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-gray-800 text-[15px] line-clamp-1">
                                      {item.title || item.name || `Item #${idx + 1}`}
                                    </p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                      <span className="text-sm text-muted-foreground">Qty: <strong className="text-gray-700">{item.quantity}</strong></span>
                                      {item.color && <span className="text-sm text-muted-foreground">Color: <strong className="text-gray-700">{item.color}</strong></span>}
                                      {item.size && <span className="text-sm text-muted-foreground">Size: <strong className="text-gray-700">{item.size}</strong></span>}
                                    </div>
                                  </div>
                                  {/* Item Price */}
                                  <div className="text-right flex-shrink-0">
                                    <p className="font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                                    {item.quantity > 1 && (
                                      <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="bg-gray-50 rounded-xl p-4 text-center text-muted-foreground text-sm">
                                {itemCount} item{itemCount !== 1 ? 's' : ''} in this order
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Shipping & Payment Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                          {/* Shipping Address */}
                          {order.shippingAddress && (
                            <div className="bg-gray-50 rounded-xl p-4">
                              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                                <MapPin size={13} /> Shipping Address
                              </h5>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {order.shippingAddress.street && <>{order.shippingAddress.street}<br /></>}
                                {order.shippingAddress.city && <>{order.shippingAddress.city}, </>}
                                {order.shippingAddress.state && <>{order.shippingAddress.state} </>}
                                {order.shippingAddress.pincode && <>{order.shippingAddress.pincode}<br /></>}
                                {order.shippingAddress.phone && <>Phone: {order.shippingAddress.phone}</>}
                              </p>
                            </div>
                          )}

                          {/* Payment Info */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-2">
                              <CreditCard size={13} /> Payment
                            </h5>
                            <p className="text-sm text-gray-700">
                              Method: <strong>{order.paymentMethod || 'Cash on Delivery'}</strong>
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                              Status: <strong className={order.isPaid ? 'text-emerald-600' : 'text-amber-600'}>{order.isPaid ? 'Paid' : 'Pending'}</strong>
                            </p>
                            {order.isPaid && order.paidAt && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Paid on {new Date(order.paidAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>

                          {/* Price Breakdown */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Order Total</h5>
                            <div className="space-y-1.5 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="text-gray-700 font-medium">${(order.totalPrice || 0).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-emerald-600 font-medium">Free</span>
                              </div>
                              {order.totalPriceAfterDiscount && order.totalPriceAfterDiscount < order.totalPrice && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Discount</span>
                                  <span className="text-emerald-600 font-medium">-${(order.totalPrice - order.totalPriceAfterDiscount).toFixed(2)}</span>
                                </div>
                              )}
                              <div className="border-t border-gray-200 pt-1.5 mt-1 flex justify-between">
                                <span className="font-bold text-gray-800">Total</span>
                                <span className="font-bold text-primary">${(order.totalPriceAfterDiscount || order.totalPrice || 0).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mt-6">
                          {order.status?.toLowerCase() === 'delivered' && (
                            <>
                              <button className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-primary/20 transition-colors">
                                <Star size={16} /> Write a Review
                              </button>
                              <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors">
                                <RotateCcw size={16} /> Return / Replace
                              </button>
                            </>
                          )}
                          <Link
                            to="/shop"
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors"
                          >
                            <Package size={16} /> Buy Again
                          </Link>
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

      {/* Back to Account */}
      <div className="mt-10 text-center">
        <Link to="/account" className="text-primary font-medium hover:underline text-sm">
          ← Back to Your Account
        </Link>
      </div>
    </main>
  );
}
