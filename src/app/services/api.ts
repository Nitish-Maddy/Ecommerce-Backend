/** Dev: `/api/v1` + Vite proxy → this repo’s backend. Prod: set `VITE_API_URL` or defaults to localhost:5000. */
function resolveApiBase(): string {
  const explicit = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (explicit) {
    const b = explicit.replace(/\/$/, '');
    return b.endsWith('/api/v1') ? b : `${b}/api/v1`;
  }
  if (import.meta.env.DEV) {
    return '/api/v1';
  }
  return 'http://localhost:5000/api/v1';
}

const API_BASE = resolveApiBase();

function resolvePaymentBase(): string {
  const explicit = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (explicit) {
    const b = explicit.replace(/\/$/, '').replace(/\/api\/v1$/, '');
    return `${b}/api/payments`;
  }
  if (import.meta.env.DEV) {
    return '/api/payments';
  }
  return 'http://localhost:5000/api/payments';
}

const PAYMENT_BASE = resolvePaymentBase();

export { API_BASE, PAYMENT_BASE };

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

type RequestOptions = RequestInit & { skipAuth?: boolean };

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { skipAuth, ...fetchInit } = options;
  const token = skipAuth ? null : getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchInit.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchInit,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    const base = data.message || `Request failed with status ${res.status}`;
    const extra =
      data.details && String(data.details) !== String(data.message)
        ? ` — ${data.details}`
        : '';
    throw new Error(base + extra);
  }

  return data;
}

// ── Product API ──────────────────────────────────────────
export const productApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/products${query}`);
  },
  getById: (id: string) => request<any>(`/products/${id}`),
  getBySlug: (slug: string) => request<any>(`/products/slug/${slug}`),
  getBestSellers: (limit = 8) =>
    request<any>(`/products/bestsellers?limit=${limit}`),
  getNewlyLaunched: (limit = 8) =>
    request<any>(`/products/newlylaunched?limit=${limit}`),
  getMegaOffers: (limit = 8) =>
    request<any>(`/products/megaoffers?limit=${limit}`),
  getByCategory: (categoryId: string, params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any>(`/products/category/${categoryId}${query}`);
  },
  getRelated: (id: string, limit = 4) =>
    request<any>(`/products/${id}/related?limit=${limit}`),
  search: (q: string, limit = 10) =>
    request<any>(`/products/search?q=${encodeURIComponent(q)}&limit=${limit}`),
};

// ── Category API ─────────────────────────────────────────
export const categoryApi = {
  getAll: () => request<any>('/categories'),
  getActive: () => request<any>('/categories/active'),
  getById: (id: string) => request<any>(`/categories/${id}`),
  getBySlug: (slug: string) => request<any>(`/categories/slug/${slug}`),
};

// ── User / Auth API ──────────────────────────────────────
export const userApi = {
  login: (email: string, password: string) =>
    request<any>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: async (name: string, email: string, password: string) => {
    const init: RequestOptions = {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      skipAuth: true,
    };
    try {
      return await request<any>('/users', init);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (/route not found|not found|^404\b/i.test(msg)) {
        return await request<any>('/users/register', init);
      }
      throw err;
    }
  },
  getProfile: (id: string) => request<any>(`/users/${id}`),
  updateProfile: (id: string, data: { name?: string; email?: string; phone?: string }) =>
    request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  changePassword: (id: string, newPassword: string) =>
    request<any>(`/users/${id}/password`, {
      method: 'PATCH',
      body: JSON.stringify({ newPassword }),
    }),
  // Address management
  addAddress: (id: string, data: any) =>
    request<any>(`/users/${id}/addressess`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateAddress: (id: string, addressId: string, data: any) =>
    request<any>(`/users/${id}/addressess/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteAddress: (id: string, addressId: string) =>
    request<any>(`/users/${id}/addressess/${addressId}`, { method: 'DELETE' }),
};

// ── Cart API ─────────────────────────────────────────────
export const cartApi = {
  get: () => request<any>('/cart'),
  add: (productId: string, quantity = 1) =>
    request<any>('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),
  remove: (productId: string) =>
    request<any>(`/cart/remove/${productId}`, { method: 'DELETE' }),
  clear: () => request<any>('/cart/clear', { method: 'DELETE' }),
};

// ── Wishlist API ─────────────────────────────────────────
export const wishlistApi = {
  get: () => request<any>('/wishlist'),
  add: (productId: string) =>
    request<any>('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),
  remove: (productId: string) =>
    request<any>(`/wishlist/${productId}`, { method: 'DELETE' }),
  clear: () => request<any>('/wishlist', { method: 'DELETE' }),
};

// ── Order API ────────────────────────────────────────────
export const orderApi = {
  create: (orderData: any) =>
    request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),
  getAll: () => request<any>('/orders'),
  getMyOrders: () => request<any>('/orders/my-orders'),
  getById: (id: string) => request<any>(`/orders/${id}`),
  cancel: (id: string) =>
    request<any>(`/orders/${id}/cancel`, { method: 'PATCH' }),
};

// ── Review API ───────────────────────────────────────────
export const reviewApi = {
  getByProduct: (productId: string) =>
    request<any>(`/reviews/product/${productId}`),
  create: (data: { productId: string; rating: number; comment: string }) =>
    request<any>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<any>(`/reviews/${id}`, { method: 'DELETE' }),
};

// ── Payment API (Razorpay — lives under /api/payments, not /api/v1) ──
async function paymentRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${PAYMENT_BASE}${path}`, {
    ...options,
    headers,
  });
  const data = await res.json();

  if (!res.ok) {
    const base = data.message || `Request failed with status ${res.status}`;
    const extra =
      data.details && String(data.details) !== String(data.message)
        ? ` — ${data.details}`
        : '';
    throw new Error(base + extra);
  }

  return data;
}

export const paymentApi = {
  createOrder: (amount: number, currency = 'INR', receipt?: string) =>
    paymentRequest<any>('/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount, currency, receipt }),
    }),
  verify: (data: {
    paymentId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) =>
    paymentRequest<any>('/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ── Newsletter API ────────────────────────────────────────
export const newsletterApi = {
  subscribe: (email: string) =>
    request<any>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

