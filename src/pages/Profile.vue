
<template>
  <div class="profile-page">
    <header class="profile-header">
      <div class="container">
        <h1>My Profile</h1>
        <button @click="$router.go(-1)" class="back-btn">← Back</button>
      </div>
    </header>

    <main class="profile-main">
      <div class="container">
        <div class="profile-grid">
          <!-- Profile Information -->
          <div class="profile-info-section">
            <div class="profile-card">
              <h2>Profile Information</h2>
              <form @submit.prevent="updateProfile">
                <div class="form-group">
                  <label>Full Name</label>
                  <input v-model="profile.name" type="text" required>
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input v-model="profile.email" type="email" required>
                </div>
                <div class="form-group">
                  <label>Phone</label>
                  <input v-model="profile.phone" type="tel">
                </div>
                <div class="form-group">
                  <label>Bio</label>
                  <textarea v-model="profile.bio" rows="4"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Update Profile</button>
              </form>
            </div>
          </div>

          <!-- NEAR Wallet Connection -->
          <div class="wallet-section">
            <div class="wallet-card">
              <h2>NEAR Wallet</h2>
              <div v-if="nearStore.isConnected" class="wallet-connected">
                <p><strong>Connected Account:</strong> {{ nearStore.accountId }}</p>
                <button @click="nearStore.disconnectWallet()" class="btn btn-danger">Disconnect</button>
              </div>
              <div v-else class="wallet-disconnected">
                <p>Connect your NEAR wallet to access blockchain features</p>
                <div class="wallet-options">
                  <button @click="connectWallet('meteor')" class="btn btn-primary">Meteor Wallet</button>
                  <button @click="connectWallet('mynear')" class="btn btn-primary">MyNearWallet</button>
                  <button @click="connectWallet('near')" class="btn btn-primary">NEAR Wallet</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Certificates -->
          <div class="certificates-section">
            <div class="certificates-card">
              <h2>My Certificates</h2>
              <div v-if="certificates.length === 0" class="empty-state">
                <p>No certificates yet</p>
              </div>
              <div v-else class="certificates-grid">
                <div v-for="certificate in certificates" :key="certificate.id" class="certificate-item">
                  <h3>{{ certificate.title }}</h3>
                  <p>Issued by: {{ certificate.organizationName }}</p>
                  <p>Date: {{ formatDate(certificate.issuedDate) }}</p>
                  <div class="certificate-actions">
                    <button @click="viewCertificate(certificate)" class="btn btn-info">View</button>
                    <button @click="downloadCertificate(certificate)" class="btn btn-secondary">Download</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Rewards -->
          <div class="rewards-section">
            <div class="rewards-card">
              <h2>My Rewards</h2>
              <div v-if="rewards.length === 0" class="empty-state">
                <p>No rewards yet</p>
              </div>
              <div v-else class="rewards-grid">
                <div v-for="reward in rewards" :key="reward.id" class="reward-item">
                  <h3>{{ reward.title }}</h3>
                  <p>{{ reward.description }}</p>
                  <p class="reward-points">{{ reward.points }} points</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
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

const profile = ref({
  name: '',
  email: '',
  phone: '',
  bio: ''
})

const certificates = ref([])
const rewards = ref([])

const loadProfile = async () => {
  try {
    if (authStore.user) {
      profile.value = { ...authStore.user }
    }
    
    const [certificatesResponse, rewardsResponse] = await Promise.all([
      api.getCertificates(),
      api.getRewards()
    ])
    
    certificates.value = certificatesResponse.data
    rewards.value = rewardsResponse.data
  } catch (error) {
    console.error('Failed to load profile data:', error)
  }
}

const updateProfile = async () => {
  try {
    await api.updateProfile(profile.value)
    alert('Profile updated successfully!')
  } catch (error) {
    console.error('Failed to update profile:', error)
    alert('Failed to update profile')
  }
}

const connectWallet = async (walletType) => {
  try {
    await nearStore.connectWallet(walletType)
  } catch (error) {
    console.error('Failed to connect wallet:', error)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

const viewCertificate = (certificate) => {
  // Implementation for viewing certificate details
  router.push(`/certificate/${certificate.id}`)
}

const downloadCertificate = (certificate) => {
  // Implementation for downloading certificate
  console.log('Download certificate:', certificate)
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  loadProfile()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f8fafc;
}

.profile-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.profile-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.profile-main {
  padding: 2rem 0;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.profile-card,
.wallet-card,
.certificates-card,
.rewards-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}

.wallet-connected,
.wallet-disconnected {
  margin-top: 1rem;
}

.wallet-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.certificates-grid,
.rewards-grid {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.certificate-item,
.reward-item {
  border: 1px solid #e2e8f0;
  padding: 1rem;
  border-radius: 0.375rem;
}

.certificate-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

.reward-points {
  font-weight: bold;
  color: #3b82f6;
}

.empty-state {
  text-align: center;
  color: #6b7280;
  margin-top: 1rem;
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
</style>
