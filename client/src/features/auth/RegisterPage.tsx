import React, { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/cafe_login-signup-page.png";
import styles from './styles.module.css';
import '../../styles/_global.css';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4343';


const RegisterPage: React.FC = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
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

    setStatus({ loading: true, error: null, success: false });

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
        navigate('/login');
      }, 2000);

    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : 'A network error occurred.';
      console.error('Registration Error:', errorMessage);
      setStatus({ loading: false, error: errorMessage, success: false });
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Sidebar - Hidden on mobile, visible on medium+ */}
      <div className="hidden md:flex md:w-1/3 lg:w-1/4 bg-gradient-to-b from-blue-50 to-gray-50 flex-col items-center justify-center p-8 border-r border-gray-200">
        <div className="text-center mb-8">
          <h2 className={`${styles.courier} text-4xl lg:text-5xl text-gray-800 mb-6`}>Coffeemates</h2>
          <div className="flex justify-center mb-6">
            <FaUserCircle className="w-32 h-32 text-blue-400" />
          </div>
          <p className={`${styles.roboto} text-xl text-gray-700 mb-2`}>Join Our Community</p>
          <p className="text-gray-500 text-sm max-w-xs">
            Connect with coffee enthusiasts worldwide. Share recipes, discover beans, and brew together.
          </p>
        </div>
        
        <div className="mt-8 w-full max-w-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">☕</span>
              </div>
              <span className="text-sm text-gray-700">Share coffee experiences</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">🌱</span>
              </div>
              <span className="text-sm text-gray-700">Discover new beans</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">👥</span>
              </div>
              <span className="text-sm text-gray-700">Connect with brewers</span>
            </div>
          </div>
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
        <div className="w-full max-w-md lg:max-w-xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 lg:p-10">
          
          {/* Mobile Header - Only shown on small screens */}
          <div className="md:hidden text-center mb-8">
            <h1 className={`${styles.courier} text-3xl text-gray-800 mb-2`}>Coffeemates</h1>
            <p className={`${styles.courier} text-gray-600 mb-6`}>Connect, sip, and share your brew.</p>
            <div className="flex justify-center mb-6">
              <FaUserCircle className="w-20 h-20 text-blue-400" />
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block text-center mb-8">
            <h1 className={`${styles.courier} text-4xl lg:text-5xl text-gray-800 mb-2`}>Join Coffeemates</h1>
            <p className="text-gray-600">Create your account and start your coffee journey</p>
          </div>

          {/* Status Messages */}
          {status.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm text-center">{status.error}</p>
            </div>
          )}

          {status.success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-green-600 text-sm text-center">
                ✅ Account created successfully! Redirecting to login...
              </p>
            </div>
          )}

          {status.loading && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-blue-600 text-sm text-center flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Creating your account...
              </p>
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <button 
                type="button" 
                onClick={() => window.location.href = "/api/auth/google"} 
                className="flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
              >
                <FcGoogle size={20} />
                <span className="text-sm md:text-base font-medium">Google</span>
              </button>
              <button 
                type="button" 
                onClick={() => window.location.href = "/api/auth/facebook"} 
                className="flex items-center justify-center gap-3 px-4 py-3.5 bg-white border border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
              >
                <FaFacebook size={20} color="#1877F2" />
                <span className="text-sm md:text-base font-medium">Facebook</span>
              </button>
            </div>
            
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">Or register with email</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all placeholder-gray-500"
                placeholder="Choose a username"
                disabled={status.loading || status.success}
              />
            </div>

            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all placeholder-gray-500"
                placeholder="Your email address"
                disabled={status.loading || status.success}
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all placeholder-gray-500"
                placeholder="Create a password"
                disabled={status.loading || status.success}
              />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={status.loading || status.success}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {status.loading ? 'Creating Account...' : status.success ? 'Account Created!' : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Terms and Privacy */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-800">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
            </p>
          </div>

          {/* Login Link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>

          {/* Mobile Features - Only on small screens */}
          <div className="md:hidden mt-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl mb-1">☕</div>
                <p className="text-xs text-gray-600">Share</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl mb-1">🌱</div>
                <p className="text-xs text-gray-600">Discover</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl mb-1">👥</div>
                <p className="text-xs text-gray-600">Connect</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator for debugging (hidden in production) */}
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

export default RegisterPage;