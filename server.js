
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 5000

// Serve static files from the 'dist' directory (Vite's build output)
app.use(express.static(path.join(__dirname, 'dist')))

// Handle SPA routing - serve index.html for all non-static file requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`)
})
