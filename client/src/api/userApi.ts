// src/api/userApi.ts
const API_URL = import.meta.env.VITE_API_URL ? 
  `${import.meta.env.VITE_API_URL}/api` : 
  '/api';

const getToken = () => {
  return localStorage.getItem('authToken')?.replace(/['"]+/g, '').trim();
};

// Search users
export const searchUsers = async (query: string) => {
  try {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(query)}`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to search users: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Search users response:', data);
    
    // Check different response formats
    if (data.success && data.users) {
      return data.users;
    } else if (data.users) {
      return data.users;
    } else if (Array.isArray(data)) {
      return data;
    }
    
    return [];
    
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// Get all users (for admin/search)
export const getAllUsers = async (page = 1, limit = 20) => {
  try {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/users?page=${page}&limit=${limit}`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch users: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Get all users response:', data);
    
    // Check different response formats
    if (data.success && data.users) {
      return data.users;
    } else if (data.users) {
      return data.users;
    } else if (Array.isArray(data)) {
      return data;
    }
    
    return [];
    
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId: string) => {
  try {
    const token = getToken();
    
    const response = await fetch(`${API_URL}/users/${userId}`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch user: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Get user by ID response:', data);
    
    // Check different response formats
    if (data.success && data.user) {
      return data.user;
    } else if (data.user) {
      return data.user;
    }
    
    return null;
    
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const response = await fetch(`${API_URL}/users/profile/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch current user: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Get current user response:', data);
    
    if (data.success && data.user) {
      return data.user;
    } else if (data.user) {
      return data.user;
    }
    
    return null;
    
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};