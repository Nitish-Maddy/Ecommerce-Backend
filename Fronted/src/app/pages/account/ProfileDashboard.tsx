import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Heart, MapPin, ShoppingBag, Edit3, Lock, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';
import { orderApi } from '../../services/api';

export function ProfileDashboard() {
  const { user } = useAuth();
  const { wishlist, cart } = useShop();
  const [orderCount, setOrderCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await orderApi.getMyOrders();
        if (res.success && Array.isArray(res.data)) {
          setOrderCount(res.data.length);
          setRecentOrders(res.data.slice(0, 3));
        }
      } catch { /* no orders */ }
      setLoading(false);
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Orders', value: orderCount, icon: Package, color: 'from-orange-400 to-orange-500', link: '/account/orders' },
    { label: 'Wishlist Items', value: wishlist.length, icon: Heart, color: 'from-pink-400 to-pink-500', link: '/account/wishlist' },
    { label: 'Cart Items', value: cart.length, icon: ShoppingBag, color: 'from-blue-400 to-blue-500', link: '/cart' },
    { label: 'Addresses', value: '—', icon: MapPin, color: 'from-green-400 to-green-500', link: '/account/addresses' },
  ];

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
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-[#6B5344]/5 to-transparent rounded-2xl p-6 mb-6 border border-primary/10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-[#6B5344] rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{user?.email}</p>
            <div className="flex gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Active
              </span>
              <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase">
                {user?.role || 'Member'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.link} className="bg-white rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
                <stat.icon size={18} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{loading ? '—' : stat.value}</p>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Link to="/account/settings" className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-primary/90 transition-all shadow-sm">
          <Edit3 size={16} /> Edit Profile
        </Link>
        <Link to="/account/settings" className="flex items-center gap-2 bg-white border border-border text-foreground px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all shadow-sm">
          <Lock size={16} /> Change Password
        </Link>
        <Link to="/account/orders" className="flex items-center gap-2 bg-white border border-border text-foreground px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-50 transition-all shadow-sm">
          <TrendingUp size={16} /> View All Orders
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-foreground flex items-center gap-2">
            <Clock size={18} className="text-primary" /> Recent Orders
          </h2>
          <Link to="/account/orders" className="text-primary text-sm font-medium hover:underline">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="p-8 text-center">
            <Package size={36} className="text-gray-300 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm font-medium">No orders yet</p>
            <Link to="/shop" className="text-primary text-sm font-medium hover:underline mt-1 inline-block">
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <Link key={order._id} to={`/account/orders/${order._id}`} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package size={18} className="text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${getStatusColor(order.orderStatus || order.status)}`}>
                    {(order.orderStatus || order.status || 'PLACED').replace(/_/g, ' ')}
                  </span>
                  <span className="font-bold text-sm text-foreground">₹{(order.totalPrice || 0).toFixed(0)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
