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
              <button @click="showAddCourse = true" class="btn btn-primary">Add Course</button>
            </div>
            <div class="courses-grid">
              <div v-for="course in courses" :key="course.id" class="course-card">
                <h3>{{ course.title }}</h3>
                <p>{{ course.description }}</p>
                <div class="course-actions">
                  <button @click="editCourse(course)" class="btn btn-secondary" :disabled="false">Edit</button>
                  <button @click="viewStudents(course)" class="btn btn-info" :disabled="false">Students</button>
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
                  <button @click="viewCertificate(certificate)" class="btn btn-info" :disabled="false">View</button>
                  <button @click="revokeCertificate(certificate)" class="btn btn-danger" :disabled="false">Revoke</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add Course Modal -->
    <div v-if="showAddCourse" class="modal-overlay" @click="showAddCourse = false">
      <div class="modal" @click.stop>
        <h3>Add New Course</h3>
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
          <div class="form-actions">
            <button type="button" @click="showAddCourse = false" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">Add Course</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Issue Certificate Modal -->
    <div v-if="showIssueCertificate" class="modal-overlay" @click="showIssueCertificate = false">
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
            <button type="button" @click="showIssueCertificate = false" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">Issue Certificate</button>
          </div>
        </form>
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

const router = useRouter()
const authStore = useAuthStore()
const nearStore = useNearStore()

const courses = ref([])
const certificates = ref([])
const certificatesIssued = ref(0)
const activeStudents = ref(0)
const showAddCourse = ref(false)
const showIssueCertificate = ref(false)

const newCourse = ref({
  title: '',
  description: '',
  price: 0
})

const newCertificate = ref({
  studentEmail: '',
  title: '',
  courseId: ''
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const loadData = async () => {
  try {
    const [coursesResponse, certificatesResponse] = await Promise.all([
      api.getCourses(),
      api.getCertificates()
    ])

    courses.value = coursesResponse.data
    certificates.value = certificatesResponse.data
    certificatesIssued.value = certificates.value.length
    activeStudents.value = new Set(certificates.value.map(c => c.studentEmail)).size
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

const addCourse = async () => {
  try {
    const response = await api.createCourse(newCourse.value)
    console.log('Course created successfully:', response.data)
    showAddCourse.value = false
    newCourse.value = { title: '', description: '', price: 0 }
    await loadData()
    alert('Khóa học đã được tạo thành công!')
  } catch (error) {
    console.error('Failed to add course:', error)
    alert('Có lỗi khi tạo khóa học: ' + error.message)
  }
}

const issueCertificate = async () => {
  try {
    const certificateData = {
      ...newCertificate.value,
      organizationId: authStore.user?.id,
      issuedDate: new Date().toISOString()
    }

    const response = await api.issueCertificate(certificateData)
    console.log('Certificate issued successfully:', response.data)

    // Also issue on NEAR blockchain
    if (nearStore.isConnected) {
      await nearStore.issueCertificate(certificateData)
    }

    showIssueCertificate.value = false
    newCertificate.value = { studentEmail: '', title: '', courseId: '' }
    await loadData()
    alert('Chứng chỉ đã được cấp thành công!')
  } catch (error) {
    console.error('Failed to issue certificate:', error)
    alert('Có lỗi khi cấp chứng chỉ: ' + error.message)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const editCourse = (course) => {
  // Implementation for editing course
  console.log('Edit course:', course)
}

const viewStudents = (course) => {
  // Implementation for viewing students
  console.log('View students for course:', course)
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

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  loadData()
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
</style>