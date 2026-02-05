// src/hooks/useOAuthHandler.ts - STANDALONE VERSION
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Standalone OAuth handler that doesn't depend on useAuth
 * This solves the Render SPA redirect issue
 */
export const useOAuthHandler = (): void => {
  const navigate = useNavigate();
  const hasProcessed = useRef<string>('');

  useEffect(() => {
    // Get current URL
    const currentUrl = window.location.href;
    
    // Skip if already processed
    if (hasProcessed.current === currentUrl) {
      return;
    }

    // Extract OAuth parameters
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    console.log('🔍 useOAuthHandler checking:', {
      hasToken: !!token,
      hasUserParam: !!userParam,
      url: currentUrl
    });

    if (token && userParam) {
      console.log('🔄 useOAuthHandler processing OAuth callback');
      hasProcessed.current = currentUrl;
      
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        
        // Validate
        if (!userData.id || !userData.email) {
          throw new Error('Invalid user data');
        }
        
        // Save to localStorage (same as AuthProvider.login does)
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        console.log('✅ OAuth data saved to localStorage');
        
        // Clear URL parameters
        window.history.replaceState({}, '', window.location.pathname);
        
        // Force a page reload to trigger AuthProvider initialization
        // This is necessary because we can't call login() without useAuth
        window.location.href = '/home';
        
      } catch (error) {
        console.error('❌ OAuth processing error:', error);
        navigate('/login', { 
          replace: true, 
          state: { error: 'Login failed' } 
        });
      }
    }
  }, [navigate]);
};