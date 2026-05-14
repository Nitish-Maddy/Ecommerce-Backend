import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, ArrowLeft, Download, RotateCcw, MapPin, CreditCard, Truck } from 'lucide-react';
import { orderApi } from '../../services/api';
import { TrackingTimeline } from '../../components/TrackingTimeline';

export function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!orderId) return;
      try {
        const res = await orderApi.getById(orderId);
        if (res.success) setOrder(res.data);
      } catch { /* error */ }
      setLoading(false);
    };
    fetch();
  }, [orderId]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <Package size={48} className="text-gray-300 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-foreground mb-2">Order Not Found</h2>
        <Link to="/account/orders" className="text-primary text-sm font-medium hover:underline">← Back to Orders</Link>
      </div>
    );
  }

  const items = order.orderItems || order.cartItems || [];
  const status = (order.orderStatus || order.status || 'PLACED').toUpperCase();
  const address = order.shippingAddress;

  return (
    <div>
      {/* Back */}
      <Link to="/account/orders" className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline mb-4">
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-5 mb-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">Order #{order._id.slice(-10).toUpperCase()}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            {order.invoiceNumber && (
              <p className="text-xs text-muted-foreground mt-1">Invoice: {order.invoiceNumber}</p>
            )}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button className="flex items-center gap-1.5 bg-primary/10 text-primary px-4 py-2 rounded-xl font-medium text-sm hover:bg-primary/20 transition-colors">
              <Download size={15} /> Download Invoice
            </button>
            {status === 'DELIVERED' && (
              <button className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors">
                <RotateCcw size={15} /> Return / Replace
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Order Items + Price Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          {/* Items */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
            <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Package size={18} className="text-primary" /> Items ({items.length})
            </h2>
            <div className="space-y-3">
              {items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.title || item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400"><Package size={24} /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm">{item.title || item.name || `Item #${idx + 1}`}</p>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span>Qty: <strong className="text-gray-700">{item.quantity}</strong></span>
                      {item.color && <span>Color: <strong className="text-gray-700">{item.color}</strong></span>}
                      {item.size && <span>Size: <strong className="text-gray-700">{item.size}</strong></span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(0)}</p>
                    {item.quantity > 1 && <p className="text-xs text-muted-foreground">₹{item.price.toFixed(0)} each</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
            <h2 className="font-bold text-foreground mb-4">Price Breakdown</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items Total</span>
                <span className="font-medium">₹{(order.itemsPrice || order.totalPrice || 0).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={order.shippingPrice > 0 ? 'font-medium' : 'text-emerald-600 font-medium'}>
                  {order.shippingPrice > 0 ? `₹${order.shippingPrice.toFixed(0)}` : 'Free'}
                </span>
              </div>
              {order.taxPrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">₹{order.taxPrice.toFixed(0)}</span>
                </div>
              )}
              {order.discountPrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-emerald-600 font-medium">-₹{order.discountPrice.toFixed(0)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                <span className="font-bold text-foreground">Total</span>
                <span className="font-bold text-primary text-lg">₹{(order.totalPrice || 0).toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Tracking, Address, Payment */}
        <div className="space-y-4">
          {/* Tracking Timeline */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
            <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Truck size={18} className="text-primary" /> Order Status
            </h2>
            <TrackingTimeline
              orderStatus={status}
              createdAt={order.createdAt}
              deliveredAt={order.deliveredAt}
              expectedDeliveryDate={order.expectedDeliveryDate}
            />
          </div>

          {/* Delivery Info */}
          {(order.deliveryPartner || order.trackingId) && (
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
              <h2 className="font-bold text-foreground mb-3 text-sm">Delivery Info</h2>
              {order.deliveryPartner && (
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Courier</span>
                  <span className="font-medium">{order.deliveryPartner}</span>
                </div>
              )}
              {order.trackingId && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tracking ID</span>
                  <span className="font-mono text-xs font-medium">{order.trackingId}</span>
                </div>
              )}
            </div>
          )}

          {/* Shipping Address */}
          {address && (
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
              <h2 className="font-bold text-foreground mb-3 flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-primary" /> Shipping Address
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {address.fullName && <span className="font-medium">{address.fullName}<br /></span>}
                {(address.street || address.addressLine) && <>{address.street || address.addressLine}<br /></>}
                {address.city && <>{address.city}, </>}{address.state} {address.pincode}
                {address.phone && <><br />📞 {address.phone}</>}
              </p>
            </div>
          )}

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
            <h2 className="font-bold text-foreground mb-3 flex items-center gap-2 text-sm">
              <CreditCard size={16} className="text-primary" /> Payment
            </h2>
            <div className="text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="font-medium">{order.paymentMethod || 'COD'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium ${order.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {order.isPaid ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
