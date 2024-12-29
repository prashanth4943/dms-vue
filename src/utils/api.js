import axios from 'axios';
import router from '../routes/index'; // Import your Vue Router instance

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8081', // Replace with your backend base URL
//   timeout: 5000, // Optional timeout
  withCredentials: true,
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // If the response is valid, return it as-is
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle session invalidation (e.g., redirect to login page)
      alert('Your session has expired. Please log in again.');
      router.push('/'); // Redirect to login or root route
    }
    // Forward other errors
    return Promise.reject(error);
  }
);

export default api;
