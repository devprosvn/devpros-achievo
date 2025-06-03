import axios from 'axios'

const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000'

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

// Mock data for development
const mockData = {
  courses: [
    {
      id: 1,
      title: 'Vue.js Complete Course',
      description: 'Learn Vue.js from beginner to advanced level',
      category: 'programming',
      instructor: 'John Doe',
      duration: '40 hours',
      level: 'Beginner',
      priceNEAR: '5',
      priceUSD: '15',
      image: null
    },
    {
      id: 2,
      title: 'UI/UX Design Fundamentals',
      description: 'Master the basics of user interface and user experience design',
      category: 'design',
      instructor: 'Jane Smith',
      duration: '30 hours',
      level: 'Intermediate',
      priceNEAR: '8',
      priceUSD: '24',
      image: null
    },
    {
      id: 3,
      title: 'Digital Marketing Strategy',
      description: 'Learn effective digital marketing strategies for modern businesses',
      category: 'marketing',
      instructor: 'Mike Johnson',
      duration: '25 hours',
      level: 'Beginner',
      priceNEAR: '6',
      priceUSD: '18',
      image: null
    }
  ],
  certificates: [
    {
      id: 'cert_1',
      title: 'Vue.js Fundamentals',
      recipientName: 'John Student',
      issuerName: 'Tech Academy',
      issueDate: '2024-01-15',
      status: 'verified'
    }
  ],
  rewards: [
    {
      id: 1,
      title: 'Early Bird',
      description: 'Completed first course within 24 hours',
      points: 100
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

// Override API calls with mock data for development
if (process.env.NODE_ENV === 'development') {
  api.getCourses = () => createMockApiCall(mockData.courses)
  api.getCertificates = () => createMockApiCall(mockData.certificates)
  api.getRewards = () => createMockApiCall(mockData.rewards)
  api.processPayment = (paymentData) => createMockApiCall({ success: true, transactionId: 'mock_tx_123' })
}

// Export the apiClient for direct access
export { apiClient }

// Export mock data as well  
export { mockData }

export default api