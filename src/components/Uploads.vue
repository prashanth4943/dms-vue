<template>
  <div class="min-h-screen bg-neutralLight font-sans text-text">
    <HeaderComponent />

    <!-- Upload Container -->
    <div class="upload-container max-w-2xl mx-auto mt-8 p-6 bg-white shadow-md border border-primary rounded-large">
      <h1 class="text-3xl font-damion font-bold mb-4 text-primary">Upload Your Document</h1>
      <p class="text-text mb-6">
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
        <img src="/public/upload.png" alt="" class="w-24 block m-auto">
      </div>

      <!-- File Input -->
      <!-- <label for="file-input" class="block mt-6 text-center">
        <button type="submit" class="upload-label px-6 py-2 border border-primary text-primary bg-white rounded-large hover:bg-primary hover:text-white transition">
          Choose File
        </button>
      </label> -->
      <label
        for="file-input"
        class="upload-label inline-block  mt-6 text-center px-6 py-2 border border-primary text-white bg-primary rounded-medium hover:bg-white hover:text-primary transition cursor-pointer"
      >
        Choose File
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
          <img :src="filePreview" alt="Image Preview" class="rounded-large shadow-md border border-primary mx-auto" />
        </div>
        <div v-else class="generic-preview text-accent">
          <p><strong>File Name:</strong> {{ file.name }}</p>
          <p><strong>File Type:</strong> {{ file.type }}</p>
        </div>
        <div class="flex justify-between mt-4">
          <button @click="uploadFile(file)" class="upload-btn px-4 py-2 border border-primary text-white bg-primary hover:bg-white hover:text-primary transition">
            Upload
          </button>
          <button @click="clearFile" class="cancel-btn px-4 py-2 border border-primary text-white bg-primary  hover:bg-white hover:text-primary transition">
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
  <FooterComponent/>
</template>

  <script>
import { useUserStore } from "../utils/store"; // Import your Pinia store
import api from '../utils/api'; 
import FileListComponent from './FileListComponent.vue';
import Swal from 'sweetalert2';
// import HeaderComponent from "./HeaderComponent.vue";
import HeaderComponent from "./HeaderComponent.vue";
import FooterComponent from "./FooterComponent.vue";

export default {
  name: 'Uploads',
  components: {
    FileListComponent, 
    HeaderComponent,
    FooterComponent
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
      if(email == ""){
           const getemail = await api.get(`/getEmail`);
            const email = getemail.data.email;
            userStore.setEmail(email)
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("fileType", file.type);
      formData.append("fileSize", file.size); // Add metadata
      formData.append("email", email); // Add user email

      try {
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Explicitly tell the server it's a multipart request
      },
    });

    if (response.status === 200) {
      this.successMessage = "File uploaded successfully!";
      this.errorMessage = "";
      this.clearFile();

      const fileData = response.data.file;
      userStore.addUploadedFile(fileData);


      // Trigger Swal to ask for user choice
      Swal.fire({
        title: "Success!",
        text: "File uploaded successfully. Would you like to upload another file or view the file list?",
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Upload Another",
        cancelButtonText: "Go to File List",
        customClass: {
          popup: "custom-swal-popup", // Add this for theming
          confirmButton: "custom-swal-confirm-button",
          cancelButton: "custom-swal-cancel-button",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // User wants to upload another file
          this.successMessage = ""
          this.clearFile();
        } else {
          // User wants to view file list
          this.$router.push("/filelist");
        }
      });
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

    // Show error alert
    Swal.fire({
      title: "Error!",
      text: this.errorMessage,
      icon: "error",
      confirmButtonText: "OK",
      customClass: {
        popup: "custom-swal-popup",
        confirmButton: "custom-swal-confirm-button",
      },
    });
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
  .hidden {
  display: none;
}
.custom-swal-popup {
  background-color: #ffffff; /* Change as needed */
  color: #213547; /* Adjust text color */
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.custom-swal-confirm-button {
  background-color: #535bf2; /* Match your primary color */
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.5em 1em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.custom-swal-confirm-button:hover {
  background-color: #646cff;
}

.custom-swal-cancel-button {
  background-color: #f9f9f9;
  color: #535bf2;
  border: 1px solid #535bf2;
  border-radius: 5px;
  padding: 0.5em 1em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.custom-swal-cancel-button:hover {
  background-color: #535bf2;
  color: #fff;
}

  </style>
  