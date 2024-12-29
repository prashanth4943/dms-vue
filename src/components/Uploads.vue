<template>
    <div class="upload-container">
      <h1>Upload Your Document</h1>
      <p>Drag and drop your file here or click the button below to upload.</p>
  
      <label for="file-input" class="upload-label">Choose File</label>
      <input
        type="file"
        id="file-input"
        ref="fileInput"
        @change="handleFileInput"
        style="display: none"
      />
  
      <div
        class="drag-drop-area"
        @dragover.prevent="dragging = true"
        @dragleave="dragging = false"
        @drop.prevent="handleDrop"
        :class="{ dragging: dragging }"
      >
        Drag & drop your file here
      </div>
  
      <!-- Preview Section -->
      <div v-if="file" class="file-preview">
        <h2>File Preview</h2>
        <div v-if="isImage(file)" class="image-preview">
          <img :src="filePreview" alt="Image Preview" />
        </div>
        <div v-else class="generic-preview">
          <p><strong>File Name:</strong> {{ file.name }}</p>
          <p><strong>File Type:</strong> {{ file.type }}</p>
        </div>
        <button @click="uploadFile(file)" class="upload-btn">Upload</button>
        <button @click="clearFile" class="cancel-btn">Cancel</button>
      </div>
  
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
    <FileListComponent/>
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
  .upload-container {
    background-color: #ffffff;
    border: 2px dashed #cccccc;
    border-radius: 8px;
    width: 400px;
    padding: 20px;
    text-align: center;
    margin: 50px auto;
  }
  
  .upload-container h1 {
    font-size: 1.5em;
    color: #333333;
    margin-bottom: 10px;
  }
  
  .upload-container p {
    font-size: 1em;
    color: #666666;
    margin-bottom: 20px;
  }
  
  .upload-label {
    display: inline-block;
    padding: 10px 20px;
    background-color: #6c63ff;
    color: #ffffff;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .upload-label:hover {
    background-color: #5147c4;
  }
  
  .drag-drop-area {
    border: 2px dashed #cccccc;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    color: #999999;
    font-size: 0.9em;
    background-color: #f7f7f7;
    transition: background-color 0.3s ease;
  }
  
  .drag-drop-area.dragging {
    background-color: #e8e8ff;
    border-color: #6c63ff;
  }
  
  .file-preview {
    margin-top: 20px;
    text-align: left;
  }
  
  .image-preview img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin-top: 10px;
  }
  
  .generic-preview p {
    margin: 5px 0;
  }
  
  .upload-btn,
  .cancel-btn {
    margin-top: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .upload-btn {
    background-color: #28a745;
    color: #ffffff;
    margin-right: 10px;
  }
  
  .upload-btn:hover {
    background-color: #218838;
  }
  
  .cancel-btn {
    background-color: #dc3545;
    color: #ffffff;
  }
  
  .cancel-btn:hover {
    background-color: #c82333;
  }
  
  .success-message {
    margin-top: 20px;
    color: #28a745;
    font-weight: bold;
  }
  
  .error-message {
    margin-top: 20px;
    color: #dc3545;
    font-weight: bold;
  }
  </style>
  