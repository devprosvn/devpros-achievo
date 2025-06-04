
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../services/api'
import firebaseService from '../services/firebase'

// Role hierarchy
export const ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  ORGANIZATION_VERIFIER: 'organization_verifier',
  USER: 'user'
}

export const ROLE_HIERARCHY = {
  [ROLES.USER]: 0,
  [ROLES.ORGANIZATION_VERIFIER]: 1,
  [ROLES.MODERATOR]: 2,
  [ROLES.ADMIN]: 3
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const userRole = ref(ROLES.USER)
  const userType = ref('student') // Backward compatibility

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
    if (walletAddress === 'bernieio.testnet') return 'admin'
    return 'user' // default for all other accounts
  }

  const getRoleFromWallet = (walletAddress) => {
    // bernieio.testnet is always admin (contract owner)
    if (walletAddress === 'bernieio.testnet') return ROLES.ADMIN
    // Default role for new users
    return ROLES.USER
  }

  const hasRole = (requiredRole) => {
    if (!userRole.value) return false
    return ROLE_HIERARCHY[userRole.value] >= ROLE_HIERARCHY[requiredRole]
  }

  const isAdmin = () => hasRole(ROLES.ADMIN)
  const isModerator = () => hasRole(ROLES.MODERATOR)
  const isOrganizationVerifier = () => hasRole(ROLES.ORGANIZATION_VERIFIER)

  const loadUserRole = async (walletAddress) => {
    try {
      // Check if user is contract owner (bernieio.testnet) - always admin
      if (walletAddress === 'bernieio.testnet') {
        userRole.value = ROLES.ADMIN
        console.log('Admin role assigned to bernieio.testnet')
        return ROLES.ADMIN
      }

      // Try to get role from Firebase for other users
      const existingRole = await firebaseService.getUserRole(walletAddress)
      
      if (existingRole) {
        userRole.value = existingRole.role
        return existingRole.role
      } else {
        // Create default role for new user
        const defaultRole = ROLES.USER
        const roleData = {
          wallet_address: walletAddress,
          role: defaultRole,
          assigned_by: 'system',
          assigned_at: new Date().toISOString()
        }
        
        await firebaseService.createUserRole(roleData)
        userRole.value = defaultRole
        return defaultRole
      }
    } catch (error) {
      console.error('Error loading user role:', error)
      // For bernieio.testnet, still return admin even if Firebase fails
      if (walletAddress === 'bernieio.testnet') {
        userRole.value = ROLES.ADMIN
        return ROLES.ADMIN
      }
      userRole.value = ROLES.USER
      return ROLES.USER
    }
  }

  const loginWithWallet = async (walletAddress, accountInfo) => {
    try {
      // Load user role
      const role = await loadUserRole(walletAddress)
      
      user.value = {
        wallet_address: walletAddress,
        role: role,
        ...accountInfo
      }
      
      isAuthenticated.value = true
      userRole.value = role
      userType.value = getUserTypeFromWallet(walletAddress)
      
      localStorage.setItem('wallet_address', walletAddress)
      localStorage.setItem('user_role', role)
      localStorage.setItem('user_type', userType.value)
      
      console.log(`User ${walletAddress} logged in with role: ${role}`)
      
      return role
    } catch (error) {
      console.error('Error during wallet login:', error)
      throw error
    }
  }

  const assignRole = async (walletAddress, newRole, assignedBy) => {
    try {
      // Only admin can assign roles
      if (!isAdmin()) {
        throw new Error('Only admin can assign roles')
      }

      // Cannot change admin role of contract owner
      if (walletAddress === 'bernieio.testnet' && newRole !== ROLES.ADMIN) {
        throw new Error('Cannot change contract owner admin role')
      }

      const existingRole = await firebaseService.getUserRole(walletAddress)
      const roleData = {
        wallet_address: walletAddress,
        role: newRole,
        assigned_by: assignedBy,
        assigned_at: new Date().toISOString()
      }

      if (existingRole) {
        await firebaseService.updateUserRole(existingRole.id, roleData)
      } else {
        await firebaseService.createUserRole(roleData)
      }

      // If it's current user, update local state
      if (user.value && user.value.wallet_address === walletAddress) {
        userRole.value = newRole
        user.value.role = newRole
        localStorage.setItem('user_role', newRole)
      }

      return true
    } catch (error) {
      console.error('Error assigning role:', error)
      throw error
    }
  }

  return {
    user,
    isAuthenticated,
    userType,
    userRole,
    login,
    register,
    registerOrganization,
    logout,
    initializeAuth,
    getUserTypeFromWallet,
    getRoleFromWallet,
    loginWithWallet,
    loadUserRole,
    assignRole,
    hasRole,
    isAdmin,
    isModerator,
    isOrganizationVerifier,
    ROLES,
    ROLE_HIERARCHY
  }
})
