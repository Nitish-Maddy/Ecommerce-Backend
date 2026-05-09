import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Truck, ArrowLeft, Package, MapPin, Clock } from 'lucide-react';
import { orderApi } from '../../services/api';
import { TrackingTimeline } from '../../components/TrackingTimeline';
import { useAuth } from '../../context/AuthContext';

export function TrackOrder() {
  const { orderId } = useParams();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!isAuthenticated) { setLoading(false); return; }

      if (orderId) {
        // Show specific order tracking
        try {
          const res = await orderApi.getById(orderId);
          if (res.success) setOrder(res.data);
        } catch { /* error */ }
      } else {
        // Show all active (non-delivered, non-cancelled) orders for tracking
        try {
          const res = await orderApi.getMyOrders();
          if (res.success && Array.isArray(res.data)) {
            setOrders(res.data.filter((o: any) => {
              const status = (o.orderStatus || o.status || 'PLACED').toUpperCase();
              return !['DELIVERED', 'CANCELLED'].includes(status);
            }));
          }
        } catch { /* error */ }
      }
      setLoading(false);
    };
    fetch();
  }, [orderId, isAuthenticated]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  // Single order tracking
  if (orderId && order) {
    const status = (order.orderStatus || order.status || 'PLACED').toUpperCase();
    const address = order.shippingAddress;

    return (
      <div>
        <Link to="/account/track-order" className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline mb-4">
          <ArrowLeft size={16} /> All Active Orders
        </Link>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-5 mb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Truck className="text-primary" size={22} /> Track Order
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Order #{order._id.slice(-10).toUpperCase()}
              </p>
            </div>
            {order.expectedDeliveryDate && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-2 flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                <div>
                  <p className="text-[10px] text-primary font-bold uppercase">Expected By</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(order.expectedDeliveryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
            <h2 className="font-bold text-foreground mb-5">Tracking Timeline</h2>
            <TrackingTimeline
              orderStatus={status}
              createdAt={order.createdAt}
              deliveredAt={order.deliveredAt}
              expectedDeliveryDate={order.expectedDeliveryDate}
            />
          </div>

          {/* Delivery Details */}
          <div className="space-y-4">
            {/* Courier Info */}
            {(order.deliveryPartner || order.trackingId) && (
              <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
                <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Truck size={18} className="text-primary" /> Courier Details
                </h2>
                <div className="space-y-3">
                  {order.deliveryPartner && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Courier Service</span>
                      <span className="font-medium text-foreground">{order.deliveryPartner}</span>
                    </div>
                  )}
                  {order.trackingId && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tracking ID</span>
                      <span className="font-mono text-xs font-bold bg-gray-100 px-3 py-1 rounded-lg">{order.trackingId}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Delivery Address */}
            {address && (
              <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
                <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-primary" /> Delivery Address
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {address.fullName && <span className="font-medium">{address.fullName}<br /></span>}
                  {(address.street || address.addressLine) && <>{address.street || address.addressLine}<br /></>}
                  {address.city && <>{address.city}, </>}{address.state} {address.pincode}
                  {address.phone && <><br />📞 {address.phone}</>}
                </p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
              <Link to={`/account/orders/${order._id}`} className="block w-full text-center bg-primary text-primary-foreground py-2.5 rounded-xl font-medium text-sm hover:bg-primary/90 transition-all">
                View Full Order Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List of active orders to track
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
        <Truck className="text-primary" size={24} /> Track Orders
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border shadow-sm py-16 text-center">
          <Truck size={40} className="text-gray-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-foreground mb-2">No Active Orders</h2>
          <p className="text-muted-foreground text-sm mb-4">All your orders have been delivered or cancelled</p>
          <Link to="/account/order-history" className="text-primary text-sm font-medium hover:underline">
            View Order History →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const status = (o.orderStatus || o.status || 'PLACED').toUpperCase();
            const items = o.orderItems || o.cartItems || [];
            return (
              <Link key={o._id} to={`/account/track-order/${o._id}`}
                className="flex items-center justify-between bg-white rounded-2xl border border-border shadow-sm p-5 hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Truck size={22} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">Order #{o._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {items.length} item{items.length !== 1 ? 's' : ''} · {status.replace(/_/g, ' ')}
                    </p>
                    {o.expectedDeliveryDate && (
                      <p className="text-xs text-primary font-medium mt-0.5">
                        Expected: {new Date(o.expectedDeliveryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-primary text-sm font-medium">Track →</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
