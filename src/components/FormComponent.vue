<template>
    <div class="form-container">
      <h2>Welcome to Document Management System</h2>
      <p>
      Your all-in-one platform to securely manage, organize, and access your documents
      anytime, anywhere. We strive to make document management effortless for you!
    </p>
    <p>
      Please fill out the form below to get started. This will allow us to personalize your experience
      and provide you with the best tools for managing your important files.
    </p>
  
      <form @submit.prevent="handleSubmit">
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
          <label for="phone">Phone:</label>
          <input
            type="tel"
            id="phone"
            v-model="formData.phone"
            required
            placeholder="Enter your phone number"
          />
        </div>
  
        <button type="submit">Submit</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FormComponent',
    data() {
      return {
        formData: {
          firstName: '',
          lastName: '',
          email: '',
          phone: ''
        }
      };
    },
    methods: {
      async handleSubmit() {
        // Simple form validation
        if (
          !this.formData.firstName ||
          !this.formData.lastName ||
          !this.formData.email ||
          !this.formData.phone
        ) {
          alert('All fields are required!');
          return;
        }
  
        try {
          // Send form data to the backend
          const response = await fetch('http://localhost:8080/storePIDetails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.formData),
            credentials: "include", 
          });
  
          if (!response.ok) {
            throw new Error('Failed to submit data');
          }
  
          // Navigate to the /uploads route after successful submission
          this.$router.push('/uploads');
        } catch (error) {
          console.error('Error:', error);
          alert('Something went wrong. Please try again.');
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
  </style>
  