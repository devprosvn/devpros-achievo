
<template>
  <div class="nft-certificate-minter">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-4">
        Mint NFT Certificate
      </h3>
      
      <form @submit.prevent="mintNFTCertificate" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Certificate ID
          </label>
          <input
            v-model="nftForm.certificateId"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter certificate ID to mint as NFT"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Receiver Wallet Address
          </label>
          <input
            v-model="nftForm.receiverId"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., student.testnet"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            NFT Title
          </label>
          <input
            v-model="nftForm.title"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Achievement Certificate"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            v-model="nftForm.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digital certificate of achievement"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Certificate Image/Media
          </label>
          <input
            @change="handleFileUpload"
            type="file"
            accept="image/*"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p class="text-sm text-gray-500 mt-1">
            Upload an image to represent this NFT certificate
          </p>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="$emit('cancel')"
            class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <span v-if="isLoading">Minting...</span>
            <span v-else>Mint NFT Certificate</span>
          </button>
        </div>
      </form>

      <!-- Progress indicator -->
      <div v-if="isLoading" class="mt-4">
        <div class="bg-gray-200 rounded-full h-2">
          <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="text-sm text-gray-600 mt-1">{{ statusMessage }}</p>
      </div>

      <!-- Success message -->
      <div v-if="mintSuccess" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <p class="text-green-800">NFT Certificate minted successfully!</p>
        </div>
        <div v-if="mintedTokenId" class="mt-2">
          <p class="text-sm text-green-700">Token ID: {{ mintedTokenId }}</p>
          <a v-if="ipfsUrl" :href="ipfsUrl" target="_blank" class="text-sm text-blue-600 hover:underline">
            View on IPFS
          </a>
        </div>
      </div>

      <!-- Error message -->
      <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
        <p class="text-red-800">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNearStore } from '../stores/near'
import { useAuthStore } from '../stores/auth'
import PinataService from '../services/pinata'
import { api } from '../services/api'

const emit = defineEmits(['success', 'cancel'])

const nearStore = useNearStore()
const authStore = useAuthStore()

const isLoading = ref(false)
const progress = ref(0)
const statusMessage = ref('')
const mintSuccess = ref(false)
const mintedTokenId = ref('')
const ipfsUrl = ref('')
const error = ref('')
const selectedFile = ref(null)

const nftForm = ref({
  certificateId: '',
  receiverId: '',
  title: '',
  description: ''
})

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0]
}

const mintNFTCertificate = async () => {
  try {
    error.value = ''
    mintSuccess.value = false
    isLoading.value = true
    progress.value = 0

    // Check authentication and permissions
    if (!authStore.isAuthenticated) {
      throw new Error('Please connect your wallet first')
    }

    // Check if user has permission to mint NFTs (organization or admin)
    if (!authStore.isOrganizationVerifier() && !authStore.user?.wallet_address?.endsWith('.testnet')) {
      throw new Error('Only verified organizations can mint NFT certificates')
    }

    statusMessage.value = 'Preparing NFT data...'
    progress.value = 20

    let mediaUrl = ''
    let mediaHash = ''

    // Upload media to IPFS if file selected
    if (selectedFile.value) {
      statusMessage.value = 'Uploading media to IPFS...'
      progress.value = 40

      const mediaUpload = await PinataService.uploadFile(selectedFile.value)
      if (mediaUpload.success) {
        mediaUrl = mediaUpload.ipfsUrl
        mediaHash = mediaUpload.ipfsHash
      }
    }

    statusMessage.value = 'Minting NFT to IPFS...'
    progress.value = 60

    // Prepare NFT data
    const nftData = {
      tokenId: `nft_cert_${Date.now()}`,
      receiverId: nftForm.value.receiverId,
      certificateId: nftForm.value.certificateId,
      title: nftForm.value.title,
      description: nftForm.value.description,
      mediaUrl: mediaUrl,
      mediaHash: mediaHash,
      issuerId: authStore.user.wallet_address,
      ownerId: nftForm.value.receiverId
    }

    // Upload NFT metadata to IPFS
    const ipfsResult = await PinataService.mintNFTCertificateToIPFS(nftData)
    
    if (!ipfsResult.success) {
      throw new Error(`IPFS upload failed: ${ipfsResult.error}`)
    }

    statusMessage.value = 'Minting on NEAR blockchain...'
    progress.value = 80

    // Mint NFT on NEAR blockchain
    const blockchainResult = await nearStore.mintNFTCertificate({
      receiverId: nftForm.value.receiverId,
      title: nftForm.value.title,
      description: nftForm.value.description,
      mediaUrl: ipfsResult.mediaUrl,
      mediaHash: ipfsResult.mediaHash,
      certificateId: nftForm.value.certificateId,
      referenceUrl: ipfsResult.metadataUrl,
      referenceHash: ipfsResult.metadataHash
    })

    statusMessage.value = 'Saving to database...'
    progress.value = 90

    // Save NFT data to Firebase
    await api.mintNFTCertificate({
      ...nftData,
      blockchainHash: blockchainResult?.transaction?.hash,
      metadataUrl: ipfsResult.metadataUrl,
      metadataHash: ipfsResult.metadataHash
    })

    statusMessage.value = 'NFT Certificate minted successfully!'
    progress.value = 100

    mintSuccess.value = true
    mintedTokenId.value = nftData.tokenId
    ipfsUrl.value = ipfsResult.metadataUrl

    emit('success', {
      tokenId: nftData.tokenId,
      ipfsUrl: ipfsResult.metadataUrl,
      blockchainResult
    })

    // Reset form
    nftForm.value = {
      certificateId: '',
      receiverId: '',
      title: '',
      description: ''
    }
    selectedFile.value = null

  } catch (err) {
    console.error('NFT minting failed:', err)
    error.value = err.message || 'Failed to mint NFT certificate'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Component specific styles */
</style>
