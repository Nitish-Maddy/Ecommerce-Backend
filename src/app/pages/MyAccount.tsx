import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, MapPin, Settings, CreditCard, LogOut, ChevronRight, Shield, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';

export function MyAccount() {
  const { isAuthenticated, user, logout } = useAuth();
  const { wishlist, cart } = useShop();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
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

  const accountSections = [
    {
      title: 'Your Orders',
      description: 'Track, return, or buy things again',
      icon: Package,
      link: '/orders',
      color: 'from-orange-400 to-orange-500',
      badge: null,
    },
    {
      title: 'Login & Security',
      description: 'Edit name, email, and password',
      icon: Shield,
      link: '/account#settings',
      color: 'from-green-400 to-green-500',
      badge: null,
    },
    {
      title: 'Your Addresses',
      description: 'Edit addresses for orders',
      icon: MapPin,
      link: '/account#addresses',
      color: 'from-blue-400 to-blue-500',
      badge: null,
    },
    {
      title: 'Your Wishlist',
      description: 'Products you\'ve saved for later',
      icon: Heart,
      link: '/wishlist',
      color: 'from-pink-400 to-pink-500',
      badge: wishlist.length > 0 ? wishlist.length : null,
    },
    {
      title: 'Payment Methods',
      description: 'Manage payment methods',
      icon: CreditCard,
      link: '/account#payment',
      color: 'from-purple-400 to-purple-500',
      badge: null,
    },
    {
      title: 'Notifications',
      description: 'Manage notification preferences',
      icon: Bell,
      link: '/account#notifications',
      color: 'from-yellow-400 to-yellow-500',
      badge: null,
    },
  ];

  return (
    <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-border shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-[#6B5344] rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-xl ring-4 ring-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-bold text-foreground">{user?.name}</h1>
            <p className="text-muted-foreground mt-1">{user?.email}</p>
            <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Active
              </span>
              <span className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">
                {user?.role || 'Member'}
              </span>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-all font-medium text-sm"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-border p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-primary">{cart.length}</p>
          <p className="text-xs text-muted-foreground font-medium mt-1">Cart Items</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-primary">{wishlist.length}</p>
          <p className="text-xs text-muted-foreground font-medium mt-1">Wishlist Items</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="text-xs text-muted-foreground font-medium mt-1">Total Orders</p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5 text-center shadow-sm">
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="text-xs text-muted-foreground font-medium mt-1">Reviews</p>
        </div>
      </div>

      {/* Account Sections Grid */}
      <h2 className="text-2xl font-bold text-foreground mb-5">Your Account</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accountSections.map((section) => (
          <Link
            key={section.title}
            to={section.link}
            className="group bg-white rounded-2xl border border-border p-5 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex items-start gap-4"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform flex-shrink-0`}>
              <section.icon size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{section.title}</h3>
                {section.badge && (
                  <span className="bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded-full">{section.badge}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{section.description}</p>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-primary mt-1 transition-colors flex-shrink-0" />
          </Link>
        ))}
      </div>

      {/* Recently Viewed / Recommendations Placeholder */}
      <div id="addresses" className="mt-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">Your Addresses</h2>
        <div className="bg-white rounded-2xl border border-border p-8 shadow-sm text-center">
          <MapPin size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No addresses saved yet</p>
          <p className="text-sm text-muted-foreground mt-1">Add an address for faster checkout</p>
          <button className="mt-4 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all">
            + Add Address
          </button>
        </div>
      </div>

      <div id="settings" className="mt-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">Account Settings</h2>
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <p className="font-medium text-foreground">Name</p>
              <p className="text-sm text-muted-foreground">{user?.name}</p>
            </div>
            <button className="text-primary text-sm font-medium hover:underline">Edit</button>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <p className="font-medium text-foreground">Email</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <button className="text-primary text-sm font-medium hover:underline">Edit</button>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="font-medium text-foreground">Password</p>
              <p className="text-sm text-muted-foreground">••••••••</p>
            </div>
            <button className="text-primary text-sm font-medium hover:underline">Change</button>
          </div>
        </div>
      </div>
    </main>
  );
}
