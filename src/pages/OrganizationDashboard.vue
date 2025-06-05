<template>
  <div class="organization-dashboard">
    <header class="dashboard-header">
      <div class="container">
        <h1>Organization Dashboard</h1>
        <div class="user-info">
          <span>Welcome, {{ authStore.user?.name || 'Organization' }}</span>
          <button @click="logout" class="logout-btn">Logout</button>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <div class="container">
        <div class="dashboard-grid">
          <!-- Statistics Cards -->
          <div class="stats-section">
            <div class="stat-card">
              <h3>Total Courses</h3>
              <p class="stat-number">{{ courses.length }}</p>
            </div>
            <div class="stat-card">
              <h3>Certificates Issued</h3>
              <p class="stat-number">{{ certificatesIssued }}</p>
            </div>
            <div class="stat-card">
              <h3>Active Students</h3>
              <p class="stat-number">{{ activeStudents }}</p>
            </div>
          </div>

          <!-- Course Management -->
          <div class="courses-section">
            <div class="section-header">
              <h2>Course Management</h2>
              <div class="header-actions">
                <button @click="seedMockData" class="btn btn-info">Seed Mock Data</button>
                <div class="flex gap-2">
                  <button @click="showAddCourse = true" class="btn btn-primary">Add Course</button>
                  <button @click="loadCourses" class="btn btn-secondary">
                    🔄 Tải lại
                  </button>
                </div>
              </div>
            </div>
            <div class="courses-grid">
              <div v-for="course in courses" :key="course.id" class="course-card">
                <h3>{{ course.title }}</h3>
                <p>{{ course.description }}</p>
                <div class="course-actions">
                  <button @click="editCourse(course)" class="btn btn-secondary" :disabled="isLoading">Edit</button>
                  <button @click="viewStudents(course)" class="btn btn-info" :disabled="isLoading">Students</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Certificate Management -->
          <div class="certificates-section">
            <div class="section-header">
              <h2>Certificate Management</h2>
              <button @click="showIssueCertificate = true" class="btn btn-primary">Issue Certificate</button>
            </div>
            <div class="certificates-list">
              <div v-for="certificate in certificates" :key="certificate.id" class="certificate-item">
                <div class="certificate-info">
                  <h4>{{ certificate.title }}</h4>
                  <p>Student: {{ certificate.studentName }}</p>
                  <p>Issued: {{ formatDate(certificate.issuedDate) }}</p>
                </div>
                <div class="certificate-actions">
                  <button @click="viewCertificate(certificate)" class="btn btn-info" :disabled="isLoading">View</button>
                  <button @click="revokeCertificate(certificate)" class="btn btn-danger" :disabled="isLoading">Revoke</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add Course Modal -->
    <div v-if="showAddCourse" class="modal-overlay" @click="closeModal('course')">
      <div class="modal" @click.stop>
        <h3>{{ editingCourseId ? 'Edit Course' : 'Add New Course' }}</h3>
        <form @submit.prevent="addCourse">
          <div class="form-group">
            <label>Course Title</label>
            <input v-model="newCourse.title" type="text" required>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newCourse.description" required></textarea>
          </div>
          <div class="form-group">
            <label>Price (NEAR)</label>
            <input v-model="newCourse.price" type="number" step="0.01" required>
          </div>
          <div class="form-group">
            <label>Category</label>
            <select v-model="newCourse.category" required>
              <option value="general">General</option>
              <option value="blockchain">Blockchain</option>
              <option value="development">Web Development</option>
              <option value="finance">Finance</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
          <div class="form-group">
            <label>Instructor</label>
            <input v-model="newCourse.instructor" type="text" placeholder="Enter instructor name">
          </div>
          <div class="form-group">
            <label>Duration</label>
            <select v-model="newCourse.duration">
              <option value="2 weeks">2 weeks</option>
              <option value="4 weeks">4 weeks</option>
              <option value="6 weeks">6 weeks</option>
              <option value="8 weeks">8 weeks</option>
              <option value="12 weeks">12 weeks</option>
            </select>
          </div>
          <div class="form-group">
            <label>Level</label>
            <select v-model="newCourse.level">
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" @click="cancelCourseEdit" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              {{ isLoading ? 'Đang xử lý...' : (editingCourseId ? 'Update Course' : 'Add Course') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Issue Certificate Modal -->
    <div v-if="showIssueCertificate" class="modal-overlay" @click="closeModal('certificate')">
      <div class="modal" @click.stop>
        <h3>Issue Certificate</h3>
        <form @submit.prevent="issueCertificate">
          <div class="form-group">
            <label>Student Email</label>
            <input v-model="newCertificate.studentEmail" type="email" required>
          </div>
          <div class="form-group">
            <label>Certificate Title</label>
            <input v-model="newCertificate.title" type="text" required>
          </div>
          <div class="form-group">
            <label>Course</label>
            <select v-model="newCertificate.courseId" required>
              <option value="">Select Course</option>
              <option v-for="course in courses" :key="course.id" :value="course.id">
                {{ course.title }}
              </option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" @click="closeModal('certificate')" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              {{ isLoading ? 'Đang xử lý...' : 'Issue Certificate' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Students List Modal -->
    <div v-if="showStudentsList" class="modal-overlay" @click="closeModal('students')">
      <div class="modal large-modal" @click.stop>
        <h3>Students in {{ selectedCourse?.title }}</h3>
        <div v-if="courseStudents.length === 0" class="no-students">
          <p>Chưa có học viên nào trong khóa học này.</p>
        </div>
        <div v-else class="students-table">
          <table>
            <thead>
              <tr>
                <th>Tên học viên</th>
                <th>Email</th>
                <th>Ngày hoàn thành</th>
                <th>Trạng thái</th>
                <th>Chứng chỉ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in courseStudents" :key="student.certificateId">
                <td>{{ student.name }}</td>
                <td>{{ student.email }}</td>
                <td>{{ formatDate(student.issueDate) }}</td>
                <td>
                  <span class="badge" :class="'badge-' + (student.status === 'completed' ? 'success' : 'warning')">
                    {{ student.status === 'completed' ? 'Hoàn thành' : 'Đang học' }}
                  </span>
                </td>
                <td>
                  <button @click="viewCertificateFromStudent(student.certificateId)" class="btn btn-info btn-sm">
                    Xem chứng chỉ
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="form-actions">
          <button @click="closeModal('students')" class="btn btn-secondary">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNearStore } from '../stores/near'
import { api } from '../services/api'
import firebaseService from '../services/firebase'

const router = useRouter()
const authStore = useAuthStore()
const nearStore = useNearStore()

const courses = ref([])
const certificates = ref([])
const certificatesIssued = ref(0)
const activeStudents = ref(0)
const showAddCourse = ref(false)
const showIssueCertificate = ref(false)
const isLoading = ref(false)

const newCourse = ref({
  title: '',
  description: '',
  price: 0,
  category: 'general',
  instructor: '',
  duration: '4 weeks',
  level: 'Beginner',
  image: '/vue-js-logo.png',
  skills: []
})

const newCertificate = ref({
  studentEmail: '',
  title: '',
  courseId: ''
})

const editingCourseId = ref(null)
const showStudentsList = ref(false)
const selectedCourse = ref(null)
const courseStudents = ref([])

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const loadData = async () => {
  try {
    console.log('Loading dashboard data...')

    const [coursesResponse, certificatesResponse] = await Promise.all([
      api.getCourses(),
      api.getCertificates()
    ])

    console.log('Courses loaded:', coursesResponse.data)
    console.log('Certificates loaded:', certificatesResponse.data)

    courses.value = coursesResponse.data || []
    certificates.value = certificatesResponse.data || []
    certificatesIssued.value = certificates.value.length
    activeStudents.value = new Set(certificates.value.map(c => c.studentEmail)).size

    console.log('Dashboard data loaded successfully')
  } catch (error) {
    console.error('Failed to load data:', error)
    alert(`Lỗi khi tải dữ liệu: ${error.message}`)
    // Set default values in case of error
    courses.value = []
    certificates.value = []
    certificatesIssued.value = 0
    activeStudents.value = 0
  }
}

const addCourse = async () => {
  if (isLoading.value) return

  try {
    isLoading.value = true

    // Validate required fields first
    if (!newCourse.value.title?.trim()) {
      alert('Vui lòng nhập tiêu đề khóa học')
      return
    }
    if (!newCourse.value.description?.trim()) {
      alert('Vui lòng nhập mô tả khóa học')
      return
    }
    if (!newCourse.value.price || newCourse.value.price <= 0) {
      alert('Vui lòng nhập giá khóa học hợp lệ')
      return
    }

    // Ensure all required fields have valid values
    const courseData = {
      title: newCourse.value.title.trim(),
      description: newCourse.value.description.trim(),
      price: parseFloat(newCourse.value.price),
      category: newCourse.value.category || 'general',
      instructor: newCourse.value.instructor || authStore.user?.name || 'Organization',
      duration: newCourse.value.duration || '4 weeks',
      level: newCourse.value.level || 'Beginner',
      image: newCourse.value.image || '/vue-js-logo.png',
      skills: Array.isArray(newCourse.value.skills) ? newCourse.value.skills : ['learning'],
      organization_wallet: authStore.user?.wallet_address || 'bernieio.testnet'
    }

    let response

    if (editingCourseId.value) {
      // Update existing course
      response = await api.updateCourse(editingCourseId.value, courseData)
      console.log('Course updated successfully:', response.data)
      alert('Khóa học đã được cập nhật thành công!')
    } else {
      // Create new course
      console.log("🔵 Gửi dữ liệu khóa học:", courseData)
      response = await api.createCourse(courseData)
      console.log("🟢 Tạo khóa học thành công:", response)

      if (!response.data) {
        throw new Error('Không nhận được dữ liệu khóa học từ server')
      }

      alert('Khóa học đã được tạo thành công!')
    }

    // Reset form and close modal immediately
    resetCourseForm()
    
    // Reload data to reflect changes
    await loadData()

  } catch (error) {
    console.error('Failed to save course:', error)
    alert('Có lỗi khi lưu khóa học: ' + error.message)
  } finally {
    isLoading.value = false
  }
}

const issueCertificate = async () => {
  if (isLoading.value) return

  try {
    isLoading.value = true

    // Validate required fields first
    if (!newCertificate.value.studentEmail?.trim()) {
      alert('Vui lòng nhập email học viên')
      return
    }
    if (!newCertificate.value.title?.trim()) {
      alert('Vui lòng nhập tiêu đề chứng chỉ')
      return
    }
    if (!newCertificate.value.courseId) {
      alert('Vui lòng chọn khóa học')
      return
    }

    // Ensure all required fields have valid values
    const certificateData = {
      studentEmail: newCertificate.value.studentEmail.trim(),
      title: newCertificate.value.title.trim(),
      courseId: newCertificate.value.courseId,
      organizationId: authStore.user?.id || 'org_001',
      issuedDate: new Date().toISOString(),
      issuerWallet: authStore.user?.wallet_address || 'bernieio.testnet',
      issuerName: authStore.user?.name || 'Organization'
    }

    const response = await api.issueCertificate(certificateData)
    console.log('Certificate issued successfully:', response.data)

    // Also issue on NEAR blockchain
    if (nearStore.isConnected) {
      try {
        await nearStore.issueCertificate(certificateData)
      } catch (nearError) {
        console.warn('NEAR blockchain issue failed:', nearError)
      }
    }

    alert('Chứng chỉ đã được cấp thành công!')

    // Reset form and close modal immediately
    resetCertificateForm()
    
    // Reload dashboard data
    await loadData()

  } catch (error) {
    console.error('Failed to issue certificate:', error)
    alert('Có lỗi khi cấp chứng chỉ: ' + error.message)
  } finally {
    isLoading.value = false
  }
}

const resetCertificateForm = () => {
  newCertificate.value = { studentEmail: '', title: '', courseId: '' }
  showIssueCertificate.value = false
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const editCourse = (course) => {
  // Set the course data to edit
  newCourse.value = {
    title: course.title,
    description: course.description,
    price: parseFloat(course.priceNEAR),
    category: course.category || 'general',
    instructor: course.instructor || '',
    duration: course.duration || '4 weeks',
    level: course.level || 'Beginner',
    image: course.image || '/vue-js-logo.png',
    skills: course.skills || []
  }
  editingCourseId.value = course.id
  showAddCourse.value = true
}

const viewStudents = (course) => {
  // Show students enrolled in this course
  selectedCourse.value = course
  loadCourseStudents(course)
  showStudentsList.value = true
}

const viewCertificate = (certificate) => {
  // Show certificate details in an alert for now (can be improved with a modal later)
  const details = `
Certificate Details:
- ID: ${certificate.id}
- Title: ${certificate.title}
- Student: ${certificate.recipientName || certificate.studentName}
- Course ID: ${certificate.courseId}
- Issue Date: ${formatDate(certificate.issueDate || certificate.issuedDate)}
- Status: ${certificate.status}
- Blockchain Hash: ${certificate.blockchainHash || 'N/A'}
  `
  alert(details)
}

const revokeCertificate = async (certificate) => {
  if (confirm('Are you sure you want to revoke this certificate?')) {
    try {
      await api.revokeCertificate(certificate.id)
      loadData()
    } catch (error) {
      console.error('Failed to revoke certificate:', error)
    }
  }
}

const loadCourseStudents = async (course) => {
  try {
    // Get students who have certificates for this course from Firebase
    const courseCertificates = await firebaseService.getCertificatesByCourse(course.id)
    const studentsInCourse = courseCertificates.map(cert => ({
      name: cert.recipientName || cert.studentName || cert.studentEmail,
      email: cert.studentEmail || cert.recipientName,
      certificateId: cert.id,
      issueDate: cert.issueDate || cert.issuedDate,
      status: cert.status || 'completed'
    }))

    courseStudents.value = studentsInCourse
  } catch (error) {
    console.error('Failed to load course students:', error)
    // Fallback to local certificates
    const studentsInCourse = certificates.value
      .filter(cert => cert.courseId === course.id)
      .map(cert => ({
        name: cert.recipientName || cert.studentName || cert.studentEmail,
        email: cert.studentEmail || cert.recipientName,
        certificateId: cert.id,
        issueDate: cert.issueDate || cert.issuedDate,
        status: cert.status || 'completed'
      }))

    courseStudents.value = studentsInCourse
  }
}

const resetCourseForm = () => {
  newCourse.value = {
    title: '',
    description: '',
    price: 0,
    category: 'general',
    instructor: '',
    duration: '4 weeks',
    level: 'Beginner',
    image: '/vue-js-logo.png',
    skills: []
  }
  editingCourseId.value = null
  showAddCourse.value = false
}

const cancelCourseEdit = () => {
  resetCourseForm()
}

// Close modals when clicking outside
const closeModal = (modalName) => {
  if (modalName === 'course') {
    resetCourseForm()
  } else if (modalName === 'certificate') {
    resetCertificateForm()
  } else if (modalName === 'students') {
    showStudentsList.value = false
    selectedCourse.value = null
    courseStudents.value = []
  }
}

const viewCertificateFromStudent = (certificateId) => {
  const certificate = certificates.value.find(cert => cert.id === certificateId)
  if (certificate) {
    viewCertificate(certificate)
  }
}

const connectMeteorWallet = async () => {
  try {
    await nearStore.connectWallet('meteor')
    if (nearStore.isConnected) {
      console.log('Meteor Wallet connected:', nearStore.accountId)
      // Auto login with wallet
      const userType = authStore.getUserTypeFromWallet(nearStore.accountId)
      authStore.userType = userType
    }
  } catch (error) {
    console.error('Failed to connect Meteor Wallet:', error)
    alert('Kết nối Meteor Wallet thất bại: ' + error.message)
  }
}
const loadCourses = async () => {
      try {
        console.log("📚 Đang tải danh sách khóa học...")
        const response = await api.getCourses()
        courses.value = response.data || []
        console.log("✅ Đã tải được", courses.value.length, "khóa học")
      } catch (error) {
        console.error('❌ Lỗi khi tải khóa học:', error)
        courses.value = []
      }
    }

// Function to seed mock data (replace with actual implementation)
const seedMockData = async () => {
  try {
    // Mock data for courses
    const mockCourses = [
      { title: 'NEAR 101', description: 'Introduction to NEAR Blockchain', price: 1.5 },
      { title: 'Rust for NEAR', description: 'Smart contract development using Rust', price: 2.0 },
      { title: 'Web3 Development', description: 'Building decentralized applications', price: 2.5 }
    ]

    // Mock data for certificates
    const mockCertificates = [
      { studentEmail: 'student1@example.com', title: 'NEAR 101 Certificate', courseId: '1' },
      { studentEmail: 'student2@example.com', title: 'Rust for NEAR Certificate', courseId: '2' }
    ]

    // Seed courses
    for (const course of mockCourses) {
      await api.createCourse(course)
      console.log('Mock course created:', course.title)
    }

    // Seed certificates
    for (const certificate of mockCertificates) {
      const certificateData = {
        ...certificate,
        organizationId: authStore.user?.id,
        issuedDate: new Date().toISOString()
      }
      await api.issueCertificate(certificateData)
      console.log('Mock certificate issued:', certificate.title)

      // Also issue on NEAR blockchain
      if (nearStore.isConnected) {
        await nearStore.issueCertificate(certificateData)
      }
    }

    await loadData() // Reload data to reflect changes
    alert('Mock data seeded successfully!')
  } catch (error) {
    console.error('Failed to seed mock data:', error)
    alert('Failed to seed mock data: ' + error.message)
  }
}

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  // Always reload data when component mounts to ensure fresh data
  await loadData()
})
</script>

<style scoped>
.organization-dashboard {
  min-height: 100vh;
  background-color: #f8fafc;
}

.dashboard-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.dashboard-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.dashboard-main {
  padding: 2rem 0;
}

.dashboard-grid {
  display: grid;
  gap: 2rem;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #3b82f6;
  margin: 0.5rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.courses-section, .certificates-section {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.course-card {
  border: 1px solid #e2e8f0;
  padding: 1rem;
  border-radius: 0.375rem;
}

.course-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.certificates-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.certificate-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.certificate-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-info {
  background: #06b6d4;
  color: white;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.large-modal {
  width: 90%;
  max-width: 800px;
}

.students-table {
  max-height: 400px;
  overflow-y: auto;
}

.students-table table {
  width: 100%;
  border-collapse: collapse;
}

.students-table th,
.students-table td {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  text-align: left;
}

.students-table th {
  background: #f8fafc;
  font-weight: 600;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.no-students {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-success {
  background: #d1fae5;
  color: #065f46;
}

.badge-warning {
  background: #fef3c7;
  color: #92400e;
}
</style>