
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'

export const useNearStore = defineStore('near', () => {
  const wallet = ref(null)
  const contract = ref(null)
  const accountId = ref(null)
  const isConnected = ref(false)

  const nearConfig = {
    networkId: "testnet",
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  }

  const initNear = async () => {
    try {
      const near = await connect(nearConfig)
      wallet.value = new WalletConnection(near, "achievo-app")
      
      if (wallet.value.getAccountId()) {
        accountId.value = wallet.value.getAccountId()
        isConnected.value = true
        
        // Initialize contract
        contract.value = new Contract(
          wallet.value.account(),
          'your-contract-id.testnet', // Replace with actual contract ID
          {
            viewMethods: ['get_certificate', 'get_all_certificates'],
            changeMethods: ['issue_certificate', 'update_certificate'],
          }
        )
      }
    } catch (error) {
      console.error('Failed to initialize NEAR:', error)
    }
  }

  const connectWallet = async (walletType = 'near') => {
    try {
      if (walletType === 'meteor') {
        // Meteor Wallet integration
        window.open('https://meteorwallet.app/', '_blank')
      } else if (walletType === 'mynear') {
        // MyNearWallet integration
        window.open('https://mynearwallet.com/', '_blank')
      } else {
        // Default NEAR wallet
        await wallet.value.requestSignIn('your-contract-id.testnet', 'Achievo App')
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const disconnectWallet = () => {
    if (wallet.value) {
      wallet.value.signOut()
      accountId.value = null
      isConnected.value = false
      contract.value = null
    }
  }

  const getCertificate = async (certificateId) => {
    if (!contract.value) return null
    try {
      return await contract.value.get_certificate({ certificate_id: certificateId })
    } catch (error) {
      console.error('Failed to get certificate:', error)
      return null
    }
  }

  const getAllCertificates = async () => {
    if (!contract.value) return []
    try {
      return await contract.value.get_all_certificates()
    } catch (error) {
      console.error('Failed to get certificates:', error)
      return []
    }
  }

  const issueCertificate = async (certificateData) => {
    if (!contract.value) return null
    try {
      return await contract.value.issue_certificate(certificateData)
    } catch (error) {
      console.error('Failed to issue certificate:', error)
      throw error
    }
  }

  return {
    wallet,
    contract,
    accountId,
    isConnected,
    initNear,
    connectWallet,
    disconnectWallet,
    getCertificate,
    getAllCertificates,
    issueCertificate
  }
})
