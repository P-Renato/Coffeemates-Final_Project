// src/api/adminApi.ts
import axios from 'axios';
import { handleError } from '../utils/errorHandlers';

// Your backend URL - from your logs
const API_URL = '';

// Helper to get token
const getToken = () => {
  const possibleKeys = [
    'authToken',     // Your actual key
    'token',         // Common alternative
    'coffeematesToken', // From your logout code
    'accessToken',   // Another common name
    'jwtToken'       // Another common name
  ];
  
  for (const key of possibleKeys) {
    const token = localStorage.getItem(key);
    if (token) {
      console.log(`✅ Found token in ${key}`);
      return token;
    }
  }
  
  console.warn('No token found in localStorage');
  console.log('Available keys:', Object.keys(localStorage));
  return null;
};

// Get all users - CORRECT ENDPOINT
export const getAllUsers = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Note: Using /api/auth (not /api/users)
    const response = await axios.get(`${API_URL}/api/auth`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Fetched users:', response.data);
      if (Array.isArray(response.data)) {
      // If response.data is already an array
      return response.data;
    } else if (response.data && Array.isArray(response.data.users)) {
      // If response.data has a users property
      return response.data.users;
    } else {
      console.warn('Unexpected response structure:', response.data);
      return [];
    }
  } catch (error) {
    handleError('getAllUsers', error)
    throw error;
  }
};

export const updateUserStatus = async (userId: string, updates: { status?: string; isActive?: boolean }) => {
  try {
    const token = getToken();
    if (!token) throw new Error('No authentication token found');

   
    const response = await axios.patch(
      `${API_URL}/api/auth/${userId}/status`,
      updates,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('User status updated:', response.data);
    return response.data;
  } catch (error) {
    handleError('updateUserStatus', error)
    throw error;
  }
};

export const banUser = async (userId: string) => {
  return updateUserStatus(userId, { status: 'banned', isActive: false });
};

export const activateUser = async (userId: string) => {
  return updateUserStatus(userId, { status: 'active', isActive: true });
};

export const deleteUserById = async (userId: string) => {
  console.log('🗑️ deleteUserById called for:', userId);
  
  try {
    const token = localStorage.getItem('authToken')?.replace(/['"]+/g, '').trim();
    
    const response = await fetch(`/api/auth/${userId}`, {
      method: 'DELETE',
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    });
    
    console.log('🗑️ Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Delete failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('🗑️ Success response:', data);
    
    return data;
    
  } catch (error) {
    handleError('deleteUserById', error);
    throw error;
  }
};