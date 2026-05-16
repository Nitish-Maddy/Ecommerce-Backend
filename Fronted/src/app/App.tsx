import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingButtons } from './components/FloatingButtons';

import { ProtectedRoute } from './components/ProtectedRoute';
import { NotFound } from './pages/NotFound';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { CategoryList } from './pages/CategoryList';
import { CategoryDetail } from './pages/CategoryDetail';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { MyOrders } from './pages/MyOrders';
import { ContactUs } from './pages/ContactUs';
import { Collection } from './pages/Collection';
import { DiscoverPage } from './pages/DiscoverPage';
import { OffersPage } from './pages/OffersPage';
import { PolicyPage } from './pages/PolicyPage';

// Account Pages
import { AccountLayout } from './components/AccountLayout';
import { ProfileDashboard } from './pages/account/ProfileDashboard';
import { AccountMyOrders } from './pages/account/AccountMyOrders';
import { OrderDetails } from './pages/account/OrderDetails';
import { OrderHistory } from './pages/account/OrderHistory';
import { TrackOrder } from './pages/account/TrackOrder';
import { AccountWishlist } from './pages/account/AccountWishlist';
import { SavedAddresses } from './pages/account/SavedAddresses';
import { PaymentMethods } from './pages/account/PaymentMethods';
import { ProfileSettings } from './pages/account/ProfileSettings';

import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';
import { ScrollToTop } from './components/ScrollToTop';

function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <main className="container mx-auto px-4 py-32 min-h-screen">
      <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl border border-border shadow-sm p-8 sm:p-10">
        <div className="text-emerald-600 font-bold text-sm tracking-wide uppercase mb-3">
          Payment Successful
        </div>
        <h1 className="text-4xl font-extrabold text-foreground mb-3">Your order is confirmed</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Order ID: <span className="font-semibold text-foreground">{orderId}</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/account/orders"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
          >
            View Orders
          </Link>
          <Link
            to="/shop"
            className="bg-secondary text-foreground px-8 py-3 rounded-xl font-bold text-lg hover:bg-secondary/80 transition-all border border-border"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
    <ShopProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/category" element={<CategoryList />} />
            <Route path="/category/:categoryName" element={<CategoryDetail />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/collection/:slug" element={<Collection />} />
            <Route path="/discover/:slug" element={<DiscoverPage />} />
            <Route path="/offers/:slug" element={<OffersPage />} />
            <Route path="/policy/:slug" element={<PolicyPage />} />

            {/* Account Dashboard with Sidebar */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ProfileDashboard />} />
              <Route path="orders" element={<AccountMyOrders />} />
              <Route path="orders/:orderId" element={<OrderDetails />} />
              <Route path="order-history" element={<OrderHistory />} />
              <Route path="track-order" element={<TrackOrder />} />
              <Route path="track-order/:orderId" element={<TrackOrder />} />
              <Route path="wishlist" element={<AccountWishlist />} />
              <Route path="addresses" element={<SavedAddresses />} />
              <Route path="payment-methods" element={<PaymentMethods />} />
              <Route path="settings" element={<ProfileSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
        <FloatingButtons />
        <Toaster position="top-right" duration={3000} closeButton />
      </div>
    </BrowserRouter>
    </ShopProvider>
    </AuthProvider>
  );
}
