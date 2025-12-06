import React, { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import bgImage from "../../assets/cafe_login-signup-page.png";
import styles from './styles.module.css';
import '../../styles/_global.css';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";


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
  const navigate = useNavigate();

 
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

      // console.log('Login Successful! ', data);
      // console.log('User object received:', user);
      // console.log('User role:', user.role);

      if(token && user) {
        login(token, user);
        setStatus({loading: false, error: null, success: true });

        console.log('Checking role for redirect...', user.role); // Debug

        if (user.email === "example@admin.com") {
          console.log('Redirecting to admin page');
        navigate('/admin');  
      } else {
        console.log('Redirecting to home page - user is not admin');
        navigate('/home');  
      }
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

  const bgContainerStyle = {
    backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      height: "100vh",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
  }

  const containerStyle = {
    maxWidth: '80%',
    width: '80%',
    height: '80%',
    margin: '100px auto',
    padding: '30px',
    border: '1px solid #ddd',
    textAlign: 'center' as const,
    backgroundColor: 'rgba(255, 255, 255, 0.9)'
  };

  const inputStyle = {
    width: '60%',
    padding: '10px',
    margin: '10px 0',
    boxSizing: 'border-box' as const,
    borderBottom: '1px solid #ccc',
    textAlign: 'left' as const,
    borderRadius: '4px',
  };

  const buttonStyle = {
    padding: '.8em auto',
    backgroundColor: status.loading ? '#95a5a6' : '#4a69bd',
    color: 'white',
    border: 'none',
    cursor: status.loading ? 'not-allowed' : 'pointer',
    width: '20em',
    margin: '1.2em',
    borderRadius: '8px',
    height: '4.5em'
  };


  return (
    <section className='flex'>
      <div className={styles.sidebar}>
        <h2 className={styles.courier}  style={{fontSize: 40}}>Coffeemates</h2>

        <div className={styles.avatar}>
          <FaUserCircle className={styles.avatarIcon} />
        </div>

        <p className={styles.roboto} style={{ fontSize: 16}}>Welcome!</p>
      </div>

      <div style={bgContainerStyle}>
        <div style={containerStyle}>
          <h1 className={styles.courier} style={{fontSize: 40}}>Coffeemates</h1>
          <p className={styles.courier} style={{ fontSize: 24}}>Connect, sip, and share your brew.</p>
          

          <div style={{ display: 'flex', justifyContent: 'space-around', width: '80%', gap: '10px', margin: '1.1em auto' }}>
            <button 
              type="button" 
              onClick={() => window.location.href = "http://localhost:4343/api/auth/google"} 
              style={{...buttonStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '18px' , backgroundColor: '#fff',  fontWeight: 'lighter', fontSize: '12', color: '#333', border: '1px solid var(--color-primary)'}}
              className={styles.roboto}
            >
              <p>
                Login with Google
              </p>
              <FcGoogle size={24} />
            </button>
            <button 
              type="button" 
              onClick={() => window.location.href = "http://localhost:4343/api/auth/facebook"} 
              style={{...buttonStyle, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '18px' , backgroundColor: '#fff',  fontWeight: 'lighter', fontSize: '12', color: '#333', border: '1px solid var(--color-primary)'}}
              className={styles.roboto}
            >
              <p>
                Login with Facebook
              </p>
              <FaFacebook size={24} color="#1877F2" />
            </button>
          </div>
          <div className={styles.formWrapper}>
                
            <h3>Sign-in</h3>

          </div>


        

          {status.error && <p style={{ color: '#c0392b', padding: '10px', backgroundColor: '#fbeaea', border: '1px solid #c0392b', borderRadius: '4px' }}>Error: {status.error}</p>}
          {status.loading && <p style={{ color: '#2980b9' }}>Logging in...</p>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', width: '100%', alignItems: 'center', flexDirection: 'column', gap: '5px', marginTop: '30px' }}>

            
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

            <button type="submit" disabled={status.loading} style={{...buttonStyle, background: `var(--color-primary)`, width: '60%', fontFamily: 'var(--font-body)', fontSize: '16' }} className='rounded-2xl'>
              Login
            </button>
          </form>

          <p style={{ marginTop: '20px', fontWeight: 'bold' }}>
            Don't have an account? <a href="/signup" style={{ color: '#4a69bd', textDecoration: 'none' }}>Signup Here</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;