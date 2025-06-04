
// Standalone script to seed data to Firebase
import { seedData } from './src/scripts/seedData.js'

console.log('🚀 Starting database seeding process...')
seedData()
  .then(() => {
    console.log('✨ Database seeding completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Database seeding failed:', error)
    process.exit(1)
  })
