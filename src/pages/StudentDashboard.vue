<template>
  <div class="dashboard">
    <nav class="sidebar">
      <div class="sidebar-header">
        <h3>Achievo</h3>
        <p>Student Portal</p>
      </div>
      <ul class="nav-menu">
        <li><a href="#" @click="activeTab = 'overview'" :class="{ active: activeTab === 'overview' }">Overview</a></li>
        <li><a href="#" @click="activeTab = 'certificates'" :class="{ active: activeTab === 'certificates' }">My Certificates</a></li>
        <li><a href="#" @click="activeTab = 'rewards'" :class="{ active: activeTab === 'rewards' }">Rewards</a></li>
        <li><a href="#" @click="activeTab = 'profile'" :class="{ active: activeTab === 'profile' }">Profile</a></li>
        <li><router-link to="/marketplace">Marketplace</router-link></li>
        <li><router-link to="/certificate-validation">Verify Certificate</router-link></li>
      </ul>
      <div class="wallet-status">
        <div v-if="nearStore.isConnected" class="connected">
          <p>Wallet Connected</p>
          <p class="account-id">{{ nearStore.accountId }}</p>
          <button @click="nearStore.disconnectWallet()" class="btn btn-sm">Disconnect</button>
        </div>
        <div v-else class="disconnected">
          <p>Wallet not connected</p>
          <button @click="connectMeteorWallet" class="btn btn-sm" :disabled="nearStore.isLoading">
            {{ nearStore.isLoading ? 'Connecting...' : 'Connect Wallet' }}
          </button>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <header class="dashboard-header">
        <h1>Welcome back, {{ user?.name || 'Student' }}!</h1>
        <button @click="logout" class="btn btn-logout">Logout</button>
      </header>

      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="tab-content">
        <div class="stats-grid">
          <div class="stat-card">
            <h3>{{ certificates.length }}</h3>
            <p>Certificates Earned</p>
          </div>
          <div class="stat-card">
            <h3>{{ rewards.length }}</h3>
            <p>Rewards Collected</p>
          </div>
          <div class="stat-card">
            <h3>{{ completedCourses }}</h3>
            <p>Courses Completed</p>
          </div>
          <div class="stat-card">
            <h3>{{ learningProgress }}%</h3>
            <p>Learning Progress</p>
          </div>
        </div>

        <div class="recent-activity">
          <h2>Recent Activity</h2>
          <div class="activity-list">
            <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
              <div class="activity-icon">🎓</div>
              <div class="activity-details">
                <h4>{{ activity.title }}</h4>
                <p>{{ activity.description }}</p>
                <span class="activity-date">{{ activity.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Certificates Tab -->
      <div v-if="activeTab === 'certificates'" class="tab-content">
        <div class="section-header">
          <h2>My Certificates</h2>
          <button @click="loadCertificates" class="btn btn-primary">Refresh</button>
        </div>
        <div class="certificates-grid">
          <div v-for="cert in certificates" :key="cert.id" class="certificate-card">
            <div class="certificate-header">
              <h3>{{ cert.title }}</h3>
              <span class="certificate-status" :class="cert.status">{{ cert.status }}</span>
            </div>
            <p class="certificate-issuer">Issued by: {{ cert.issuer }}</p>
            <p class="certificate-date">Date: {{ cert.issueDate }}</p>
            <div class="certificate-actions">
              <button class="btn btn-sm">Download</button>
              <button class="btn btn-sm btn-outline">Share</button>
              <button v-if="authStore.isOrganizationVerifier()" @click="openMintNFT(cert)" class="btn btn-sm btn-purple">
                Mint NFT
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- NFT Certificates Section -->
      <div class="mb-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-900">My NFT Certificates</h2>
            <button
              @click="refreshNFTCertificates"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>

          <div v-if="loadingNFTs" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2 text-gray-600">Loading NFT certificates...</p>
          </div>

          <div v-else-if="nftCertificates.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No NFT certificates</h3>
            <p class="mt-1 text-sm text-gray-500">You don't have any NFT certificates yet.</p>
          </div>

          <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="nft in nftCertificates"
              :key="nft.token_id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">{{ nft.metadata.title }}</h3>
                  <p class="text-sm text-gray-600 mt-1">{{ nft.metadata.description }}</p>
                  <div class="mt-2 space-y-1">
                    <p class="text-xs text-gray-500">Token ID: {{ nft.token_id }}</p>
                    <p class="text-xs text-gray-500">Issued: {{ formatDate(nft.metadata.issued_at) }}</p>
                    <span class="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                      NFT Certificate
                    </span>
                  </div>
                </div>
              </div>

              <div class="mt-4 flex space-x-2">
                <button
                  v-if="nft.metadata.media"
                  @click="viewNFTMedia(nft)"
                  class="bg-indigo-600 text-white px-3 py-1 text-sm rounded hover:bg-indigo-700 transition-colors"
                >
                  View Media
                </button>
                <button
                  v-if="nft.metadata.reference"
                  @click="viewNFTMetadata(nft)"
                  class="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700 transition-colors"
                >
                  View Metadata
                </button>
                <button
                  @click="shareNFT(nft)"
                  class="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rewards Tab -->
      <div v-if="activeTab === 'rewards'" class="tab-content">
        <div class="section-header">
          <h2>My Rewards</h2>
          <button @click="loadRewards" class="btn btn-primary">Refresh</button>
        </div>
        <div class="rewards-grid">
          <div v-for="reward in rewards" :key="reward.id" class="reward-card">
            <div class="reward-icon">🏆</div>
            <h3>{{ reward.title }}</h3>
            <p>{{ reward.description }}</p>
            <span class="reward-points">{{ reward.points }} points</span>
          </div>
        </div>
      </div>

      <!-- Profile Tab -->
      <div v-if="activeTab === 'profile'" class="tab-content">
        <div class="profile-section">
          <h2>Profile Information</h2>
          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="form-group">
              <label>Full Name</label>
              <input v-model="profileForm.name" type="text" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="profileForm.email" type="email" />
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input v-model="profileForm.phone" type="tel" />
            </div>
            <div class="form-group">
              <label>Bio</label>
              <textarea v-model="profileForm.bio" rows="4"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Update Profile</button>
          </form>
        </div>
      </div>
    </main>

    <!-- NFT Minting Modal -->
    <div v-if="showMintModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full m-4 max-h-screen overflow-y-auto">
        <NFTCertificateMinter
          @success="handleMintSuccess"
          @cancel="closeMintModal"
        />
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
import NFTCertificateMinter from '../components/NFTCertificateMinter.vue'

const router = useRouter()
const authStore = useAuthStore()
const nearStore = useNearStore()

const activeTab = ref('overview')
const certificates = ref([])
const rewards = ref([])
const nftCertificates = ref([])
const recentActivities = ref([])
const completedCourses = ref(0)
const learningProgress = ref(0)
const loading = ref(true)
const loadingNFTs = ref(false)
const error = ref('')
const showMintModal = ref(false)
const selectedCertificate = ref(null)

const user = ref(authStore.user)
const profileForm = ref({
  name: '',
  email: '',
  phone: '',
  bio: ''
})

onMounted(async () => {
  await loadDashboardData()
  await nearStore.initNear()
  await loadNFTCertificates()
})

const loadDashboardData = async () => {
  try {
    await Promise.all([
      loadCertificates(),
      loadRewards(),
      loadRecentActivities()
    ])
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
}

const loadCertificates = async () => {
  try {
    const response = await api.getCertificates()
    certificates.value = response.data
  } catch (error) {
    console.error('Failed to load certificates:', error)
  }
}

const loadRewards = async () => {
  try {
    const response = await api.getRewards()
    rewards.value = response.data
  } catch (error) {
    console.error('Failed to load rewards:', error)
  }
}

const loadRecentActivities = () => {
  recentActivities.value = [
    {
      id: 1,
      title: 'Certificate Earned',
      description: 'Completed Vue.js Fundamentals Course',
      date: '2 days ago'
    },
    {
      id: 2,
      title: 'Reward Unlocked',
      description: 'Early Bird Achievement',
      date: '1 week ago'
    }
  ]
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

const updateProfile = async () => {
  try {
    // Update profile via API
    alert('Profile updated successfully!')
  } catch (error) {
    alert('Failed to update profile: ' + error.message)
  }
}

const logout = () => {
  authStore.logout()
  nearStore.disconnectWallet()
  router.push('/')
}

const shareCertificate = async (certificate) => {
  try {
    await api.shareCertificate(certificate)
    // Show success message
  } catch (error) {
    console.error('Failed to share certificate:', error)
  }
}

const loadNFTCertificates = async () => {
  if (!authStore.isAuthenticated || !authStore.user?.wallet_address) return

  try {
    loadingNFTs.value = true
    const nftTokens = await nearStore.getNFTTokensForOwner(authStore.user.wallet_address)
    nftCertificates.value = nftTokens || []
  } catch (error) {
    console.error('Failed to load NFT certificates:', error)
  } finally {
    loadingNFTs.value = false
  }
}

const refreshNFTCertificates = async () => {
  await loadNFTCertificates()
}

const openMintNFT = (certificate) => {
  selectedCertificate.value = certificate
  showMintModal.value = true
}

const closeMintModal = () => {
  showMintModal.value = false
  selectedCertificate.value = null
}

const handleMintSuccess = (result) => {
  console.log('NFT minted successfully:', result)
  showMintModal.value = false
  selectedCertificate.value = null
  // Refresh NFT certificates
  loadNFTCertificates()
}

const viewNFTMedia = (nft) => {
  if (nft.metadata.media) {
    window.open(nft.metadata.media, '_blank')
  }
}

const viewNFTMetadata = (nft) => {
  if (nft.metadata.reference) {
    window.open(nft.metadata.reference, '_blank')
  }
}

const shareNFT = async (nft) => {
  try {
    const shareText = `Check out my NFT certificate: ${nft.metadata.title}`
    const shareUrl = nft.metadata.reference || nft.metadata.media

    if (navigator.share) {
      await navigator.share({
        title: `NFT Certificate: ${nft.metadata.title}`,
        text: shareText,
        url: shareUrl
      })
    } else {
      await navigator.clipboard.writeText(`${shareText} - ${shareUrl}`)
      // Show success message
    }
  } catch (error) {
    console.error('Failed to share NFT:', error)
  }
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp / 1000000);
  return date.toLocaleDateString();
}
</script>

<style scoped>
.dashboard {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 280px;
  background: #2c3e50;
  color: white;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 30px 20px;
  border-bottom: 1px solid #34495e;
}

.sidebar-header h3 {
  margin: 0 0 5px 0;
  font-size: 1.5rem;
}

.sidebar-header p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.nav-menu li a {
  display: block;
  padding: 15px 20px;
  color: white;
  text-decoration: none;
  transition: background 0.3s;
}

.nav-menu li a:hover,
.nav-menu li a.active {
  background: #3498db;
}

.wallet-status {
  padding: 20px;
  border-top: 1px solid #34495e;
}

.connected .account-id {
  font-size: 0.8rem;
  opacity: 0.8;
  word-break: break-all;
}

.main-content {
  flex: 1;
  padding: 30px;
  background: #f8f9fa;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.dashboard-header h1 {
  margin: 0;
  color: #2c3e50;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-logout {
  background: #e74c3c;
  color: white;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.9rem;
}

.btn-outline {
  background: transparent;
  border: 2px solid #3498db;
  color: #3498db;
}

.btn-purple {
  background: #8e44ad;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.stat-card h3 {
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  color: #3498db;
}

.stat-card p {
  margin: 0;
  color: #666;
  font-weight: 600;
}

.recent-activity {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.activity-icon {
  font-size: 1.5rem;
}

.activity-details h4 {
  margin: 0 0 5px 0;
}

.activity-details p {
  margin: 0 0 5px 0;
  color: #666;
}

.activity-date {
  font-size: 0.8rem;
  color: #999;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.certificates-grid,
.rewards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.certificate-card,
.reward-card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.certificate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.certificate-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.certificate-status.verified {
  background: #d4edda;
  color: #155724;
}

.certificate-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.reward-card {
  text-align: center;
}

.reward-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.reward-points {
  background: #3498db;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.profile-form {
  max-width: 500px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 16px;
}
</style>