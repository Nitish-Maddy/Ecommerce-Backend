import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import {
  LayoutDashboard, Package, Clock, Truck, Heart, MapPin,
  CreditCard, Settings, LogOut, ChevronRight, Menu, X, User
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/account', end: true },
  { label: 'My Orders', icon: Package, path: '/account/orders' },
  { label: 'Order History', icon: Clock, path: '/account/order-history' },
  { label: 'Track Order', icon: Truck, path: '/account/track-order' },
  { label: 'Wishlist', icon: Heart, path: '/account/wishlist' },
  { label: 'Saved Addresses', icon: MapPin, path: '/account/addresses' },
  { label: 'Payment Methods', icon: CreditCard, path: '/account/payment-methods' },
  { label: 'Profile Settings', icon: Settings, path: '/account/settings' },
];

export function AccountLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { wishlist } = useShop();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <main className="container mx-auto px-4 py-32 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-border text-center">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={36} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Sign in to view your account</h1>
          <p className="text-muted-foreground mb-8">Access your profile, orders, and more</p>
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
      {/* Mobile menu toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 bg-white border border-border rounded-xl px-4 py-3 w-full shadow-sm text-foreground font-medium"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          <span>Account Menu</span>
        </button>
      </div>

      <div className="flex gap-6 items-start">
        {/* Sidebar */}
        <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block w-full lg:w-72 flex-shrink-0`}>
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden sticky top-36">
            {/* User profile header */}
            <div className="p-5 border-b border-gray-100 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-[#6B5344] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-foreground truncate text-sm">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group mb-0.5 ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-foreground'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={18} className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'} />
                      <span className="flex-1">{item.label}</span>
                      {item.label === 'Wishlist' && wishlist.length > 0 && (
                        <span className="bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {wishlist.length}
                        </span>
                      )}
                      <ChevronRight size={14} className={`transition-transform ${isActive ? 'text-primary' : 'text-gray-300'}`} />
                    </>
                  )}
                </NavLink>
              ))}

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full mt-1"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
