
<template>
  <div class="home">
    <header class="hero-section">
      <div class="container">
        <h1>Achievo - Blockchain Certificate Platform</h1>
        <p>Secure, verifiable certificates powered by NEAR Protocol</p>
        <div class="cta-buttons">
          <router-link to="/register" class="btn btn-primary">Get Started</router-link>
          <router-link to="/certificate-validation" class="btn btn-secondary">Verify Certificate</router-link>
        </div>
      </div>
    </header>

    <section class="features">
      <div class="container">
        <div class="feature-grid">
          <div class="feature-card">
            <h3>For Students</h3>
            <p>Earn verifiable certificates and track your learning progress</p>
            <router-link to="/student-dashboard" class="btn btn-outline">Student Portal</router-link>
          </div>
          <div class="feature-card">
            <h3>For Organizations</h3>
            <p>Issue and manage certificates for your courses and programs</p>
            <router-link to="/organization-dashboard" class="btn btn-outline">Organization Portal</router-link>
          </div>
          <div class="feature-card">
            <h3>Marketplace</h3>
            <p>Discover and purchase courses and special certificates</p>
            <router-link to="/marketplace" class="btn btn-outline">Browse Marketplace</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useNearStore } from '../stores/near'

const nearStore = useNearStore()

onMounted(() => {
  nearStore.initNear()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 0;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-section h1 {
  font-size: 3.5rem;
  margin-bottom: 20px;
  font-weight: 700;
}

.hero-section p {
  font-size: 1.25rem;
  margin-bottom: 40px;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 15px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.features {
  padding: 80px 0;
  background: #f8f9fa;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.feature-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
}

.feature-card p {
  color: #666;
  margin-bottom: 25px;
  line-height: 1.6;
}
</style>
