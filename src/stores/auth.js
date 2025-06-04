
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const userType = ref('student') // 'student', 'organization', 'admin', or 'superuser'

  const login = async (credentials) => {
    try {
      const response = await api.login(credentials)
      user.value = response.data.user
      isAuthenticated.value = true
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.register(userData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  const registerOrganization = async (orgData) => {
    try {
      const response = await api.registerOrganization(orgData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  const initializeAuth = () => {
    const token = localStorage.getItem('token')
    if (token) {
      isAuthenticated.value = true
      // You might want to verify token with backend here
    }
  }

  const getUserTypeFromWallet = (walletAddress) => {
    if (walletAddress === 'achievo.testnet') return 'admin'
    if (walletAddress === 'achievo-admin.testnet') return 'superuser'
    if (walletAddress === 'achievo-org.testnet') return 'organization'
    if (walletAddress === 'achievo-student.testnet') return 'student'
    return 'student' // default
  }

  const loginWithWallet = (walletAddress, accountInfo) => {
    user.value = {
      wallet_address: walletAddress,
      ...accountInfo
    }
    isAuthenticated.value = true
    userType.value = getUserTypeFromWallet(walletAddress)
    localStorage.setItem('wallet_address', walletAddress)
    localStorage.setItem('user_type', userType.value)
  }

  return {
    user,
    isAuthenticated,
    userType,
    login,
    register,
    registerOrganization,
    logout,
    initializeAuth,
    getUserTypeFromWallet,
    loginWithWallet
  }
})
