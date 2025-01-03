<template>
    <header class="header">
     <div class="flex justify-between items-center p-4 bg-primary text-neutralLight">
      <h1 class="text-xl font-bold">Archivio</h1>
      <button @click="handleLogout" class="logout-btn px-4 py-2 border border-primary rounded-large text-primary bg-white hover:bg-accent hover:text-white transition">
        Logout
      </button>
    </div>
    </header>
  </template>
  <script>
  import { useLogout } from '/src/composables/uselogout';
   
  export default {
    setup() {
      const { logoutUser } = useLogout();
      return { logoutUser };
    }
  };
  </script>
  
  <style scoped>
  .header {
    border-bottom: 1px solid #0F456E; /* Thin bottom border */
    background-color: #ffffff;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  </style>
  