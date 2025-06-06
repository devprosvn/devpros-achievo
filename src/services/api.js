import axios from 'axios'
import PinataService from './pinata'
import firebaseService from './firebase'

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
    console.error('API Error:', error)
    
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    
    // Handle network connection errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || !error.response) {
      console.error('Network connection failed. Is the server running?')
      error.message = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.'
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
      organization_wallet: 'bernieio.testnet'
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
      organization_wallet: 'bernieio.testnet'
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
      organization_wallet: 'bernieio.testnet'
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
  validateCertificate: (certificateId) => {
    // Tìm certificate trong mock data
    const certificate = mockData.certificates.find(cert => 
      cert.id === certificateId || 
      cert.certificate_id === certificateId ||
      cert.blockchainHash === certificateId
    )

    if (certificate) {
      return createMockApiCall({
        isValid: certificate.status !== 'revoked',
        certificate: {
          id: certificate.id,
          title: certificate.title,
          recipientName: certificate.recipientName,
          issuerName: certificate.issuerName,
          issueDate: certificate.issueDate,
          status: certificate.status || 'verified',
          blockchainHash: certificate.blockchainHash
        }
      })
    } else {
      return createMockApiCall({
        isValid: false,
        message: 'Certificate not found'
      })
    }
  },

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

  // Download certificate
  downloadCertificate: async (certificate) => {
    try {
      if (certificate.fileUrl) {
        // Download from IPFS
        const response = await fetch(certificate.fileUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `certificate_${certificate.id}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        return { success: true }
      } else {
        // Generate and download PDF
        const blob = PinataService.generateCertificatePDF(certificate)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `certificate_${certificate.id}.txt`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        return { success: true }
      }
    } catch (error) {
      console.error('Download failed:', error)
      return { success: false, error: error.message }
    }
  },

  // Share certificate
  shareCertificate: (certificate) => {
    const shareUrl = certificate.ipfsUrl || `${window.location.origin}/certificate-validation?id=${certificate.id}`
    const shareText = `Check out my certificate: ${certificate.title} - Issued by ${certificate.issuerName}`

    if (navigator.share) {
      return navigator.share({
        title: `Certificate: ${certificate.title}`,
        text: shareText,
        url: shareUrl
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText} - ${shareUrl}`)
      return Promise.resolve()
    }
  },

  // Mint certificate to IPFS
  mintCertificateToIPFS: (certificate) => {
    return PinataService.mintCertificateToIPFS(certificate)
  },
}

// Health check function
const checkServerHealth = async () => {
  try {
    const response = await apiClient.get('/api/health')
    console.log('Server health check:', response.data)
    return true
  } catch (error) {
    console.error('Server health check failed:', error)
    return false
  }
}

// Backend API-based get courses
api.getCourses = async () => {
  try {
    console.log('API: Getting courses from backend API...')
    
    // Check server health first
    const isHealthy = await checkServerHealth()
    if (!isHealthy) {
      throw new Error('Server không phản hồi. Vui lòng thử lại sau.')
    }
    
    const response = await apiClient.get('/api/courses')
    console.log('API: Courses retrieved from backend:', response.data)
    return response.data
  } catch (error) {
    console.error('Failed to get courses from backend:', error)
    
    // Handle backend API error responses
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    
    // Provide more specific error messages for network issues
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Server chưa sẵn sàng. Vui lòng đợi server khởi động.')
    }
    
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.')
    }
    
    throw new Error(`Không thể tải khóa học từ backend: ${error.message}`)
  }
}
// Firebase-backed get certificates
api.getCertificates = async () => {
  try {
    const certificates = await firebaseService.getCertificates()
    return { data: certificates }
  } catch (error) {
    console.error('Failed to get certificates:', error)
    // Fallback to mock data if Firebase fails
    return createMockApiCall(mockData.certificates)
  }
}
api.getRewards = () => createMockApiCall(mockData.rewards)
api.processPayment = (paymentData) => createMockApiCall({ success: true, transactionId: 'mock_tx_123' })

// Backend API-based course operations
api.createCourse = async (courseData) => {
  try {
    console.log('API: Creating course via backend API with data:', courseData)
    
    // Basic client-side validation
    if (!courseData.title?.trim()) {
      throw new Error('Tiêu đề khóa học là bắt buộc')
    }
    if (!courseData.description?.trim()) {
      throw new Error('Mô tả khóa học là bắt buộc')
    }
    if (!courseData.price || courseData.price <= 0) {
      throw new Error('Giá khóa học phải lớn hơn 0')
    }
    
    // Call backend API instead of Firebase directly
    const response = await apiClient.post('/api/courses', courseData)
    
    console.log('API: Course created successfully via backend:', response.data)
    return response.data
  } catch (error) {
    console.error('API: Failed to create course via backend:', error)
    
    // Handle backend API error responses
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    
    // Provide more specific error messages for network issues
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.')
    }
    
    throw error
  }
}

// Backend API-based update course
api.updateCourse = async (courseId, courseData) => {
  try {
    console.log('API: Updating course via backend API with data:', courseData)
    
    // Validate required fields
    if (!courseId) {
      throw new Error('Course ID is required for update')
    }
    
    // Ensure we have some data to update
    if (!courseData || Object.keys(courseData).length === 0) {
      throw new Error('No course data provided for update')
    }
    
    // Call backend API instead of Firebase directly
    const response = await apiClient.put(`/api/courses/${courseId}`, courseData)
    
    console.log('API: Course updated successfully via backend:', response.data)
    return response.data
  } catch (error) {
    console.error('API: Failed to update course via backend:', error)
    
    // Handle backend API error responses
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    
    // Provide more specific error messages for network issues
    if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
      throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.')
    }
    
    throw error
  }
}

// Firebase-backed issue certificate with IPFS minting
api.issueCertificate = async (certificateData) => {
  try {
    console.log('API: Issuing certificate with data:', certificateData)
    
    // Try to mint to IPFS first
    let ipfsData = {}
    try {
      const ipfsResult = await PinataService.mintCertificateToIPFS(certificateData)
      if (ipfsResult.success) {
        ipfsData = {
          ipfsHash: ipfsResult.metadataHash,
          ipfsUrl: ipfsResult.metadataUrl,
          fileHash: ipfsResult.fileHash,
          fileUrl: ipfsResult.fileUrl,
          blockchainHash: ipfsResult.metadataHash
        }
      }
    } catch (ipfsError) {
      console.warn('IPFS minting failed:', ipfsError)
    }
    
    // Combine original data with IPFS data
    const fullCertificateData = {
      ...certificateData,
      ...ipfsData
    }
    
    // Let Firebase service handle all the data cleaning and validation
    const result = await firebaseService.createCertificate(fullCertificateData)
    
    console.log('API: Certificate issued successfully:', result)
    return { data: result }
  } catch (error) {
    console.error('API: Failed to issue certificate:', error)
    throw error
  }
}

// Firebase revoke certificate  
api.revokeCertificate = async (id) => {
  try {
    await firebaseService.deleteCertificate(id)
    return { data: { success: true } }
  } catch (error) {
    console.error('Failed to revoke certificate:', error)
    throw error
  }

  // NFT Certificate operations
  api.mintNFTCertificate = async (nftData) => {
    try {
      const newNFT = {
        token_id: `nft_cert_${Date.now()}`,
        owner_id: nftData.receiverId,
        certificate_id: nftData.certificateId,
        metadata: {
          title: nftData.title || 'Achievement Certificate',
          description: nftData.description || 'Digital certificate of achievement',
          media: nftData.mediaUrl,
          media_hash: nftData.mediaHash,
          issued_at: new Date().toISOString(),
          extra: nftData.certificateId ? `certificate_id:${nftData.certificateId}` : undefined
        },
        issuer_id: nftData.issuerId,
        blockchain_hash: nftData.blockchainHash
      }

      // Save to Firebase
      const result = await firebaseService.createNFTCertificate(newNFT)
      return { data: result }
    } catch (error) {
      console.error('Failed to mint NFT certificate:', error)
      throw error
    }
  }

  api.getNFTCertificates = async () => {
    try {
      const nftCertificates = await firebaseService.getNFTCertificates()
      return { data: nftCertificates }
    } catch (error) {
      console.error('Failed to get NFT certificates:', error)
      throw error
    }
  }

  api.getNFTCertificatesByOwner = async (walletAddress) => {
    try {
      const nftCertificates = await firebaseService.getNFTCertificatesByOwner(walletAddress)
      return { data: nftCertificates }
    } catch (error) {
      console.error('Failed to get NFT certificates by owner:', error)
      throw error
    }
  }

  // Role management operations
  api.getUserRole = async (walletAddress) => {
    try {
      const role = await firebaseService.getUserRole(walletAddress)
      return { data: role }
    } catch (error) {
      console.error('Failed to get user role:', error)
      throw error
    }
  }

  api.assignRole = async (roleData) => {
    try {
      const result = await firebaseService.createUserRole(roleData)
      return { data: result }
    } catch (error) {
      console.error('Failed to assign role:', error)
      throw error
    }
  }

  api.updateRole = async (roleId, roleData) => {
    try {
      const result = await firebaseService.updateUserRole(roleId, roleData)
      return { data: result }
    } catch (error) {
      console.error('Failed to update role:', error)
      throw error
    }
  }

  api.getAllUserRoles = async () => {
    try {
      const roles = await firebaseService.getAllUserRoles()
      return { data: roles }
    } catch (error) {
      console.error('Failed to get all user roles:', error)
      throw error
    }
  }
}

// Export the apiClient for direct access
export { apiClient, mockData }

export default api