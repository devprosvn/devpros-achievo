
<template>
  <div class="home-page">
    <header class="hero-header">
      <h1 class="title">Welcome to Achievo</h1>
      <p class="subtitle">The leading platform for digital credentials</p>
      <router-link to="/register" class="btn btn-primary">Get Started</router-link>
    </header>
    
    <main class="content">
      <section class="features">
        <h2>Features</h2>
        <ul>
          <li>Issue certificates easily</li>
          <li>Validate credentials quickly</li>
          <li>Join a network of achievers</li>
        </ul>
      </section>
    </main>

    <footer class="main-footer">
      <p>&copy; 2023 Achievo. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.home-page {
  font-family: 'Aptos', sans-serif;
  color: var(--color-text);
  text-align: center;
}

.hero-header {
  background-color: #667eea;
  color: white;
  padding: 60px 20px;
}

.title {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
}

.content {
  padding: 40px 20px;
}

.features ul {
  list-style: none;
  padding: 0;
}

.features li {
  margin-bottom: 10px;
}

.main-footer {
  background-color: #222;
  color: white;
  padding: 20px 0;
}
</style>
