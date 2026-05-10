// ── Backend-compatible interfaces ────────────────────────

export interface Product {
  _id: string;
  id?: number; // for backwards compat with hardcoded data
  title: string;
  name?: string; // alias used in hardcoded data
  slug?: string;
  imgCover?: string;
  image?: string; // alias
  images?: string[];
  description?: string;
  price: number;
  originalPrice?: number; // alias for hardcoded data
  priceAfterDiscount?: number;
  discountPercentage?: number;
  discount?: number; // alias
  quantity?: number;
  sold?: number;
  unit?: string;
  category: any; // string or populated object
  subcategory?: any;
  brand?: any;
  tags?: string[];
  isBestSeller?: boolean;
  isNewlyLaunched?: boolean;
  isMegaOffer?: boolean;
  isCombo?: boolean;
  ratingAvg?: number;
  rating?: number; // alias
  ratingCount?: number;
  reviews?: any;
  benefits?: string[];
  ingredients?: string[];
  howToUse?: string;
  badge?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  id?: number;
  name: string;
  slug?: string;
  description?: string;
  image: string;
  icon?: string;
  parentCategory?: string | null;
  displayOrder?: number;
  showInNav?: boolean;
  isActive?: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  image: string;
  rating: number;
  text: string;
}

// ── Helper to normalize product for display ──────────────
export function normalizeProduct(p: any): Product & { displayName: string; displayImage: string; displayPrice: number; displayOriginalPrice?: number; displayDiscount?: number; displayRating: number; displayReviews: number; displayId: string } {
  return {
    ...p,
    displayId: p._id || String(p.id),
    displayName: p.title || p.name || 'Untitled Product',
    displayImage: p.imgCover || p.image || '',
    displayPrice: p.priceAfterDiscount || p.price || 0,
    displayOriginalPrice: p.priceAfterDiscount ? p.price : p.originalPrice,
    displayDiscount: p.discountPercentage || p.discount || 0,
    displayRating: p.ratingAvg || p.rating || 0,
    displayReviews: p.ratingCount || (typeof p.reviews === 'number' ? p.reviews : 0),
  };
}

// ── Hardcoded fallback data ──────────────────────────────

export const fallbackProducts: Product[] = [
  {
    _id: '1',
    id: 1,
    title: 'Omega-3 Fish Oil 1000mg',
    name: 'Omega-3 Fish Oil 1000mg',
    price: 24.99,
    originalPrice: 34.99,
    discount: 30,
    rating: 4.8,
    reviews: 256,
    image: 'https://images.unsplash.com/photo-1768403305881-a7a82fd63512?w=400',
    badge: 'Best Seller',
    category: 'Wellness'
  },
  {
    _id: '2',
    id: 2,
    title: 'Whey Protein Isolate',
    name: 'Whey Protein Isolate',
    price: 49.99,
    originalPrice: 69.99,
    discount: 28,
    rating: 4.9,
    reviews: 412,
    image: 'https://images.unsplash.com/photo-1642588420290-058839d71554?w=400',
    badge: 'Popular',
    category: 'Nutrition'
  },
  {
    _id: '3',
    id: 3,
    title: 'Multivitamin Complex',
    name: 'Multivitamin Complex',
    price: 19.99,
    originalPrice: 29.99,
    discount: 33,
    rating: 4.7,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1768403305881-a7a82fd63512?w=400',
    category: 'Wellness'
  },
  {
    _id: '4',
    id: 4,
    title: 'Collagen Peptides Powder',
    name: 'Collagen Peptides Powder',
    price: 34.99,
    originalPrice: 44.99,
    discount: 22,
    rating: 4.6,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1651740896477-467ea46b4fe5?w=400',
    badge: 'New',
    category: 'Skin'
  },
  {
    _id: '5',
    id: 5,
    title: 'Pre-Workout Energy Boost',
    name: 'Pre-Workout Energy Boost',
    price: 39.99,
    originalPrice: 54.99,
    discount: 27,
    rating: 4.8,
    reviews: 324,
    image: 'https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?w=400',
    badge: 'Best Seller',
    category: 'Fitness'
  },
  {
    _id: '6',
    id: 6,
    title: 'Biotin Hair Growth Vitamins',
    name: 'Biotin Hair Growth Vitamins',
    price: 22.99,
    originalPrice: 32.99,
    discount: 30,
    rating: 4.7,
    reviews: 278,
    image: 'https://images.unsplash.com/photo-1642005801149-b33da87c1175?w=400',
    category: 'Hair'
  },
  {
    _id: '7',
    id: 7,
    title: 'Probiotics Digestive Health',
    name: 'Probiotics Digestive Health',
    price: 27.99,
    originalPrice: 39.99,
    discount: 30,
    rating: 4.9,
    reviews: 445,
    image: 'https://images.unsplash.com/photo-1768403305881-a7a82fd63512?w=400',
    badge: 'Popular',
    category: 'Wellness'
  },
  {
    _id: '8',
    id: 8,
    title: 'Vitamin C Serum',
    name: 'Vitamin C Serum',
    price: 29.99,
    originalPrice: 39.99,
    discount: 25,
    rating: 4.8,
    reviews: 356,
    image: 'https://images.unsplash.com/photo-1651740896477-467ea46b4fe5?w=400',
    badge: 'Best Seller',
    category: 'Skin'
  }
];

export const fallbackCategories: Category[] = [
  {
    _id: '1',
    id: 1,
    name: 'Wellness',
    image: 'https://images.unsplash.com/photo-1758599879693-9e06f55a4ded?w=400'
  },
  {
    _id: '2',
    id: 2,
    name: 'Nutrition',
    image: 'https://images.unsplash.com/photo-1670164747721-d3500ef757a6?w=400'
  },
  {
    _id: '3',
    id: 3,
    name: 'Fitness',
    image: 'https://images.unsplash.com/photo-1584827386916-b5351d3ba34b?w=400'
  },
  {
    _id: '4',
    id: 4,
    name: 'Skin',
    image: 'https://images.unsplash.com/photo-1651740896477-467ea46b4fe5?w=400'
  },
  {
    _id: '5',
    id: 5,
    name: 'Hair',
    image: 'https://images.unsplash.com/photo-1642005801149-b33da87c1175?w=400'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1711201459951-50f07e176367?w=200',
    rating: 5,
    text: 'Amazing products! The Omega-3 supplements have really improved my overall health. Highly recommend this brand for quality wellness products.'
  },
  {
    id: 2,
    name: 'Emma Wilson',
    image: 'https://images.unsplash.com/photo-1545311630-51ea4a4c84de?w=200',
    rating: 5,
    text: 'I love the collagen powder! My skin has never looked better. The customer service is excellent and shipping is always fast.'
  },
  {
    id: 3,
    name: 'Michael Chen',
    image: 'https://images.unsplash.com/photo-1711201459951-50f07e176367?w=200',
    rating: 5,
    text: 'The whey protein is top-notch quality. Great taste, mixes well, and the results are fantastic. Will definitely order again!'
  },
  {
    id: 4,
    name: 'Jessica Brown',
    image: 'https://images.unsplash.com/photo-1545311630-51ea4a4c84de?w=200',
    rating: 4,
    text: 'Great selection of wellness products. The multivitamins are easy to take and I feel more energetic. Affordable prices too!'
  }
];

// Keep backwards-compatible named exports
export const products = fallbackProducts;
export const categories = fallbackCategories;
