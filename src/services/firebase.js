
import { initializeApp } from 'firebase/app'
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore'

// Firebase configuration từ environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export const firebaseService = {
  // Courses operations
  async createCourse(courseData) {
    try {
      console.log('Firebase: Creating course with data:', courseData)
      const coursesRef = collection(db, 'courses')
      const docRef = await addDoc(coursesRef, {
        ...courseData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      console.log('Firebase: Course created successfully with ID:', docRef.id)
      return { id: docRef.id, ...courseData }
    } catch (error) {
      console.error('Firebase: Error creating course:', error)
      console.error('Firebase: Error details:', error.message)
      throw error
    }
  },

  async getCourses() {
    try {
      const coursesRef = collection(db, 'courses')
      const q = query(coursesRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      const courses = []
      querySnapshot.forEach((doc) => {
        courses.push({ id: doc.id, ...doc.data() })
      })
      return courses
    } catch (error) {
      console.error('Error getting courses:', error)
      throw error
    }
  },

  async updateCourse(courseId, courseData) {
    try {
      const courseRef = doc(db, 'courses', courseId)
      await updateDoc(courseRef, {
        ...courseData,
        updatedAt: new Date()
      })
      return { id: courseId, ...courseData }
    } catch (error) {
      console.error('Error updating course:', error)
      throw error
    }
  },

  async deleteCourse(courseId) {
    try {
      const courseRef = doc(db, 'courses', courseId)
      await deleteDoc(courseRef)
      return { success: true }
    } catch (error) {
      console.error('Error deleting course:', error)
      throw error
    }
  },

  // Certificates operations
  async createCertificate(certificateData) {
    try {
      console.log('Firebase: Creating certificate with data:', certificateData)
      const certificatesRef = collection(db, 'certificates')
      const docRef = await addDoc(certificatesRef, {
        ...certificateData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      console.log('Firebase: Certificate created successfully with ID:', docRef.id)
      return { id: docRef.id, ...certificateData }
    } catch (error) {
      console.error('Firebase: Error creating certificate:', error)
      console.error('Firebase: Error details:', error.message)
      throw error
    }
  },

  async getCertificates() {
    try {
      const certificatesRef = collection(db, 'certificates')
      const q = query(certificatesRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      const certificates = []
      querySnapshot.forEach((doc) => {
        certificates.push({ id: doc.id, ...doc.data() })
      })
      return certificates
    } catch (error) {
      console.error('Error getting certificates:', error)
      throw error
    }
  },

  async updateCertificate(certificateId, certificateData) {
    try {
      const certificateRef = doc(db, 'certificates', certificateId)
      await updateDoc(certificateRef, {
        ...certificateData,
        updatedAt: new Date()
      })
      return { id: certificateId, ...certificateData }
    } catch (error) {
      console.error('Error updating certificate:', error)
      throw error
    }
  },

  async deleteCertificate(certificateId) {
    try {
      const certificateRef = doc(db, 'certificates', certificateId)
      await deleteDoc(certificateRef)
      return { success: true }
    } catch (error) {
      console.error('Error deleting certificate:', error)
      throw error
    }
  },

  // Get certificates by course
  async getCertificatesByCourse(courseId) {
    try {
      const certificatesRef = collection(db, 'certificates')
      const q = query(certificatesRef, where('courseId', '==', courseId))
      const querySnapshot = await getDocs(q)
      const certificates = []
      querySnapshot.forEach((doc) => {
        certificates.push({ id: doc.id, ...doc.data() })
      })
      return certificates
    } catch (error) {
      console.error('Error getting certificates by course:', error)
      throw error
    }
  },

  // User Roles operations
  async createUserRole(roleData) {
    try {
      const rolesRef = collection(db, 'user_roles')
      const docRef = await addDoc(rolesRef, {
        ...roleData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return { id: docRef.id, ...roleData }
    } catch (error) {
      console.error('Error creating user role:', error)
      throw error
    }
  },

  async getUserRole(walletAddress) {
    try {
      const rolesRef = collection(db, 'user_roles')
      const q = query(rolesRef, where('wallet_address', '==', walletAddress))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        return null
      }
      
      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() }
    } catch (error) {
      console.error('Error getting user role:', error)
      throw error
    }
  },

  async updateUserRole(roleId, roleData) {
    try {
      const roleRef = doc(db, 'user_roles', roleId)
      await updateDoc(roleRef, {
        ...roleData,
        updatedAt: new Date()
      })
      return { id: roleId, ...roleData }
    } catch (error) {
      console.error('Error updating user role:', error)
      throw error
    }
  },

  async getAllUserRoles() {
    try {
      const rolesRef = collection(db, 'user_roles')
      const q = query(rolesRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      const roles = []
      querySnapshot.forEach((doc) => {
        roles.push({ id: doc.id, ...doc.data() })
      })
      return roles
    } catch (error) {
      console.error('Error getting user roles:', error)
      throw error
    }
  },

  // NFT Certificates operations
  async createNFTCertificate(nftData) {
    try {
      const nftRef = collection(db, 'nft_certificates')
      const docRef = await addDoc(nftRef, {
        ...nftData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return { id: docRef.id, ...nftData }
    } catch (error) {
      console.error('Error creating NFT certificate:', error)
      throw error
    }
  },

  async getNFTCertificates() {
    try {
      const nftRef = collection(db, 'nft_certificates')
      const q = query(nftRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      const nftCertificates = []
      querySnapshot.forEach((doc) => {
        nftCertificates.push({ id: doc.id, ...doc.data() })
      })
      return nftCertificates
    } catch (error) {
      console.error('Error getting NFT certificates:', error)
      throw error
    }
  },

  async getNFTCertificatesByOwner(walletAddress) {
    try {
      const nftRef = collection(db, 'nft_certificates')
      const q = query(nftRef, where('owner_id', '==', walletAddress))
      const querySnapshot = await getDocs(q)
      const nftCertificates = []
      querySnapshot.forEach((doc) => {
        nftCertificates.push({ id: doc.id, ...doc.data() })
      })
      return nftCertificates
    } catch (error) {
      console.error('Error getting NFT certificates by owner:', error)
      throw error
    }
  },

  // Organizations operations
  async createOrganization(orgData) {
    try {
      const orgsRef = collection(db, 'organizations')
      const docRef = await addDoc(orgsRef, {
        ...orgData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return { id: docRef.id, ...orgData }
    } catch (error) {
      console.error('Error creating organization:', error)
      throw error
    }
  },

  async getOrganizations() {
    try {
      const orgsRef = collection(db, 'organizations')
      const querySnapshot = await getDocs(orgsRef)
      const organizations = []
      querySnapshot.forEach((doc) => {
        organizations.push({ id: doc.id, ...doc.data() })
      })
      return organizations
    } catch (error) {
      console.error('Error getting organizations:', error)
      throw error
    }
  }
}

export { db }
export default firebaseService
