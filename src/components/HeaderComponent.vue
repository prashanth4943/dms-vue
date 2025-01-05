<template>
    <header class="bg-accent text-primary shadow-md">
      <div class="flex justify-between items-center p-6">
        <!-- App Name -->
        <h1 class="text-4xl font-serif font-bold tracking-tight">Archivio</h1>
  
        <vue-text-marquee
      :speed="30"
      :pause-on-hover="true"
      class="text-lg font-medium"
    >
      Welcome to Archivio! | Stay organized effortlessly! | Modern file management system!
    </vue-text-marquee>
        <!-- Logout Option -->
        <a 
          href="#" 
          @click.prevent="logoutUser" 
          class="text-neutralDark hover:text-primary text-lg font-sans font-medium transition"
        >
          Logout
        </a>
      </div>
    </header>
  </template>
  
  <script>
  import { useLogout } from '/src/composables/uselogout';
  import VueTextMarquee from 'vue-text-marquee';
  
  export default {
    components: { VueTextMarquee },
    setup() {
      const { logoutUser } = useLogout();
      return { logoutUser };
    }
  };
  </script>
  
  <style scoped>
  .header {
    border-bottom: 1px solid #E9ECEF; /* Subtle border for clean separation */
  }
  </style>
  