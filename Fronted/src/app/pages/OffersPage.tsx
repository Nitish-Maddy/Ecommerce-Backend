import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { Product, normalizeProduct } from '../data/products';
import { useShop } from '../context/ShopContext';
import { productApi } from '../services/api';

type OfferKey = 'mega-offers' | 'combos-gifts' | 'bestsellers' | 'newly-launched';

const OFFER_CONFIG: Record<
  OfferKey,
  { title: string; subtitle: string; fetcher?: () => Promise<any>; fallbackFilter?: (p: any) => boolean }
> = {
  'mega-offers': {
    title: 'Mega Offers',
    subtitle: 'Big savings on selected products.',
    fetcher: () => productApi.getMegaOffers(60),
    fallbackFilter: (p) => !!p?.isMegaOffer,
  },
  'combos-gifts': {
    title: 'Combos & Gifts',
    subtitle: 'Perfect bundles and gift-ready picks.',
    // If your backend later supports combos, swap this to a dedicated endpoint.
    fallbackFilter: (p) => !!p?.isCombo || (Array.isArray(p?.tags) && p.tags.includes('combo')),
  },
  bestsellers: {
    title: 'Bestsellers',
    subtitle: 'Customer favourites you’ll love.',
    fetcher: () => productApi.getBestSellers(60),
    fallbackFilter: (p) => !!p?.isBestSeller,
  },
  'newly-launched': {
    title: 'Newly Launched',
    subtitle: 'Fresh arrivals and latest launches.',
    fetcher: () => productApi.getNewlyLaunched(60),
    fallbackFilter: (p) => !!p?.isNewlyLaunched,
  },
};

function isOfferKey(v: string | undefined): v is OfferKey {
  return !!v && Object.prototype.hasOwnProperty.call(OFFER_CONFIG, v);
}

export function OffersPage() {
  const { slug } = useParams<{ slug: string }>();
  const { products: contextProducts } = useShop();

  const config = useMemo(() => (isOfferKey(slug) ? OFFER_CONFIG[slug] : null), [slug]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      if (!config) {
        setLoading(false);
        return;
      }

      // Try server fetch first when available
      if (config.fetcher) {
        try {
          const res = await config.fetcher();
          if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
            setDisplayProducts(res.data);
            setLoading(false);
            return;
          }
        } catch {
          // fallback
        }
      }

      // Fallback to local filtering from context
      const filtered = config.fallbackFilter
        ? contextProducts.filter(config.fallbackFilter)
        : contextProducts;

      // If no flagged products exist for "newly-launched", show most recently added products
      if (filtered.length === 0 && slug === 'newly-launched' && contextProducts.length > 0) {
        const byDate = [...contextProducts].sort((a, b) => {
          const da = new Date(a.createdAt || 0).getTime();
          const db = new Date(b.createdAt || 0).getTime();
          return db - da;
        });
        setDisplayProducts(byDate.slice(0, 60));
        setLoading(false);
        return;
      }

      // Ensure stable-ish order (name sort) for nicer UX
      const sorted = [...filtered].sort((a, b) => {
        const an = normalizeProduct(a).displayName.toLowerCase();
        const bn = normalizeProduct(b).displayName.toLowerCase();
        return an.localeCompare(bn);
      });

      setDisplayProducts(sorted);
      setLoading(false);
    };

    run();
  }, [config, slug, contextProducts]);

  if (!config) {
    return (
      <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
        <h1 className="text-3xl font-bold text-foreground">Offer page not found</h1>
        <p className="text-muted-foreground mt-2">Please choose a valid offer.</p>
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
        <h1 className="text-4xl font-bold text-foreground mb-3">{config.title}</h1>
        <p className="text-muted-foreground text-lg">{config.subtitle}</p>
        <p className="text-muted-foreground mt-2">
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

