import React, { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from "react-router-dom";


interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

interface Status {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialFormData: RegisterFormData = {
  username: '',
  email: '',
  password: '',
};

// change to actual backend URL when deployed or running locally
const API_BASE_URL = 'http://localhost:4343/api/auth/register';


const RegisterPage: React.FC = () => {
  // TODO: Use useNavigate() from react-router-dom to redirect to /login
  const navigate = useNavigate(); 
  
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [status, setStatus] = useState<Status>({ loading: false, error: null, success: false });

 
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status.loading) return;

    setStatus({ loading: true, error: null, success: false });

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
       
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed due to server error.');
      }
      
      const result = await response.json();
      setStatus({ loading: false, error: null, success: true });
      setFormData(initialFormData);
      console.log('Registration Successful: ', result);
      
      setTimeout(() => {
        navigate('/login');;
      }, 2000);

    } catch (err) {
     
      const errorMessage = (err instanceof Error) ? err.message : 'A network error occurred.';
      console.error('Registration Error:', errorMessage);
      setStatus({ loading: false, error: errorMessage, success: false });
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

  const socialButtonStyle = {
    padding: '10px 15px',
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #ccc',
    cursor: 'pointer',
    flex: 1,
    borderRadius: '4px',
  };


  return (
    <div style={containerStyle}>
      <h1>Coffeemates</h1>
      <p style={{ margin: '10px 0 30px 0', color: '#555' }}>Connect, sip, and share your brew.</p>
      
      <h3 style={{ marginTop: '30px', fontSize: '1.5rem', fontWeight: 'normal' }}>Create Account</h3>

     
      <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
          <button type="button" onClick={() => window.location.href = "http://localhost:4343/auth/google"} style={socialButtonStyle}>Sign up with Google</button>
          <button type="button" onClick={() => window.location.href = "http://localhost:4343/auth/facebook"} style={socialButtonStyle}>Sign up with Facebook</button>
      </div>

      <div style={{ margin: '20px 0', color: '#888' }}>— OR —</div>

      
      {status.error && <p style={{ color: '#c0392b', padding: '10px', backgroundColor: '#fbeaea', border: '1px solid #c0392b', borderRadius: '4px' }}>Error: {status.error}</p>}
      {status.success && <p style={{ color: '#27ae60', padding: '10px', backgroundColor: '#eafbf0', border: '1px solid #27ae60', borderRadius: '4px' }}>Success! Please log in.</p>}
      {status.loading && <p style={{ color: '#2980b9' }}>Creating account...</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>

        
        <input
          id="username"
          name="username"
          type="text"
          required
          value={formData.username}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Username"
        />

        
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Email"
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
          Create Account
        </button>
      </form>

      <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
        Already have an account? <a href="/login" style={{ color: '#4a69bd', textDecoration: 'none' }}>Login</a>
      </p>
    </div>
  );
};

export default RegisterPage;