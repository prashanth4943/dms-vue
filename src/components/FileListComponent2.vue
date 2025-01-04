<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-if="filteredFiles.length === 0" class="col-span-full text-center text-gray-500">
    No files matched your search.
  </div>
      <div
        v-for="file in filteredFiles"
        :key="file.FileID"
        class="bg-white shadow rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer relative"
      >
        <!-- Thumbnail -->
        <div
          class="relative bg-gray-100 h-40 flex items-center justify-center cursor-pointer"
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
          <img
            v-if="file.thumbnail"
            :src="file.thumbnail"
            alt="File Thumbnail"
            class="h-full object-cover"
            :class="selectedFiles.includes(file.FileID) ? 'opacity-50' : ''"
          />
          <div v-else class="text-gray-400" :class="selectedFiles.includes(file.FileID) ? 'opacity-50' : ''">
            No Thumbnail
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
    @click.stop="iconAction(file.FileID, 'trash')"
  />

  <!-- Share Icon -->
  <font-awesome-icon
    :icon="['fas', 'share-alt']"
    :class="{
      'text-secondary text-lg hover:text-secondary-dark cursor-pointer': !selectedFiles.includes(file.FileID),
      'text-gray-400 cursor-not-allowed pointer-events-none': selectedFiles.includes(file.FileID),
    }"
    @click.stop="iconAction(file.FileID, 'share')"
  />

  <!-- Eye Icon -->
  <font-awesome-icon
    :icon="['fas', 'eye']"
    :class="{
      'text-blue-500 text-lg hover:text-blue-600 cursor-pointer': !selectedFiles.includes(file.FileID),
      'text-gray-400 cursor-not-allowed pointer-events-none': selectedFiles.includes(file.FileID),
    }"
    @click.stop="iconAction(file.FileID, 'eye')"
  />

  <!-- Download Icon -->
  <font-awesome-icon
    :icon="['fas', 'download']"
    :class="{
      'text-green-500 text-lg hover:text-green-600 cursor-pointer': !selectedFiles.includes(file.FileID),
      'text-gray-400 cursor-not-allowed pointer-events-none': selectedFiles.includes(file.FileID),
    }"
    @click.stop="iconAction(file.FileID, 'download')"
  />
</div>
      </div>

  

    <!-- Search FAB -->
    <div
    class="fixed top-12 right-20 bg-blue-500 text-white rounded-lg p-5 shadow-lg cursor-pointer hover:bg-blue-600 transition"
    @click="toggleSearch"
  >
    <font-awesome-icon :icon="['fas', searchIcon]" class="text-2xl" />
  </div>

  <!-- Search FAB -->
  <div
    class="fixed top-12 right-20 bg-blue-500 text-white rounded-lg p-5 shadow-lg cursor-pointer hover:bg-blue-600 transition"
    @click="toggleSearch"
  >
    <font-awesome-icon :icon="['fas', searchIcon]" class="text-2xl" />
  </div>

  <!-- Search bar next to the FAB -->
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



    <!-- Upload FAB -->
    <div
    class="fixed bottom-12 right-20 bg-green-500 text-white rounded-lg p-5 shadow-lg cursor-pointer hover:bg-green-600 transition"
    @click="openUploadModal"
    >
    <font-awesome-icon :icon="['fas', 'upload']" class="text-2xl" />
    </div>

    <div
      v-if="isUploadModalVisible"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
    ></div>

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

  </template>
  
  <script>
  import { ref, computed, onMounted, onBeforeUnmount, defineComponent } from "vue";
  import { useUserStore } from '../utils/store';
  import { useToast } from "vue-toastification";
  import api from '../utils/api'; // Import the Axios instance or API helper
  import Swal from 'sweetalert2';
  
  export default defineComponent({
    name: 'FileListComponent2',
    setup() {
      const userStore = useUserStore();
      const toast = useToast();
      const selectedFiles = ref([]);
      const hasSelectedFiles = computed(() => selectedFiles.value.length > 0);
      const selectedCount = computed(() => selectedFiles.value.length);
      const uploadedFiles = computed(() => userStore.uploadedFiles);
      const displayedFiles = ref([]);
    //   const searchQuery = ref('');
      const showSearchBar = ref(false);
      const searchButtonText = ref("Show Search");
      const currentPage = ref(1);
      const pageSize = 20;
      const loading = ref(false);
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
  
      const viewFile = (fileId) => {
        console.log(`View file with ID: ${fileId}`);
      };
  
      const downloadFile = (fileId) => {
        console.log(`Download file with ID: ${fileId}`);
      };
  
      const deleteFile = async (fileId) => {
        try {
          await api.delete(`/deleteFile/${fileId}`);
          userStore.setUploadedFiles(uploadedFiles.value.filter(file => file.FileID !== fileId));
          toast.success("File deleted successfully");
        } catch (error) {
          console.error(`Error deleting file ${fileId}:`, error);
          toast.error("Failed to delete file");
        }
      };
  
      const shareFile = (fileId) => {
        console.log(`Share file with ID: ${fileId}`);
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
      searchIcon,
      toggleSearch,
      closeSearch,
      }  
    }
});

</script>