
<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo Section -->
      <div class="navbar-brand">
        <router-link to="/" class="brand-link">
          <img src="/achievo-logo.png" alt="Achievo" class="brand-logo" />
          <span class="brand-text">Achievo</span>
        </router-link>
      </div>

      <!-- Navigation Menu -->
      <div class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
        <div class="navbar-nav">
          <router-link to="/" class="nav-link" @click="closeMenu">Trang chủ</router-link>
          <router-link to="/marketplace" class="nav-link" @click="closeMenu">Khóa học</router-link>
          <router-link to="/certificate-validation" class="nav-link" @click="closeMenu">Xác thực chứng chỉ</router-link>
          
          <!-- Conditional Navigation based on connection status -->
          <div v-if="!isConnected" class="nav-auth">
            <router-link to="/login" class="nav-link" @click="closeMenu">Đăng nhập</router-link>
            <router-link to="/register" class="nav-link btn-register" @click="closeMenu">Đăng ký</router-link>
          </div>
          
          <div v-else class="nav-user">
            <div class="dropdown" @click="toggleDropdown" ref="dropdown">
              <button class="dropdown-toggle">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
                <span>{{ accountId }}</span>
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              <div class="dropdown-menu" v-show="isDropdownOpen">
                <router-link to="/student-dashboard" class="dropdown-item" @click="closeDropdown">Dashboard</router-link>
                <router-link to="/profile" class="dropdown-item" @click="closeDropdown">Hồ sơ</router-link>
                <hr class="dropdown-divider">
                <button @click="handleDisconnect" class="dropdown-item">Ngắt kết nối</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Toggle -->
      <div class="navbar-toggle" @click="toggleMenu">
        <span class="toggle-line"></span>
        <span class="toggle-line"></span>
        <span class="toggle-line"></span>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useNearStore } from '../stores/near'

const nearStore = useNearStore()

const isMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const dropdown = ref(null)

// Reactive properties
const isConnected = computed(() => nearStore.isConnected)
const accountId = computed(() => nearStore.accountId)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleDisconnect = async () => {
  try {
    await nearStore.disconnectWallet()
    closeDropdown()
  } catch (error) {
    console.error('Disconnect failed:', error)
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e5e7eb;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding: 0.75rem 0;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
}

.navbar-brand {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #1f2937;
  font-weight: 700;
  font-size: 1.5rem;
}

.brand-logo {
  height: 40px;
  width: auto;
  margin-right: 0.75rem;
}

.brand-text {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar-menu {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #667eea;
}

.nav-link.router-link-active {
  color: #667eea;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -0.25rem;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 1px;
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 2rem;
}

.btn-register {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white !important;
  padding: 0.5rem 1.5rem !important;
  border-radius: 0.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.nav-user {
  margin-left: 2rem;
}

.dropdown {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dropdown-toggle:hover {
  background: #f9fafb;
  border-color: #667eea;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  color: #4b5563;
  text-decoration: none;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dropdown-item:hover {
  background: #f3f4f6;
  color: #667eea;
}

.dropdown-divider {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 0.5rem 0;
}

.navbar-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  padding: 0.25rem;
}

.toggle-line {
  width: 25px;
  height: 3px;
  background: #4b5563;
  margin: 2px 0;
  transition: 0.3s;
  border-radius: 2px;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .navbar-toggle {
    display: flex;
  }

  .navbar-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid #e5e7eb;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    justify-content: flex-start;
    padding: 1rem;
  }

  .navbar-menu.is-active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .navbar-nav {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    width: 100%;
  }

  .nav-link {
    padding: 1rem 0;
    border-bottom: 1px solid #f3f4f6;
  }

  .nav-auth {
    flex-direction: column;
    margin-left: 0;
    margin-top: 1rem;
    gap: 0.5rem;
  }

  .nav-user {
    margin-left: 0;
    margin-top: 1rem;
  }

  .dropdown-menu {
    position: static;
    box-shadow: none;
    border: none;
    margin-top: 0.5rem;
    background: #f9fafb;
  }
}

/* Animation for mobile menu toggle */
.navbar-toggle.is-active .toggle-line:nth-child(1) {
  transform: rotate(-45deg) translate(-5px, 6px);
}

.navbar-toggle.is-active .toggle-line:nth-child(2) {
  opacity: 0;
}

.navbar-toggle.is-active .toggle-line:nth-child(3) {
  transform: rotate(45deg) translate(-5px, -6px);
}
</style>
