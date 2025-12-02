import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType } from '../types/auth';
import { AuthContext } from './AuthContext';


interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  }, []);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');

        console.log('AuthProvider: Checking auth status', { storedToken, userData });

        if (storedToken && userData) {
          setIsAuthenticated(true);
          setUser(JSON.parse(userData));
          setToken(storedToken);
          console.log('AuthProvider: User is authenticated');
        } else {
          console.log('AuthProvider: No auth token found');
          logout(); // ensure clean state
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [logout]);

  const login = (newToken: string, userData: User) => {
    console.log('AuthProvider: Login called with', { newToken, userData });
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setToken(newToken);
    console.log('AuthProvider: Authentication state updated');
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
