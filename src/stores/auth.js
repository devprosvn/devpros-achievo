
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const userType = ref('student') // 'student', 'organization', 'admin', 'superuser'
  const walletAddress = ref(null)

  const login = async (credentials) => {
    try {
      const response = await api.login(credentials)
      user.value = response.data.user
      isAuthenticated.value = true
      userType.value = response.data.user.type || response.data.user.role
      localStorage.setItem('token', response.data.token)
      return response.data
    } catch (error) {
      throw error
    }
  }

  const loginWithWallet = async (walletAddress) => {
    try {
      const response = await api.loginWithWallet({ wallet_address: walletAddress })
      user.value = response.data.user
      isAuthenticated.value = true
      userType.value = response.data.user.type || response.data.user.role
      walletAddress.value = walletAddress
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('wallet_address', walletAddress)
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
    walletAddress.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('wallet_address')
  }

  const initializeAuth = async () => {
    const token = localStorage.getItem('token')
    const storedWalletAddress = localStorage.getItem('wallet_address')
    
    if (token && storedWalletAddress) {
      try {
        // Verify wallet connection with backend
        const response = await api.verifyWalletConnection(storedWalletAddress)
        if (response.data.verified) {
          user.value = response.data.user
          isAuthenticated.value = true
          userType.value = response.data.user.type || response.data.user.role
          walletAddress.value = storedWalletAddress
        } else {
          logout()
        }
      } catch (error) {
        console.error('Failed to verify wallet connection:', error)
        logout()
      }
    } else if (token) {
      isAuthenticated.value = true
      // Regular token verification
    }
  }

  return {
    user,
    isAuthenticated,
    userType,
    walletAddress,
    login,
    loginWithWallet,
    register,
    registerOrganization,
    logout,
    initializeAuth
  }
})
