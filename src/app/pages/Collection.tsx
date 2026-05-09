import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { normalizeProduct, Product } from '../data/products';
import { useShop } from '../context/ShopContext';
import { productApi } from '../services/api';

const COLLECTIONS: Record<string, { title: string; query: string }> = {
  'daily-essentials': { title: 'Daily Essentials', query: 'daily essentials' },
  'mens-wellness': { title: "Men's Wellness", query: "men's wellness" },
  'weight-management': { title: 'Weight Management', query: 'weight management' },
  'daily-nutrition': { title: 'Daily Nutrition', query: 'daily nutrition' },
  fitness: { title: 'Fitness', query: 'fitness' },
};

export function Collection() {
  const { slug } = useParams<{ slug: string }>();
  const collection = useMemo(() => (slug ? COLLECTIONS[slug] : undefined), [slug]);
  const { products: contextProducts } = useShop();

  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const q = collection?.query || '';

      try {
        if (q) {
          const res = await productApi.search(q, 50);
          if (res.success && Array.isArray(res.data)) {
            setDisplayProducts(res.data);
            setLoading(false);
            return;
          }
        }
      } catch {
        // fall back
      }

      if (!q) {
        setDisplayProducts(contextProducts);
        setLoading(false);
        return;
      }

      setDisplayProducts(
        contextProducts.filter((p) => {
          const np = normalizeProduct(p);
          const catName =
            typeof p.category === 'string' ? p.category : p.category?.name || '';
          return (
            np.displayName.toLowerCase().includes(q.toLowerCase()) ||
            catName.toLowerCase().includes(q.toLowerCase())
          );
        })
      );
      setLoading(false);
    };

    run();
  }, [collection, contextProducts]);

  if (!collection) {
    return (
      <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
        <h1 className="text-3xl font-bold text-foreground">Collection not found</h1>
        <p className="text-muted-foreground mt-2">
          This collection doesn’t exist. Please choose a valid category.
        </p>
        <div className="mt-6">
          <Link to="/shop" className="text-primary font-semibold hover:underline">
            Browse all products →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
      <div className="mb-8">
        <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">
          ← Back to Shop
        </Link>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-4">{collection.title}</h1>
        <p className="text-muted-foreground text-lg">
          {loading ? 'Loading...' : `${displayProducts.length} product${displayProducts.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {displayProducts.length === 0 && !loading ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No products found</p>
          <Link to="/shop" className="text-primary hover:underline font-medium block mt-3">
            Browse all products →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}

