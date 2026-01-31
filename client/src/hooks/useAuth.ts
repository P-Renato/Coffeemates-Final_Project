import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { AuthContextType } from '../types/auth';

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

   // Add debugging
  useEffect(() => {
    if (context) {
      console.log('🔍 useAuth hook context:', {
        hasToken: !!context.token,
        tokenPreview: context.token ? `${context.token.substring(0, 20)}...` : 'none',
        hasUser: !!context.user,
        userId: context.user?.id,
        isLoading: context.isLoading
      });
      
      // Also check localStorage directly
      console.log('🔍 useAuth localStorage:', {
        authToken: localStorage.getItem('authToken'),
        tokenKey: localStorage.getItem('token'),
        userData: localStorage.getItem('userData')
      });
    }
  }, [context]);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};