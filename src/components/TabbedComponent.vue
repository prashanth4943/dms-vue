<template>
    <div class="max-w-5xl mx-auto bg-neutralLight p-6 rounded-lg shadow-xl">
      <!-- Tabs -->
      <div class="flex border-b">
        <div
          :class="['tab', { 'border-primary text-primary': activeTab === 0, 'hover:bg-neutralDark': activeTab !== 0 }]"
          @click="setActiveTab(0)"
        >
          File List
        </div>
        <div
          :class="['tab', { 'border-primary text-primary': activeTab === 1, 'hover:bg-neutralDark': activeTab !== 1 }]"
          @click="setActiveTab(1)"
        >
          Upload File
        </div>
      </div>
  
      <!-- Tab content -->
      <div v-if="activeTab === 0" class="p-6">
        <!-- File List Section -->
        <FileListComponent2 />
      </div>
      <div v-if="activeTab === 1" class="p-6">
        <!-- Upload File Section -->
        <Uploads />
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import FileListComponent2 from './FileListComponent2.vue';
  import Uploads from './Uploads.vue';
  
  export default {
    name: 'TabsLayout',
    components: {
      FileListComponent2,
      Uploads,
    },
    setup() {
      const activeTab = ref(0); // Default active tab is 0
  
      // Function to set the active tab
      const setActiveTab = (tabIndex) => {
        activeTab.value = tabIndex;
      };
  
      return {
        activeTab,
        setActiveTab,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Tab styling */
  .tab {
    cursor: pointer;
    padding: 10px 20px;
    font-size: 1.25rem;
    font-family: 'Crimson Text', serif;
    transition: all 0.3s ease;
  }
  
  .tab:hover {
    background-color: #f3f4f6; /* Light hover effect */
  }
  
  .tab.border-primary {
    border-bottom: 2px solid #0F456E; /* Active Tab Highlight */
  }
  
  .text-primary {
    color: #0F456E;
  }
  </style>
  