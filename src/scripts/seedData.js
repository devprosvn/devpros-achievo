
import firebaseService from '../services/firebase.js'

// Mock data from api.js
const mockCourses = [
  {
    title: 'Introduction to Blockchain',
    description: 'Learn the fundamentals of blockchain technology',
    category: 'blockchain',
    instructor: 'Achievo Education Institute',
    duration: '8 weeks',
    level: 'Beginner',
    priceNEAR: '5',
    priceUSD: '15',
    image: '/vue-js-logo.png',
    skills: ['blockchain', 'cryptocurrency', 'smart_contracts'],
    organization_wallet: 'achievo-org.testnet'
  },
  {
    title: 'Web3 Development',
    description: 'Build decentralized applications on NEAR Protocol',
    category: 'development',
    instructor: 'Achievo Education Institute',
    duration: '12 weeks',
    level: 'Intermediate',
    priceNEAR: '10',
    priceUSD: '30',
    image: '/ui-ux-design-banner.png',
    skills: ['web3', 'smart_contracts', 'dapp_development', 'near_protocol'],
    organization_wallet: 'achievo-org.testnet'
  },
  {
    title: 'DeFi Fundamentals',
    description: 'Understanding Decentralized Finance protocols',
    category: 'finance',
    instructor: 'Achievo Education Institute',
    duration: '6 weeks',
    level: 'Beginner',
    priceNEAR: '7',
    priceUSD: '21',
    image: '/digital-marketing-banner.png',
    skills: ['defi', 'liquidity_pools', 'yield_farming', 'tokenomics'],
    organization_wallet: 'achievo-org.testnet'
  }
]

const mockCertificates = [
  {
    certificate_id: 'CERT_001',
    title: 'Introduction to Blockchain',
    recipientName: 'John Student',
    recipientWallet: 'achievo-student.testnet',
    issuerName: 'Achievo Education Institute',
    issuerWallet: 'achievo-org.testnet',
    courseId: 'BLOCKCHAIN_101',
    issueDate: '2024-02-15',
    completionDate: '2024-02-15',
    grade: 'A',
    skills: ['blockchain', 'cryptocurrency', 'smart_contracts'],
    status: 'verified',
    blockchainHash: 'QmSampleHash123456789',
    studentEmail: 'student@achievo.io'
  }
]

const mockOrganizations = [
  {
    name: 'Achievo Education Institute',
    email: 'contact@achievo-edu.org',
    wallet_address: 'achievo-org.testnet',
    type: 'organization',
    verified: true,
    description: 'Leading blockchain education institute',
    website: 'https://achievo-edu.org'
  }
]

async function seedData() {
  try {
    console.log('🌱 Starting to seed data to Firebase...')
    
    // Seed courses
    console.log('📚 Seeding courses...')
    for (const course of mockCourses) {
      try {
        const result = await firebaseService.createCourse(course)
        console.log(`✅ Created course: ${course.title}`)
      } catch (error) {
        console.error(`❌ Failed to create course ${course.title}:`, error.message)
      }
    }
    
    // Seed organizations
    console.log('🏢 Seeding organizations...')
    for (const org of mockOrganizations) {
      try {
        const result = await firebaseService.createOrganization(org)
        console.log(`✅ Created organization: ${org.name}`)
      } catch (error) {
        console.error(`❌ Failed to create organization ${org.name}:`, error.message)
      }
    }
    
    // Seed certificates
    console.log('🎓 Seeding certificates...')
    for (const cert of mockCertificates) {
      try {
        const result = await firebaseService.createCertificate(cert)
        console.log(`✅ Created certificate: ${cert.title}`)
      } catch (error) {
        console.error(`❌ Failed to create certificate ${cert.title}:`, error.message)
      }
    }
    
    console.log('🎉 Data seeding completed successfully!')
    
  } catch (error) {
    console.error('💥 Error during data seeding:', error)
  }
}

// Run the seeding if this file is executed directly
if (typeof window === 'undefined') {
  seedData()
}

export { seedData, mockCourses, mockCertificates, mockOrganizations }
