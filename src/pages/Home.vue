
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="flex items-center justify-between w-full">
            <router-link to="/" class="logo">
              Achievo
            </router-link>
            
            <nav class="hidden md:flex items-center gap-2">
              <a href="#" class="nav-link">Home</a>
              <router-link to="/marketplace" class="nav-link">Marketplace</router-link>
              <a href="#" class="nav-link">About</a>
              <a href="#" class="nav-link">FAQ</a>
            </nav>
            
            <div class="flex items-center gap-3">
              <button 
                v-if="connectedWallet" 
                class="btn btn-secondary text-sm px-4 py-2"
              >
                <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                {{ connectedWallet === "meteor" ? "Meteor" : "MyNear" }} Connected
              </button>
              <button 
                v-else
                @click="setIsWalletModalOpen(true)" 
                class="btn btn-primary px-6 py-3"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content fade-in">
          <h1 class="hero-title">
            Secure Digital Credentials on 
            <span class="text-white">Blockchain</span>
          </h1>
          <p class="hero-subtitle">
            Achievo leverages NEAR Protocol to provide tamper-proof certificates and rewards for learners and organizations worldwide.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              @click="setIsWalletModalOpen(true)"
              class="btn btn-primary btn-lg"
            >
              Get Started Now
              <ArrowRightIcon class="w-5 h-5" />
            </button>
            <button class="btn btn-secondary">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white relative">
      <div class="container">
        <div class="text-center mb-16 slide-up">
          <h2 class="text-4xl font-bold text-gradient mb-4">
            Platform Benefits
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of digital credentials with blockchain technology
          </p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card slide-up">
            <div class="feature-icon">
              <ShieldCheckIcon class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">Secure Authentication</h3>
            <p class="text-gray-600">
              Blockchain-based verification ensures your credentials cannot be forged or tampered with.
            </p>
          </div>
          
          <div class="feature-card slide-up" style="animation-delay: 0.2s">
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
          
          <div class="feature-card slide-up" style="animation-delay: 0.4s">
            <div class="feature-icon">
              <CheckCircleIcon class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">Instant Verification</h3>
            <p class="text-gray-600">
              Employers can instantly verify your credentials with a simple certificate ID.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-10"></div>
      <div class="container relative z-10">
        <div class="text-center">
          <h2 class="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p class="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of learners and organizations already using Achievo for secure digital credentials.
          </p>
          <button 
            @click="setIsWalletModalOpen(true)" 
            class="btn btn-lg bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 font-bold px-8 py-4 shadow-lg"
          >
            Connect Wallet Now
            <ArrowRightIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="container">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="logo text-white">
            Achievo
          </div>
          <div class="flex gap-8">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Terms</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Contact</a>
          </div>
          <div class="text-gray-400">
            © 2024 Achievo. All rights reserved.
          </div>
        </div>
      </div>
    </footer>

    <!-- Wallet Connection Modal -->
    <WalletConnectionModal
      :open="isWalletModalOpen"
      @update:open="setIsWalletModalOpen"
      @connect="handleWalletConnect"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ShieldCheckIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'
import WalletConnectionModal from '../components/WalletConnectionModal.vue'

const isWalletModalOpen = ref(false)
const connectedWallet = ref(null)

const setIsWalletModalOpen = (value) => {
  isWalletModalOpen.value = value
}

const handleWalletConnect = (walletType) => {
  connectedWallet.value = walletType
}
</script>

<style scoped>
.btn-lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* Add staggered animation delays */
.feature-card:nth-child(1) { animation-delay: 0s; }
.feature-card:nth-child(2) { animation-delay: 0.2s; }
.feature-card:nth-child(3) { animation-delay: 0.4s; }
</style>
