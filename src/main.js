
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'

// Import pages
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import StudentDashboard from './pages/StudentDashboard.vue'
import OrganizationDashboard from './pages/OrganizationDashboard.vue'
import Marketplace from './pages/Marketplace.vue'
import CertificateValidation from './pages/CertificateValidation.vue'
import Profile from './pages/Profile.vue'

import './assets/main.css'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/student-dashboard', component: StudentDashboard },
  { path: '/organization-dashboard', component: OrganizationDashboard },
  { path: '/marketplace', component: Marketplace },
  { path: '/certificate-validation', component: CertificateValidation },
  { path: '/profile', component: Profile },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')
