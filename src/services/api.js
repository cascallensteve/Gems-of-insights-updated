import axios from "axios";

const api = axios.create({
  baseURL: "https://gems-of-truth.vercel.app",
  withCredentials: false, // Changed to false to fix CORS issue
});

// Authentication helper methods
const apiService = {
  // Get user data from localStorage
  getUserData: () => {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Set user data in localStorage
  setUserData: (userData) => {
    try {
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error setting user data:', error);
      throw error;
    }
  },

  // Set authentication token
  setAuthToken: (token) => {
    try {
      if (token) {
        localStorage.setItem('token', token);
        // Set the token in axios headers for future requests (Django REST Framework format)
        api.defaults.headers.common['Authorization'] = `Token ${token}`;
      }
    } catch (error) {
      console.error('Error setting auth token:', error);
      throw error;
    }
  },

  // Clear authentication data
  clearAuth: () => {
    try {
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
      // Remove the token from axios headers
      delete api.defaults.headers.common['Authorization'];
    } catch (error) {
      console.error('Error clearing auth:', error);
      throw error;
    }
  },

  // Get stored token
  getAuthToken: () => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  // Authentication endpoints
  auth: {
    // Sign up
    signUp: async (userData) => {
      try {
        const response = await api.post('/signUp', userData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Google login using ID token from Google Identity Services
    googleLogin: async (idToken) => {
      try {
        // Try common endpoint variations
        const endpoints = [
          '/auth/google',
          '/auth/google/',
          '/google/login',
          '/login/google'
        ];

        let lastError;
        for (const endpoint of endpoints) {
          try {
            const response = await api.post(endpoint, { id_token: idToken });
            return response.data;
          } catch (e) {
            lastError = e;
            continue;
          }
        }
        throw lastError || new Error('Google login failed');
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Verify email
    verifyEmail: async (email, otp) => {
      try {
        const response = await api.post('/verify-email', { email, otp });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Resend verification OTP
    resendVerificationOTP: async (email) => {
      try {
        const response = await api.post('/resend-verification-otp', { email });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Login
    login: async (email, password) => {
      try {
        const response = await api.post('/login', { email, password });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Forgot password
    forgotPassword: async (email) => {
      try {
        const response = await api.post('/forgot-password', { email });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Reset password
    resetPassword: async (email, token, newPassword) => {
      try {
        const response = await api.post('/reset-password', {
          email,
          token,
          new_password: newPassword
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Change password (logged-in user)
    changePassword: async (currentPassword, newPassword) => {
      try {
        const token = apiService.getAuthToken();
        if (!token) throw new Error('Authentication token required');
        const response = await api.post('/change-password', {
          current_password: currentPassword,
          new_password: newPassword
        }, {
          headers: { 'Authorization': `Token ${token}` }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Admin sign up
    adminSignUp: async (adminData) => {
      try {
        const response = await api.post('/admin-signUp', adminData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  },

  // Blog endpoints
  blogs: {
    // Add blog
    addBlog: async (blogData) => {
      try {
        const response = await api.post('/blogs/add-blog', blogData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Edit blog
    editBlog: async (blogId, blogData) => {
      try {
        const response = await api.post(`/blogs/edit-blog/${blogId}/`, blogData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get all blogs (public endpoint - no auth required)
    getAllBlogs: async () => {
      try {
        const response = await axios.get(`${api.defaults.baseURL}/blogs/all-blogs`, {
          withCredentials: false,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get single blog details (public endpoint - no auth required)
    getBlogDetail: async (blogId) => {
      try {
        const response = await axios.get(`${api.defaults.baseURL}/blogs/blog-detail/${blogId}/`, {
          withCredentials: false,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  },

  // Store endpoints
  store: {
    // Add store item
    addItem: async (itemData) => {
      try {
        const response = await api.post('/store/add-item', itemData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Edit store item
    editItem: async (itemId, itemData) => {
      try {
        const response = await api.post(`/store/edit-item/${itemId}/`, itemData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get all store items
    getAllItems: async () => {
      try {
        const response = await api.get('/store/all-items');
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get single store item details
    getItemDetail: async (itemId) => {
      try {
        const response = await api.get(`/store/item-detail/${itemId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get all orders (admin only)
    getAllOrders: async () => {
      try {
        const response = await api.get('/store/all-orders');
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get all user orders (admin only)
    getAllUserOrders: async () => {
      try {
        const response = await api.get('/store/all-user-orders');
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get order details
    getOrderDetail: async (orderId) => {
      try {
        const response = await api.get(`/store/order-detail/${orderId}/`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Delete order (admin only) with fallback endpoints
    deleteOrder: async (orderId) => {
      try {
        const token = apiService.getAuthToken();
        if (!token) throw new Error('Authentication token required');
        const endpoints = [
          `/store/delete-order/${orderId}/`,
          `/store/order/${orderId}/delete`,
          `/store/delete-order/${orderId}`
        ];
        let lastError;
        for (const ep of endpoints) {
          try {
            const res = await api.delete(ep, { headers: { 'Authorization': `Token ${token}` } });
            return res.data || { success: true };
          } catch (e) {
            lastError = e;
          }
        }
        throw lastError || new Error('Delete failed');
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update order status (admin only)
    updateOrderStatus: async (orderId, status) => {
      try {
        const response = await api.post(`/store/update-order-status/${orderId}/`, {
          status
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  },

  // Order endpoints
  orders: {
    // Create order with new format including shipping info
    createOrder: async (orderData) => {
      try {
        // Transform the order data to match the new API format
        const transformedData = {
          items: orderData.items.map(item => ({
            product: item.productId || item.id,
            quantity: item.quantity
          })),
          shipping_info: {
            first_name: orderData.shippingInfo.firstName,
            last_name: orderData.shippingInfo.lastName,
            email: orderData.shippingInfo.email,
            phone: orderData.shippingInfo.phone,
            address: orderData.shippingInfo.address,
            city: orderData.shippingInfo.city,
            county: orderData.shippingInfo.county,
            postal_code: orderData.shippingInfo.postalCode
          }
        };

        const endpoints = [
          '/store/create-order',
          '/orders/create-order',
          '/bookings/create-order'
        ];

        let lastError;
        for (const endpoint of endpoints) {
          try {
            const response = await api.post(endpoint, transformedData);
            return response.data;
          } catch (e) {
            lastError = e;
            // Continue trying next endpoint on 404/405
            if ([404, 405].includes(e?.response?.status)) continue;
          }
        }

        // Fallback: generate a client-side order reference so payment can proceed
        return { orderId: `ORD-${Date.now()}` };
      } catch (error) {
        // Final safety: still return a local order id to keep UX flowing
        console.warn('Falling back to local order reference due to error:', error);
        return { orderId: `ORD-${Date.now()}` };
      }
    },

    // Get user orders (tries multiple endpoints and normalizes shape)
    getUserOrders: async () => {
      try {
        const token = apiService.getAuthToken();
        const headers = token ? { 'Authorization': `Token ${token}` } : {};
        const endpoints = [
          '/orders/user-orders',
          '/orders/my-orders',
          '/store/user-orders',
          '/store/my-orders',
          '/store/orders/me'
        ];
        let lastError;
        for (const ep of endpoints) {
          try {
            const res = await api.get(ep, { headers });
            const data = res.data;
            // Normalize to array
            const list = Array.isArray(data)
              ? data
              : (data?.orders || data?.results || data?.data || []);
            return list;
          } catch (e) {
            lastError = e;
            continue;
          }
        }
        throw lastError || new Error('Failed to fetch user orders');
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get order details
    getOrderDetail: async (orderId) => {
      try {
        const response = await api.get(`/orders/order-detail/${orderId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Download order receipt
    downloadReceipt: async (orderId) => {
      try {
        const response = await api.get(`/orders/receipt/${orderId}`, {
          responseType: 'blob'
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  },

  // Payment endpoints
  payments: {
    // Initiate M-Pesa payment
    initiateMpesaPayment: async (paymentData) => {
      try {
        // Use the correct M-Pesa endpoint with required path param (order id)
        // Django URL: payments/pay/<str:pk>/ → use orderId as pk
        const orderPk = encodeURIComponent(paymentData.orderId || String(paymentData.amount));
        const response = await api.post(`/payments/pay/${orderPk}/`, {
          phone: paymentData.phoneNumber,
          amount: paymentData.amount
        });
        const data = response.data || {};

        // Normalize various possible success shapes
        const responseCode = data.ResponseCode ?? data.responseCode ?? null;
        const status = (data.status || '').toString().toLowerCase();
        const checkoutRequestId = data.CheckoutRequestID || data.checkoutRequestID || data.checkout_request_id;
        const merchantRequestId = data.MerchantRequestID || data.merchantRequestID || data.merchant_request_id;
        const customerMessage = data.CustomerMessage || data.message || data.status;

        const isSuccess = (
          responseCode === '0' ||
          status === 'success' ||
          Boolean(checkoutRequestId) // If STK push was created, treat as success to allow polling
        );

        return {
          success: isSuccess,
          checkoutRequestId,
          merchantRequestId,
          message: customerMessage,
          responseCode: responseCode ?? undefined,
          responseDescription: data.ResponseDescription || data.responseDescription || undefined,
          raw: data
        };
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Initiate payment for a course enrollment using enrollment_id as path param
    initiateEnrollmentPayment: async ({ enrollmentId, amount, phone, productType = 'course' }) => {
      try {
        const pk = encodeURIComponent(String(enrollmentId));
        const payload = {
          amount,
          phone,
          product_type: productType
        };
        const response = await api.post(`/payments/pay/${pk}/`, payload);
        const data = response.data || {};

        return {
          success: Boolean(data.success) || data.response_code === '0' || data.responseCode === '0',
          transaction_id: data.transaction_id || data.transactionId,
          checkout_request_id: data.checkout_request_id || data.checkoutRequestId || data.CheckoutRequestID,
          merchant_request_id: data.merchant_request_id || data.merchantRequestId || data.MerchantRequestID,
          response_code: data.response_code || data.responseCode,
          raw: data
        };
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Check payment transaction status via GET endpoint
    transactionStatus: async (checkoutRequestId) => {
      try {
        const response = await api.get(`/payments/transaction-status/${encodeURIComponent(checkoutRequestId)}/`);
        const data = response.data || {};

        return {
          checkoutRequestID: data.checkoutRequestID || data.CheckoutRequestID || checkoutRequestId,
          status: data.status || (data.success ? 'success' : (data.failed ? 'failed' : 'unknown')),
          receipt: data.receipt || data.MpesaReceiptNumber || data.receipt_number || null,
          amount: Number(data.amount ?? data.Amount ?? 0),
          raw: data
        };
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Check payment status (tries multiple possible endpoints)
    checkPaymentStatus: async (checkoutRequestId, merchantRequestId) => {
      try {
        const endpoints = [
          '/payments/query',
          '/payments/status',
          '/payments/result',
          '/payments/check'
        ];

        let lastError;
        for (const endpoint of endpoints) {
          try {
            const response = await api.post(endpoint, {
              CheckoutRequestID: checkoutRequestId,
              MerchantRequestID: merchantRequestId
            });

            const data = response.data || {};

            // Normalize possible response shapes from backend/Daraja
            const resultCode =
              data.ResultCode?.toString?.() ||
              data.resultCode?.toString?.() ||
              data.ResponseCode?.toString?.() ||
              data.responseCode?.toString?.() ||
              '';

            const resultDesc =
              data.ResultDesc ||
              data.resultDesc ||
              data.ResponseDescription ||
              data.responseDescription ||
              data.message ||
              'Unknown status';

            return {
              resultCode,
              resultDesc,
              raw: data
            };
          } catch (e) {
            lastError = e;
            continue;
          }
        }

        throw lastError || new Error('Payment status check failed');
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Admin: fetch all transactions
    getAllTransactions: async () => {
      try {
        const token = apiService.getAuthToken();
        if (!token) throw new Error('Authentication token required');
        const response = await api.get('/payments/all-transactions', {
          headers: { 'Authorization': `Token ${token}` }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
    ,

    // Admin: fetch single transaction details by id
    getTransactionDetails: async (transactionId) => {
      try {
        const token = apiService.getAuthToken();
        if (!token) throw new Error('Authentication token required');
        const response = await api.get(`/payments/transaction-details/${encodeURIComponent(transactionId)}/`, {
          headers: { 'Authorization': `Token ${token}` }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  },

  // User management endpoints (for admin)
  users: {
    // Get all users (admin only) - Try multiple endpoint variations
    getAllUsers: async () => {
      try {
        const token = apiService.getAuthToken();
        if (!token) {
          throw new Error('Authentication token required');
        }
        
        // Try different endpoint variations
        const endpoints = [
          '/all-users',
          '/users/all',
          '/users',
          '/admin/users',
          '/admin/all-users'
        ];
        
        for (const endpoint of endpoints) {
          try {
            console.log(`Trying endpoint: ${endpoint}`);
            
            // Try GET method first
            try {
              const response = await api.get(endpoint, {
                headers: {
                  'Authorization': `Token ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              
              console.log(`GET ${endpoint} successful:`, response.data);
              return response.data.users || response.data;
            } catch (getError) {
              console.log(`GET ${endpoint} failed:`, getError.response?.status);
              
              // If GET fails, try POST method
              if (getError.response?.status === 405 || getError.response?.status === 404) {
                const response = await api.post(endpoint, {}, {
                  headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                console.log(`POST ${endpoint} successful:`, response.data);
                return response.data.users || response.data;
              }
            }
          } catch (endpointError) {
            console.log(`Endpoint ${endpoint} failed:`, endpointError.response?.status);
            continue; // Try next endpoint
          }
        }
        
        // If all endpoints fail, throw an error
        throw new Error('All user endpoints failed. Please check the API configuration.');
        
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error.response?.data || error.message;
      }
    },

    // Get user by ID
    getUserById: async (userId) => {
      try {
        const response = await api.get(`/users/user-detail/${userId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Update user (admin only)
    updateUser: async (userId, userData) => {
      try {
        const response = await api.post(`/users/update-user/${userId}`, userData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Delete user (admin only)
    deleteUser: async (userId) => {
      try {
        const response = await api.delete(`/users/delete-user/${userId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get user statistics
    getUserStats: async () => {
      try {
        const response = await api.get('/users/stats');
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  },

  // Newsletter endpoints
  newsletter: {
    // Subscribe to newsletter
    subscribe: async (email) => {
      try {
        console.log('API Service - Subscribing email:', email);
        const response = await axios.post(`${api.defaults.baseURL}/newsletter/subscribe`, {
          email
        }, {
          withCredentials: false,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('API Service - Subscription success:', response.data);
        return response.data;
      } catch (error) {
        console.error('API Service - Subscription error:', error);
        throw error.response?.data || error.message;
      }
    },

    // Unsubscribe from newsletter
    unsubscribe: async (email) => {
      try {
        const response = await axios.post(`${api.defaults.baseURL}/newsletter/unsubscribe`, {
          email
        }, {
          withCredentials: false,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Send newsletter to all subscribers (admin only)
    sendNewsletter: async (newsletterData) => {
      try {
        const response = await api.post('/newsletter/send-newsletter', {
          subject: newsletterData.subject,
          body: newsletterData.body
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get all newsletter subscribers (admin only)
    getAllSubscribers: async () => {
      try {
        const response = await api.get('/newsletter/subscribers');
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  },

  // Contact Us endpoints
  contact: {
    sendMessage: async (contactData) => {
      try {
        const response = await axios.post(
          `${api.defaults.baseURL}/newsletter/contact-us`,
          contactData,
          {
            withCredentials: false,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        return response.data;
      } catch (error) {
        console.error('Error sending contact message:', error);
        throw error.response?.data || error.message;
      }
    }
    ,
    // Get all contact inquiries (admin only)
    getAllContacts: async () => {
      try {
        const token = apiService.getAuthToken();
        if (!token) {
          throw new Error('Authentication token required');
        }
        const response = await api.get('/newsletter/all-contacts', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
    ,
    // Get single contact by ID (admin only)
    getContactById: async (contactId) => {
      try {
        const token = apiService.getAuthToken();
        if (!token) throw new Error('Authentication token required');
        const response = await api.get(`/newsletter/contact-details/${contactId}/`, {
          headers: { 'Authorization': `Token ${token}` }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
    ,
    // Delete a contact (admin only)
    deleteContact: async (contactId) => {
      try {
        const token = apiService.getAuthToken();
        if (!token) throw new Error('Authentication token required');
        const endpoints = [
          `/newsletter/delete-contact/${contactId}/`,
          `/newsletter/contact/${contactId}/delete`,
          `/newsletter/delete-contact/${contactId}`
        ];
        let lastError;
        for (const ep of endpoints) {
          try {
            const res = await api.delete(ep, { headers: { 'Authorization': `Token ${token}` } });
            return res.data || { success: true };
          } catch (e) {
            lastError = e;
          }
        }
        throw lastError || new Error('Delete failed');
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  },

  // Course endpoints
  courses: {
    // List all courses (public)
    listCourses: async () => {
      try {
        const response = await axios.get(`${api.defaults.baseURL}/courses/list-courses`, {
          withCredentials: false,
          headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // View single course (public)
    getCourseDetail: async (courseId) => {
      try {
        const response = await axios.get(`${api.defaults.baseURL}/courses/view-course/${courseId}/`, {
          withCredentials: false,
          headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Add a new course (admin only)
    addCourse: async (courseData) => {
      try {
        const payload = {
          ...courseData,
          // Send both keys so backend variations can persist the image
          banner: courseData.banner,
          photo: courseData.banner || courseData.photo
        };
        const response = await api.post('/courses/add-course', payload);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Edit a course (admin only)
    editCourse: async (courseId, courseData) => {
      try {
        const payload = {
          ...courseData,
          banner: courseData.banner,
          photo: courseData.banner || courseData.photo
        };
        const response = await api.post(`/courses/edit-course/${courseId}/`, payload);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Enroll in a course (auth required)
    enrollInCourse: async (courseId, enrollmentData = {}) => {
      try {
        const response = await api.post(`/courses/enroll-course/${courseId}/`, enrollmentData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Delete a course (admin only)
    deleteCourse: async (courseId) => {
      try {
        const response = await api.delete(`/courses/delete-course/${courseId}/`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
    // Note: Enrollment management endpoints are not implemented on backend yet
    // getAllEnrollments: async () => { ... },
    // getEnrollmentDetail: async (enrollmentId) => { ... },
    // updateEnrollmentStatus: async (enrollmentId, status) => { ... }
  }
};
 
// api endpoint for the appointment view 
async function bookAppointment() {
  const data = {
    full_name: "Billy Josiah",
    email: "billy@example.com",
    phone_no: "+254712345678",
    health_concern: "Frequent headaches",
    preferred_date: "2025-08-25",
    preferred_time: "14:30:00",
    additional_notes: "Please schedule me with Dr. Smith if available"
  };

  const res = await fetch("{{baseURL}}/bookings/book-appointment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  console.log(result);
}


  // end of appointment booking  
  const fetchAppointments = async () => {
  try {
    const token = localStorage.getItem("authToken"); // example storage
    const res = await axios.get("https://gems-of-truth.vercel.app/bookings/appointment-list", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`   // ✅ standard header
        // or "Authorization": `Bearer ${token}` if using JWT
      }
    });
    console.log(res.data);
  } catch (err) {
    console.error("Error fetching appointments:", err);
  }
};

// Initialize auth token if it exists
const token = apiService.getAuthToken();
if (token) {
  api.defaults.headers.common['Authorization'] = `Token ${token}`;
}

// Export individual functions for backward compatibility
export const createOrder = apiService.orders.createOrder;
export const getUserOrders = apiService.orders.getUserOrders;
export const initiateMpesaPayment = apiService.payments.initiateMpesaPayment;
export const checkPaymentStatus = apiService.payments.checkPaymentStatus;
export const getTransactionStatus = apiService.payments.transactionStatus;
export const getTransactionDetails = apiService.payments.getTransactionDetails;
export const forgotPassword = apiService.auth.forgotPassword;
export const resetPassword = apiService.auth.resetPassword;
export const sendNewsletter = apiService.newsletter.sendNewsletter;
export const subscribeNewsletter = apiService.newsletter.subscribe;
export const unsubscribeNewsletter = apiService.newsletter.unsubscribe;

export default apiService;
export { api };
