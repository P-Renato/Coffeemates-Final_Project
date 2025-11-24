import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const hasHandledOAuth = useRef(false);

  useEffect(() => {
    // Prevent double execution
    if (hasHandledOAuth.current) {
      return;
    }
    hasHandledOAuth.current = true;

    const handleOAuthSuccess = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        const userId = urlParams.get("userId");
        const userParam = urlParams.get("user");

        console.log('OAuthSuccess - URL parameters:', {
          token: token ? 'Present' : 'Missing',
          userId: userId ? 'Present' : 'Missing',
          user: userParam ? 'Present' : 'Missing',
          fullUrl: window.location.href
        });

        if (!token) {
          throw new Error('No token received from OAuth provider');
        }

        let userData;

        if (userParam) {
          // Format 1: User data is provided in URL
          userData = JSON.parse(decodeURIComponent(userParam));
        } else if (userId) {
          // Format 2: Only userId is provided - we need to fetch user data WITH AUTH
          console.log('Fetching user data for userId:', userId);
          
          try {
            // ✅ USE THE TOKEN FOR AUTHORIZATION
            const response = await fetch(`/api/users/${userId}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            console.log('Fetch response status:', response.status, response.statusText);
            
            if (response.ok) {
              const data = await response.json();
              userData = data.user;
              console.log('Fetched user data:', userData);
            } else {
              const errorText = await response.text();
              console.error('Fetch failed with status:', response.status, 'Response:', errorText);
              throw new Error(`Failed to fetch user data: ${response.status}`);
            }
          } catch (fetchError) {
            console.error('Fetch error:', fetchError);
            throw new Error(`Network error while fetching user data: ${(fetchError as Error).message}`);
          }
        } else {
          throw new Error('No user data or userId received from OAuth provider');
        }

        if (!userData.id || !userData.email) {
          throw new Error('Invalid user data received');
        }

        // Call the login function from auth context
        await login(token, userData);
        
        setStatus('success');
        console.log('OAuthSuccess - Login successful, redirecting to home');
        
        // Clear URL parameters to prevent re-triggering
        window.history.replaceState({}, '', window.location.pathname);
        
        // Navigate immediately
        navigate("/", { replace: true });

      } catch (error) {
        console.error('OAuthSuccess - Error:', error);
        setStatus('error');
        
        navigate("/login", { replace: true, state: { error: 'OAuth login failed' } });
      }
    };

    handleOAuthSuccess();
  }, [navigate, login]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column'
    }}>
      {status === 'loading' && (
        <>
          <h2>Completing Login...</h2>
          <p>Please wait while we log you in.</p>
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