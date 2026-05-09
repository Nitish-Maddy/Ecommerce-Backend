import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userApi } from '../services/api';

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  setSession: (authToken: string, authUser: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = (await userApi.login(email, password)) as {
      data?: { user: AuthUser; token: string };
      user?: AuthUser;
      token?: string;
      message?: string;
    };
    const userData = response.data?.user ?? response.user;
    const authToken = response.data?.token ?? response.token;
    if (!userData || !authToken) {
      throw new Error(response.message || 'Invalid login response from server');
    }
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  };

  const signup = async (name: string, email: string, password: string) => {
    const response = (await userApi.register(name, email, password)) as {
      data?: { user: AuthUser; token: string };
      message?: string;
    };
    const userData = response.data?.user;
    const authToken = response.data?.token;
    if (userData && authToken) {
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('auth_token', authToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      return;
    }
    await login(email, password);
  };

  const setSession = useCallback((authToken: string, authUser: AuthUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('auth_user', JSON.stringify(authUser));
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        signup,
        setSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
