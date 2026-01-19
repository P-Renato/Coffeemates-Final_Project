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
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4343';
console.log('API_BASE_URL:', API_BASE_URL);
console.log('Environment:', import.meta.env.MODE);

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

    setStatus({ loading: true, error: null, success: false });

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
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

        if (user.role === 'admin') {
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

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Sidebar - Hidden on mobile, visible on medium+ */}
      <div className="hidden md:flex md:w-1/3 lg:w-1/4 bg-gray-50 flex-col items-center justify-center p-8 border-r border-gray-200">
        <div className="text-center mb-8">
          <h2 className={`${styles.courier} text-4xl lg:text-5xl text-gray-800 mb-4`}>Coffeemates</h2>
          <div className="flex justify-center mb-4">
            <FaUserCircle className="w-24 h-24 text-gray-400" />
          </div>
          <p className={`${styles.roboto} text-lg text-gray-600`}>Welcome!</p>
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Connect with fellow coffee lovers
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        className="flex-1 flex items-center justify-center p-4 md:p-8"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh'
        }}
      >
        <div className="w-full max-w-md lg:max-w-lg bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8">
          
          {/* Mobile Header - Only shown on small screens */}
          <div className="md:hidden text-center mb-6">
            <h1 className={`${styles.courier} text-3xl text-gray-800 mb-2`}>Coffeemates</h1>
            <p className={`${styles.courier} text-gray-600`}>Connect, sip, and share your brew.</p>
          </div>

          {/* Desktop Header - Only shown on medium+ screens */}
          <div className="hidden md:block text-center mb-8">
            <h1 className={`${styles.courier} text-4xl lg:text-5xl text-gray-800 mb-2`}>Coffeemates</h1>
            <p className={`${styles.courier} text-xl text-gray-600`}>Connect, sip, and share your brew.</p>
          </div>

          {/* Social Login Buttons */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button 
                type="button" 
                onClick={() => window.location.href = `${API_BASE_URL}/api/auth/google`} 
                className="flex-1 flex items-center justify-center gap-3 px-4 py-3 bg-white border border-blue-300 rounded-xl hover:bg-blue-50 transition-colors duration-200"
              >
                <FcGoogle size={20} />
                <span className="text-sm md:text-base font-medium">Google</span>
              </button>
              <button 
                type="button" 
                onClick={() => window.location.href = `${API_BASE_URL}/api/auth/facebook`} 
                className="flex-1 flex items-center justify-center gap-3 px-4 py-3 bg-white border border-blue-300 rounded-xl hover:bg-blue-50 transition-colors duration-200"
              >
                <FaFacebook size={20} color="#1877F2" />
                <span className="text-sm md:text-base font-medium">Facebook</span>
              </button>
            </div>
            
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">Or continue with email</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
          </div>

          {/* Form Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">Sign in to your account</h3>
            
            {/* Error Message */}
            {status.error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{status.error}</p>
              </div>
            )}

            {/* Loading Indicator */}
            {status.loading && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-600 text-sm text-center">Logging in...</p>
              </div>
            )}
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                id="login"
                name="login"
                type="text"
                required
                value={formData.login}
                onChange={handleChange}
                className="w-full px-4 py-3 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent placeholder-gray-500"
                placeholder="Email or Username"
                disabled={status.loading}
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent placeholder-gray-500"
                placeholder="Password"
                disabled={status.loading}
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={status.loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {status.loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <a 
              href="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Forgot your password?
            </a>
          </div>

          {/* Signup Link */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a 
                href="/signup" 
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Sign up here
              </a>
            </p>
          </div>

          {/* Mobile-only footer */}
          <div className="md:hidden text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              By signing in, you agree to our Terms and Privacy Policy
            </p>
          </div>
        </div>
      </div>

      {/* Responsive Design Notes (hidden in production) */}
      <div className="fixed bottom-4 right-4 hidden">
        <div className="text-xs text-gray-500 bg-white/80 p-2 rounded">
          <span className="sm:hidden">XS</span>
          <span className="hidden sm:inline md:hidden">SM</span>
          <span className="hidden md:inline lg:hidden">MD</span>
          <span className="hidden lg:inline xl:hidden">LG</span>
          <span className="hidden xl:inline 2xl:hidden">XL</span>
          <span className="hidden 2xl:inline">2XL</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;