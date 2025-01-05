// src/composables/useLogout.js
import { ref } from 'vue';
// import axios from 'axios';
import api from '../utils/api'; // Import the Axios instance or api helper
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
// import { useUserStore } from '@/stores/user';
import { useUserStore } from '../utils/store';

export function useLogout() {
  const userStore = useUserStore();
  const router = useRouter();
  const errorMessage = ref('');

  const logoutUser = async () => {
    try {
      const response = await api.post('/logout');

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Logged out successfully',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          userStore.reset();
          router.push('/');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Logout Failed',
          text: response.data.message || 'Something went wrong.'
        });
      }
    } catch (error) {
      console.error('Error logging out:', error);
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: 'An error occurred. Please try again later.'
      });
    }
  };

  return {
    logoutUser,
    errorMessage
  };
}
