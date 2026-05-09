import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Eye } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export function AccountWishlist() {
  const { wishlist, toggleWishlist, addToCart, isInCart } = useShop();

  const getProductId = (p: any) => p._id || String(p.id);
  const getProductSlug = (p: any) => p.slug || p._id || String(p.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
        <Heart className="text-primary" size={24} /> My Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border shadow-sm py-16 text-center">
          <Heart size={40} className="text-gray-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-foreground mb-2">Your Wishlist is Empty</h2>
          <p className="text-muted-foreground text-sm mb-4">Save products you love for later</p>
          <Link to="/shop" className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all">
            Discover Products
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wishlist.map((product) => {
              const pid = getProductId(product);
              const productSlug = getProductSlug(product);
              const inCart = isInCart(pid);
              return (
                <div key={pid} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-all group">
                  <div className="flex gap-4 p-4">
                    {/* Image */}
                    <Link
                      to={`/product/${productSlug}`}
                      className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0"
                    >
                      {(product as any).image || (product as any).images?.[0] ? (
                        <img
                          src={(product as any).image || (product as any).images?.[0]}
                          alt={(product as any).title || (product as any).name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Heart size={24} />
                        </div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${productSlug}`}>
                        <h3 className="font-bold text-foreground text-sm line-clamp-2 hover:text-primary transition-colors">
                          {(product as any).title || (product as any).name || 'Product'}
                        </h3>
                      </Link>
                      {(product as any).price && (
                        <p className="text-lg font-bold text-primary mt-1">
                          ₹{(product as any).price}
                          {(product as any).originalPrice && (
                            <span className="text-xs text-gray-400 line-through ml-2 font-normal">₹{(product as any).originalPrice}</span>
                          )}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => { if (!inCart) addToCart(product); }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            inCart
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-primary text-primary-foreground hover:bg-primary/90'
                          }`}
                        >
                          <ShoppingCart size={13} /> {inCart ? 'In Cart' : 'Add to Cart'}
                        </button>
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="flex items-center gap-1.5 bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                        <Link
                          to={`/product/${productSlug}`}
                          className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                        >
                          <Eye size={13} /> View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
