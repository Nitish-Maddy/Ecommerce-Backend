import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

export function CategoryList() {
  const { categories } = useShop();

  return (
    <main className="container mx-auto px-4 pt-36 pb-12">
      <h1 className="text-4xl font-bold text-center text-primary mb-12">Shop by Category</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <Link
            key={category._id || category.id}
            to={`/category/${(category.slug || category.name).toLowerCase()}`}
            className="group block"
          >
            <div className="relative aspect-square rounded-full overflow-hidden mb-4 bg-secondary">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
            </div>
            <h3 className="text-center text-lg font-medium text-foreground group-hover:text-primary transition-colors">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </main>
  );
}
