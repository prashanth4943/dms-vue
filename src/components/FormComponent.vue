<template>
  <div class="form-container">
    <h2 class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center gap-x-4">
      Welcome to Document Management System
    </h2>
    <p>
      Your all-in-one platform to securely manage, organize, and access your documents
      anytime, anywhere. We strive to make document management effortless for you!
    </p>

    <form @submit.prevent="handleSubmit">
      <div v-if="isSignup">
        <div class="form-group">
          <label for="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            v-model="formData.firstName"
            required
            placeholder="Enter your first name"
          />
        </div>

        <div class="form-group">
          <label for="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            v-model="formData.lastName"
            required
            placeholder="Enter your last name"
          />
        </div>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          required
          placeholder="Enter your email"
        />
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input
          type="password"
          id="password"
          v-model="formData.password"
          required
          placeholder="Enter your password"
        />
      </div>

      <!-- Show additional fields for signup -->
     

      <button type="submit">{{ isSignup ? 'Sign Up' : 'Login' }}</button>

      <p class="toggle-mode">
        {{ isSignup ? 'Already have an account?' : "Don't have an account?" }}
        <span @click="toggleMode">{{ isSignup ? 'Login' : 'Sign up' }}</span>
      </p>
    </form>
  </div>
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
      }
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
          alert(response.data.message || 'Something went wrong. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert(error.response?.data?.message || 'Something went wrong. Please try again.');
      }
    }
  }
};
</script>

  <style>
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
    background-color: #007bff;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  toggle-text {
  color: blue;
  cursor: pointer;
  margin-top: 10px;
}
.toggle-text span {
  text-decoration: underline;
}
  </style>
  