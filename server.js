
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 5000

// Middleware to parse JSON request bodies
app.use(express.json())

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

// Import Firebase service (we'll create a simplified version for server)
const createFirebaseService = () => {
  // Simplified Firebase service for server-side use
  const cleanObject = (obj) => {
    if (obj === null || obj === undefined) return {}
    if (typeof obj !== 'object' || Array.isArray(obj)) return obj
    
    const cleaned = {}
    for (const [key, value] of Object.entries(obj)) {
      if (value !== null && value !== undefined && value !== '') {
        if (typeof value === 'object' && !Array.isArray(value)) {
          const cleanedValue = cleanObject(value)
          if (Object.keys(cleanedValue).length > 0) {
            cleaned[key] = cleanedValue
          }
        } else {
          cleaned[key] = value
        }
      }
    }
    return cleaned
  }

  return {
    async createCourse(courseData) {
      console.log('Server Firebase: Creating course with data:', courseData)

      // Thoroughly clean data
      const cleanData = cleanObject(courseData)
      
      // Ensure required fields have valid values
      const finalData = {
        title: cleanData.title || 'Untitled Course',
        description: cleanData.description || 'No description provided',
        price: parseFloat(cleanData.price) || 0,
        category: cleanData.category || 'general',
        instructor: cleanData.instructor || 'Unknown Instructor',
        duration: cleanData.duration || '4 weeks',
        level: cleanData.level || 'Beginner',
        image: cleanData.image || '/vue-js-logo.png',
        skills: Array.isArray(cleanData.skills) && cleanData.skills.length > 0 ? cleanData.skills : ['learning'],
        organization_wallet: cleanData.organization_wallet || 'bernieio.testnet',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      console.log('Server Firebase: Final course data to save:', JSON.stringify(finalData, null, 2))

      // For now, simulate Firebase operation with a delay
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Generate a mock ID
      const courseId = `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      console.log('Server Firebase: Course created successfully with ID:', courseId)
      return { id: courseId, ...finalData }
    },

    async getCourses() {
      console.log('Server Firebase: Getting courses...')
      
      // Mock data for now
      const mockCourses = [
        {
          id: 'BLOCKCHAIN_101',
          title: 'Introduction to Blockchain',
          description: 'Learn the fundamentals of blockchain technology',
          category: 'blockchain',
          instructor: 'Achievo Education Institute',
          duration: '8 weeks',
          level: 'Beginner',
          price: 5,
          image: '/vue-js-logo.png',
          skills: ['blockchain', 'cryptocurrency', 'smart_contracts'],
          organization_wallet: 'bernieio.testnet',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      
      return mockCourses
    }
  }
}

const firebaseService = createFirebaseService()

// API Endpoint for creating courses
app.post('/api/courses', async (req, res) => {
  try {
    const courseData = req.body
    console.log('Backend API: Received course creation request:', courseData)
    
    // Basic server-side validation
    if (!courseData.title || !courseData.description || !courseData.price) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required course fields (title, description, price).' 
      })
    }

    if (parseFloat(courseData.price) <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Course price must be greater than 0.' 
      })
    }

    // Call Firebase Service from the backend
    const result = await firebaseService.createCourse(courseData)
    
    console.log('Backend API: Course created successfully:', result)
    res.status(201).json({ 
      success: true,
      message: 'Course created successfully', 
      data: result 
    })
  } catch (error) {
    console.error('Backend API: Error creating course:', error)
    res.status(500).json({ 
      success: false,
      message: 'Failed to create course', 
      error: error.message 
    })
  }
})

// API Endpoint for getting courses
app.get('/api/courses', async (req, res) => {
  try {
    console.log('Backend API: Received get courses request')
    
    const courses = await firebaseService.getCourses()
    
    console.log('Backend API: Retrieved courses successfully:', courses.length)
    res.status(200).json({ 
      success: true,
      data: courses 
    })
  } catch (error) {
    console.error('Backend API: Error getting courses:', error)
    res.status(500).json({ 
      success: false,
      message: 'Failed to get courses', 
      error: error.message 
    })
  }
})

// API Endpoint for updating courses
app.put('/api/courses/:id', async (req, res) => {
  try {
    const courseId = req.params.id
    const courseData = req.body
    console.log('Backend API: Received course update request:', courseId, courseData)
    
    // Basic validation
    if (!courseId) {
      return res.status(400).json({ 
        success: false,
        message: 'Course ID is required.' 
      })
    }

    // Simulate update operation
    const result = { id: courseId, ...courseData, updatedAt: new Date().toISOString() }
    
    console.log('Backend API: Course updated successfully:', result)
    res.status(200).json({ 
      success: true,
      message: 'Course updated successfully', 
      data: result 
    })
  } catch (error) {
    console.error('Backend API: Error updating course:', error)
    res.status(500).json({ 
      success: false,
      message: 'Failed to update course', 
      error: error.message 
    })
  }
})

// Serve static files from the 'dist' directory (Vite's build output)
app.use(express.static(path.join(__dirname, 'dist')))

// Handle SPA routing - serve index.html for all non-static file requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`)
  console.log(`API endpoints available:`)
  console.log(`  POST /api/courses - Create course`)
  console.log(`  GET /api/courses - Get all courses`)
  console.log(`  PUT /api/courses/:id - Update course`)
})
