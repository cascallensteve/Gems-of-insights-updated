// Blog API Service
import { api } from './api';

const API_BASE_URL = 'https://gems-of-truth.vercel.app';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('authToken');
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication token not found. Please login.');
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Token': token,
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    if (response.status === 401) {
      // Token might be expired, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
      throw new Error('Authentication failed. Please login again.');
    }
    
    const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const blogService = {
  // Fetch all blogs (public endpoint - no auth required)
  getAllBlogs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/all-blogs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Raw API response:', data);
      
      // Handle different possible response structures
      let blogs = [];
      if (data.blogs && Array.isArray(data.blogs)) {
        blogs = data.blogs;
      } else if (Array.isArray(data)) {
        blogs = data;
      } else if (data.results && Array.isArray(data.results)) {
        blogs = data.results;
      }
      
      // Transform blog objects if they have nested structure
      return blogs.map(blogItem => {
        // If the blog data is nested in a 'blog' property, extract it
        if (blogItem.blog && typeof blogItem.blog === 'object') {
          return {
            ...blogItem.blog,
            id: blogItem.id || blogItem.blog.id,
            timestamp: blogItem.timestamp || blogItem.blog.timestamp,
            owner: blogItem.owner || blogItem.blog.owner,
            owner_username: blogItem.owner_username || blogItem.blog.owner_username
          };
        }
        return blogItem;
      });
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },

  // Get single blog details (public endpoint - no auth required)
  getBlogById: async (blogId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/blog-detail/${blogId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.blog;
    } catch (error) {
      console.error('Error fetching blog details:', error);
      throw error;
    }
  },

  // Get comments for a blog (public if available; falls back to [])
  getComments: async (blogId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blogs/blog-comments/${blogId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Normalize to array of comments
      return Array.isArray(data?.comments) ? data.comments : Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('Falling back to no comments due to error:', error);
      return [];
    }
  },

  // Add a comment to a blog (auth required)
  addComment: async (blogId, bodyText) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Authentication required. Please log in.');
      const res = await fetch(`${API_BASE_URL}/blogs/add-comment/${blogId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ body: bodyText })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      return res.json();
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Add new blog
  addBlog: async (blogData) => {
    try {
      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/blogs/add-blog`, {
        method: 'POST',
        body: JSON.stringify(blogData),
      });
      return data.blog;
    } catch (error) {
      console.error('Error adding blog:', error);
      throw error;
    }
  },

  // Edit existing blog
  editBlog: async (blogId, blogData) => {
    try {
      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/blogs/edit-blog/${blogId}/`, {
        method: 'POST',
        body: JSON.stringify(blogData),
      });
      return data.blog;
    } catch (error) {
      console.error('Error editing blog:', error);
      throw error;
    }
  },

  // Validate blog data before sending
  validateBlogData: (blogData) => {
    const required = ['title', 'description', 'body', 'read_time', 'tag_list'];
    const missing = required.filter(field => !blogData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    return true;
  },

  // Format blog data for API
  formatBlogData: (formData) => {
    return {
      title: formData.title?.trim() || '',
      description: formData.description?.trim() || '',
      body: formData.body?.trim() || '',
      read_time: formData.read_time?.trim() || '',
      tag_list: Array.isArray(formData.tags) 
        ? formData.tags.join(' ')
        : formData.tag_list?.trim() || '',
      photo: formData.photo?.trim() || ''
    };
  },

  // Parse tags from tag_list string
  parseTags: (tagList) => {
    if (!tagList) return [];
    return tagList.split(' ').filter(tag => tag.trim() !== '');
  },

  // Format timestamp for display
  formatTimestamp: (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Unknown date';
    }
  },

  // Get author display name
  getAuthorName: (author) => {
    if (!author) return 'Anonymous';
    return `${author.first_name || ''} ${author.last_name || ''}`.trim() || author.email || 'Anonymous';
  },

  // Check if user can edit blog (for future use)
  canEditBlog: (blog, currentUser) => {
    if (!currentUser) return false;
    if (!blog.author) return false;
    return blog.author.id === currentUser.id;
  },

  // Like a blog post
  likeBlog: async (blogId) => {
    try {
      // First try with axios (preferred method)
      const response = await api.post(`/blogs/like-blog/${blogId}/`);
      return response.data;
    } catch (error) {
      // If CORS error, try alternative authentication methods
      if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
        console.warn('CORS issue detected, trying alternative authentication methods...');
        const token = getAuthToken();
        
        if (!token) {
          throw new Error('Authentication required. Please login.');
        }
        
        try {
          // Method 1: Try Authorization Bearer header
          let response = await fetch(`${API_BASE_URL}/blogs/like-blog/${blogId}/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            return await response.json();
          }

          // Method 2: Try token as query parameter
          response = await fetch(`${API_BASE_URL}/blogs/like-blog/${blogId}/?token=${encodeURIComponent(token)}`, {
            method: 'POST',
          });

          if (response.ok) {
            return await response.json();
          }

          // Method 3: Try token in form body
          const formData = new FormData();
          formData.append('token', token);
          
          response = await fetch(`${API_BASE_URL}/blogs/like-blog/${blogId}/`, {
            method: 'POST',
            body: formData
          });

          if (response.ok) {
            return await response.json();
          }

          // If all methods fail, get the error message
          const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);

        } catch (fetchError) {
          console.error('All authentication methods failed:', fetchError);
          // Return optimistic success for UI, but log the real error
          return { message: 'Like updated locally (authentication issue)' };
        }
      }
      
      console.error('Error liking blog:', error);
      throw error.response?.data || error;
    }
  },

  // Get blog like status and count using the view-likes endpoint
  getBlogLikes: async (blogId) => {
    try {
      // Try the new view-likes endpoint first
      const response = await api.get(`/blogs/view-likes/${blogId}/`);
      const data = response.data;
      
      // Check if current user liked the blog
      const token = getAuthToken();
      let isLiked = false;
      
      if (token && data.likes) {
        // You'd need the current user ID to check this properly
        // For now, we'll assume false and let the like button handle the state
        isLiked = false;
      }
      
      return {
        likes: data.total_likes || 0,
        isLiked: isLiked,
        likesData: data.likes || []
      };
    } catch (error) {
      // Fallback to blog-detail endpoint
      console.warn('View-likes endpoint failed, trying blog-detail...', error);
      try {
        const response = await fetch(`${API_BASE_URL}/blogs/blog-detail/${blogId}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          return {
            likes: data.blog.likes || 0,
            isLiked: data.blog.isLiked || false
          };
        }
      } catch (fetchError) {
        console.warn('Fallback also failed:', fetchError);
      }
      
      // Return default values if both methods fail
      return { likes: 0, isLiked: false };
    }
  },

  // Get detailed likes information for a blog
  getBlogLikesDetails: async (blogId) => {
    try {
      const response = await api.get(`/blogs/view-likes/${blogId}/`);
      return response.data;
    } catch (error) {
      // Try with fetch if axios fails due to CORS
      if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
        try {
          const response = await fetch(`${API_BASE_URL}/blogs/view-likes/${blogId}/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return await response.json();
        } catch (fetchError) {
          console.error('Failed to fetch likes details:', fetchError);
          throw fetchError;
        }
      }
      
      console.error('Error fetching blog likes details:', error);
      throw error;
    }
  }
};

export default blogService;
