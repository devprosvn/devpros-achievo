
<template>
  <div class="flex min-h-screen flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-40 border-b bg-white">
      <div class="container mx-auto px-4 flex h-16 items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-xl font-bold font-aptos-bold-italic">Achievo</span>
        </div>
        <div class="flex items-center gap-4">
          <nav class="hidden md:flex">
            <ul class="flex items-center gap-6">
              <li>
                <a href="#" class="text-sm font-medium hover:text-blue-600 font-aptos transition-colors">
                  Home
                </a>
              </li>
              <li>
                <router-link to="/marketplace" class="text-sm font-medium hover:text-blue-600 font-aptos transition-colors">
                  Marketplace
                </router-link>
              </li>
              <li>
                <a href="#" class="text-sm font-medium hover:text-blue-600 font-aptos transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" class="text-sm font-medium hover:text-blue-600 font-aptos transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>
          <button 
            v-if="connectedWallet" 
            class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <div class="h-2 w-2 rounded-full bg-green-500"></div>
            {{ connectedWallet === "meteor" ? "Meteor" : "MyNear" }} Connected
          </button>
          <button 
            v-else
            @click="setIsWalletModalOpen(true)" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="bg-gradient-to-b from-blue-50 to-white py-20">
      <div class="container mx-auto px-4 flex flex-col items-center gap-8 text-center">
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-aptos">
          Secure Digital Credentials on <span class="text-blue-600">Blockchain</span>
        </h1>
        <p class="max-w-2xl text-lg text-gray-600 font-aptos-italic">
          Achievo leverages NEAR Protocol to provide tamper-proof certificates and rewards for learners and
          organizations.
        </p>
        <div class="flex flex-col gap-4 sm:flex-row">
          <button 
            @click="setIsWalletModalOpen(true)"
            class="px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Connect Wallet
          </button>
          <button class="px-6 py-3 border border-gray-300 text-gray-700 rounded-md text-lg font-medium hover:bg-gray-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="mb-12 text-center text-3xl font-bold font-aptos">Platform Benefits</h2>
        <div class="grid gap-8 md:grid-cols-3">
          <div class="flex flex-col items-center gap-4 rounded-lg border p-6 text-center">
            <div class="rounded-full bg-blue-100 p-3">
              <ShieldCheckIcon class="h-6 w-6 text-blue-600" />
            </div>
            <h3 class="text-xl font-bold font-aptos">Secure Authentication</h3>
            <p class="text-gray-600 font-aptos-italic">
              Blockchain-based verification ensures your credentials cannot be forged or tampered with.
            </p>
          </div>
          <div class="flex flex-col items-center gap-4 rounded-lg border p-6 text-center">
            <div class="rounded-full bg-green-100 p-3">
              <TrophyIcon class="h-6 w-6 text-green-600" />
            </div>
            <h3 class="text-xl font-bold font-aptos">Dynamic NFT Certificates</h3>
            <p class="text-gray-600 font-aptos-italic">
              Certificates evolve as you complete more courses, showcasing your growing expertise.
            </p>
          </div>
          <div class="flex flex-col items-center gap-4 rounded-lg border p-6 text-center">
            <div class="rounded-full bg-purple-100 p-3">
              <CheckCircleIcon class="h-6 w-6 text-purple-600" />
            </div>
            <h3 class="text-xl font-bold font-aptos">Instant Verification</h3>
            <p class="text-gray-600 font-aptos-italic">
              Employers can instantly verify your credentials with a simple certificate ID.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-blue-600 py-16 text-white">
      <div class="container mx-auto px-4 flex flex-col items-center gap-6 text-center">
        <h2 class="text-3xl font-bold font-aptos">Ready to Get Started?</h2>
        <p class="max-w-2xl text-blue-100 font-aptos-italic">
          Join thousands of learners and organizations already using Achievo for secure digital credentials.
        </p>
        <button 
          @click="setIsWalletModalOpen(true)" 
          class="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-md text-lg font-medium hover:bg-gray-100 transition-colors mt-4"
        >
          Connect Wallet 
          <ArrowRightIcon class="h-4 w-4" />
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t py-12 bg-white">
      <div class="container mx-auto px-4">
        <div class="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div class="flex items-center gap-2">
            <span class="text-xl font-bold font-aptos-bold-italic">Achievo</span>
          </div>
          <div class="flex gap-8">
            <a href="#" class="text-sm text-gray-600 hover:text-blue-600 font-aptos transition-colors">
              Terms
            </a>
            <a href="#" class="text-sm text-gray-600 hover:text-blue-600 font-aptos transition-colors">
              Privacy
            </a>
            <a href="#" class="text-sm text-gray-600 hover:text-blue-600 font-aptos transition-colors">
              Contact
            </a>
          </div>
          <div class="text-sm text-gray-600 font-aptos-italic">© 2023 Achievo. All rights reserved.</div>
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
import { ShieldCheckIcon, TrophyIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'
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
.font-aptos {
  font-family: 'Aptos', Arial, sans-serif;
}

.font-aptos-bold-italic {
  font-family: 'Aptos', Arial, sans-serif;
  font-weight: bold;
  font-style: italic;
}

.font-aptos-italic {
  font-family: 'Aptos', Arial, sans-serif;
  font-style: italic;
}
</style>
