<template>
  <TransitionRoot :show="isOpen" as="template">
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Dialog as="div" class="relative" @close="closeModal">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
          <!-- Close Icon (Top-right corner) -->
          <button 
            @click="closeModal" 
            class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <i class="fas fa-times"></i>
          </button>

          <!-- Upload Section -->
          <div 
            class="border-2 border-dashed border-blue-500 p-6 text-center mb-4"
            @dragover.prevent="onDragOver" 
            @dragleave.prevent="onDragLeave" 
            @drop.prevent="handleDrop"
          >
            <div class="text-blue-500 text-3xl mb-2">
              <i class="fas fa-upload"></i>
            </div>
            <p v-if="!file" class="text-gray-600">Drag and drop a file here or click to browse</p>
            <input type="file" ref="fileInput" class="hidden" @change="handleFileInput" />
            <div v-if="filePreview" class="mt-4">
              <img :src="filePreview" alt="File Preview" class="max-w-full max-h-48 mx-auto" />
            </div>
          </div>

          <!-- Success/Error Messages -->
          <p v-if="successMessage" class="text-green-500">{{ successMessage }}</p>
          <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>

          <!-- Modal Footer -->
          <div class="flex justify-end mt-4">
            <button 
              @click="uploadFile(file)" 
              :disabled="!file" 
              class="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 disabled:bg-gray-300"
            >
              Upload
            </button>
            <button 
              @click="closeModal" 
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  </TransitionRoot>
</template>

<script>
import { Dialog, TransitionRoot } from '@headlessui/vue';
import { ref } from 'vue';

export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:isOpen'],
  setup(props, { emit }) {
    const file = ref(null);
    const filePreview = ref(null);
    const successMessage = ref('');
    const errorMessage = ref('');

    const closeModal = () => {
      emit('update:isOpen', false);
    };

    const handleFileInput = (event) => {
      file.value = event.target.files[0];
      previewFile(file.value);
    };

    const handleDrop = (event) => {
      file.value = event.dataTransfer.files[0];
      previewFile(file.value);
    };

    const previewFile = (file) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          filePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const uploadFile = () => {
      if (!file.value) {
        errorMessage.value = 'No file selected!';
        successMessage.value = '';
        return;
      }

      successMessage.value = 'File uploaded successfully!';
      errorMessage.value = '';
      setTimeout(() => {
        clearFile();
        closeModal();
      }, 2000);
    };

    const clearFile = () => {
      file.value = null;
      filePreview.value = null;
      successMessage.value = '';
      errorMessage.value = '';
    };

    return {
      file,
      filePreview,
      successMessage,
      errorMessage,
      closeModal,
      handleFileInput,
      handleDrop,
      previewFile,
      uploadFile,
      clearFile,
    };
  },
};
</script>
