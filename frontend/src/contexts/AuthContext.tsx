import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { config } from '../config/env';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for token in localStorage on app start
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }

    // Check for token in URL (from OAuth callback or mobile sharing)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const errorFromUrl = urlParams.get('error');

    if (tokenFromUrl) {
      localStorage.setItem('auth_token', tokenFromUrl);
      setToken(tokenFromUrl);
      fetchUser(tokenFromUrl);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      // Show success message
      toast.success('Successfully signed in!');
    } else if (errorFromUrl) {
      toast.error('Authentication failed. Please try again.');
      setIsLoading(false);
    }
  }, []);

  const getApiUrl = () => {
    return config.apiBaseUrl;
  };

  const fetchUser = async (authToken: string) => {
    try {
      const response = await fetch(`${getApiUrl()}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token is invalid
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    window.location.href = `${getApiUrl()}/auth/google`;
  };

  const logout = async () => {
    try {
      await fetch(`${getApiUrl()}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
