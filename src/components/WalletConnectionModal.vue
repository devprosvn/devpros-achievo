
<template>
  <div v-if="open" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Connect Your Wallet</h2>
          <p class="modal-subtitle">Choose your preferred NEAR wallet to get started</p>
        </div>
        
        <div class="wallet-options">
          <button 
            @click="handleConnect('near')"
            class="wallet-option"
          >
            <div class="wallet-icon bg-gradient-to-br from-green-400 to-green-600">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div class="wallet-info">
              <h3 class="wallet-name">NEAR Wallet</h3>
              <p class="wallet-description">Official NEAR Protocol wallet</p>
            </div>
            <ArrowRightIcon class="w-5 h-5 text-gray-400" />
          </button>
          
          <button 
            @click="handleConnect('meteor')"
            class="wallet-option"
          >
            <div class="wallet-icon bg-gradient-to-br from-purple-400 to-purple-600">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div class="wallet-info">
              <h3 class="wallet-name">Meteor Wallet</h3>
              <p class="wallet-description">Fast and secure mobile wallet</p>
            </div>
            <ArrowRightIcon class="w-5 h-5 text-gray-400" />
          </button>
          
          <button 
            @click="handleConnect('mynear')"
            class="wallet-option"
          >
            <div class="wallet-icon bg-gradient-to-br from-blue-400 to-blue-600">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"/>
              </svg>
            </div>
            <div class="wallet-info">
              <h3 class="wallet-name">MyNearWallet</h3>
              <p class="wallet-description">Community-driven wallet solution</p>
            </div>
            <ArrowRightIcon class="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div class="modal-footer">
          <button @click="$emit('update:open', false)" class="btn btn-secondary w-full">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowRightIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  open: Boolean
})

const emit = defineEmits(['update:open', 'connect'])

const handleConnect = (walletType) => {
  emit('connect', walletType)
  emit('update:open', false)
}

const handleOverlayClick = () => {
  emit('update:open', false)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-container {
  width: 100%;
  max-width: 480px;
  margin: 1rem;
  animation: slideUp 0.3s ease-out;
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(31, 38, 135, 0.5);
  padding: 2rem;
}

.modal-header {
  text-align: center;
  margin-bottom: 2rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.modal-subtitle {
  color: #64748b;
  font-size: 0.875rem;
}

.wallet-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.wallet-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(79, 70, 229, 0.1);
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  width: 100%;
}

.wallet-option:hover {
  transform: translateY(-2px);
  border-color: rgba(79, 70, 229, 0.3);
  box-shadow: 0 8px 25px rgba(31, 38, 135, 0.3);
  background: white;
}

.wallet-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.wallet-info {
  flex: 1;
}

.wallet-name {
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.wallet-description {
  font-size: 0.875rem;
  color: #64748b;
}

.modal-footer {
  border-top: 1px solid rgba(79, 70, 229, 0.1);
  padding-top: 1.5rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
