import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';  
import About from '../components/About.vue';
import FormComponent from '../components/FormComponent.vue';
import Uploads from '../components/Uploads.vue';
import FileListComponent from '../components/FileListComponent.vue';
import TabbedComponent from '../components/TabbedComponent.vue';
import Actions from '../views/Actions.vue';

// Define routes
const routes = [
  { path: '/', component: FormComponent },
  { path: '/home', component: Home },
  { path: '/about', component: About },
  { path: '/filelist', component: Actions },
  { path: '/uploads', component: Uploads }
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
