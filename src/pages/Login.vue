<template>
  <div class="min-h-screen bg-white">
    <!-- Header Component -->
    <header class="sticky top-0 z-50 bg-white border-b">
      <div class="container mx-auto px-4">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo -->
          <router-link to="/" class="flex items-center gap-2">
            <UserIcon class="h-8 w-8 text-blue-600" />
            <span class="text-xl font-bold">Achievo</span>
          </router-link>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-8">
            <router-link to="/" class="text-sm font-medium hover:text-blue-600 transition-colors">Home</router-link>
            <router-link to="/marketplace" class="text-sm font-medium hover:text-blue-600 transition-colors">Marketplace</router-link>
            <a href="#" class="text-sm font-medium hover:text-blue-600 transition-colors">About</a>
            <a href="#" class="text-sm font-medium hover:text-blue-600 transition-colors">FAQ</a>
          </nav>

          <!-- Auth Links -->
          <div class="flex items-center gap-4">
            <router-link to="/register" class="text-sm font-medium hover:text-blue-600 transition-colors">Register</router-link>
          </div>
        </div>
      </div>
    </header>

    <div class="flex items-center justify-center py-20 bg-gray-50">
      <div class="login-page">
        <div class="login-container">
          <div class="login-form">
            <h2>Login to Achievo</h2>
            <form @submit.prevent="handleLogin">
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  required
                  placeholder="Enter your password"
                />
              </div>
              <div class="form-group">
                <label for="userType">Login as</label>
                <select id="userType" v-model="form.userType">
                  <option value="student">Student</option>
                  <option value="organization">Organization</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Logging in...' : 'Login' }}
              </button>
            </form>

            <div class="wallet-section">
              <h3>Or connect with NEAR Wallet</h3>
              <div class="wallet-buttons">
                <button @click="connectWallet('near')" class="btn btn-wallet">
                  Connect NEAR Wallet
                </button>
                <button @click="connectWallet('meteor')" class="btn btn-wallet">
                  Connect Meteor Wallet
                </button>
                <button @click="connectWallet('mynear')" class="btn btn-wallet">
                  Connect MyNearWallet
                </button>
              </div>
            </div>

            <p class="login-footer">
              Don't have an account? <router-link to="/register">Register here</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { UserIcon } from '@heroicons/vue/24/outline'
import { useNearStore } from '../stores/near'

const router = useRouter()
const authStore = useAuthStore()
const nearStore = useNearStore()

const loading = ref(false)
const form = ref({
  email: '',
  password: '',
  userType: 'student'
})

const handleLogin = async () => {
  loading.value = true
  try {
    await authStore.login(form.value)
    authStore.userType = form.value.userType

    if (form.value.userType === 'student') {
      router.push('/student-dashboard')
    } else {
      router.push('/organization-dashboard')
    }
  } catch (error) {
    alert('Login failed: ' + error.message)
  } finally {
    loading.value = false
  }
}

const connectWallet = async (walletType) => {
  try {
    await nearStore.connectWallet(walletType)
    if (nearStore.isConnected) {
      router.push('/student-dashboard')
    }
  } catch (error) {
    alert('Wallet connection failed: ' + error.message)
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #555;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.wallet-section {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #e1e5e9;
}

.wallet-section h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.wallet-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-wallet {
  background: #f8f9fa;
  color: #333;
  border: 2px solid #e1e5e9;
}

.btn-wallet:hover {
  background: #e9ecef;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-footer a {
  color: #667eea;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>