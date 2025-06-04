
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { setupWalletSelector } from '@near-wallet-selector/core'
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet'
// import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet'
import { setupModal } from '@near-wallet-selector/modal-ui'
import { providers } from 'near-api-js'
import { Buffer } from 'buffer'

export const useNearStore = defineStore('near', () => {
  const selector = ref(null)
  const wallet = ref(null)
  const modal = ref(null)
  const accounts = ref([])
  const accountId = ref(null)
  const isConnected = ref(false)
  const isLoading = ref(false)
  const isInitializing = ref(false)

  let initializationPromise = null

  const nearConfig = {
    networkId: "testnet",
    nodeUrl: "https://rpc.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
  }

  // Contract owner account
  const adminAccount = "bernieio.testnet"

  // Hàm nội bộ thực hiện khởi tạo
  const _doInitNear = async () => {
    if (typeof window === 'undefined') {
      console.log('NEAR initialization skipped (not in browser environment).')
      throw new Error('NEAR initialization skipped (not in browser environment).')
    }

    console.log('Initializing NEAR wallet selector...')
    isInitializing.value = true

    try {
      const newSelector = await setupWalletSelector({
        network: nearConfig.networkId,
        debug: true,
        modules: [
          setupMeteorWallet(),
          // setupMyNearWallet(),
        ],
      })
      console.log('NEAR wallet selector initialized successfully.')

      selector.value = newSelector

      modal.value = setupModal(newSelector, {
        contractId: 'bernieio.testnet',
      })

      const state = newSelector.store.getState()
      accounts.value = state.accounts
      
      if (state.accounts.length > 0) {
        accountId.value = state.accounts[0].accountId
        isConnected.value = true
        wallet.value = await newSelector.wallet()
      }

      // Theo dõi thay đổi trạng thái của selector
      newSelector.store.observable.subscribe((currentState) => {
        console.log('Wallet selector state changed:', currentState)
        accounts.value = currentState.accounts
        if (currentState.accounts.length > 0) {
          accountId.value = currentState.accounts[0].accountId
          isConnected.value = true
          newSelector.wallet().then(w => { wallet.value = w }).catch(console.error)
        } else {
          accountId.value = null
          isConnected.value = false
          wallet.value = null
        }
      })
      
      return newSelector
    } catch (error) {
      console.error('NEAR initialization failed:', error)
      selector.value = null
      initializationPromise = null
      throw error
    } finally {
      isInitializing.value = false
    }
  }

  // Hàm initNear được export ra ngoài
  const initNear = () => {
    if (selector.value) {
      return Promise.resolve(selector.value)
    }
    if (!initializationPromise) {
      initializationPromise = _doInitNear()
    }
    return initializationPromise
  }

  const connectWallet = async (walletType) => {
    isLoading.value = true
    try {
      const currentSelector = await initNear()
      
      if (!currentSelector) {
        throw new Error('NEAR wallet selector not initialized after initNear call.')
      }

      let walletIdToConnect
      switch (walletType) {
        case 'meteor':
          walletIdToConnect = 'meteor-wallet'
          break
        case 'mynear':
          walletIdToConnect = 'my-near-wallet'
          break
        default:
          if (modal.value) {
            console.log('Showing wallet selector modal.')
            modal.value.show()
            isLoading.value = false
            return
          } else {
            throw new Error(`Wallet type '${walletType}' is not recognized and modal is not available.`)
          }
      }
      
      console.log(`Attempting to connect to wallet ID: ${walletIdToConnect}`)

      const selectedWalletInstance = await currentSelector.wallet(walletIdToConnect)

      if (!selectedWalletInstance) {
        throw new Error(`Could not get wallet instance for ${walletIdToConnect}.`)
      }

      await selectedWalletInstance.signIn({
        contractId: 'bernieio.testnet',
      })

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
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }

  const callMethod = async (methodName, args = {}, gas = '300000000000000', deposit = '0') => {
    if (!wallet.value || !isConnected.value || !accountId.value) {
      throw new Error('Wallet not connected or accountId not available for callMethod')
    }
    
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
              deposit,
            },
          },
        ],
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
    const currentSelector = selector.value
    if (!currentSelector) {
      console.warn("Selector not initialized for viewMethod. Attempting to initialize...")
      try {
        await initNear()
        const recheckedSelector = selector.value
        if (!recheckedSelector) {
          console.error("Selector still not initialized after attempt.")
          return null
        }
        const { network: recheckedNetwork } = recheckedSelector.options
        const recheckedProvider = new providers.JsonRpcProvider({ url: recheckedNetwork.nodeUrl })
        const recheckedResult = await recheckedProvider.query({
          request_type: 'call_function',
          account_id: 'bernieio.testnet',
          method_name: methodName,
          args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
          finality: 'optimistic',
        })
        return JSON.parse(Buffer.from(recheckedResult.result).toString())
      } catch(initError) {
        console.error("Failed to initialize selector for viewMethod:", initError)
        return null
      }
    }
    
    try {
      const { network } = currentSelector.options
      const provider = new providers.JsonRpcProvider({ url: network.nodeUrl })
      
      const result = await provider.query({
        request_type: 'call_function',
        account_id: 'bernieio.testnet',
        method_name: methodName,
        args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
        finality: 'optimistic',
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
      metadata: certificateData.metadata || {},
    })
  }

  const updateCertificate = async (certificateId, updateData) => {
    return await callMethod('update_certificate', {
      certificate_id: certificateId,
      ...updateData,
    })
  }

  const revokeCertificate = async (certificateId) => {
    return await callMethod('revoke_certificate', {
      certificate_id: certificateId,
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
          blockchainHash: certificate.hash || certificateId,
        },
      }
    } catch (error) {
      console.error('Failed to validate certificate:', error)
      return { isValid: false, message: 'Validation failed' }
    }
  }

  // NFT Certificate Functions
  const mintNFTCertificate = async (certificateData) => {
    return await callMethod('mint_nft_certificate', {
      receiver_id: certificateData.receiverId,
      metadata: {
        title: certificateData.title || 'Achievement Certificate',
        description: certificateData.description || 'Digital certificate of achievement',
        media: certificateData.mediaUrl,
        media_hash: certificateData.mediaHash,
        extra: certificateData.certificateId ? `certificate_id:${certificateData.certificateId}` : undefined,
        reference: certificateData.referenceUrl,
        reference_hash: certificateData.referenceHash
      },
      certificate_id: certificateData.certificateId
    })
  }

  const getNFTToken = async (tokenId) => {
    return await viewMethod('nft_token', { token_id: tokenId })
  }

  const getNFTTokensForOwner = async (accountId, fromIndex = 0, limit = 50) => {
    return await viewMethod('nft_tokens_for_owner', { 
      account_id: accountId, 
      from_index: fromIndex, 
      limit: limit 
    }) || []
  }

  const getNFTSupplyForOwner = async (accountId) => {
    return await viewMethod('nft_supply_for_owner', { account_id: accountId }) || 0
  }

  const transferNFT = async (receiverId, tokenId, memo) => {
    return await callMethod('nft_transfer', {
      receiver_id: receiverId,
      token_id: tokenId,
      memo: memo
    })
  }

  const approveNFT = async (tokenId, accountId) => {
    return await callMethod('nft_approve', {
      token_id: tokenId,
      account_id: accountId
    })
  }

  const revokeNFTApproval = async (tokenId, accountId) => {
    return await callMethod('nft_revoke', {
      token_id: tokenId,
      account_id: accountId
    })
  }

  const getNFTMetadata = async () => {
    return await viewMethod('nft_metadata') || {
      spec: "nft-1.0.0",
      name: "Achievo Certificates",
      symbol: "ACHIEVO"
    }
  }

  // Tự động khởi tạo NEAR khi store được sử dụng lần đầu ở client-side
  if (typeof window !== 'undefined') {
    initNear().catch(err => console.error("Auto-init Near failed during store setup:", err))
  }

  return {
    selector,
    wallet,
    modal,
    accounts,
    accountId,
    isConnected,
    isLoading,
    isInitializing,
    initNear,
    connectWallet,
    disconnectWallet,
    callMethod,
    viewMethod,
    getCertificate,
    getAllCertificates,
    getUserCertificates,
    issueCertificate,
    updateCertificate,
    revokeCertificate,
    validateCertificate,
    mintNFTCertificate,
    getNFTToken,
    getNFTTokensForOwner,
    getNFTSupplyForOwner,
    transferNFT,
    approveNFT,
    revokeNFTApproval,
    getNFTMetadata,
  }
})
