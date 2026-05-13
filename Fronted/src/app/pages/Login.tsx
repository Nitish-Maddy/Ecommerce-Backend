import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


function deriveSignUp(pathname: string, queryMode: string | null): boolean {
  if (queryMode === 'signup') return true;
  if (queryMode === 'login') return false;
  return pathname === '/signup';
}

export function Login() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/';
  const isSignUp = useMemo(() => {
    const mode = new URLSearchParams(location.search).get('mode');
    return deriveSignUp(location.pathname, mode);
  }, [location.pathname, location.search]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, signup, isAuthenticated, user, logout } = useAuth();

  const searchSuffix = location.search || '';



  const goToSignup = () => {
    setError('');
    navigate(`/signup${searchSuffix}`);
  };

  const goToLogin = () => {
    setError('');
    navigate(`/login${searchSuffix}`);
  };

  // If already logged in, show profile
  if (isAuthenticated && user) {
    return (
      <main className="container mx-auto px-4 py-32 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-border text-center">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground mb-2">{user.email}</p>
          <p className="text-xs text-muted-foreground mb-8">Role: {user.role}</p>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full bg-red-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all active:scale-[0.98]"
          >
            Sign Out
          </button>
          <Link
            to="/"
            className="block mt-4 text-primary font-medium hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
      navigate(redirectTo);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-32 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-border">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp ? 'Join TBS Veda today' : 'Sign in to your TBS Veda account'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}



        <form className="space-y-6" onSubmit={handleSubmit}>
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 bg-secondary/30 border border-border rounded-xl outline-none focus:border-primary transition-colors"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 bg-secondary/30 border border-border rounded-xl outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-foreground">Password</label>
              {!isSignUp && (
                <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full p-3 pr-12 bg-secondary/30 border border-border rounded-xl outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-black/5 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => (isSignUp ? goToLogin() : goToSignup())}
            className="text-primary font-medium hover:underline"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
          {!isSignUp && (
            <div className="mt-2">
              <button
                type="button"
                onClick={goToSignup}
                className="text-primary font-medium hover:underline"
              >
                Create a new account →
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
