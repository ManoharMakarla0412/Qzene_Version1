import { API_URL } from '@/lib/constants';
import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  profile?: { name?: string; avatarUrl?: string; bio?: string };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation(); // Get current route

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/check`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Auth check failed');
      const data = await response.json();

      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error('Login failed');

    const data = await response.json();
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    // Only run checkAuth for /admin/* routes
    if (location.pathname.startsWith('/admin')) {
      checkAuth();
    }
  }, [location.pathname]); // Re-run when path changes

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);