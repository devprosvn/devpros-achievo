import axios from 'axios'

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Sample data for testing NEAR Certificate System
const mockData = {
  // Sample users for Meteor Wallet authentication
  users: {
    admin: {
      wallet_address: "achievo.testnet",
      name: "Achievo Admin",
      email: "admin@achievo.io",
      role: "admin",
      type: "admin",
      permissions: ["manage_users", "verify_organizations", "system_config"],
      created_at: new Date("2024-01-01"),
      status: "active"
    },
    superuser: {
      wallet_address: "achievo-admin.testnet", 
      name: "Super Administrator",
      email: "superuser@achievo.io",
      role: "superuser",
      type: "superuser",
      permissions: ["all_permissions"],
      created_at: new Date("2024-01-01"),
      status: "active"
    },
    student: {
      wallet_address: "achievo-student.testnet",
      name: "John Student",
      dob: "1995-05-15",
      email: "student@achievo.io",
      type: "individual",
      role: "learner",
      certificates_earned: [],
      rewards_received: [],
      created_at: new Date("2024-01-15"),
      status: "active"
    },
    organization: {
      wallet_address: "achievo-org.testnet",
      name: "Achievo Education Institute",
      contact_info: {
        email: "contact@achievo-edu.org",
        phone: "+1-555-0123",
        website: "https://achievo-edu.org",
        address: "123 Education St, Learning City, LC 12345"
      },
      type: "organization",
      verified: true,
      certificates_issued: [],
      created_at: new Date("2024-01-01"),
      verified_at: new Date("2024-01-02"),
      status: "verified"
    }
  },
  courses: [
    {
      id: 'BLOCKCHAIN_101',
      title: 'Introduction to Blockchain',
      description: 'Learn the fundamentals of blockchain technology',
      category: 'blockchain',
      instructor: 'Achievo Education Institute',
      instructorWallet: 'achievo-org.testnet',
      duration: '8 weeks',
      level: 'Beginner',
      priceNEAR: '5',
      priceUSD: '15',
      skills: ['blockchain', 'cryptocurrency', 'smart_contracts'],
      image: '/vue-js-logo.png'
    },
    {
      id: 'WEB3_DEV',
      title: 'Web3 Development',
      description: 'Build decentralized applications on NEAR Protocol',
      category: 'development',
      instructor: 'Achievo Education Institute',
      instructorWallet: 'achievo-org.testnet',
      duration: '12 weeks',
      level: 'Intermediate',
      priceNEAR: '8',
      priceUSD: '24',
      skills: ['web3', 'smart_contracts', 'dapp_development', 'near_protocol'],
      image: '/ui-ux-design-banner.png'
    },
    {
      id: 'DEFI_BASICS',
      title: 'DeFi Fundamentals',
      description: 'Understanding Decentralized Finance protocols',
      category: 'finance',
      instructor: 'Achievo Education Institute',
      instructorWallet: 'achievo-org.testnet',
      duration: '6 weeks',
      level: 'Beginner',
      priceNEAR: '6',
      priceUSD: '18',
      skills: ['defi', 'liquidity_pools', 'yield_farming', 'tokenomics'],
      image: '/digital-marketing-banner.png'
    }
  ],
  certificates: [
    {
      id: 'CERT_001',
      certificate_id: 'CERT_001',
      title: 'Introduction to Blockchain',
      recipientName: 'John Student',
      recipientWallet: 'achievo-student.testnet',
      issuerName: 'Achievo Education Institute',
      issuerWallet: 'achievo-org.testnet',
      courseId: 'BLOCKCHAIN_101',
      issueDate: '2024-02-15',
      completionDate: '2024-02-15',
      grade: 'A',
      skills: ['blockchain', 'cryptocurrency', 'smart_contracts'],
      ipfs_hash: 'QmSampleHash123456789',
      status: 'active'
    }
  ],
  rewards: [
    {
      id: 'REWARD_001',
      reward_id: 'REWARD_001',
      title: 'Completion Bonus',
      description: 'Completion bonus for Blockchain 101 course',
      learner_wallet: 'achievo-student.testnet',
      certificate_id: 'CERT_001',
      reward_type: 'completion_bonus',
      amount: '10',
      currency: 'NEAR',
      points: 100,
      granted_at: new Date('2024-02-16'),
      status: 'granted'
    }
  ],
  // Meteor Wallet configuration for testnet
  meteorWalletAccounts: [
    {
      wallet_address: "achievo.testnet",
      account_type: "admin",
      display_name: "Achievo Admin"
    },
    {
      wallet_address: "achievo-admin.testnet", 
      account_type: "superuser",
      display_name: "Super Administrator"
    },
    {
      wallet_address: "achievo-student.testnet",
      account_type: "student", 
      display_name: "John Student"
    },
    {
      wallet_address: "achievo-org.testnet",
      account_type: "organization",
      display_name: "Achievo Education Institute"
    }
  ]
}

// Fallback to mock data when API is not available
const createMockApiCall = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data })
    }, 500)
  })
}

export const api = {
  // Auth endpoints
  register: (userData) => apiClient.post('/api/auth/register', userData),
  registerOrganization: (orgData) => apiClient.post('/api/auth/register-org', orgData),
  registerIndividual: (userData) => apiClient.post('/api/auth/register-individual', userData),
  login: (credentials) => apiClient.post('/api/auth/login', credentials),
  loginWithWallet: (walletData) => apiClient.post('/api/auth/wallet-login', walletData),
  logout: () => apiClient.post('/api/auth/logout'),
  refreshToken: () => apiClient.post('/api/auth/refresh'),
  
  // NEAR wallet specific
  verifyWalletConnection: (walletAddress) => apiClient.post('/api/auth/verify-wallet', { wallet_address: walletAddress }),
  getUserByWallet: (walletAddress) => apiClient.get(`/api/auth/user/${walletAddress}`),

  // User profile endpoints
  getProfile: () => apiClient.get('/api/profile'),
  updateProfile: (profileData) => apiClient.put('/api/profile', profileData),

  // Certificate endpoints
  getCertificates: () => apiClient.get('/api/certificates'),
  getCertificate: (id) => apiClient.get(`/api/certificates/${id}`),
  issueCertificate: (certificateData) => apiClient.post('/api/certificates/issue', certificateData),
  updateCertificate: (id, data) => apiClient.put(`/api/certificates/${id}`, data),
  revokeCertificate: (id) => apiClient.delete(`/api/certificates/${id}`),
  validateCertificate: (certificateId) => apiClient.post('/api/validation/certificate', { certificateId }),

  // Course endpoints
  getCourses: () => apiClient.get('/api/courses'),
  getCourse: (id) => apiClient.get(`/api/courses/${id}`),
  createCourse: (courseData) => apiClient.post('/api/courses', courseData),
  updateCourse: (id, data) => apiClient.put(`/api/courses/${id}`, data),
  deleteCourse: (id) => apiClient.delete(`/api/courses/${id}`),

  // Marketplace endpoints
  getMarketplaceCourses: () => apiClient.get('/api/marketplace/courses'),
  purchaseCourse: (courseId, paymentData) => apiClient.post(`/api/marketplace/courses/${courseId}/purchase`, paymentData),

  // Payment endpoints
  processPayment: (paymentData) => apiClient.post('/api/payments/process', paymentData),
  getPaymentStatus: (paymentId) => apiClient.get(`/api/payments/status/${paymentId}`),
  getPaymentHistory: () => apiClient.get('/api/payments/history'),

  // Rewards endpoints
  getRewards: () => apiClient.get('/api/rewards'),
  claimReward: (rewardId) => apiClient.post(`/api/rewards/${rewardId}/claim`),

  // Dashboard endpoints
  getStudentStats: () => apiClient.get('/api/dashboard/student'),
  getOrganizationStats: () => apiClient.get('/api/dashboard/organization'),

  // Organization management
  getStudents: () => apiClient.get('/api/organization/students'),
  getEnrollments: () => apiClient.get('/api/organization/enrollments'),
  approveEnrollment: (enrollmentId) => apiClient.post(`/api/organization/enrollments/${enrollmentId}/approve`),

  // Search and filtering
  searchCourses: (query) => apiClient.get(`/api/search/courses?q=${encodeURIComponent(query)}`),
  filterCourses: (filters) => apiClient.post('/api/search/courses/filter', filters),

  // File upload
  uploadFile: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

// Override API calls with mock data for development
if (process.env.NODE_ENV === 'development') {
  api.getCourses = () => createMockApiCall(mockData.courses)
  api.getCertificates = () => createMockApiCall(mockData.certificates)
  api.getRewards = () => createMockApiCall(mockData.rewards)
  api.processPayment = (paymentData) => createMockApiCall({ success: true, transactionId: 'mock_tx_123' })
  
  // Mock wallet authentication
  api.loginWithWallet = (walletData) => {
    const user = Object.values(mockData.users).find(u => u.wallet_address === walletData.wallet_address)
    if (user) {
      return createMockApiCall({ 
        success: true, 
        user, 
        token: 'mock_wallet_token_' + walletData.wallet_address.replace('.', '_')
      })
    }
    return Promise.reject(new Error('Wallet not found in system'))
  }
  
  api.verifyWalletConnection = (walletAddress) => {
    const user = Object.values(mockData.users).find(u => u.wallet_address === walletAddress)
    return createMockApiCall({ verified: !!user, user })
  }
  
  api.getUserByWallet = (walletAddress) => {
    const user = Object.values(mockData.users).find(u => u.wallet_address === walletAddress)
    if (user) {
      return createMockApiCall(user)
    }
    return Promise.reject(new Error('User not found'))
  }
}

// Export the apiClient for direct access
export { apiClient, mockData }

export default api