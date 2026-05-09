import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { useShop } from '../context/ShopContext';
import { normalizeProduct, Product } from '../data/products';
import { productApi } from '../services/api';

export function Shop() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products: contextProducts } = useShop();
  const [displayProducts, setDisplayProducts] = useState<Product[]>(contextProducts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (query) {
          const res = await productApi.search(query, 50);
          if (res.success && res.data?.length > 0) {
            setDisplayProducts(res.data);
            setLoading(false);
            return;
          }
        } else {
          const res = await productApi.getAll();
          if (res.success && res.data?.length > 0) {
            setDisplayProducts(res.data);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fall through to context/fallback
      }

      // Fallback: filter context products locally
      if (query) {
        setDisplayProducts(
          contextProducts.filter((p) => {
            const np = normalizeProduct(p);
            const catName = typeof p.category === 'string' ? p.category : p.category?.name || '';
            return (
              np.displayName.toLowerCase().includes(query.toLowerCase()) ||
              catName.toLowerCase().includes(query.toLowerCase())
            );
          })
        );
      } else {
        setDisplayProducts(contextProducts);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [query, contextProducts]);

  return (
    <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {query ? `Search results for "${query}"` : 'All Products'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {loading ? 'Loading...' : `${displayProducts.length} product${displayProducts.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {displayProducts.length === 0 && !loading ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No products found</p>
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
