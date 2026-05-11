import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Shield, Package, RotateCcw } from 'lucide-react';
import { Product, normalizeProduct, fallbackProducts } from '../data/products';
import { useShop } from '../context/ShopContext';
import { productApi } from '../services/api';
import { toast } from 'sonner';

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, products: contextProducts } = useShop();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

      try {
        const res = await productApi.getBySlug(slug || '');
        if (res.success && res.data) {
          setProduct(res.data);
          setLoading(false);
          return;
        }
      } catch {
        // Fall through to local data
      }

      // Fallback: find in context or hardcoded data
      const allProducts = [...contextProducts, ...fallbackProducts];
      const found = allProducts.find(
        (p) =>
          p.slug === slug ||
          p._id === slug ||
          String(p.id) === slug
      );
      setProduct(found || null);
      setLoading(false);
    };

    fetchProduct();
  }, [slug, contextProducts]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 text-center min-h-screen">
        <h1 className="text-2xl text-muted-foreground">Loading product...</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Product not found</h1>
        <Link to="/shop" className="text-primary hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const np = normalizeProduct(product);
  const pid = np.displayId;
  const isWishlisted = isInWishlist(pid);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${np.displayName} added to cart`);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    if (!isWishlisted) {
      toast.success(`${np.displayName} added to wishlist`);
    } else {
      toast.info(`${np.displayName} removed from wishlist`);
    }
  };

  const catName = typeof product.category === 'string' ? product.category : product.category?.name || '';

  return (
    <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
      <div className="mb-8">
        <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">
          ← Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-border">
        {/* Left: Product Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/50 group">
          {product.badge && (
            <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              {product.badge}
            </div>
          )}
          {np.displayDiscount > 0 && (
            <div className="absolute top-4 right-4 z-10 bg-red-500 text-white px-2 py-1 flex flex-col items-center justify-center rounded-lg shadow-md">
              <span className="font-bold leading-none">{np.displayDiscount}%</span>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">OFF</span>
            </div>
          )}
          <img
            src={np.displayImage}
            alt={np.displayName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <div className="mb-2 text-primary font-medium tracking-wide text-sm uppercase">
            {catName}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {np.displayName}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center text-yellow-400">
              <Star size={20} fill="currentColor" />
              <span className="ml-1 text-foreground font-medium">{np.displayRating}</span>
            </div>
            <span className="text-muted-foreground text-sm">({np.displayReviews} reviews)</span>
          </div>

          <div className="flex items-end gap-3 mb-8">
            <span className="text-4xl font-bold text-foreground">${np.displayPrice}</span>
            {np.displayOriginalPrice && np.displayOriginalPrice > np.displayPrice && (
              <span className="text-xl text-muted-foreground line-through mb-1">
                ${np.displayOriginalPrice}
              </span>
            )}
          </div>

          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            {product.description || `Experience the power of ${np.displayName.toLowerCase()}. Formulated with premium ingredients to support your journey to health and wellness. 100% natural, lab-tested, and trusted by thousands.`}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button 
              onClick={handleAddToCart}
              className="flex-[2] bg-secondary text-foreground py-4 rounded-xl font-bold text-lg hover:bg-secondary/80 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
            >
              <ShoppingCart size={22} />
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-[3] bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
            >
              Buy Now
            </button>
            <button 
              onClick={handleWishlist}
              className={`p-4 border-2 ${isWishlisted ? 'border-red-500' : 'border-border'} text-foreground hover:text-red-500 hover:border-red-500 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center bg-white group hover:shadow-md`}
            >
              <Heart className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'group-hover:fill-red-500 text-foreground'}`} size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-border mt-auto">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-secondary p-3 rounded-full text-primary">
                <Shield size={24} />
              </div>
              <span className="text-sm font-medium text-foreground">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-secondary p-3 rounded-full text-primary">
                <Package size={24} />
              </div>
              <span className="text-sm font-medium text-foreground">Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="bg-secondary p-3 rounded-full text-primary">
                <RotateCcw size={24} />
              </div>
              <span className="text-sm font-medium text-foreground">30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
