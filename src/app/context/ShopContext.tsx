import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, fallbackProducts, fallbackCategories, Category } from '../data/products';
import { productApi, categoryApi, cartApi, wishlistApi } from '../services/api';

interface ShopContextType {
  products: Product[];
  categories: Category[];
  cart: Product[];
  wishlist: Product[];
  loading: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInCart: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  refreshProducts: () => void;
  refreshCategories: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

function getProductId(p: Product): string {
  return p._id || String(p.id);
}

function isAuthenticated(): boolean {
  return !!localStorage.getItem('auth_token');
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  const refreshProducts = useCallback(async () => {
    try {
      const res = await productApi.getAll();
      if (res.success && res.data && res.data.length > 0) {
        setProducts(res.data);
      }
    } catch {
      // Keep fallback data
    }
  }, []);

  // Fetch categories from API
  const refreshCategories = useCallback(async () => {
    try {
      const res = await categoryApi.getActive();
      if (res.success && res.data && res.data.length > 0) {
        setCategories(res.data);
      }
    } catch {
      // Keep fallback data
    }
  }, []);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([refreshProducts(), refreshCategories()]);

      // Load cart and wishlist from API if authenticated
      if (isAuthenticated()) {
        try {
          const cartRes = await cartApi.get();
          if (cartRes.success && cartRes.data?.cartItems) {
            const cartProducts = cartRes.data.cartItems
              .map((item: any) => item.productId)
              .filter(Boolean);
            setCart(cartProducts);
          }
        } catch {
          // Use local cart
        }

        try {
          const wishRes = await wishlistApi.get();
          if (wishRes.success && wishRes.data?.products) {
            const wishProducts = wishRes.data.products
              .map((item: any) => item.productId)
              .filter(Boolean);
            setWishlist(wishProducts);
          }
        } catch {
          // Use local wishlist
        }
      }

      setLoading(false);
    };

    loadData();
  }, [refreshProducts, refreshCategories]);

  const addToCart = (product: Product) => {
    const pid = getProductId(product);
    setCart((prev) => {
      if (prev.some((p) => getProductId(p) === pid)) return prev;
      return [...prev, product];
    });

    // Sync with backend if authenticated
    if (isAuthenticated()) {
      cartApi.add(pid).catch(() => {});
    }
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((p) => getProductId(p) !== productId));

    if (isAuthenticated()) {
      cartApi.remove(productId).catch(() => {});
    }
  };

  const toggleWishlist = (product: Product) => {
    const pid = getProductId(product);
    setWishlist((prev) => {
      const exists = prev.some((p) => getProductId(p) === pid);
      if (exists) {
        if (isAuthenticated()) {
          wishlistApi.remove(pid).catch(() => {});
        }
        return prev.filter((p) => getProductId(p) !== pid);
      }
      if (isAuthenticated()) {
        wishlistApi.add(pid).catch(() => {});
      }
      return [...prev, product];
    });
  };

  const isInCart = (productId: string) =>
    cart.some((p) => getProductId(p) === productId);

  const isInWishlist = (productId: string) =>
    wishlist.some((p) => getProductId(p) === productId);

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        loading,
        addToCart,
        removeFromCart,
        toggleWishlist,
        isInCart,
        isInWishlist,
        refreshProducts,
        refreshCategories,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
