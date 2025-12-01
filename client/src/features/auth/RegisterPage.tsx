import React, { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/cafe_login-signup-page.png";
import styles from './styles.module.css';
import '../../styles/_global.css';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";


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
    border: '1px solid #ccc',
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

        <div className={styles.formWrapper}>  
          <h3 >Create Account</h3>
        </div>
        
          <div style={{ display: 'flex',  justifyContent: 'space-around', width: '80%', gap: '10px', margin: '1.1em auto' }}>
              <button type="button" onClick={() => window.location.href = "http://localhost:4343/api/auth/google"} style={{...buttonStyle,  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '18px' , backgroundColor: '#fff',  fontWeight: 'lighter', fontSize: '12', color: '#333', border: '1px solid var(--color-primary)'}}>Sign up with Google <FcGoogle size={24} /></button>
              <button type="button" onClick={() => window.location.href = "http://localhost:4343/api/auth/facebook"} style={{...buttonStyle,  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '18px' , backgroundColor: '#fff',  fontWeight: 'lighter', fontSize: '12', color: '#333', border: '1px solid var(--color-primary)'}}>Sign up with Facebook <FaFacebook size={24} color="#1877F2" /></button>
          </div>

          <div style={{ margin: '20px 0', color: '#888' }}>— OR —</div>

          
          {status.error && <p style={{ color: '#c0392b', padding: '10px', backgroundColor: '#fbeaea', border: '1px solid #c0392b', borderRadius: '4px' }}>Error: {status.error}</p>}
          {status.success && <p style={{ color: '#27ae60', padding: '10px', backgroundColor: '#eafbf0', border: '1px solid #27ae60', borderRadius: '4px' }}>Success! Please log in.</p>}
          {status.loading && <p style={{ color: '#2980b9' }}>Creating account...</p>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', width: '100%', alignItems: 'center', flexDirection: 'column', gap: '5px' }}>

            
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

            <button type="submit" disabled={status.loading} style={{...buttonStyle, background: `var(--color-primary)`, width: '60%', fontFamily: 'var(--font-body)', fontSize: '16' }} className='rounded-2xl'>
              Create Account
            </button>
          </form>

          <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>
            Already have an account? <a href="/login" style={{ color: '#4a69bd', textDecoration: 'none' }}>Login</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;