<template>
    <div class="layout">
      <!-- Header Component -->
      <HeaderComponent />
  
      <!-- Main Content Section -->
      <main class="main-content">
        <!-- <router-view /> -->
        <FileListComponent2/>
      </main> 
  
      <!-- Footer Component -->
      <FooterComponent />
    </div>
  </template>
  
  <script>
  // Import necessary components
  import HeaderComponent from '../components/HeaderComponent.vue';
  import FooterComponent from '../components/FooterComponent.vue';
  import FileListComponent2 from '../components/FileListComponent2.vue';
  
  export default {
    components: {
      HeaderComponent,
      FooterComponent,
      FileListComponent2,
    },
  };
  </script>
  
  <style scoped>
/* Layout Styling */
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensures full height, including footer placement */
}

/* Main Content Styling */
.main-content {
  flex: 1; /* Pushes footer to the bottom */
  padding: 2rem; /* Add spacing around the content */
  background-color: #F6F6F6; /* Light neutral background */
  color: #333333; /* Text color for readability */
  max-width: 1200px; /* Limiting the width of the main content */
  margin: 0 auto; /* Centers the main content */
}

/* Footer Styling */
.footer {
  padding: 1rem;
  background-color: #FFFFFF;
  text-align: center;
  border-top: 1px solid #E9ECEF; /* Thin border for footer */
}

  </style>
  