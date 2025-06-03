<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            Achievo - Blockchain Certificate Platform
          </h1>
          <p class="hero-subtitle">
            Secure, verifiable certificates powered by NEAR Protocol. 
            Transform your learning journey with blockchain-verified credentials.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <!-- Show different buttons based on connection status -->
            <div v-if="!isConnected" class="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                @click="setIsWalletModalOpen(true)"
                :disabled="connectingWallet"
                class="btn btn-primary px-6 py-3 text-base"
              >
                <span v-if="connectingWallet">Connecting...</span>
                <span v-else>Get Started Now</span>
                <svg v-if="!connectingWallet" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
              <button class="btn btn-secondary px-5 py-3 text-base">
                Learn More
              </button>
            </div>
            
            <!-- Show when wallet is connected -->
            <div v-else class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div class="text-center">
                <div class="bg-green-100 text-green-800 px-4 py-2 rounded-lg mb-3">
                  <svg class="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Wallet Connected: {{ accountId }}
                </div>
              </div>
              <router-link to="/student-dashboard" class="btn btn-primary px-6 py-3 text-base">
                Go to Dashboard
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </router-link>
              <button @click="handleDisconnect" class="btn btn-outline px-5 py-3 text-base">
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-pattern"></div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="text-center mb-16">
          <h2 class="section-title">Why Choose Achievo?</h2>
          <p class="section-subtitle">
            Revolutionary blockchain technology meets educational excellence
          </p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">Blockchain Security</h3>
            <p class="text-gray-600">
              Certificates are secured on NEAR blockchain, ensuring immutable and verifiable credentials.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">Instant Verification</h3>
            <p class="text-gray-600">
              Verify any certificate instantly with our blockchain-based validation system.
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">Dynamic NFT Certificates</h3>
            <p class="text-gray-600">
              Certificates evolve as you complete more courses, showcasing your growing expertise.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Dashboard Preview Section -->
    <section class="dashboard-preview">
      <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold mb-6 text-gray-900">
              For Students & Learners
            </h2>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="text-gray-900">Earn verifiable certificates that employers trust</p>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="text-gray-900">Track your learning progress and achievements</p>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="text-gray-900">Collect rewards and unlock new opportunities</p>
              </div>
            </div>
            <div class="mt-8">
              <router-link to="/register" class="btn btn-primary">
                Start Learning
              </router-link>
            </div>
          </div>
          <div>
            <h2 class="text-3xl font-bold mb-6 text-gray-900">
              For Organizations
            </h2>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="text-gray-900">Issue blockchain-verified certificates instantly</p>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="text-gray-900">Manage courses and track student progress</p>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-1">
                  <svg class="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <p class="text-gray-900">Build trust with tamper-proof credentials</p>
              </div>
            </div>
            <div class="mt-8">
              <router-link to="/register" class="btn btn-primary">
                Create Organization Account
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="container relative z-10">
        <div class="text-center">
          <h2 class="text-4xl font-bold mb-6 text-white">Ready to Get Started?</h2>
          <p class="text-xl mb-8 max-w-2xl mx-auto opacity-90 text-white">
            Join thousands of learners and organizations already using Achievo for secure digital credentials.
          </p>
          <router-link 
            v-if="isConnected"
            to="/student-dashboard" 
            class="btn bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 font-bold px-6 py-3 shadow-lg"
          >
            Access Dashboard
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
          </router-link>
          <button 
            v-else
            @click="setIsWalletModalOpen(true)" 
            class="btn bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 font-bold px-6 py-3 shadow-lg"
          >
            Connect Wallet Now
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Wallet Connection Modal -->
    <WalletConnectionModal 
      :isOpen="isWalletModalOpen" 
      @close="setIsWalletModalOpen(false)"
      @connect="handleWalletConnect"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNearStore } from '../stores/near'
// import { ArrowRightIcon } from '@heroicons/vue/24/solid' //Commented out, as it is no longer needed.
import WalletConnectionModal from '../components/WalletConnectionModal.vue'

const router = useRouter()
const nearStore = useNearStore()

const isWalletModalOpen = ref(false)

const setIsWalletModalOpen = (value) => {
  isWalletModalOpen.value = value
}

const connectionError = ref(null)
const connectingWallet = ref(false)

// Reactive properties from NEAR store
const isConnected = computed(() => nearStore.isConnected)
const accountId = computed(() => nearStore.accountId)

const handleWalletConnect = async (walletType) => {
  connectionError.value = null
  connectingWallet.value = true
  try {
    console.log(`Component: Attempting to connect to ${walletType || 'default modal'}`)
    await nearStore.connectWallet(walletType)
    console.log('Component: Wallet connection process initiated/completed.')
    
    // Close modal after successful connection
    setIsWalletModalOpen(false)
  } catch (error) {
    console.error('Component: Wallet connection failed:', error)
    connectionError.value = error.message || 'Không thể kết nối ví. Vui lòng thử lại.'
  } finally {
    connectingWallet.value = false
  }
}

const handleDisconnect = async () => {
  try {
    await nearStore.disconnectWallet()
  } catch (error) {
    console.error('Disconnect failed:', error)
  }
}

// Watch for connection status changes
watch(isConnected, (newValue) => {
  if (newValue) {
    console.log('Wallet connected successfully!')
    setIsWalletModalOpen(false)
  }
})

onMounted(async () => {
  try {
    console.log('Home component: Initializing NEAR...')
    await nearStore.initNear()
    console.log('Home component: NEAR initialization completed')
  } catch (error) {
    console.error('Home component: NEAR initialization failed:', error)
  }
})
</script>

<style scoped>
/* Add staggered animation delays */
.feature-card:nth-child(1) { animation-delay: 0s; }
.feature-card:nth-child(2) { animation-delay: 0.2s; }
.feature-card:nth-child(3) { animation-delay: 0.4s; }

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 120px 0;
  position: relative;
  overflow: hidden;
}

.hero-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px);
  background-size: 60px 60px;
}

.hero-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #ffffff, #f0f8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.features-section {
  padding: 120px 0;
  background: #f8fafc;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.feature-card {
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(30px);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
}

.dashboard-preview {
  padding: 120px 0;
  background: white;
}

.cta-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 120px 0;
  position: relative;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>