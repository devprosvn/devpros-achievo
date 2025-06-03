
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'

export const useNearStore = defineStore('near', () => {
  const wallet = ref(null)
  const contract = ref(null)
  const accountId = ref(null)
  const isConnected = ref(false)
  const isLoading = ref(false)

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
      if (typeof window === 'undefined') {
        console.log('NEAR initialization skipped (not in browser)')
        return
      }
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const near = await connect(nearConfig)
      wallet.value = new WalletConnection(near, "achievo-app")
      
      if (wallet.value.getAccountId()) {
        accountId.value = wallet.value.getAccountId()
        isConnected.value = true
        
        contract.value = new Contract(
          wallet.value.account(),
          'bernieio.testnet',
          {
            viewMethods: ['get_certificate', 'get_all_certificates', 'get_user_certificates'],
            changeMethods: ['issue_certificate', 'update_certificate', 'revoke_certificate'],
          }
        )
      }
    } catch (error) {
      console.warn('NEAR initialization failed:', error)
    }
  }

  const connectWallet = async (walletType = 'near') => {
    try {
      isLoading.value = true
      
      if (walletType === 'meteor') {
        window.open('https://meteorwallet.app/', '_blank')
      } else if (walletType === 'mynear') {
        window.open('https://mynearwallet.com/', '_blank')
      } else {
        await wallet.value.requestSignIn('bernieio.testnet', 'Achievo App')
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    } finally {
      isLoading.value = false
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

  const getUserCertificates = async (userId) => {
    if (!contract.value) return []
    try {
      return await contract.value.get_user_certificates({ user_id: userId })
    } catch (error) {
      console.error('Failed to get user certificates:', error)
      return []
    }
  }

  const issueCertificate = async (certificateData) => {
    if (!contract.value) throw new Error('Contract not initialized')
    try {
      isLoading.value = true
      const result = await contract.value.issue_certificate({
        certificate_id: certificateData.id,
        title: certificateData.title,
        recipient_name: certificateData.recipientName,
        recipient_email: certificateData.recipientEmail,
        issuer_name: certificateData.issuerName,
        issuer_id: certificateData.issuerId,
        course_id: certificateData.courseId,
        issue_date: certificateData.issueDate,
        metadata: certificateData.metadata || {}
      })
      return result
    } catch (error) {
      console.error('Failed to issue certificate:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateCertificate = async (certificateId, updateData) => {
    if (!contract.value) throw new Error('Contract not initialized')
    try {
      isLoading.value = true
      const result = await contract.value.update_certificate({
        certificate_id: certificateId,
        ...updateData
      })
      return result
    } catch (error) {
      console.error('Failed to update certificate:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const revokeCertificate = async (certificateId) => {
    if (!contract.value) throw new Error('Contract not initialized')
    try {
      isLoading.value = true
      const result = await contract.value.revoke_certificate({
        certificate_id: certificateId
      })
      return result
    } catch (error) {
      console.error('Failed to revoke certificate:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const validateCertificate = async (certificateId) => {
    try {
      const certificate = await getCertificate(certificateId)
      if (!certificate) {
        return { isValid: false, message: 'Certificate not found' }
      }
      
      return {
        isValid: certificate.status !== 'revoked',
        certificate: {
          id: certificateId,
          title: certificate.title,
          recipientName: certificate.recipient_name,
          recipientEmail: certificate.recipient_email,
          issuerName: certificate.issuer_name,
          issueDate: certificate.issue_date,
          status: certificate.status || 'valid',
          blockchainHash: certificate.hash || certificateId
        }
      }
    } catch (error) {
      console.error('Failed to validate certificate:', error)
      return { isValid: false, message: 'Validation failed' }
    }
  }

  return {
    wallet,
    contract,
    accountId,
    isConnected,
    isLoading,
    initNear,
    connectWallet,
    disconnectWallet,
    getCertificate,
    getAllCertificates,
    getUserCertificates,
    issueCertificate,
    updateCertificate,
    revokeCertificate,
    validateCertificate
  }
})
