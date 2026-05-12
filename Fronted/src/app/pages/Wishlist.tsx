import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export function Wishlist() {
  const { wishlist } = useShop();

  if (wishlist.length === 0) {
    return (
      <main className="container mx-auto px-4 py-32 min-h-screen text-center flex flex-col items-center justify-center">
        <div className="bg-secondary/30 p-8 rounded-full mb-6 text-primary">
          <Heart size={64} fill="currentColor" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Your Wishlist is Empty</h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          Save your favorite wellness products here. They'll be waiting for you when you're ready to purchase.
        </p>
        <Link 
          to="/shop" 
          className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
        >
          Discover Products
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-32 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center gap-3">
          <Heart className="text-primary fill-primary" /> Your Wishlist
        </h1>
        <p className="text-muted-foreground text-lg">
          You have {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved in your wishlist.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {wishlist.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
