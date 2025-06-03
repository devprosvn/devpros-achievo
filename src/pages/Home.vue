<template>
  <div class="min-h-screen bg-white">
    <!-- Header Component -->
    <header class="sticky top-0 z-50 bg-white border-b">
      <div class="container mx-auto px-4">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <TrophyIcon class="h-8 w-8 text-blue-600" />
            <span class="text-xl font-bold">Achievo</span>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-8">
            <router-link to="/" class="text-sm font-medium hover:text-blue-600 transition-colors">Home</router-link>
            <router-link to="/marketplace" class="text-sm font-medium hover:text-blue-600 transition-colors">Marketplace</router-link>
            <a href="#" class="text-sm font-medium hover:text-blue-600 transition-colors">About</a>
            <a href="#" class="text-sm font-medium hover:text-blue-600 transition-colors">FAQ</a>
          </nav>

          <!-- Wallet Connection -->
          <div class="flex items-center gap-4">
            <button 
              v-if="!nearStore.isConnected"
              @click="openWalletModal"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </button>

            <div v-else class="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <span class="text-sm font-medium">{{ nearStore.accountId?.split('.')[0] || 'Wallet' }}</span>
              <span class="text-sm text-gray-500">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="bg-gradient-to-b from-blue-50 to-white py-20">
      <div class="container mx-auto px-4">
        <div class="flex flex-col items-center gap-8 text-center">
          <h1 class="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Secure Digital Credentials on 
            <span class="text-blue-600">Blockchain</span>
          </h1>

          <p class="max-w-2xl text-lg text-gray-600">
            Achievo leverages NEAR Protocol to provide tamper-proof certificates and rewards for learners and organizations.
          </p>

          <div class="flex flex-col gap-4 sm:flex-row">
            <button 
              @click="openWalletModal"
              class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              Connect Wallet
            </button>
            <button class="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors text-lg">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="bg-white py-20">
      <div class="container mx-auto px-4">
        <h2 class="text-center text-3xl font-bold mb-12">Platform Benefits</h2>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature Card 1 -->
          <div class="flex flex-col items-center gap-4 rounded-lg border p-6 text-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <ShieldCheckIcon class="h-6 w-6 text-blue-600" />
            </div>
            <h3 class="text-xl font-bold">Secure Authentication</h3>
            <p class="text-gray-600">
              Blockchain-based verification ensures your credentials cannot be forged or tampered with.
            </p>
          </div>

          <!-- Feature Card 2 -->
          <div class="flex flex-col items-center gap-4 rounded-lg border p-6 text-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <TrophyIcon class="h-6 w-6 text-green-600" />
            </div>
            <h3 class="text-xl font-bold">Dynamic NFT Certificates</h3>
            <p class="text-gray-600">
              Certificates evolve as you complete more courses, showcasing your growing expertise.
            </p>
          </div>

          <!-- Feature Card 3 -->
          <div class="flex flex-col items-center gap-4 rounded-lg border p-6 text-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <CheckCircleIcon class="h-6 w-6 text-purple-600" />
            </div>
            <h3 class="text-xl font-bold">Instant Verification</h3>
            <p class="text-gray-600">
              Employers can instantly verify your credentials with a simple certificate ID.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-blue-600 text-white py-16">
      <div class="container mx-auto px-4">
        <div class="flex flex-col items-center gap-6 text-center">
          <h2 class="text-3xl font-bold">Ready to Get Started?</h2>
          <p class="max-w-2xl text-blue-100">
            Join thousands of learners and organizations already using Achievo for secure digital credentials.
          </p>
          <button 
            @click="openWalletModal"
            class="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors text-lg mt-4 flex items-center gap-2"
          >
            Connect Wallet
            <ArrowRightIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t py-12">
      <div class="container mx-auto px-4">
        <div class="flex flex-col items-center justify-between gap-6 md:flex-row">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <TrophyIcon class="h-6 w-6 text-blue-600" />
            <span class="font-bold">Achievo</span>
          </div>

          <!-- Links -->
          <nav class="flex gap-8">
            <a href="#" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">Contact</a>
          </nav>

          <!-- Copyright -->
          <p class="text-sm text-gray-500">© 2023 Achievo. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <!-- Wallet Connection Modal -->
    <TransitionRoot as="template" :show="showWalletModal">
      <Dialog as="div" class="relative z-50" @close="closeWalletModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                <div>
                  <div class="text-center">
                    <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900">
                      Connect Wallet
                    </DialogTitle>
                    <p class="mt-2 text-sm text-gray-500">
                      Choose your preferred wallet to connect to Achievo
                    </p>
                  </div>
                </div>

                <div class="mt-6">
                  <div class="grid gap-4 py-4">
                    <!-- Meteor Wallet Button -->
                    <button
                      @click="connectWallet('meteor')"
                      :disabled="connecting"
                      class="flex items-center justify-between border border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                          <WalletIcon class="h-6 w-6 text-blue-600" />
                        </div>
                        <span class="font-medium">Meteor Wallet</span>
                      </div>

                      <div v-if="connecting && connectingWallet === 'meteor'" class="animate-spin">
                        <div class="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      </div>
                      <ArrowRightIcon v-else class="h-5 w-5 text-gray-400" />
                    </button>

                    <!-- MyNearWallet Button -->
                    <button
                      @click="connectWallet('mynear')"
                      :disabled="connecting"
                      class="flex items-center justify-between border border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <div class="flex items-center gap-3">
                        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                          <WalletIcon class="h-6 w-6 text-green-600" />
                        </div>
                        <span class="font-medium">MyNearWallet</span>
                      </div>

                      <div v-if="connecting && connectingWallet === 'mynear'" class="animate-spin">
                        <div class="h-5 w-5 border-2 border-green-600 border-t-transparent rounded-full"></div>
                      </div>
                      <ArrowRightIcon v-else class="h-5 w-5 text-gray-400" />
                    </button>
                  </div>

                  <p class="text-xs text-gray-500 mt-4 text-center">
                    By connecting a wallet, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Dialog, 
  DialogPanel, 
  DialogTitle,
  TransitionChild, 
  TransitionRoot 
} from '@headlessui/vue'
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  TrophyIcon
} from '@heroicons/vue/24/outline'
import { WalletIcon } from '@heroicons/vue/24/solid'
import { useNearStore } from '../stores/near'

const nearStore = useNearStore()

const showWalletModal = ref(false)
const connecting = ref(false)
const connectingWallet = ref(null)

const openWalletModal = () => {
  showWalletModal.value = true
}

const closeWalletModal = () => {
  showWalletModal.value = false
  connecting.value = false
  connectingWallet.value = null
}

const connectWallet = async (walletType) => {
  connecting.value = true
  connectingWallet.value = walletType

  try {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    await nearStore.connectWallet(walletType)
    closeWalletModal()
  } catch (error) {
    console.error('Failed to connect wallet:', error)
  } finally {
    connecting.value = false
    connectingWallet.value = null
  }
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>