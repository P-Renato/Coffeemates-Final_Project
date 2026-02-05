// src/hooks/useOAuthHandler.ts
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

/**
 * Custom hook specifically for handling OAuth callback parameters
 * This solves the Render SPA redirect issue where /oauth-success -> /index.html
 * 
 * Usage: Simply call useOAuthHandler() in your App.tsx component
 */
export const useOAuthHandler = (): void => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  const hasProcessed = useRef<string>(''); // Track processed URLs to prevent double handling

  useEffect(() => {
    // Don't process if auth is still loading or already authenticated
    if (isLoading || isAuthenticated) {
      return;
    }

    // Get the current URL with search params
    const currentUrl = window.location.href;
    
    // Skip if we've already processed this URL
    if (hasProcessed.current === currentUrl) {
      return;
    }

    // Extract token and user from URL parameters
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    // Debug logging
    console.log('🔍 useOAuthHandler checking:', {
      hasToken: !!token,
      hasUserParam: !!userParam,
      windowPath: window.location.pathname,
      windowSearch: window.location.search,
      reactPath: location.pathname,
      reactSearch: location.search,
      currentUrl
    });

    // Process OAuth callback if we have both token and user
    if (token && userParam) {
      console.log('🔄 useOAuthHandler processing OAuth callback');
      
      try {
        // Mark this URL as processed
        hasProcessed.current = currentUrl;
        
        // Decode and parse user data
        const userData = JSON.parse(decodeURIComponent(userParam));
        
        // Validate required fields
        if (!userData.id || !userData.email) {
          throw new Error('Invalid user data received from OAuth provider');
        }
        
        // Call the login function from existing useAuth hook
        login(token, userData);
        
        // Clear URL parameters to prevent re-processing on refresh
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
        
        console.log('✅ OAuth successful via useOAuthHandler, redirecting to home');
        
        // Navigate to home page
        navigate('/home', { replace: true });
        
      } catch (error) {
        console.error('❌ useOAuthHandler error:', error);
        
        // Clear the processed flag on error
        hasProcessed.current = '';
        
        // Redirect to login with error message
        navigate('/login', { 
          replace: true, 
          state: { 
            error: 'OAuth login failed',
            message: (error as Error).message 
          } 
        });
      }
    }
    
    // If we're on /oauth-success path but no params, redirect to login
    else if (window.location.pathname.includes('oauth-success')) {
      console.log('ℹ️ On /oauth-success but no OAuth params found');
      navigate('/login', { replace: true });
    }
    
  }, [location, login, navigate, isAuthenticated, isLoading]);
};