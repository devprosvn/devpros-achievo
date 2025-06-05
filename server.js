
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

// Fallback to index.html for all other routes (Vue Router history mode)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`)
})
