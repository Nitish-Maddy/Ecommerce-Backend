import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { normalizeProduct } from '../data/products';
import { orderApi, PAYMENT_BASE } from '../services/api';
import { toast } from 'sonner';
import axios from 'axios';

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const onPayment = async (price: number, itemName: string) => {
  try {
    const res = await axios.post(
      `${PAYMENT_BASE}/create-order`,
      { amount: price, currency: 'INR', receipt: `receipt_${Date.now()}` },
      { headers: getAuthHeaders() }
    );
    const data = res.data.data;

    console.log(data);

    const paymentObject = new (window as any).Razorpay({
      key: data.key_id,
      order_id: data.id,
      amount: data.amount,
      currency: "INR",
      name: "TBS Veda",
      description: itemName,
      handler: function (response: any) {
        console.log(response);

        const verifyData = {
          paymentId: data.id,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        };

        axios.post(`${PAYMENT_BASE}/verify`, verifyData, {
          headers: getAuthHeaders(),
        }).then((res) => {
          console.log(res.data);
          if (res?.data?.success) {
            alert("Payment successful");
          } else {
            alert("Payment failed");
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    });

    paymentObject.open();
  } catch (error) {
    console.log(error);
  }
}


export function Checkout() {
  const navigate = useNavigate();
  const { cart } = useShop();
  const { isAuthenticated, user } = useAuth();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  const total = cart.reduce((sum, item) => {
    const np = normalizeProduct(item);
    return sum + np.displayPrice;
  }, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isAuthenticated) {
        // Create order via API
        const orderData = {
          shippingAddress: {
            fullName: formData.name,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            phone: formData.phone,
          },
          cartItems: cart.map((item) => {
            const np = normalizeProduct(item);
            return {
              // Backend accepts real Mongo _id, or resolves by slug / title for demo/fallback items
              productId: np._id || np.displayId,
              slug: np.slug,
              title: np.displayName,
              image: np.displayImage || undefined,
              quantity: 1,
              price: np.displayPrice,
            };
          }),
          totalPrice: total,
        };

        await orderApi.create(orderData);
        //open payment gateway
        await onPayment(total, 'Order Payment');
        toast.success('Redirecting to payment gateway...');
      } else {
        // Simulate order for non-authenticated users
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success('Order placed! Sign in to track your order.');
      }

      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="container mx-auto px-4 py-32 min-h-screen text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <button
          onClick={() => navigate('/shop')}
          className="text-primary hover:underline"
        >
          Continue Shopping
        </button>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
      <h1 className="text-4xl font-bold text-foreground mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Shipping Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Shipping Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-secondary/30 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-secondary/30 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-secondary/30 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-secondary/30 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-secondary/30 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-secondary/30 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">PIN Code</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-secondary/30 border border-border rounded-xl outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? 'Placing Order...' : `Place Order — ₹${total.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary */}
        <div>
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-sm sticky top-32">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cart.map((item) => {
                const np = normalizeProduct(item);
                return (
                  <div key={np.displayId} className="flex items-center gap-4">
                    <img
                      src={np.displayImage}
                      alt={np.displayName}
                      className="w-16 h-16 object-cover rounded-xl"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{np.displayName}</p>
                      <p className="text-sm text-muted-foreground">Qty: 1</p>
                    </div>
                    <span className="font-bold">₹{np.displayPrice}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-bold text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between text-xl pt-2 border-t border-border">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
