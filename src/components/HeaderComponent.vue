<template>
    <header class="header">
      <div class="container flex justify-between items-center">
        <h1 class="text-primary text-lg font-bold">Archivio</h1>
        <button
          @click="handleLogout"
          class="logout-btn px-4 py-2 border border-primary text-primary bg-white rounded-large hover:bg-primary hover:text-white transition"
        >
          Logout
        </button>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    methods: {
      handleLogout() {
        // Logout functionality
        console.log("Logout clicked");
      },
    },
  };
  </script>
  
  <style scoped>
  .header {
    border-bottom: 1px solid #0F456E; /* Thin bottom border */
    padding: 1rem;
    background-color: #ffffff;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  </style>
  