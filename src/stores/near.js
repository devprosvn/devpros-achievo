
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { setupWalletSelector } from '@near-wallet-selector/core'
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet'
import { setupMeteorWalletApp } from '@near-wallet-selector/meteor-wallet-app'
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet'
import { setupModal } from '@near-wallet-selector/modal-ui'

export const useNearStore = defineStore('near', () => {
  const selector = ref(null)
  const wallet = ref(null)
  const modal = ref(null)
  const accounts = ref([])
  const accountId = ref(null)
  const isConnected = ref(false)
  const isLoading = ref(false)

  const nearConfig = {
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
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
      
      selector.value = await setupWalletSelector({
        network: nearConfig.networkId,
        debug: true,
        modules: [
          setupMeteorWallet(),
          setupMeteorWalletApp(),
          setupMyNearWallet()
        ],
      })

      modal.value = setupModal(selector.value, {
        contractId: 'bernieio.testnet'
      })

      const state = selector.value.store.getState()
      accounts.value = state.accounts
      
      if (state.accounts.length > 0) {
        accountId.value = state.accounts[0].accountId
        isConnected.value = true
        wallet.value = await selector.value.wallet()
      }

      // Subscribe to state changes
      selector.value.store.observable.subscribe((state) => {
        accounts.value = state.accounts
        if (state.accounts.length > 0) {
          accountId.value = state.accounts[0].accountId
          isConnected.value = true
        } else {
          accountId.value = null
          isConnected.value = false
          wallet.value = null
        }
      })

    } catch (error) {
      console.warn('NEAR initialization failed:', error)
    }
  }

  const connectWallet = async (walletType = 'meteor') => {
    try {
      isLoading.value = true
      
      if (!selector.value) {
        await initNear()
      }

      let walletId
      switch (walletType) {
        case 'meteor':
          walletId = 'meteor-wallet'
          break
        case 'meteor-app':
          walletId = 'meteor-wallet-app'
          break
        case 'mynear':
          walletId = 'my-near-wallet'
          break
        default:
          walletId = 'meteor-wallet'
      }

      const selectedWallet = await selector.value.wallet(walletId)
      
      await selectedWallet.signIn({
        contractId: 'bernieio.testnet',
        methodNames: ['issue_certificate', 'update_certificate', 'revoke_certificate']
      })

      wallet.value = selectedWallet
      
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const disconnectWallet = async () => {
    try {
      if (wallet.value) {
        await wallet.value.signOut()
      }
      accountId.value = null
      isConnected.value = false
      wallet.value = null
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }

  const callMethod = async (methodName, args = {}, gas = '300000000000000', deposit = '0') => {
    if (!wallet.value) throw new Error('Wallet not connected')
    
    try {
      isLoading.value = true
      const result = await wallet.value.signAndSendTransaction({
        signerId: accountId.value,
        receiverId: 'bernieio.testnet',
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName,
              args,
              gas,
              deposit
            }
          }
        ]
      })
      return result
    } catch (error) {
      console.error(`Failed to call ${methodName}:`, error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const viewMethod = async (methodName, args = {}) => {
    if (!selector.value) return null
    
    try {
      const { network } = selector.value.options
      const provider = new providers.JsonRpcProvider({ url: network.nodeUrl })
      
      const result = await provider.query({
        request_type: 'call_function',
        account_id: 'bernieio.testnet',
        method_name: methodName,
        args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
        finality: 'final'
      })
      
      return JSON.parse(Buffer.from(result.result).toString())
    } catch (error) {
      console.error(`Failed to call view method ${methodName}:`, error)
      return null
    }
  }

  const getCertificate = async (certificateId) => {
    return await viewMethod('get_certificate', { certificate_id: certificateId })
  }

  const getAllCertificates = async () => {
    return await viewMethod('get_all_certificates') || []
  }

  const getUserCertificates = async (userId) => {
    return await viewMethod('get_user_certificates', { user_id: userId }) || []
  }

  const issueCertificate = async (certificateData) => {
    return await callMethod('issue_certificate', {
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
  }

  const updateCertificate = async (certificateId, updateData) => {
    return await callMethod('update_certificate', {
      certificate_id: certificateId,
      ...updateData
    })
  }

  const revokeCertificate = async (certificateId) => {
    return await callMethod('revoke_certificate', {
      certificate_id: certificateId
    })
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
    selector,
    wallet,
    modal,
    accounts,
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
