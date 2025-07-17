'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { TIMING, AUTH_CONFIG } from '@/constants';

interface User {
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.JWT_TOKEN);
    const userData = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.USER_DATA);
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch {
        clearStorageData();
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const clearStorageData = () => {
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.JWT_TOKEN);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.USER_DATA);
  };

  const login = () => {
    sessionStorage.setItem(
      AUTH_CONFIG.STORAGE_KEYS.REDIRECT_AFTER_AUTH, 
      AUTH_CONFIG.ROUTES.DEFAULT_REDIRECT
    );
    
    window.location.href = `${AUTH_CONFIG.API_URL}${AUTH_CONFIG.ENDPOINTS.GOOGLE_AUTH}`;
  };

  const logout = () => {
    clearStorageData();
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
    
    const interval = setInterval(checkAuth, TIMING.AUTH_CHECK_INTERVAL);
    
    return () => clearInterval(interval);
  }, [checkAuth]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 