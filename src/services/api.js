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

// Mock data for development with NEAR testnet accounts
const mockData = {
  // Sample accounts for testing
  accounts: {
    admin: {
      wallet_address: "achievo.testnet",
      name: "Achievo Admin",
      email: "admin@achievo.io",
      role: "admin",
      type: "admin"
    },
    superuser: {
      wallet_address: "achievo-admin.testnet",
      name: "Super Administrator", 
      email: "superuser@achievo.io",
      role: "superuser",
      type: "superuser"
    },
    student: {
      wallet_address: "achievo-student.testnet",
      name: "John Student",
      email: "student@achievo.io",
      type: "individual",
      role: "learner"
    },
    organization: {
      wallet_address: "achievo-org.testnet",
      name: "Achievo Education Institute",
      email: "contact@achievo-edu.org",
      type: "organization",
      verified: true
    }
  },
  
  courses: [
    {
      id: 'BLOCKCHAIN_101',
      title: 'Introduction to Blockchain',
      description: 'Learn the fundamentals of blockchain technology',
      category: 'blockchain',
      instructor: 'Achievo Education Institute',
      duration: '8 weeks',
      level: 'Beginner',
      priceNEAR: '5',
      priceUSD: '15',
      image: '/vue-js-logo.png',
      skills: ['blockchain', 'cryptocurrency', 'smart_contracts'],
      organization_wallet: 'achievo-org.testnet'
    },
    {
      id: 'WEB3_DEV',
      title: 'Web3 Development',
      description: 'Build decentralized applications on NEAR Protocol',
      category: 'development',
      instructor: 'Achievo Education Institute',
      duration: '12 weeks',
      level: 'Intermediate',
      priceNEAR: '10',
      priceUSD: '30',
      image: '/ui-ux-design-banner.png',
      skills: ['web3', 'smart_contracts', 'dapp_development', 'near_protocol'],
      organization_wallet: 'achievo-org.testnet'
    },
    {
      id: 'DEFI_BASICS',
      title: 'DeFi Fundamentals',
      description: 'Understanding Decentralized Finance protocols',
      category: 'finance',
      instructor: 'Achievo Education Institute',
      duration: '6 weeks',
      level: 'Beginner',
      priceNEAR: '7',
      priceUSD: '21',
      image: '/digital-marketing-banner.png',
      skills: ['defi', 'liquidity_pools', 'yield_farming', 'tokenomics'],
      organization_wallet: 'achievo-org.testnet'
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
      status: 'verified',
      blockchainHash: 'QmSampleHash123456789'
    }
  ],
  
  rewards: [
    {
      id: 'REWARD_001',
      reward_id: 'REWARD_001',
      title: 'Completion Bonus',
      description: 'Completion bonus for Blockchain 101 course',
      recipientWallet: 'achievo-student.testnet',
      certificateId: 'CERT_001',
      rewardType: 'completion_bonus',
      amount: '10',
      currency: 'NEAR',
      grantedAt: '2024-02-16',
      status: 'granted'
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
  login: (credentials) => apiClient.post('/api/auth/login', credentials),
  logout: () => apiClient.post('/api/auth/logout'),
  refreshToken: () => apiClient.post('/api/auth/refresh'),

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

// Always use mock data until real backend is available
// Remove the environment check to use mock data in both development and production
api.getCourses = () => createMockApiCall(mockData.courses)
api.getCertificates = () => createMockApiCall(mockData.certificates)
api.getRewards = () => createMockApiCall(mockData.rewards)
api.processPayment = (paymentData) => createMockApiCall({ success: true, transactionId: 'mock_tx_123' })

// Mock create course
api.createCourse = (courseData) => {
  const newCourse = {
    id: `COURSE_${Date.now()}`,
    title: courseData.title,
    description: courseData.description,
    category: 'general',
    instructor: 'Organization',
    duration: '4 weeks',
    level: 'Beginner',
    priceNEAR: courseData.price.toString(),
    priceUSD: (courseData.price * 3).toString(),
    image: '/vue-js-logo.png',
    skills: ['learning'],
    organization_wallet: 'achievo-org.testnet'
  }
  mockData.courses.push(newCourse)
  return createMockApiCall(newCourse)
}

// Mock issue certificate
api.issueCertificate = (certificateData) => {
  const newCertificate = {
    id: `CERT_${Date.now()}`,
    certificate_id: `CERT_${Date.now()}`,
    title: certificateData.title,
    recipientName: certificateData.studentEmail,
    recipientWallet: 'student.testnet',
    issuerName: 'Organization',
    issuerWallet: 'achievo-org.testnet',
    courseId: certificateData.courseId,
    issueDate: certificateData.issuedDate || new Date().toISOString(),
    completionDate: new Date().toISOString(),
    grade: 'A',
    skills: ['learning'],
    status: 'verified',
    blockchainHash: `QmHash${Date.now()}`
  }
  mockData.certificates.push(newCertificate)
  return createMockApiCall(newCertificate)
}

// Mock revoke certificate  
api.revokeCertificate = (id) => {
  const index = mockData.certificates.findIndex(cert => cert.id === id)
  if (index > -1) {
    mockData.certificates.splice(index, 1)
  }
  return createMockApiCall({ success: true })
}

// Export the apiClient for direct access
export { apiClient, mockData }

export default api