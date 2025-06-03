
<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-form">
        <h2>Register for Achievo</h2>
        
        <div class="user-type-selector">
          <button 
            @click="userType = 'student'" 
            :class="{ active: userType === 'student' }"
            class="type-btn"
          >
            Student
          </button>
          <button 
            @click="userType = 'organization'" 
            :class="{ active: userType === 'organization' }"
            class="type-btn"
          >
            Organization
          </button>
        </div>

        <form @submit.prevent="handleRegister">
          <!-- Student Form -->
          <div v-if="userType === 'student'">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input
                id="name"
                v-model="studentForm.name"
                type="text"
                required
                placeholder="Enter your full name"
              />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                v-model="studentForm.email"
                type="email"
                required
                placeholder="Enter your email"
              />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input
                id="password"
                v-model="studentForm.password"
                type="password"
                required
                placeholder="Enter your password"
              />
            </div>
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input
                id="phone"
                v-model="studentForm.phone"
                type="tel"
                placeholder="Enter your phone number"
              />
            </div>
            <div class="form-group">
              <label for="dateOfBirth">Date of Birth</label>
              <input
                id="dateOfBirth"
                v-model="studentForm.dateOfBirth"
                type="date"
              />
            </div>
          </div>

          <!-- Organization Form -->
          <div v-else>
            <div class="form-group">
              <label for="orgName">Organization Name</label>
              <input
                id="orgName"
                v-model="orgForm.organizationName"
                type="text"
                required
                placeholder="Enter organization name"
              />
            </div>
            <div class="form-group">
              <label for="orgEmail">Organization Email</label>
              <input
                id="orgEmail"
                v-model="orgForm.email"
                type="email"
                required
                placeholder="Enter organization email"
              />
            </div>
            <div class="form-group">
              <label for="orgPassword">Password</label>
              <input
                id="orgPassword"
                v-model="orgForm.password"
                type="password"
                required
                placeholder="Enter password"
              />
            </div>
            <div class="form-group">
              <label for="orgAddress">Address</label>
              <textarea
                id="orgAddress"
                v-model="orgForm.address"
                placeholder="Enter organization address"
                rows="3"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="orgWebsite">Website</label>
              <input
                id="orgWebsite"
                v-model="orgForm.website"
                type="url"
                placeholder="Enter organization website"
              />
            </div>
            <div class="form-group">
              <label for="orgDescription">Description</label>
              <textarea
                id="orgDescription"
                v-model="orgForm.description"
                placeholder="Enter organization description"
                rows="3"
              ></textarea>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Registering...' : 'Register' }}
          </button>
        </form>

        <p class="register-footer">
          Already have an account? <router-link to="/login">Login here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const userType = ref('student')

const studentForm = ref({
  name: '',
  email: '',
  password: '',
  phone: '',
  dateOfBirth: ''
})

const orgForm = ref({
  organizationName: '',
  email: '',
  password: '',
  address: '',
  website: '',
  description: ''
})

const handleRegister = async () => {
  loading.value = true
  try {
    if (userType.value === 'student') {
      await authStore.register({
        ...studentForm.value,
        userType: 'student'
      })
    } else {
      await authStore.registerOrganization({
        ...orgForm.value,
        userType: 'organization'
      })
    }
    
    alert('Registration successful! Please login.')
    router.push('/login')
  } catch (error) {
    alert('Registration failed: ' + error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 0;
}

.register-container {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

.register-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.user-type-selector {
  display: flex;
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e1e5e9;
}

.type-btn {
  flex: 1;
  padding: 15px;
  background: #f8f9fa;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.type-btn.active {
  background: #667eea;
  color: white;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #555;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
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
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a6fd8;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.register-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.register-footer a {
  color: #667eea;
  text-decoration: none;
}

.register-footer a:hover {
  text-decoration: underline;
}
</style>
