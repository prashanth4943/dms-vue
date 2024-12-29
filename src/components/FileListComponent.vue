<template>
    <div class="file-list-container">
      <h2>Uploaded Files</h2>
      <button class="search-toggle-btn" @click="toggleSearchBar">
      Search
    </button>
    <div v-if="showSearchBar" class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search files..." 
        @input="searchFiles"
      />
    </div>
      <div v-if="hasSelectedFiles" class="action-row">
      <button @click="selectAllFiles">Select All</button>
      <button @click="deselectAllFiles">Deselect All</button>
      <button @click="deleteSelectedFiles">Delete Selected ({{ selectedCount }})</button>
    </div>
      <!-- Display the list of uploaded files -->
      <div v-if="uploadedFiles">
      <div v-if="uploadedFiles.length > 0" class="file-list">
        <ul>
        <li v-for="file in  paginatedFiles" :key="file.FileID" class="file-item">
          <div class="file-info">
            <div>
              <strong>File Name:</strong> {{ file.FileName }}
            </div>
            <div>
              <strong>File Type:</strong> {{ file.FileType }}
            </div>
            <div>
              <strong>Upload Time:</strong> {{ new Date(file.UploadTime).toLocaleString() }}
            </div>
            <p>{{ loadingState[file.FileID] }}</p>
          </div>
          <div>
            <input type="checkbox" :value="file.FileID" v-model="selectedFileIds" :id="file.FileID"/>
          <font-awesome-icon
            :icon="['fas', 'download']"
            :class="['icon','download-icon',{ disabled: loadingState[file.FileID] }]"
            @click="!loadingState[file.FileID]  && downloadFile(file.FileID)"
          />  
          <font-awesome-icon
            :icon="['fas', 'trash-alt']"
            :class="['icon', 'delete-icon', { disabled: loadingState[file.FileID] }]"
            @click="!loadingState[file.FileID] && deleteFile(file.FileID)"
          />
        </div>
          <a :href="file.OCIReference" target="_blank" class="file-link">View File</a>
        </li>
    </ul>
    <div v-if="filteredFiles.length" class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Prev</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
    </div>
      </div>
    </div>
    <div v-else>
    <p>No files uploaded yet.</p>
  </div>
    </div>
  </template>
  <script>
  import { defineComponent, computed, onMounted , ref} from 'vue';
  import { useUserStore } from '../utils/store';
  import { useToast } from "vue-toastification";
  import api from '../utils/api'; // Import the Axios instance or api helper
  import Swal from 'sweetalert2';
  
  export default defineComponent({
    name: 'FileListComponent',
    
    setup() {
      const userStore = useUserStore();
      const uploadedFiles = computed(() => userStore.uploadedFiles); 
      const toast = useToast();
      const loadingState = ref({});
      const selectedFileIds = ref([]);
      const hasSelectedFiles = computed(() => selectedFileIds.value.length > 0);
      const selectedCount = computed(() => selectedFileIds.value.length);
      const searchQuery = ref('');
      const showSearchBar = ref(false);
      const selectedFiles = ref([]);
      const currentPage = ref(1);
      const filesPerPage = ref(5);

      const toggleSearchBar = () => {
      showSearchBar.value = !showSearchBar.value;
      };

      const selectAllFiles = () => {
      selectedFileIds.value = uploadedFiles.value.map(file => file.FileID);
        };
      const deselectAllFiles = () => {
      selectedFileIds.value = [];
        };

        const filteredFiles = computed(() => {
      if (!searchQuery.value) {
        return userStore.uploadedFiles; // No search, return all files
      }
      return userStore.uploadedFiles.filter(file =>
        file.FileName.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
       });

       const totalPages = computed(() => {
      return Math.ceil(filteredFiles.value.length / filesPerPage.value);
      });

      const paginatedFiles = computed(() => {
      const start = (currentPage.value - 1) * filesPerPage.value;
      const end = start + filesPerPage.value;
      return filteredFiles.value.slice(start, end);
      });

      const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
       };

       const searchFiles = () => {
      // This method will be triggered when the user types something in the search box
      console.log('Searching files for:', searchQuery.value);
      };
      // ------------------functions/methods---------------------
      // Only fetch files if they are not in the store (optional)
      const fetchUploadedFiles = async () => {
        if (userStore.uploadedFiles.length === 0) {
          try{
            const getemail = await api.get(`/getEmail`);
            const email = getemail.data.email;
            userStore.setEmail(email)
          }
          catch(error){
            console.error('error fetching email:',error);
          }
          try {
            if(userStore.email != null){
            const uploadedFilesResponse = await api.get(`/getUploadedFiles/${userStore.email}`);
            const uploadedFilesData = uploadedFilesResponse.data;
    
            userStore.setUploadedFiles(uploadedFilesData);
            }
          } catch (error) {
            console.error('Error fetching uploaded files:', error);
          }
        }
        console.log('Before update:', loadingState.value);
        userStore.uploadedFiles.forEach((file) => {
          loadingState.value[file.FileID] = false;
        });
        console.log('After update:', loadingState.value);

      };
  
      // Fetch files only if needed
      onMounted(() => {
        fetchUploadedFiles(); 
      });
  

  // -------------------------------------------------------
      const downloadFile = async (fileID) => {
        console.log("vnbvbvbnv")
        console.log(loadingState.value['42b6cacf-9c70-436f-a121-f0e44f3e5f5a'])
        console.log("Asdasdasdad")
        console.log(loadingState.value[fileID])
      if (loadingState.value[fileID]) return;
      console.log(fileID)
      loadingState.value[fileID] = true;
      console.log("lkjkjlkjlk")
      console.log(loadingState.value[fileID])
      try {
        const response = await api.get(`/downloadFile/${fileID}`, {
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Download progress: ${percentCompleted}%`);
          },
        });
        console.log(response.headers);
        const contentDisposition = response.headers["content-disposition"];
        const contentDisposition2 = response.headers["Content-Disposition"];
        console.log(contentDisposition)
        console.log(contentDisposition2)
        const trimmedFileID = fileID.slice(0, 10);
        let fileName = `file_${trimmedFileID}_${new Date().getTime()}`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match && match[1]) {
            fileName = match[1];
          }
        }

        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("File downloaded successfully!");
      } catch (error) {
        console.error("Error downloading file:", error);
        toast.error("Failed to download file.");
      }finally {
        loadingState.value[fileID] = false;
      }
    };
// ------------------------------------------------------
  const deleteFile = async (fileID) => {
    if (loadingState.value[fileID]) return;
    loadingState.value[fileID] = true;

    const result = await Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this file? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      // customClass: {
      //   popup: 'custom-popup',
      //   title: 'custom-title',
      //   confirmButton: 'custom-confirm-button',
      //   cancelButton: 'custom-cancel-button',
      // },
    });

    if (!result.isConfirmed) {
      loadingState.value[fileID] = false;
      return;
    }

    try {
      const response = await api.delete(`/deleteFile/${fileID}`);
      if (response.data.success) {
        userStore.setUploadedFiles(
          userStore.uploadedFiles.filter((file) => file.FileID !== fileID)
        );
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The file has been deleted successfully.',
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed!',
        text: 'An error occurred while trying to delete the file.',
      });
    } finally {
      loadingState.value[fileID] = false;
    }
  };

    const deleteSelectedFiles = async () => {
      const fileCount = selectedFileIds.value.length;
      const confirmMessage =
        fileCount === 1
          ? 'Are you sure you want to delete this selected file? This action cannot be undone.'
          : `Are you sure you want to delete all ${fileCount} selected files? This action cannot be undone.`;

      const result = await Swal.fire({
        title: 'Confirm Deletion',
        text: confirmMessage,
        icon: 'warning',
        showCancelButton: true,
        // confirmButtonColor: '#d33', // Custom color for Confirm button
        // cancelButtonColor: '#3085d6', // Custom color for Cancel button
        // confirmButtonText: fileCount === 1 ? 'Yes, delete this file!' : `Yes, delete all ${fileCount} files!`,
        // cancelButtonText: 'Cancel',
      });

      if (!result.isConfirmed) {
        // If user cancels, stop the deletion process and reset loading state
        selectedFileIds.value.forEach(fileID => {
          loadingState.value[fileID] = false;
        });
        return;
      }

      try {
        await Promise.all(
          selectedFileIds.value.map((fileID) => api.delete(`/deleteFile/${fileID}`))
        );
        userStore.setUploadedFiles(
          userStore.uploadedFiles.filter(
            (file) => !selectedFiles.value.includes(file.FileID)
          )
        );
        selectedFiles.value = [];
        toast.success(`${fileCount} file${fileCount > 1 ? 's' : ''} deleted successfully!`);
      } catch (error) {
        console.error("Error deleting selected files:", error);
        toast.error("Failed to delete some files.");
      }
  };

      return {
        uploadedFiles, 
        downloadFile,
        deleteFile,
        deleteSelectedFiles,
        loadingState,
        selectedFileIds,
        hasSelectedFiles,
        selectedCount, 
        selectAllFiles,
        deselectAllFiles,
        changePage,
        currentPage,
        totalPages,
        paginatedFiles,
        toggleSearchBar,
        searchFiles,
        searchQuery,
        showSearchBar,
        filteredFiles,
        selectedFiles,
        // toggleFileSelection,
      };
    }
  });
  </script>
  
  <style scoped>
  /* File List Container */
  .file-list-container {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  /* File list */
  .file-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  /* Individual file item styling */
  .file-item {
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 15px;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  }
  
  .file-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
  
  /* File Info Styling */
  .file-info {
    margin-bottom: 10px;
  }
  
  .file-info div {
    margin-bottom: 5px;
  }
  
  strong {
    color: #333;
  }
  
  /* File Link Styling */
  .file-link {
    display: inline-block;
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #007bff;
    color: #fff;
    border-radius: 5px;
    text-decoration: none;
    font-weight: bold;
    transition: background-color 0.3s;
  }
  
  .file-link:hover {
    background-color: #0056b3;
  }
  
  /* No files message */
  .no-files {
    color: #777;
    font-style: italic;
    text-align: center;
  }

  .icon {
  cursor: pointer;
  margin-left: 10px;
  font-size: 20px;
  transition: color 0.3s ease;
}

.download-icon {
  color: #007bff;
}

.download-icon:hover {
  color: #0056b3;
}

.delete-icon {
  color: #dc3545;
}

.delete-icon:hover {
  color: #a71d2a;
}
.file-list-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
}

.search-toggle-btn {
  background-color: #3085d6;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  margin-bottom: 10px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.file-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.file-list li {
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-list li button {
  background-color: #d33;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #3085d6;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.pagination span {
  font-size: 16px;
}

.bulk-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.bulk-actions button {
  background-color: #d33;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

  </style>
  