<template>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <!-- No Files Message -->
  <div v-if="filteredFiles.length === 0" class="col-span-full text-center text-gray-500">
    No files matched your search.
  </div>

  <!-- File Card -->
  <div
    v-for="file in filteredFiles"
    :key="file.FileID"
    class="bg-white shadow rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer relative"
  >
    <!-- Thumbnail -->
    <div
      class="relative bg-gray-100 h-40 flex items-center justify-center cursor-pointer overflow-hidden"
      @click="toggleSelection(file.FileID)"
    >
      <!-- Dim Thumbnail with Checkmark if Selected -->
      <div
        v-if="selectedFiles.includes(file.FileID)"
        class="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center z-10"
      >
        <font-awesome-icon :icon="['fas', 'check']" class="text-4xl text-white" />
      </div>

      <!-- Thumbnail Image or Placeholder -->
      <div class="thumbnail-container relative w-full h-full">
        <img
          v-if="fileThumbnails[file.FileID]"
          :src="fileThumbnails[file.FileID]"
          alt="File Thumbnail"
          class="object-cover w-full h-full"
        />
        <div
          v-else
          class="text-gray-400 flex items-center justify-center h-full"
          :class="selectedFiles.includes(file.FileID) ? 'opacity-50' : ''"
        >
          No Thumbnail
        </div>

        <!-- Bottom Shadow for Envelope Effect -->
        <div
          v-if="fileThumbnails[file.FileID]"
          class="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"
        ></div>
      </div>
    </div>

    <!-- File Info -->
    <div class="p-4 text-center">
      <h3 class="text-lg font-semibold truncate">{{ file.FileName }}</h3>
      <p class="text-sm text-gray-500">{{ file.FileType }}</p>
      <p class="text-sm text-gray-400 mt-1">
        {{ new Date(file.UploadTime).toLocaleDateString() }}
      </p>
    </div>

    <!-- Actions -->
    <div class="flex justify-around bg-gray-50 py-2">
      <!-- Trash Icon -->
      <font-awesome-icon
        :icon="['fas', 'trash-alt']"
        :class="{
          'text-red-500 text-lg hover:text-red-600 cursor-pointer': !selectedFiles.includes(file.FileID),
          'text-gray-400 cursor-not-allowed pointer-events-none': selectedFiles.includes(file.FileID),
        }"
        @click.stop="deleteFile(file.FileID)"
      />

      <!-- Share Icon -->
      <font-awesome-icon
        :icon="['fa', 'paper-plane']"
        :class="{
          'text-secondary text-lg hover:text-secondary-dark cursor-pointer': !selectedFiles.includes(file.FileID),
          'text-black-400 cursor-not-allowed pointer-events-none': selectedFiles.includes(file.FileID),
        }"
        @click.stop="shareFile(file.FileID)"
      />

      <!-- Eye Icon -->
      <font-awesome-icon
        :icon="['fas', 'eye']"
        :class="{
          'text-blue-500 text-lg hover:text-blue-600 cursor-pointer': !selectedFiles.includes(file.FileID),
          'text-gray-400 cursor-not-allowed pointer-events-none': selectedFiles.includes(file.FileID),
        }"
        @click.stop="viewFile(file.FileID)"
      />

      <!-- Download Icon -->
      <font-awesome-icon
        :icon="['fas', 'download']"
        :class="{
          'text-green-500 text-lg hover:text-green-600 cursor-pointer': !selectedFiles.includes(file.FileID),
          'text-gray-400 cursor-not-allowed pointer-events-none': selectedFiles.includes(file.FileID),
        }"
        @click.stop="downloadFile(file.FileID)"
      />
    </div>
  </div>
</div>

    <!-- Search FAB -->
    <div
    class="fixed top-12 right-20 bg-blue-500 text-white rounded-lg p-5 shadow-lg cursor-pointer hover:bg-blue-600 transition"
    @click="toggleSearch"
  >
    <font-awesome-icon :icon="['fas', searchIcon]" class="text-2xl" />
  </div>

  <div
    v-if="searchOpen"
    class="fixed top-12 right-40 bg-gray-800 text-white flex items-center py-5 px-6 rounded-lg transition-all duration-500 ease-in-out"
    style="width: 250px;"
  >
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Enter here..."
      class="w-full bg-transparent border-none outline-none text-white placeholder-white"
    />
  </div>



     <div>
    <UploadComponent />
    </div>

    

<transition
    name="slide-up"
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
  >
  <div
  v-if="selectedCount > 0"
  class="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-[50%] mb-5 bg-gray-800 text-white py-4 px-6 rounded-lg"
  :class="{
    'translate-y-0': selectedCount > 0,
    'translate-y-full': selectedCount === 0
  }"
>
  <div class="flex justify-between items-center">
      <div class="flex space-x-10">  
    <p class="text-lg">{{ selectedCount }}</p>
    <div class="border-l border-white h-6 mx-3"></div>
      <!-- Select All Icon -->
      <font-awesome-icon
        :icon="['fas', 'check-double']"
        class="text-white text-2xl hover:text-blue-500 cursor-pointer"
        @click="selectAllFiles"
      />
      <div class="border-l border-white h-6 mx-3"></div>
      <!-- Deselect All Icon -->
      <font-awesome-icon
        :icon="['fas', 'times-circle']"
        class="text-white text-2xl hover:text-red-500 cursor-pointer"
        @click="deselectAllFiles"
      />
      <div class="border-l border-white h-6 mx-3"></div>
      <!-- Delete Icon -->
      <font-awesome-icon
        :icon="['fas', 'trash-alt']"
        class="text-white text-2xl hover:text-red-500 cursor-pointer"
        @click="deleteSelectedFiles"
      />
    </div>
  </div>
</div>

  </transition>
  <!-- <UploadModal v-if="isUploadModalVisible" @close="isUploadModalVisible = false" :isOpen="isUploadModalVisible" />
  <UploadModal 
      :isOpen="isUploadModalVisible" 
      @update:isOpen="closeModal" 
    /> -->
  </template>
  
  <script>
  import { ref, computed, onMounted, onBeforeUnmount, defineComponent } from "vue";
  import { useUserStore } from '../utils/store';
  import { useToast } from "vue-toastification";
  import api from '../utils/api'; // Import the Axios instance or API helper
  import Swal from 'sweetalert2';
//   import UploadModal from './UploadModal.vue'; 
import UploadComponent from './UploadComponent.vue';
  
  export default defineComponent({
    name: 'FileListComponent2',
    components: {
    // UploadModal,
    UploadComponent,
  },
    setup() {
      const userStore = useUserStore();
      const toast = useToast();
      const selectedFiles = ref([]);
      const selectedFileID = ref(null)
      const hasSelectedFiles = computed(() => selectedFiles.value.length > 0);
      const selectedCount = computed(() => selectedFiles.value.length);
      const uploadedFiles = computed(() => userStore.uploadedFiles);
      const displayedFiles = ref([]);
      const showSearchBar = ref(false);
      const searchButtonText = ref("Show Search");
      const currentPage = ref(1);
      const pageSize = 20;
      const loading = ref(false);
      const loadingState = ref({});
      const searchOpen = ref(false);
    const searchQuery = ref('');
    const searchIcon = ref('search');
      const fileThumbnails = ref({});
      const thumbnailErrors = ref({});
      const isUploadModalVisible = ref(false)

  

  
      const toggleSearchBar = () => {
        if (showSearchBar.value) {
        searchQuery.value = '';
      }
        showSearchBar.value = !showSearchBar.value;
        searchButtonText.value = showSearchBar.value ? "Hide Search" : "Show Search";
      };
  
      const searchFiles = () => {
        resetDisplayedFiles();
      };
  
      const resetDisplayedFiles = () => {
        currentPage.value = 1;
        displayedFiles.value = filteredFiles.value.slice(0, pageSize);
      };

      const toggleSelection = (fileID) => {
        if (selectedFiles.value.includes(fileID)) {
            // If already selected, deselect it
            selectedFiles.value = selectedFiles.value.filter((id) => id !== fileID);
        } else {
            // Otherwise, add it to selected files
            selectedFiles.value.push(fileID);
            console.log(selectedFiles.value)
            console.log(selectedCount.value)
        }
        };
      const selectAllFiles = () => {
      selectedFiles.value = uploadedFiles.value.map(file => file.FileID);
        };
      const deselectAllFiles = () => {
      selectedFiles.value = [];
        };

        const beforeEnter = (el) => {
        el.style.transform = "translateY(100%)"; // Start from off-screen
        };

        const enter = (el, done) => {
        el.offsetHeight; // trigger reflow
        el.style.transition = "transform 0.5s ease-out"; // Apply transition
        el.style.transform = "translateY(0)"; // Slide up to its final position
        done();
        };

        const leave = (el, done) => {
        el.style.transition = "transform 0.5s ease-in"; // Apply transition
        el.style.transform = "translateY(100%)"; // Slide back down off-screen
        done();
        };
        const toggleSearch = () => {
            if (searchOpen.value) {
                console.log("sdadasdasdasd")
              searchQuery.value = '';
      }
      searchOpen.value = !searchOpen.value;
      searchIcon.value = searchOpen.value ? 'times' : 'search';
    };

    // Close the search bar
    const closeSearch = () => {
      searchOpen.value = false;
      searchIcon.value = 'search';
    };
    const openUploadModal = () =>{
        isUploadModalVisible.value = true; // Show the UploadModal
    }

    const filteredFiles = computed(() => {
        if (!searchQuery.value) {
          return userStore.uploadedFiles; // No search, return all files
        }
        return userStore.uploadedFiles.filter(file =>
          file.FileName.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
       });


      const loadMoreFiles = () => {
        if (loading.value || displayedFiles.value.length >= filteredFiles.value.length) return;
        loading.value = true;
  
        setTimeout(() => {
          const start = currentPage.value * pageSize;
          const end = start + pageSize;
          displayedFiles.value.push(...filteredFiles.value.slice(start, end));
          currentPage.value++;
          loading.value = false;
        }, 1000); // Simulating network latency
      };
  
      const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
          loadMoreFiles();
        }
      };
  
      const viewFile = async (fileID) => {
  try {
    // Show a loading Swal while fetching the file
    Swal.fire({
      title: "Loading...",
      text: "Please wait while we fetch the file.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Fetch the file data as a Blob
    const response = await api.get(`/getPreview/${fileID}`, {
      responseType: "blob",
    });
    const fileBlob = response.data;
    const fileURL = URL.createObjectURL(fileBlob);

    // Show the file preview in a scrollable Swal
    Swal.fire({
      html: `
        <div style="max-height: 70vh; overflow-y: auto; border: 1px solid #ddd; border-radius: 8px; padding: 10px;">
          <iframe 
            src="${fileURL}" 
            style="width: 100%; height: 600px;" 
            frameborder="0">
          </iframe>
        </div>`,
      showCloseButton: true,
      showConfirmButton: false,
      width: "60%",
      heightAuto: false,
      customClass: {
        popup: "scrollable-preview",
      },
    });
  } catch (error) {
    Swal.fire("Error", "Unable to fetch the file.", "error");
  }
};

  
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
  
  const shareFile = (fileID) => {
        selectedFileID.value = fileID;
   
        // Open SweetAlert2 modal
        Swal.fire({
            title: 'Send Email',
            html: `
                <div class="flex flex-col gap-4">
                <div>
                    <label for="to" class="block text-gray-700 text-sm font-bold mb-2">Recipient Email:</label>
                    <input id="to" type="email" class="swal2-input border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter email">
                </div>
                <div>
                    <label for="subject" class="block text-gray-700 text-sm font-bold mb-2">Subject:</label>
                    <input id="subject" type="text" class="swal2-input border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter subject">
                </div>
                <div>
                    <label for="message" class="block text-gray-700 text-sm font-bold mb-2">Message (Optional):</label>
                    <textarea id="message" class="swal2-textarea border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter message"></textarea>
                </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: `<span class="px-4 py-2 text-white rounded-lg hover:bg-yellow-600">Send</span>`,
            cancelButtonText: `<span class="px-4 py-2  text-white rounded-lg hover:bg-gray-600">Cancel</span>`,
            customClass: {
                popup: 'p-6 bg-white rounded-lg shadow-md',
                title: 'text-xl font-bold text-gray-700',
            },
          preConfirm: () => {
            const to = document.getElementById('to').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
   
            if (!to || !subject) {
              Swal.showValidationMessage('Recipient Email and Subject are required!');
              return false;
            }
   
            return { to, subject, message };
          },
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const { to, subject, message } = result.value;
              await api.post('/SendEmail', {
                to,
                subject,
                message,
                fileID: selectedFileID.value,
              });
              Swal.fire('Success', 'Email sent successfully!', 'success');
            } catch (error) {
              Swal.fire('Error', 'Failed to send email.', 'error');
            }
          }
        });
      };
  
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
          fetchThumbnail(file);
        });
        console.log('After update:', loadingState.value);

      };
  
      // Fetch files only if needed
      onMounted(() => {
        fetchUploadedFiles(); 
      });

      const fetchThumbnail = async (file) => {
    try {
      // Show loader state for the file
      loadingState.value[file.FileID] = true;

      const response = await api.get(`/getThumbnail/${file.FileID}`, {
        responseType: 'blob', // Assuming thumbnail is an image
      });

      // Create a URL for the thumbnail and store it
      fileThumbnails.value[file.FileID] = URL.createObjectURL(response.data);
    } catch (error) {
      console.error(`Error fetching thumbnail for file ${file.FileID}:`, error);
      thumbnailErrors.value[file.FileID] = true; // Mark as error
    } finally {
      loadingState.value[file.FileID] = false; // Stop loader
    }
   }; 

      return {
        uploadedFiles,
        displayedFiles,
        searchQuery,
        showSearchBar,
        searchButtonText,
        currentPage,
        pageSize,
        loading,
        filteredFiles,
        toggleSearchBar,
        searchFiles,
        resetDisplayedFiles,
        loadMoreFiles,
        handleScroll,
        viewFile,
        downloadFile,
        deleteFile,
        selectedFiles,
        toggleSelection,
        isUploadModalVisible,
        selectAllFiles,
        deselectAllFiles,
        selectedCount,
        beforeEnter,
        enter,
        leave,
        searchOpen,
        fileThumbnails,
        fetchThumbnail,
      searchIcon,
      toggleSearch,
      closeSearch,
      openUploadModal,
      loadingState,
      shareFile,
      selectedFileID,
      }  
    }
});

</script>