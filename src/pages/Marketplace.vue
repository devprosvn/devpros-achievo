
<template>
  <div class="marketplace">
    <header class="marketplace-header">
      <div class="container">
        <h1>Course Marketplace</h1>
        <p>Discover and purchase courses and certificates</p>
        
        <div class="search-filters">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search courses..."
            class="search-input"
          />
          <select v-model="selectedCategory" class="filter-select">
            <option value="">All Categories</option>
            <option value="programming">Programming</option>
            <option value="design">Design</option>
            <option value="business">Business</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>
      </div>
    </header>

    <main class="marketplace-content">
      <div class="container">
        <div class="courses-grid">
          <div v-for="course in filteredCourses" :key="course.id" class="course-card">
            <div class="course-image">
              <img :src="course.image || '/placeholder-course.jpg'" :alt="course.title" />
            </div>
            <div class="course-info">
              <div class="course-category">{{ course.category }}</div>
              <h3 class="course-title">{{ course.title }}</h3>
              <p class="course-description">{{ course.description }}</p>
              <div class="course-instructor">
                <span>By {{ course.instructor }}</span>
              </div>
              <div class="course-meta">
                <span class="course-duration">{{ course.duration }}</span>
                <span class="course-level">{{ course.level }}</span>
              </div>
              <div class="course-footer">
                <div class="course-price">
                  <span class="price-near">{{ course.priceNEAR }} NEAR</span>
                  <span class="price-usd">(~${{ course.priceUSD }})</span>
                </div>
                <button @click="purchaseCourse(course)" class="btn btn-primary">
                  Buy Course
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredCourses.length === 0" class="empty-state">
          <h3>No courses found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      </div>
    </main>

    <!-- Purchase Modal -->
    <div v-if="showPurchaseModal" class="modal-overlay" @click="closePurchaseModal">
      <div class="modal-content" @click.stop>
        <h2>Purchase Course</h2>
        <div class="course-summary">
          <h3>{{ selectedCourse?.title }}</h3>
          <p>Price: {{ selectedCourse?.priceNEAR }} NEAR</p>
        </div>
        
        <div class="payment-options">
          <h4>Choose Payment Method</h4>
          <div class="wallet-options">
            <button @click="payWithWallet('near')" class="wallet-btn">
              Pay with NEAR Wallet
            </button>
            <button @click="payWithWallet('meteor')" class="wallet-btn">
              Pay with Meteor Wallet
            </button>
            <button @click="payWithWallet('mynear')" class="wallet-btn">
              Pay with MyNearWallet
            </button>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="closePurchaseModal" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNearStore } from '../stores/near'
import { api } from '../services/api'

const nearStore = useNearStore()

const courses = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')
const showPurchaseModal = ref(false)
const selectedCourse = ref(null)
const loading = ref(false)

const filteredCourses = computed(() => {
  let filtered = courses.value

  if (searchQuery.value) {
    filtered = filtered.filter(course =>
      course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(course => course.category === selectedCategory.value)
  }

  return filtered
})

onMounted(async () => {
  await loadCourses()
  await nearStore.initNear()
})

const loadCourses = async () => {
  try {
    const response = await api.getCourses()
    courses.value = response.data || []
  } catch (error) {
    console.error('Failed to load courses:', error)
    // Mock data for demo
    courses.value = [
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
    ]
  }
}

const purchaseCourse = (course) => {
  selectedCourse.value = course
  showPurchaseModal.value = true
}

const closePurchaseModal = () => {
  showPurchaseModal.value = false
  selectedCourse.value = null
}

const payWithWallet = async (walletType) => {
  if (!nearStore.isConnected) {
    try {
      await nearStore.connectWallet(walletType)
    } catch (error) {
      alert('Failed to connect wallet: ' + error.message)
      return
    }
  }

  try {
    loading.value = true
    
    // Process payment through backend
    const paymentData = {
      courseId: selectedCourse.value.id,
      amount: selectedCourse.value.priceNEAR,
      currency: 'NEAR',
      walletType: walletType
    }

    const response = await api.processPayment(paymentData)
    
    if (response.data.success) {
      alert('Payment successful! You now have access to the course.')
      closePurchaseModal()
    } else {
      alert('Payment failed: ' + response.data.message)
    }
  } catch (error) {
    alert('Payment failed: ' + error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.marketplace {
  min-height: 100vh;
  background: #f8f9fa;
}

.marketplace-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.marketplace-header h1 {
  font-size: 3rem;
  margin-bottom: 10px;
  text-align: center;
}

.marketplace-header p {
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 40px;
  opacity: 0.9;
}

.search-filters {
  display: flex;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.search-input,
.filter-select {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.marketplace-content {
  padding: 60px 0;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

.course-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.course-image {
  height: 200px;
  background: #e9ecef;
  overflow: hidden;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-info {
  padding: 25px;
}

.course-category {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 15px;
}

.course-title {
  font-size: 1.25rem;
  margin-bottom: 10px;
  color: #333;
}

.course-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.course-instructor {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 15px;
}

.course-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #666;
}

.course-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.course-price {
  display: flex;
  flex-direction: column;
}

.price-near {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
}

.price-usd {
  font-size: 0.9rem;
  color: #666;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #28a745;
  color: white;
}

.btn-primary:hover {
  background: #218838;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
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

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.course-summary {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.wallet-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.wallet-btn {
  padding: 15px;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.wallet-btn:hover {
  background: #667eea;
  color: white;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
</style>
