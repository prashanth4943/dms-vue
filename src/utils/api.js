import axios from 'axios';
import Swal from 'sweetalert2';
import router from '../routes/index'; // Import your Vue Router instance

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8081/', // Replace with your backend base URL
  timeout: 5000, // Optional timeout
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
      // Fire a Swal for session expiration
      Swal.fire({
        icon: 'warning',
        title: 'Session Expired',
        text: 'Your session has expired. Redirecting to login...',
        timer: 3000, // Automatically close after 3 seconds
        showConfirmButton: false, // Disable OK button
        timerProgressBar: true, // Show a progress bar during the timer
      }).then(() => {
        // Redirect to the login or root route after the Swal closes
        router.push('/');
      });

      // You can also immediately push to '/' to ensure redirection, without waiting for Swal to close:
      // setTimeout(() => router.push('/'), 3000);
    }
    // Forward other errors
    return Promise.reject(error);
  }
);

export default api;
