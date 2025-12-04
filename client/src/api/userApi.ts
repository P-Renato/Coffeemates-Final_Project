// src/api/userApi.ts
import axios from 'axios';

const API_URL = 'http://localhost:4343/api';

const getToken = () => {
  return localStorage.getItem('authToken')?.replace(/['"]+/g, '').trim();
};

// Search users
export const searchUsers = async (query: string) => {
  try {
    const token = getToken();
    
    const response = await axios.get(`${API_URL}/users/search`, {
      params: { q: query },
      headers: token ? {
        Authorization: `Bearer ${token}`
      } : {}
    });
    
    return response.data.users || [];
    
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// Get all users (for admin/search)
export const getAllUsers = async () => {
  try {
    const token = getToken();
    
    const response = await axios.get(`${API_URL}/users`, {
      headers: token ? {
        Authorization: `Bearer ${token}`
      } : {}
    });
    
    return response.data.users || [];
    
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};