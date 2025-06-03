
<template>
  <div v-if="isOpen" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Connect Your Wallet</h2>
        <button @click="$emit('close')" class="close-btn">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <p class="mb-6">Choose your preferred NEAR wallet to get started with blockchain certificates.</p>
        
        <div class="wallet-options">
          <button @click="connectWallet('meteor')" class="wallet-option">
            <div class="wallet-icon">
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div class="wallet-info">
              <h3>Meteor Wallet (Browser Extension)</h3>
              <p>Fast and secure NEAR wallet extension</p>
            </div>
            <div class="wallet-arrow">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button @click="connectWallet('meteor-app')" class="wallet-option">
            <div class="wallet-icon">
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 1C5.9 1 5 1.9 5 3v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2H7zm0 2h10v16H7V3z"/>
              </svg>
            </div>
            <div class="wallet-info">
              <h3>Meteor Wallet (Mobile App)</h3>
              <p>Mobile app version of Meteor Wallet</p>
            </div>
            <div class="wallet-arrow">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button @click="connectWallet('mynear')" class="wallet-option">
            <div class="wallet-icon">
              <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div class="wallet-info">
              <h3>MyNearWallet</h3>
              <p>Official NEAR wallet solution</p>
            </div>
            <div class="wallet-arrow">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        <div class="security-note">
          <div class="security-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p>Your wallet connection is secure and encrypted. We never store your private keys.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'connect'])

const connectWallet = (walletType) => {
  emit('connect', walletType)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #374151;
}

.modal-body {
  padding: 0 1.5rem 1.5rem;
}

.modal-body p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.wallet-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.wallet-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
}

.wallet-option:hover {
  border-color: #3b82f6;
  background: #f8fafc;
  transform: translateY(-1px);
}

.wallet-icon {
  color: #3b82f6;
  flex-shrink: 0;
}

.wallet-info {
  flex: 1;
}

.wallet-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.wallet-info p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.wallet-arrow {
  color: #9ca3af;
  flex-shrink: 0;
}

.security-note {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 0.5rem;
}

.security-icon {
  color: #0369a1;
  flex-shrink: 0;
}

.security-note p {
  font-size: 0.875rem;
  color: #0369a1;
  margin: 0;
}
</style>
