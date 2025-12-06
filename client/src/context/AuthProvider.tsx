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

  const apiUrl = import.meta.env.REACT_APP_API_URL || 'http://localhost:4343';

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  }, []);

  const login = useCallback((newToken: string, userData: User) => {
    console.log('AuthProvider: Login called with', { newToken, userData });
    
    // First, save the initial data
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setToken(newToken);
    console.log('AuthProvider: Authentication state updated');
    
    // Then, fetch fresh data from server to get latest photoURL
    const fetchFreshUserData = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/users/${userData.id}`, {
          headers: {
            'Authorization': `Bearer ${newToken}`,
          },
        });
        
        if (response.ok) {
          const freshData = await response.json();
          const freshUser = {
            ...userData,
            ...freshData.user,
            photoURL: freshData.user.photoURL 
              ? `${apiUrl}${freshData.user.photoURL}`
              : userData.photoURL
          };
          
          // Update localStorage with fresh data
          localStorage.setItem('userData', JSON.stringify(freshUser));
          setUser(freshUser);
          // console.log('✅ Login updated with fresh user data:', freshUser);
        }
      } catch (error) {
        console.error('Failed to fetch fresh user data:', error);
        // Keep using the provided data
      }
    };
    
    fetchFreshUserData();
  }, [apiUrl]);

  const updateUser = useCallback((updates: Partial<User>) => {
    console.log('🔄 updateUser called with:', updates);
    
    setUser(prevUser => {
      if (!prevUser) {
        console.log('⚠️ No previous user to update');
        return prevUser;
      }
      
      const updatedUser = { ...prevUser, ...updates };
      
      // Also update localStorage
      const storedUserData = localStorage.getItem('userData');
      console.log('📝 Current localStorage userData:', storedUserData);
      
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        console.log('📝 Parsed userData:', parsedUserData);
        
        const newUserData = { ...parsedUserData, ...updates };
        console.log('📝 New userData to save:', newUserData);
        
        localStorage.setItem('userData', JSON.stringify(newUserData));
        console.log('✅ Updated localStorage');
      }
      
      console.log('🔄 Returning updated user:', updatedUser);
      return updatedUser;
    });
  }, []);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');

        console.log('AuthProvider: Checking auth status', { storedToken, userData });

        if (storedToken && userData) {
          const parsedUser = JSON.parse(userData);
          
          // Fetch fresh user data from server to get latest photoURL
          try {
            const response = await fetch(`${apiUrl}/api/users/${parsedUser.id}`, {
              headers: {
                'Authorization': `Bearer ${storedToken}`,
              },
            });
            
            if (response.ok) {
              const freshData = await response.json();
              const freshUser = {
                ...parsedUser,
                ...freshData.user,
                photoURL: freshData.user.photoURL 
                  ? `${apiUrl}${freshData.user.photoURL}`
                  : parsedUser.photoURL
              };
              
              localStorage.setItem('userData', JSON.stringify(freshUser));
              setUser(freshUser);
              console.log('✅ App load: Using fresh user data:', freshUser);
            }
          } catch (fetchError) {
            console.error('Failed to fetch fresh user data, using stored:', fetchError);
            // Use stored data as fallback
            setUser(parsedUser);
          }
          
          setIsAuthenticated(true);
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
  }, [logout, apiUrl]);

  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};