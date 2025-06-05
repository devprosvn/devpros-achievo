
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 5000 // Use port 5000 for Replit

// Serve static files from the 'dist' directory (Vite's build output)
app.use(express.static(path.join(__dirname, 'dist')))

// Serve static files first, then fallback to index.html for SPA routes
app.get('*', (req, res) => {
  // Check if requested file exists in dist folder
  const requestedPath = path.join(__dirname, 'dist', req.path)
  if (req.path !== '/' && require('fs').existsSync(requestedPath)) {
    res.sendFile(requestedPath)
  } else {
    // Fallback to index.html for Vue Router history mode
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  }
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`)
})
