// src/pages/OAuthSuccess.tsx - UPDATED TO HANDLE RENDER REDIRECTS
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processOAuth = () => {
      console.log('OAuthSuccess: Starting OAuth processing');
      
      // IMPORTANT: Use window.location.search, NOT useLocation()
      // This works even after Render redirects to /index.html
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get("token");
      const userParam = searchParams.get("user");
      
      console.log('OAuthSuccess: URL parameters:', {
        hasToken: !!token,
        hasUserParam: !!userParam,
        currentPath: window.location.pathname,
        currentSearch: window.location.search
      });

      if (!token || !userParam) {
        console.log('OAuthSuccess: No OAuth parameters found');
        setStatus('error');
        setTimeout(() => {
          navigate("/login", { replace: true, state: { error: 'No OAuth data received' } });
        }, 1000);
        return;
      }

      try {
        console.log('OAuthSuccess: Parsing user data');
        const userData = JSON.parse(decodeURIComponent(userParam));
        
        if (!userData.id || !userData.email) {
          throw new Error('Invalid user data');
        }

        console.log('OAuthSuccess: Saving to localStorage');
        // Save to localStorage (this is what AuthProvider expects)
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        console.log('OAuthSuccess: Clearing URL parameters');
        // Clear the URL - IMPORTANT for SPAs
        window.history.replaceState({}, '', window.location.pathname);
        
        setStatus('success');
        console.log('OAuthSuccess: Redirecting to home');
        
        // Use setTimeout to ensure state updates before navigation
        setTimeout(() => {
          // Navigate to home - AuthProvider will pick up the token from localStorage
          navigate("/home", { replace: true });
        }, 500);
        
      } catch (error) {
        console.error('OAuthSuccess: Error:', error);
        setStatus('error');
        setTimeout(() => {
          navigate("/login", { 
            replace: true, 
            state: { error: 'OAuth login failed: ' + (error as Error).message } 
          });
        }, 1000);
      }
    };

    processOAuth();
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column'
    }}>
      {status === 'processing' && (
        <>
          <h2>Processing OAuth Login...</h2>
          <p>Please wait while we log you in.</p>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginTop: '20px'
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </>
      )}

      {status === 'success' && (
        <>
          <h2 style={{ color: 'green' }}>Login Successful!</h2>
          <p>Redirecting to home page...</p>
        </>
      )}

      {status === 'error' && (
        <>
          <h2 style={{ color: 'red' }}>Login Failed</h2>
          <p>Redirecting to login page...</p>
        </>
      )}
    </div>
  );
};

export default OAuthSuccess;