import axios from 'axios';

let apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
apiBaseUrl = apiBaseUrl.trim().replace(/\/+$/, '');
if (!apiBaseUrl.endsWith('/api')) {
  apiBaseUrl += '/api';
}

const api = axios.create({
  baseURL: apiBaseUrl,
});


// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized - maybe token expired
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
