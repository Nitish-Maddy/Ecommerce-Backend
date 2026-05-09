import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Search, Package, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { orderApi } from '../../services/api';

export function OrderHistory() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      if (!isAuthenticated) { setLoading(false); return; }
      try {
        const res = await orderApi.getMyOrders();
        if (res.success && Array.isArray(res.data)) setOrders(res.data);
      } catch { /* error */ }
      setLoading(false);
    };
    fetch();
  }, [isAuthenticated]);

  const timeFilters = [
    { key: 'all', label: 'All Orders' },
    { key: '30', label: 'Last 30 Days' },
    { key: '180', label: 'Last 6 Months' },
    { key: '365', label: 'Last Year' },
  ];

  const now = Date.now();
  const filtered = orders.filter(order => {
    const days = timeFilter === 'all' ? Infinity : parseInt(timeFilter);
    const orderDate = new Date(order.createdAt).getTime();
    const withinTime = (now - orderDate) / (1000 * 60 * 60 * 24) <= days;

    const matchesSearch = !searchQuery.trim() ||
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.orderItems || order.cartItems || []).some((item: any) =>
        (item.title || item.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );

    return withinTime && matchesSearch;
  });

  function getStatusColor(status: string) {
    switch (status?.toUpperCase()) {
      case 'DELIVERED': return 'bg-emerald-50 text-emerald-600';
      case 'SHIPPED': case 'OUT_FOR_DELIVERY': return 'bg-blue-50 text-blue-600';
      case 'CANCELLED': return 'bg-red-50 text-red-600';
      default: return 'bg-amber-50 text-amber-600';
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Clock className="text-primary" size={24} /> Order History
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} orders found</p>
        </div>
        <div className="flex w-full sm:w-auto border border-gray-200 rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all bg-white">
          <div className="px-3 py-2.5 flex items-center text-gray-400"><Search size={16} /></div>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-56 py-2.5 px-1 outline-none text-sm text-gray-700 bg-transparent"
          />
        </div>
      </div>

      {/* Time Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {timeFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setTimeFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              timeFilter === f.key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-white border border-border text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border shadow-sm py-16 text-center">
          <Clock size={40} className="text-gray-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-foreground mb-2">No orders found</h2>
          <p className="text-muted-foreground text-sm">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {filtered.map((order) => {
              const status = (order.orderStatus || order.status || 'PLACED').toUpperCase();
              const items = order.orderItems || order.cartItems || [];
              return (
                <Link key={order._id} to={`/account/orders/${order._id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package size={20} className="text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        {' · '}{items.length} item{items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${getStatusColor(status)}`}>
                      {status.replace(/_/g, ' ')}
                    </span>
                    <span className="font-bold text-sm text-foreground">₹{(order.totalPrice || 0).toFixed(0)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
