import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';  // A simple component as an example
import About from '../components/About.vue';  // Another simple component

// Define routes
const routes = [
  { path: '/home', component: Home },
  { path: '/about', component: About }
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
