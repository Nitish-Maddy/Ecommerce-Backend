import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { useShop } from '../context/ShopContext';
import { normalizeProduct, Product } from '../data/products';
import { categoryApi, productApi } from '../services/api';

export function CategoryDetail() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const { products: contextProducts, categories: contextCategories } = useShop();
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [categoryTitle, setCategoryTitle] = useState(categoryName || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Try to find category by slug from API
        const catRes = await categoryApi.getBySlug(categoryName || '');
        if (catRes.success && catRes.data) {
          setCategoryTitle(catRes.data.name);
          // Fetch products for this category
          const prodRes = await productApi.getByCategory(catRes.data._id);
          if (prodRes.success && prodRes.data?.length > 0) {
            setDisplayProducts(prodRes.data);
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fall through to local filtering
      }

      // Fallback: filter from context
      const matchedCat = contextCategories.find(
        (c) => c.name.toLowerCase() === categoryName?.toLowerCase() ||
               c.slug?.toLowerCase() === categoryName?.toLowerCase()
      );
      if (matchedCat) {
        setCategoryTitle(matchedCat.name);
      } else {
        setCategoryTitle(categoryName || 'Category');
      }

      const filtered = contextProducts.filter((p) => {
        const catName = typeof p.category === 'string' ? p.category : p.category?.name || '';
        return catName.toLowerCase() === categoryName?.toLowerCase();
      });
      setDisplayProducts(filtered);
      setLoading(false);
    };

    fetchData();
  }, [categoryName, contextProducts, contextCategories]);

  return (
    <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
      <div className="mb-8">
        <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">
          ← Back to Shop
        </Link>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-4 capitalize">{categoryTitle}</h1>
        <p className="text-muted-foreground text-lg">
          {loading ? 'Loading...' : `${displayProducts.length} product${displayProducts.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {displayProducts.length === 0 && !loading ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground mb-4">No products found in this category</p>
          <Link to="/shop" className="text-primary hover:underline font-medium">Browse all products →</Link>
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
