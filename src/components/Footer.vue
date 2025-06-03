
<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <!-- Logo Section -->
        <div class="footer-logo">
          <img src="/achievo-logo.png" alt="Achievo" class="logo" />
        </div>

        <!-- Contact Info -->
        <div class="footer-links">
          <div class="contact-item">
            <span class="contact-label">Email:</span>
            <a href="mailto:work.devpros@gmail.com" class="contact-link">
              work.devpros@gmail.com
            </a>
          </div>
          
          <div class="contact-item">
            <span class="contact-label">Facebook:</span>
            <a href="https://facebook.com/blog.devpros" target="_blank" class="contact-link">
              facebook.com/blog.devpros
            </a>
          </div>
          
          <div class="contact-item">
            <span class="contact-label">GitHub:</span>
            <a href="https://github.com/devprosvn" target="_blank" class="contact-link">
              github.com/devprosvn
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="footer-bottom">
        <p>&copy; 2025 DevPros - Achievo. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer component - no additional logic needed
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #1f2937, #374151);
  color: white;
  padding: 3rem 0 1.5rem 0;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 2rem;
}

.footer-logo {
  flex-shrink: 0;
}

.logo {
  height: 60px;
  width: auto;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  max-width: 400px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.contact-label {
  font-weight: 600;
  color: #d1d5db;
  min-width: 80px;
}

.contact-link {
  color: #93c5fd;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: #60a5fa;
  text-decoration: underline;
}

.footer-bottom {
  border-top: 1px solid #4b5563;
  padding-top: 1.5rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.9rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .footer {
    padding: 2rem 0 1rem 0;
  }

  .footer-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }

  .footer-links {
    align-items: center;
    gap: 0.75rem;
  }

  .contact-item {
    flex-direction: column;
    gap: 0.25rem;
  }

  .contact-label {
    min-width: auto;
    font-size: 0.9rem;
  }

  .logo {
    height: 50px;
  }
}
</style>
