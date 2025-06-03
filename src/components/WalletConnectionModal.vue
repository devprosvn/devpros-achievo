
<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-50" 
      @click="$emit('update:open', false)"
    ></div>
    
    <!-- Modal -->
    <div class="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
      <div class="mb-6">
        <h2 class="text-xl font-bold font-aptos mb-2">Connect Wallet</h2>
        <p class="text-gray-600 font-aptos">Choose a wallet to connect to the Achievo platform.</p>
      </div>
      
      <div class="space-y-4 mb-6">
        <button
          @click="handleConnect('meteor')"
          :disabled="!!connecting"
          class="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <div class="flex items-center gap-3">
            <div class="rounded-full bg-blue-100 p-2">
              <WalletIcon class="h-5 w-5 text-blue-600" />
            </div>
            <span class="font-medium font-aptos">Meteor Wallet</span>
          </div>
          <div v-if="connecting === 'meteor'" class="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <ArrowRightIcon v-else class="h-5 w-5 text-gray-400" />
        </button>

        <button
          @click="handleConnect('mynear')"
          :disabled="!!connecting"
          class="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <div class="flex items-center gap-3">
            <div class="rounded-full bg-green-100 p-2">
              <WalletIcon class="h-5 w-5 text-green-600" />
            </div>
            <span class="font-medium font-aptos">MyNearWallet</span>
          </div>
          <div v-if="connecting === 'mynear'" class="h-5 w-5 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
          <ArrowRightIcon v-else class="h-5 w-5 text-gray-400" />
        </button>
      </div>
      
      <div class="text-xs text-gray-500 font-aptos">
        By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { WalletIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'

defineProps({
  open: {
    type: Boolean,
    required: true
  }
})

defineEmits(['update:open', 'connect'])

const connecting = ref(null)

const handleConnect = (walletType) => {
  connecting.value = walletType

  // Simulate connection process
  setTimeout(() => {
    connecting.value = null
    $emit('connect', walletType)
    $emit('update:open', false)
  }, 1500)
}
</script>

<style scoped>
.font-aptos {
  font-family: 'Aptos', Arial, sans-serif;
}
</style>
