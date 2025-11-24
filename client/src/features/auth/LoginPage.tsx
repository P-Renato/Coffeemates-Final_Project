import React, { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormData {
  login: string; 
  password: string;
}

interface Status {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialFormData: LoginFormData = {
  login: '',
  password: '',
};

// Change to actual backend URL when deployed or running locally
const API_BASE_URL = 'http://localhost:4343/api/auth/login';


const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>(initialFormData);
  const [status, setStatus] = useState<Status>({ loading: false, error: null, success: false });

 
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status.loading) return;

    setStatus({ loading: true, error: null, success: false  });

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed.');
      }
      
      const data = await response.json();
      console.log('Login Successful! ', data);
      
      const token = data.token || data.user?.token; 
      const user = data.user || data.userData;

      if(token && user) {
        login(token, user);
        setStatus({loading: false, error: null, success: true });

        window.location.href = '/home';
      } else {
        throw new Error('Invalid response from server: missing token or user data');
      }
    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : 'A network error occurred during login.';
      console.error('Login Error:', errorMessage);
      setStatus({ loading: false, error: errorMessage, success: false });
    } finally {
      setStatus(s => ({ ...s, loading: false }));
    }
  };


  const containerStyle = {
    maxWidth: '500px',
    margin: '100px auto',
    padding: '30px',
    border: '1px solid #ddd',
    textAlign: 'center' as const,
    fontFamily: 'sans-serif',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    boxSizing: 'border-box' as const,
    border: '1px solid #ccc',
    textAlign: 'left' as const,
    borderRadius: '4px',
  };

  const buttonStyle = {
    padding: '12px 15px',
    backgroundColor: status.loading ? '#95a5a6' : '#4a69bd',
    color: 'white',
    border: 'none',
    cursor: status.loading ? 'not-allowed' : 'pointer',
    width: '100%',
    marginTop: '20px',
    borderRadius: '4px',
    fontWeight: 'bold' as const,
  };


  return (
    <div style={containerStyle}>
      <h1>Coffeemates</h1>
      <p style={{ margin: '10px 0 30px 0', color: '#555' }}>Connect, sip, and share your brew.</p>
      
      <h3 style={{ marginTop: '30px', fontSize: '1.5rem', fontWeight: 'normal' }}>Sign-in</h3>

      <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <button 
          type="button" 
          onClick={() => window.location.href = "http://localhost:4343/auth/google"} 
          style={{...buttonStyle, backgroundColor: '#fff', color: '#333', border: '1px solid #ccc'}}
        >
          Login with Google
        </button>
        <button 
          type="button" 
          onClick={() => window.location.href = "http://localhost:4343/auth/facebook"} 
          style={{...buttonStyle, backgroundColor: '#fff', color: '#333', border: '1px solid #ccc'}}
        >
          Login with Facebook
        </button>
      </div>


    

      {status.error && <p style={{ color: '#c0392b', padding: '10px', backgroundColor: '#fbeaea', border: '1px solid #c0392b', borderRadius: '4px' }}>Error: {status.error}</p>}
      {status.loading && <p style={{ color: '#2980b9' }}>Logging in...</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '30px' }}>

        
        <input
          id="login"
          name="login"
          type="text" 
          required
          value={formData.login}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Email or Username"
        />

        
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Password"
        />

        <button type="submit" disabled={status.loading} style={buttonStyle}>
          Login
        </button>
      </form>

      <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
        Don't have an account? <a href="/signup" style={{ color: '#4a69bd', textDecoration: 'none' }}>Signup Here</a>
      </p>
    </div>
  );
};

export default LoginPage;