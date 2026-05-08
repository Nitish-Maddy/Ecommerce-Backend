import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, normalizeProduct } from '../data/products';
import { useShop } from '../context/ShopContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist, addToCart } = useShop();
  const np = normalizeProduct(product);
  const pid = np.displayId;
  const productSlug = np.slug || np.displayId;
  const isWishlisted = isInWishlist(pid);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!isWishlisted) {
      toast.success(`${np.displayName} added to wishlist`);
    } else {
      toast.info(`${np.displayName} removed from wishlist`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${np.displayName} added to cart`);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    navigate('/checkout');
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/product/${productSlug}`)}
      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
    >
      <div className="relative overflow-hidden">
        {/* Product Image */}
        <div className="block aspect-square overflow-hidden bg-secondary">
          <img
            src={np.displayImage}
            alt={np.displayName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* Badges */}
        {product.badge && (
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
            {product.badge}
          </div>
        )}
        {np.displayDiscount > 0 && (
          <div className="absolute top-4 right-4 bg-destructive text-white px-3 py-1 rounded-full text-sm">
            -{np.displayDiscount}%
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute inset-x-0 bottom-0 flex gap-2 p-4 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleWishlist}
            className={`flex-1 ${
              isWishlisted ? 'bg-primary' : 'bg-white'
            } ${
              isWishlisted ? 'text-white' : 'text-foreground'
            } py-2 rounded-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2`}
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/product/${productSlug}`);
            }}
            className="flex-1 bg-white text-foreground py-2 rounded-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Eye size={18} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="block">
          <h3 className="mb-2 text-foreground line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
            {np.displayName}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(np.displayRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({np.displayReviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4 mt-auto">
          <span className="text-xl text-primary">${np.displayPrice}</span>
          {np.displayOriginalPrice && np.displayOriginalPrice > np.displayPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${np.displayOriginalPrice}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-secondary text-foreground py-3 rounded-xl hover:bg-secondary/80 transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
            title="Add to Cart"
          >
            <ShoppingCart size={18} />
          </button>
          <button 
            onClick={handleBuyNow}
            className="flex-[2] bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}
