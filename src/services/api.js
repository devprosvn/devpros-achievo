
import axios from 'axios'

const API_BASE_URL = 'https://achievo-backend-5gw4.onrender.com'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// API methods
export const api = {
  // Auth endpoints
  login: (credentials) => apiClient.post('/api/auth/login', credentials),
  register: (userData) => apiClient.post('/api/auth/register', userData),
  registerOrg: (orgData) => apiClient.post('/api/auth/register-org', orgData),

  // Certificate endpoints
  getCertificates: () => apiClient.get('/api/certificates'),
  validateCertificate: (certificateId) => apiClient.post('/api/validation/certificate', { certificateId }),
  issueCertificate: (certificateData) => apiClient.post('/api/certificates/issue', certificateData),

  // Rewards endpoints
  getRewards: () => apiClient.get('/api/rewards'),

  // Course endpoints
  getCourses: () => apiClient.get('/api/courses'),

  // Payment endpoints
  processPayment: (paymentData) => apiClient.post('/api/payments/process', paymentData),
  getPaymentStatus: (paymentId) => apiClient.get(`/api/payments/status/${paymentId}`),
}
