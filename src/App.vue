<template>
  <div id="app">
    <NavBar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import NavBar from './components/NavBar.vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuth()
})
</script>

<style>
@import './assets/main.css';

#app {
  width: 100%;
  margin: 0;
  padding: 0;
}

.main-content {
  padding-top: 80px; /* Account for fixed navbar height */
  min-height: 100vh;
}
</style>