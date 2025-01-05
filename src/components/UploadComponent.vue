<template>
    <div
      class="fixed bottom-12 right-20 flex flex-col items-center gap-2"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <div
        class="flex justify-center items-center bg-green-500 text-white rounded-full p-8 shadow-lg cursor-pointer hover:bg-green-600 transition relative"
        :class="{ 'ring-4 ring-green-300': isDragging }"
        @click="triggerFilePicker"
      >
        <font-awesome-icon :icon="['fas', 'upload']" class="text-4xl" />
      </div>
      <span class="text-sm text-gray-500">Drag & drop here or click to upload</span>
  
      <!-- Hidden file input -->
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        @change="handleFileSelect"
        accept="image/jpeg,image/png,application/pdf"
      />
  
      <!-- Modal Preview -->
      <div
  v-if="files.length > 0"
  class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
>
  <div
    class="bg-white p-5 rounded-lg w-3/4 max-w-4xl overflow-y-auto max-h-[90vh]"
  >
    <h3 class="text-lg font-bold mb-4">Selected Files</h3>
    <div v-for="file in files" :key="file.name" class="mb-4">
      <p class="text-sm font-medium">{{ file.name }}</p>
      <div class="relative border border-gray-300 rounded overflow-hidden">
        <!-- Loader -->
        <div
          v-if="!file.isLoaded"
          class="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75"
        >
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
        </div>

        <!-- File Preview -->
        <div v-if="file.preview">
          <!-- Image Preview -->
          <div v-if="file.type.startsWith('image/')" class="overflow-auto">
            <img
              :src="file.preview"
              alt="Preview"
              class="block mx-auto mt-2"
              @load="file.isLoaded = true"
            />
          </div>
          <!-- PDF Preview -->
          <div v-else-if="file.type === 'application/pdf'" class="overflow-auto">
            <embed
              :src="file.preview"
              type="application/pdf"
              class="w-full h-[600px] mt-2"
              @load="file.isLoaded = true"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-4">
      <button
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        @click="submitFiles"
      >
        Upload
      </button>
      <button
        class="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        @click="closeModal"
      >
        Cancel
      </button>
    </div>
  </div>
</div>


    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import Swal from "sweetalert2";
  import api from "../utils/api";
import { useUserStore } from "../utils/store"; // Import your Pinia store

  
  export default {
    name: "UploadComponent",
    setup() {
      const isDragging = ref(false);
      const files = ref([]);
      const userStore = useUserStore();
      const fileInput = ref(null);
  
      const triggerFilePicker = () => {
        fileInput.value.click();
      };
  
      const onDragOver = () => {
        isDragging.value = true;
      };
  
      const onDragLeave = () => {
        isDragging.value = false;
      };
  
      const onDrop = (event) => {
        isDragging.value = false;
        const droppedFiles = Array.from(event.dataTransfer.files);
        processFiles(droppedFiles);
      };
      const markFileAsLoaded = (fileName) => {
      const file = files.value.find((f) => f.name === fileName);
      if (file) {
        file.isLoaded = true;
      }
    };
      const handleFileSelect = (event) => {
        const selectedFiles = Array.from(event.target.files);
        processFiles(selectedFiles);
      };
  
      const processFiles = (selectedFiles) => {
        const validFiles = selectedFiles.filter((file) =>
          ["image/jpeg", "image/png", "application/pdf"].includes(file.type)
        );
  
        if (validFiles.length !== selectedFiles.length) {
          alert("Only images (JPEG, PNG) and PDFs are allowed!");
        }
  
        files.value = validFiles.map((file) => {
          const preview = file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : file.type === "application/pdf"
            ? URL.createObjectURL(file)
            : null;
  
          return { name: file.name, type: file.type,size: file.size, file, preview , isLoaded: false,};
        });
      };

    const submitFiles = async () => {
      if (files.value.length === 0) {
        alert("No files to upload!");
        return;
      }

      let email = userStore.email;

      if (!email) {
        try {
          const response = await api.get(`/getEmail`);
          email = response.data.email;
          userStore.setEmail(email);
        } catch (error) {
          console.error("Failed to fetch email:", error);
          alert("Unable to fetch email. Please try again.");
          return;
        }
      }

      for (const fileObj of files.value) {
        await uploadFile(fileObj.file, email); // Pass each file individually
      }

      // Clear files after successful upload
      files.value = [];
    };

    const uploadFile = async (file, email) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("fileType", file.type);
      formData.append("fileSize", file.size); // Add metadata
      formData.append("email", email); // Add user email

      try {
        const response = await api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          const fileData = response.data.file;
          const userStore = useUserStore(); 
          userStore.addUploadedFile(fileData);

          Swal.fire({
            icon: "success",
            title: "File Uploaded Successfully!",
            text: `File: ${file.name}`,
            confirmButtonText: "OK",
            confirmButtonColor: "#FCD34D", // Yellow Palette (Custom Color)
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Upload Failed",
            text: `File: ${file.name} could not be uploaded.`,
            confirmButtonText: "Try Again",
            confirmButtonColor: "#F87171", // Red Palette (Custom Color)
          });
        }
      } catch (error) {
        console.error(`Error uploading file "${file.name}":`, error);
        Swal.fire({
          icon: "error",
          title: "Upload Error",
          text: `An error occurred while uploading "${file.name}".`,
          confirmButtonText: "OK",
          confirmButtonColor: "#F87171", // Red Palette (Custom Color)
        });
      }
    };

      const closeModal = () => {
        files.value = [];
      };
  
      return {
        isDragging,
        files,
        fileInput,
        triggerFilePicker,
        onDragOver,
        onDragLeave,
        onDrop,
        handleFileSelect,
        submitFiles,
        closeModal,
        markFileAsLoaded,
      };
    },
  };
  </script>
  
  <style scoped>
  input[type="file"] {
    display: none;
  }
  </style>
  