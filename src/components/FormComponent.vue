<template>
  <section class="flex flex-col justify-center bg-[#FFD700] h-screen transition-opacity duration-300">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
      <!-- Left Column - Text and Description -->
      <div class="flex flex-col justify-start text-[#002B5B] p-6 md:pl-16">
        <!-- Archivio Title -->
        <h2 class="font-logo text-[6rem] md:text-[8rem] font-damion mb-4 leading-tight">
          Archi<span class="text-white">vio</span>
        </h2>
        
        <ul class="flex items-baseline space-y-4 text-[2rem] md:text-[3rem] list-none pl-0">
          <li class="text-[#E0B800] flex justify-center items-center">#simplicity</li>
          <li class="text-[#E0B800] flex justify-center items-center">#lightweight</li>
          <li class="text-[#E0B800] flex justify-center items-center">#secured</li>
        </ul>
        <li class="text-[#E0B800] flex justify-center items-center text-[2rem] md:text-[3rem]">#minimalistic</li>

        <!-- Description with adjusted text size and dim blue color -->
        <p class="text-lg text-white mb-8">
          Your all-in-one platform to securely manage, organize, and access your documents anytime, anywhere.
          We strive to make document management effortless for you!
        </p>
        
        <!-- Hashtags as a list without dots, in dim yellow color -->
       
      </div>

      <!-- Right Column - Login Form -->
      <div class="flex items-center justify-center">
        <div class="form-container bg-white shadow-lg rounded-lg p-8 w-full sm:w-4/5 md:w-1/1 z-10">
          <form @submit.prevent="handleSubmit">
            <div v-if="isSignup">
              <div class="form-group mb-4">
                <input
                  type="text"
                  id="firstName"
                  v-model="formData.firstName"
                  required
                  placeholder="Enter your first name"
                  class="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div class="form-group mb-4">
                <input
                  type="text"
                  id="lastName"
                  v-model="formData.lastName"
                  required
                  placeholder="Enter your last name"
                  class="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div class="form-group mb-4">
              <input
                type="email"
                id="email"
                v-model="formData.email"
                required
                placeholder="Enter your email"
                class="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div class="form-group mb-4">
              <input
                type="password"
                id="password"
                v-model="formData.password"
                required
                placeholder="Enter your password"
                class="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <!-- Show additional fields for signup -->
            <p v-if="errorMessage" class="error-message text-red-500 text-sm mb-4">{{ errorMessage }}</p>

            <button
              type="submit"
              class="bg-[#002B5B] text-white w-full mb-4 mt-4 p-3 rounded-md hover:bg-[#1a3a7d]"
            >
              {{ isSignup ? 'Sign Up' : 'Login' }}
            </button>

            <p class="text-[#002B5B] text-center">
              {{ isSignup ? 'Already have an account?' : "Don't have an account?" }}
              <span class="cursor-pointer font-semibold" @click="toggleMode">{{ isSignup ? 'Login' : 'Sign up' }}</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import api from '../utils/api';
import { useUserStore } from '../utils/store';

export default {
  name: 'AuthComponent',
  data() {
    return {
      isSignup: false, // Toggle between login and signup modes
      formData: {
        email: '',
        password: '',
        firstName: '', // Only used in signup
        lastName: '' // Only used in signup
      },
      errorMessage: ''
    };
  },
  methods: {
    toggleMode() {
      this.isSignup = !this.isSignup;
      // Clear extra fields when switching modes
      if (!this.isSignup) {
        this.formData.firstName = '';
        this.formData.lastName = '';
      }
    },
    async handleSubmit() {
      const payload = { ...this.formData, isSignup: this.isSignup };

      try {
        const response = await api.post('/storePIDetails', payload);

        if (response.data.success) {
          const userStore = useUserStore();
          userStore.setEmail(this.formData.email);

          if (this.isSignup) {
            alert('Signup successful! Please log in.');
            this.toggleMode(); // Switch to login mode
          } else {
            const filesExist = response.data.fileExists;

            if (filesExist) {
              const uploadedFilesResponse = await api.get(`/getUploadedFiles/${this.formData.email}`);
              userStore.setUploadedFiles(uploadedFilesResponse.data);
            }

            this.$router.push('/filelist');
          }
        } else {
          // alert(response.data.message || 'Something went wrong. Please try again.');
          this.displayErrorMessage(response.data.message || 'Something went wrong. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        // alert(error.response?.data?.message || 'Something went wrong. Please try again.');
        this.displayErrorMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
      }
    },
    displayErrorMessage(message) {
      this.errorMessage = message;
      // Clear the error message after 10 seconds
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
    }
  }
};
</script>
<!-- 
  <style scoped>
  .form-container {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  button {
    /* background-color: #007bff; */
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  /* button:hover {
    background-color: #0056b3;
  } */
  toggle-text {
  color: blue;
  cursor: pointer;
  margin-top: 10px;
}
.toggle-text span {
  text-decoration: underline;
}
.error-message {
  color: red;
  margin-top: 10px;
}
  </style>
   -->