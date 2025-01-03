import { createApp } from 'vue'
import { createPinia } from 'pinia';
// import './style.css'
import './input.css'
import './index.css'
import App from './App.vue'
import router from './routes';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'vue-toastification/dist/index.css';
import Toast from 'vue-toastification';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faDownload, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

library.add(faDownload, faTrashAlt)

const options = {
    // Optional: Configure options such as position, timeout, etc.
    position: 'top-right',
    timeout: 3000,
  };

// createApp(App)
// .use(createPinia())
//  .use(router)
//  .use(Toast , options)
//  .mount('#app');

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(createPinia())
  .use(router)
  .use(Toast, options)
  .mount('#app');
