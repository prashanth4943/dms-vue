<template>
  <div class="min-h-screen bg-neutralLight font-sans text-text">
    <!-- Header -->
    <div class="flex justify-between items-center p-4 bg-primary text-neutralLight">
      <h1 class="text-xl font-bold">Archivio</h1>
      <button @click="handleLogout" class="logout-btn px-4 py-2 border border-primary rounded-large text-primary bg-white hover:bg-primary hover:text-white transition">
        Logout
      </button>
    </div>

    <!-- Upload Container -->
    <div class="upload-container max-w-2xl mx-auto mt-8 p-6 bg-white shadow-md border border-primary rounded-large">
      <h1 class="text-2xl font-serif font-bold mb-4 text-primary">Upload Your Document</h1>
      <p class="text-neutralDark mb-6">
        Drag and drop your file here or click the button below to upload.
      </p>

      <!-- Drag & Drop Area -->
      <div
        class="drag-drop-area border border-primary border-dashed rounded-large p-6 text-center transition-all hover:bg-neutralLight"
        @dragover.prevent="dragging = true"
        @dragleave="dragging = false"
        @drop.prevent="handleDrop"
        :class="{ 'bg-neutralLight': dragging }"
      >
        <p class="text-neutralDark">Drag & drop your file here</p>
      </div>

      <!-- File Input -->
      <label for="file-input" class="block mt-6 text-center">
        <button class="upload-label px-6 py-2 border border-primary text-primary bg-white rounded-large hover:bg-primary hover:text-white transition">
          Choose File
        </button>
      </label>
      <input
        type="file"
        id="file-input"
        ref="fileInput"
        @change="handleFileInput"
        class="hidden"
      />

      <!-- Preview Section -->
      <div v-if="file" class="file-preview mt-8">
        <h2 class="text-xl font-semibold mb-4 text-primary">File Preview</h2>
        <div v-if="isImage(file)" class="image-preview mb-4">
          <img :src="filePreview" alt="Image Preview" class="rounded-large shadow-md border border-primary" />
        </div>
        <div v-else class="generic-preview text-neutralDark">
          <p><strong>File Name:</strong> {{ file.name }}</p>
          <p><strong>File Type:</strong> {{ file.type }}</p>
        </div>
        <div class="flex justify-between mt-4">
          <button @click="uploadFile(file)" class="upload-btn px-4 py-2 border border-primary text-primary bg-white rounded-large hover:bg-primary hover:text-white transition">
            Upload
          </button>
          <button @click="clearFile" class="cancel-btn px-4 py-2 border border-primary text-primary bg-white rounded-large hover:bg-secondary hover:text-white transition">
            Cancel
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div v-if="successMessage" class="success-message mt-6 p-4 bg-green-100 border border-green-500 text-green-700 rounded-large">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="error-message mt-6 p-4 bg-red-100 border border-red-500 text-red-700 rounded-large">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

  <script>
import { useUserStore } from "../utils/store"; // Import your Pinia store
import api from '../utils/api'; 
import FileListComponent from './FileListComponent.vue';

export default {
  name: 'Uploads',
  components: {
    FileListComponent, 
  },
  data() {
    return {
      dragging: false,
      file: null, // Holds the selected file
      filePreview: null, // Holds the preview URL
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async uploadFile(file) {
      const userStore = useUserStore(); // Access the Pinia store
      const email = userStore.email; // Fetch the user's email from the store

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("fileType", file.type);
      formData.append("fileSize", file.size); // Add metadata
      formData.append("email", email); // Add user email

      try {
        const response = await api.post("/upload", formData , {
            headers: {
            "Content-Type": "multipart/form-data", // Explicitly tell the server it's a multipart request
            },
        });

        if (response.status === 200) {
      this.successMessage = "File uploaded successfully!";
      this.errorMessage = "";
      this.clearFile(); // Clear file after upload
    } else {
      this.successMessage = "";
      this.errorMessage = "Failed to upload file.";
    }
      } catch (error) {
        this.successMessage = "";
        if (error.response) {
            this.errorMessage = `Error: ${error.response.data.message || "Failed to upload file."}`;
        } else if (error.request) {
            this.errorMessage = "Error: No response received from the server.";
        } else {
            this.errorMessage = "Error: Could not connect to the server.";
        }
      }
    },
    handleFileInput(event) {
      const file = event.target.files[0];
      if (file) {
        this.previewFile(file);
      }
    },
    handleDrop(event) {
      this.dragging = false;
      const file = event.dataTransfer.files[0];
      if (file) {
        this.previewFile(file);
      }
    },
    previewFile(file) {
      this.file = file;
      if (this.isImage(file)) {
        this.filePreview = URL.createObjectURL(file); // Create a preview URL for images
      } else {
        this.filePreview = null;
      }
    },
    clearFile() {
      this.file = null;
      this.filePreview = null;

      // Reset file input
      const fileInput = this.$refs.fileInput;
      if (fileInput) {
        fileInput.value = null;
      }
    },
    isImage(file) {
      return file.type.startsWith("image/");
    },
  },
};
</script>
  
  <style scoped>
  
  </style>
  