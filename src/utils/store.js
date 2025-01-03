import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    email: null,
    uploadedFiles: [] // Add uploadedFiles state to hold the list of files
  }),
  actions: {
    setEmail(email) {
      this.email = email;
    },
    setUploadedFiles(files) {
      this.uploadedFiles = files; // Update the uploadedFiles array
    },
    addUploadedFile(file) {
      this.uploadedFiles.push(file); // Add a new file to the uploadedFiles array
    },
    reset() {
      this.email = null;
      this.uploadedFiles = []; 
    }
  },
});
