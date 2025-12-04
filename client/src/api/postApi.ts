// client/src/api/postApi.ts
const API_URL = 'http://localhost:4343/api';

const getToken = () => {
  return localStorage.getItem('authToken')?.replace(/['"]+/g, '').trim();
};

// Get all posts
export const getAllPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/post`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Posts API response:', data);
    
    // Return posts array based on your API response structure
    return data.posts || data.data || [];
    
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// Create a new post
export const createPost = async (formData: FormData) => {
  try {
    const token = getToken();
    console.log('Creating post with token:', token ? 'Found' : 'Missing');
    
    const response = await fetch(`${API_URL}/post`, {
      method: 'POST',
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {},
      body: formData
    });
    
    console.log('Post response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Post creation failed: ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Post API error:', error);
    throw error;
  }
};

// Like a post
export const likePost = async (postId: string) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    // Get current user ID
    const userData = localStorage.getItem('userData');
    const user = userData ? JSON.parse(userData) : null;
    const userId = user?._id || user?.id;
    
    if (!userId) {
      throw new Error('User ID not found');
    }

    console.log('Liking post:', postId, 'User:', userId);
    
    const response = await fetch(`${API_URL}/post/like/${postId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uid: userId }) 
    });
    
    console.log('Like response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Like failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Like response data:', data);
    
    return data;
    
  } catch (error) {
    console.error('Like API error:', error);
    throw error;
  }
};

// Get posts by user ID
export const getPostsByUserId = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/post/user/${userId}`);
    
    console.log('Fetching posts for user:', userId);
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user posts: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`User ${userId} posts response:`, data);
    
    return data.posts || [];
    
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

// Update a post
export const updatePost = async (postId: string, formData: FormData) => {
  try {
    const token = getToken(); 
    const response = await fetch(`${API_URL}/post/${postId}`, {
      method: 'PATCH',
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {},
      body: formData
    });

    console.log('Edit post response:', response.status);

    if (!response.ok) {
      throw new Error(`Post edit failed: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error('Edit post API error:', error);
    throw error;
  }
};
