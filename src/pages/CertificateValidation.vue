
<template>
  <div class="validation-page">
    <div class="container">
      <header class="validation-header">
        <h1>Certificate Validation</h1>
        <p>Verify the authenticity of any certificate issued on our platform</p>
      </header>

      <div class="validation-form">
        <div class="form-card">
          <h2>Enter Certificate ID</h2>
          <form @submit.prevent="validateCertificate">
            <div class="form-group">
              <label for="certificateId">Certificate ID</label>
              <input
                id="certificateId"
                v-model="certificateId"
                type="text"
                placeholder="Enter the certificate ID or hash"
                required
              />
              <small>Certificate ID can be found on the certificate document</small>
            </div>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Validating...' : 'Validate Certificate' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Validation Result -->
      <div v-if="validationResult" class="validation-result">
        <div v-if="validationResult.isValid" class="result-card valid">
          <div class="result-header">
            <div class="status-icon">✓</div>
            <h2>Certificate Valid</h2>
          </div>
          <div class="certificate-details">
            <div class="detail-row">
              <span class="label">Certificate Title:</span>
              <span class="value">{{ validationResult.certificate.title }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Recipient:</span>
              <span class="value">{{ validationResult.certificate.recipientName }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Issued by:</span>
              <span class="value">{{ validationResult.certificate.issuerName }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Issue Date:</span>
              <span class="value">{{ formatDate(validationResult.certificate.issueDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Certificate ID:</span>
              <span class="value">{{ validationResult.certificate.id }}</span>
            </div>
            <div v-if="validationResult.certificate.blockchainHash" class="detail-row">
              <span class="label">Blockchain Hash:</span>
              <span class="value">{{ validationResult.certificate.blockchainHash }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Status:</span>
              <span class="value status-badge valid">{{ validationResult.certificate.status }}</span>
            </div>
          </div>
        </div>

        <div v-else class="result-card invalid">
          <div class="result-header">
            <div class="status-icon">✗</div>
            <h2>Certificate Invalid</h2>
          </div>
          <div class="error-message">
            <p>{{ validationResult.message || 'The certificate ID you entered is not valid or does not exist in our system.' }}</p>
            <div class="suggestions">
              <h3>Please check:</h3>
              <ul>
                <li>The certificate ID is entered correctly</li>
                <li>The certificate was issued through our platform</li>
                <li>The certificate has not been revoked</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Validations -->
      <div v-if="recentValidations.length > 0" class="recent-validations">
        <h2>Recent Validations</h2>
        <div class="validations-list">
          <div v-for="validation in recentValidations" :key="validation.id" class="validation-item">
            <div class="validation-info">
              <span class="validation-id">{{ validation.certificateId }}</span>
              <span class="validation-date">{{ formatDate(validation.date) }}</span>
            </div>
            <div class="validation-status" :class="validation.isValid ? 'valid' : 'invalid'">
              {{ validation.isValid ? 'Valid' : 'Invalid' }}
            </div>
          </div>
        </div>
      </div>

      <!-- How it Works -->
      <div class="how-it-works">
        <h2>How Certificate Validation Works</h2>
        <div class="steps-grid">
          <div class="step">
            <div class="step-number">1</div>
            <h3>Enter Certificate ID</h3>
            <p>Input the unique identifier found on the certificate</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>Blockchain Verification</h3>
            <p>We check the certificate against our NEAR blockchain records</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>Instant Results</h3>
            <p>Get immediate verification of the certificate's authenticity</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNearStore } from '../stores/near'
import { api } from '../services/api'

const nearStore = useNearStore()

const certificateId = ref('')
const loading = ref(false)
const validationResult = ref(null)
const recentValidations = ref([])

const validateCertificate = async () => {
  if (!certificateId.value.trim()) return

  loading.value = true
  validationResult.value = null

  try {
    // First try to validate through API
    const response = await api.validateCertificate(certificateId.value)
    
    if (response.data.isValid) {
      validationResult.value = response.data
    } else {
      // If API validation fails, try blockchain validation
      await validateOnBlockchain()
    }

    // Add to recent validations
    addToRecentValidations(certificateId.value, validationResult.value?.isValid || false)
    
  } catch (error) {
    console.error('Validation error:', error)
    // Try blockchain validation as fallback
    await validateOnBlockchain()
  } finally {
    loading.value = false
  }
}

const validateOnBlockchain = async () => {
  try {
    if (!nearStore.contract) {
      await nearStore.initNear()
    }

    if (nearStore.contract) {
      const certificate = await nearStore.getCertificate(certificateId.value)
      
      if (certificate) {
        validationResult.value = {
          isValid: true,
          certificate: {
            id: certificateId.value,
            title: certificate.title || 'Certificate',
            recipientName: certificate.recipient_name || 'Unknown',
            issuerName: certificate.issuer_name || 'Unknown',
            issueDate: certificate.issue_date || new Date().toISOString(),
            status: certificate.status || 'Valid',
            blockchainHash: certificate.hash || certificateId.value
          }
        }
      } else {
        validationResult.value = {
          isValid: false,
          message: 'Certificate not found on blockchain'
        }
      }
    } else {
      validationResult.value = {
        isValid: false,
        message: 'Unable to connect to blockchain for verification'
      }
    }
  } catch (error) {
    console.error('Blockchain validation error:', error)
    validationResult.value = {
      isValid: false,
      message: 'Error validating certificate on blockchain'
    }
  }
}

const addToRecentValidations = (certId, isValid) => {
  const newValidation = {
    id: Date.now(),
    certificateId: certId,
    isValid: isValid,
    date: new Date().toISOString()
  }
  
  recentValidations.value.unshift(newValidation)
  recentValidations.value = recentValidations.value.slice(0, 5) // Keep only last 5
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.validation-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 40px 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.validation-header {
  text-align: center;
  margin-bottom: 50px;
}

.validation-header h1 {
  font-size: 3rem;
  color: #2c3e50;
  margin-bottom: 15px;
}

.validation-header p {
  font-size: 1.2rem;
  color: #666;
}

.validation-form {
  margin-bottom: 40px;
}

.form-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.form-card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
}

.form-group small {
  color: #666;
  font-size: 0.9rem;
  display: block;
  margin-top: 5px;
}

.btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-primary:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.validation-result {
  margin-bottom: 40px;
}

.result-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.result-card.valid {
  border-left: 5px solid #27ae60;
}

.result-card.invalid {
  border-left: 5px solid #e74c3c;
}

.result-header {
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  background: #f8f9fa;
}

.status-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: bold;
  color: white;
}

.valid .status-icon {
  background: #27ae60;
}

.invalid .status-icon {
  background: #e74c3c;
}

.result-header h2 {
  margin: 0;
  color: #2c3e50;
}

.certificate-details {
  padding: 30px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #ecf0f1;
}

.detail-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #555;
}

.value {
  color: #2c3e50;
  word-break: break-all;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.status-badge.valid {
  background: #d4edda;
  color: #155724;
}

.error-message {
  padding: 30px;
}

.error-message p {
  color: #666;
  margin-bottom: 20px;
}

.suggestions h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.suggestions ul {
  color: #666;
  padding-left: 20px;
}

.suggestions li {
  margin-bottom: 5px;
}

.recent-validations {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.recent-validations h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.validations-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.validation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.validation-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.validation-id {
  font-weight: 600;
  color: #2c3e50;
}

.validation-date {
  font-size: 0.9rem;
  color: #666;
}

.validation-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.validation-status.valid {
  background: #d4edda;
  color: #155724;
}

.validation-status.invalid {
  background: #f8d7da;
  color: #721c24;
}

.how-it-works {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.how-it-works h2 {
  text-align: center;
  margin-bottom: 40px;
  color: #2c3e50;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.step {
  text-align: center;
}

.step-number {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin: 0 auto 20px;
}

.step h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.step p {
  color: #666;
  line-height: 1.6;
}
</style>
