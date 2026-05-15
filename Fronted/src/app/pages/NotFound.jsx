import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <main className="container mx-auto px-4 py-32 min-h-screen text-center">
      <h1 className="text-5xl font-extrabold text-foreground mb-4">404</h1>
      <p className="text-muted-foreground text-lg mb-8">
        Sorry, the page you're looking for doesn't exist.
      </p>
      <Link
        to="/shop"
        className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
      >
        Return to Shop
      </Link>
    </main>
  );
}

