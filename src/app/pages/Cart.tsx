import { Link } from 'react-router-dom';
import { ShoppingBag, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { normalizeProduct } from '../data/products';

export function Cart() {
  const { cart, removeFromCart } = useShop();

  const total = cart.reduce((sum, item) => {
    const np = normalizeProduct(item);
    return sum + np.displayPrice;
  }, 0);

  if (cart.length === 0) {
    return (
      <main className="container mx-auto px-4 py-32 min-h-screen text-center flex flex-col items-center justify-center">
        <div className="bg-secondary/30 p-8 rounded-full mb-6 text-primary">
          <ShoppingBag size={64} />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Discover our premium wellness products.
        </p>
        <Link 
          to="/shop" 
          className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
        >
          Start Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-32 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center gap-3">
          <ShoppingBag className="text-primary fill-primary/20" /> Your Cart
        </h1>
        <p className="text-muted-foreground text-lg">
          You have {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-6">
          {cart.map((product) => {
            const np = normalizeProduct(product);
            const pid = np.displayId;
            const productSlug = np.slug || np.displayId;
            return (
              <div key={pid} className="flex gap-6 items-center bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-border">
                <Link to={`/product/${productSlug}`} className="block h-24 w-24 sm:h-32 sm:w-32 rounded-2xl overflow-hidden bg-secondary/50 shrink-0">
                  <img src={np.displayImage} alt={np.displayName} className="w-full h-full object-cover" />
                </Link>
                
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${productSlug}`}
                    className="font-bold text-lg sm:text-xl text-foreground hover:text-primary transition-colors block mb-1 truncate"
                  >
                    {np.displayName}
                  </Link>
                  <div className="text-sm text-primary font-medium mb-2">
                    {typeof product.category === 'string' ? product.category : product.category?.name || ''}
                  </div>
                  <div className="text-xl font-bold">${np.displayPrice}</div>
                </div>

                <button 
                  onClick={() => removeFromCart(pid)}
                  className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors sm:ml-4"
                  title="Remove from cart"
                >
                  <X size={24} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="w-full lg:w-96">
          <div className="bg-white p-8 rounded-3xl border border-border shadow-sm sticky top-32">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-lg">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold text-foreground">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-bold text-emerald-600">Free</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between text-xl mt-4">
                <span className="font-bold">Total</span>
                <span className="font-bold text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <Link 
              to="/checkout"
              className="block w-full text-center bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
