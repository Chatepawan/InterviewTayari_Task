import axios from 'axios';

// Sets the Base URL from Environment Variables
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Added Authorization Token to Requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Consider using sessionStorage for better security
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle Responses & Errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.warn('Unauthorized: Token expired or invalid.');
        localStorage.removeItem('token');
        window.location.replace('/login'); 
      } else {
        console.error(`API Error [${status}]:`, error.response.data?.message || error.message);
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
