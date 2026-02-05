// pages/OAuthSuccess.tsx - Updated for new hook architecture
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';

/**
 * OAuthSuccess Page - Shows loading state while OAuth is being processed
 * The actual OAuth processing happens in useOAuthHandler hook
 */
const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [message, setMessage] = useState('Processing your login...');

  useEffect(() => {
    // Check if OAuth was already processed by the hook
    if (isAuthenticated) {
      setMessage('Login successful! Redirecting to home...');
      const timer = setTimeout(() => {
        navigate('/home', { replace: true });
      }, 1500);
      return () => clearTimeout(timer);
    }
    
    // If not authenticated and not loading, check for OAuth params manually
    if (!isLoading) {
      const searchParams = new URLSearchParams(window.location.search);
      const hasToken = searchParams.has('token');
      const hasUser = searchParams.has('user');
      
      if (hasToken && hasUser) {
        setMessage('OAuth parameters detected. Processing login...');
        // The hook should pick this up, but if not, redirect after delay
        const timer = setTimeout(() => {
          navigate('/login', { 
            replace: true, 
            state: { error: 'OAuth processing took too long' } 
          });
        }, 5000);
        return () => clearTimeout(timer);
      } else {
        setMessage('No OAuth parameters found. Redirecting to login...');
        const timer = setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [navigate, isAuthenticated, isLoading]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h2>{message}</h2>
      <div style={{ marginTop: '20px' }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default OAuthSuccess;