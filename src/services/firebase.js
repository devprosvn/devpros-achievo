
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
  orderBy,
  setDoc
} from 'firebase/firestore'

// Firebase configuration từ environment variables
const firebaseConfig = {
  apiKey: "AIzaSyDGQ4YKHBOh9CJ8w7w7w7w7w7w7w7w7w7w",
  authDomain: "achievo-certificate.firebaseapp.com",
  projectId: "achievo-certificate",
  storageBucket: "achievo-certificate.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export const firebaseService = {
  // Courses operations
  async createCourse(courseData) {
    try {
      console.log('Firebase: Creating course with data:', courseData)
      
      // Clean data - remove undefined values
      const cleanData = {}
      Object.keys(courseData).forEach(key => {
        if (courseData[key] !== undefined && courseData[key] !== null) {
          cleanData[key] = courseData[key]
        }
      })
      
      const coursesRef = collection(db, 'courses')
      const docRef = await addDoc(coursesRef, {
        ...cleanData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      console.log('Firebase: Course created successfully with ID:', docRef.id)
      return { id: docRef.id, ...cleanData }
    } catch (error) {
      console.error('Firebase: Error creating course:', error)
      throw error
    }
  },

  async getCourses() {
    try {
      const coursesRef = collection(db, 'courses')
      const querySnapshot = await getDocs(coursesRef)
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
      // Clean data - remove undefined values
      const cleanData = {}
      Object.keys(courseData).forEach(key => {
        if (courseData[key] !== undefined && courseData[key] !== null) {
          cleanData[key] = courseData[key]
        }
      })
      
      const courseRef = doc(db, 'courses', courseId)
      await updateDoc(courseRef, {
        ...cleanData,
        updatedAt: new Date().toISOString()
      })
      return { id: courseId, ...cleanData }
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
      
      // Clean data - remove undefined values
      const cleanData = {}
      Object.keys(certificateData).forEach(key => {
        if (certificateData[key] !== undefined && certificateData[key] !== null) {
          cleanData[key] = certificateData[key]
        }
      })
      
      const certificatesRef = collection(db, 'certificates')
      const docRef = await addDoc(certificatesRef, {
        ...cleanData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      console.log('Firebase: Certificate created successfully with ID:', docRef.id)
      return { id: docRef.id, ...cleanData }
    } catch (error) {
      console.error('Firebase: Error creating certificate:', error)
      throw error
    }
  },

  async getCertificates() {
    try {
      const certificatesRef = collection(db, 'certificates')
      const querySnapshot = await getDocs(certificatesRef)
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
      // Clean data - remove undefined values
      const cleanData = {}
      Object.keys(certificateData).forEach(key => {
        if (certificateData[key] !== undefined && certificateData[key] !== null) {
          cleanData[key] = certificateData[key]
        }
      })
      
      const certificateRef = doc(db, 'certificates', certificateId)
      await updateDoc(certificateRef, {
        ...cleanData,
        updatedAt: new Date().toISOString()
      })
      return { id: certificateId, ...cleanData }
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
      // Clean data - remove undefined values
      const cleanData = {}
      Object.keys(roleData).forEach(key => {
        if (roleData[key] !== undefined && roleData[key] !== null) {
          cleanData[key] = roleData[key]
        }
      })
      
      const rolesRef = collection(db, 'user_roles')
      const docRef = await addDoc(rolesRef, {
        ...cleanData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      return { id: docRef.id, ...cleanData }
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
      // Clean data - remove undefined values
      const cleanData = {}
      Object.keys(roleData).forEach(key => {
        if (roleData[key] !== undefined && roleData[key] !== null) {
          cleanData[key] = roleData[key]
        }
      })
      
      const roleRef = doc(db, 'user_roles', roleId)
      await updateDoc(roleRef, {
        ...cleanData,
        updatedAt: new Date().toISOString()
      })
      return { id: roleId, ...cleanData }
    } catch (error) {
      console.error('Error updating user role:', error)
      throw error
    }
  },

  async getAllUserRoles() {
    try {
      const rolesRef = collection(db, 'user_roles')
      const querySnapshot = await getDocs(rolesRef)
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
      // Clean data - remove undefined values
      const cleanData = {}
      Object.keys(nftData).forEach(key => {
        if (nftData[key] !== undefined && nftData[key] !== null) {
          cleanData[key] = nftData[key]
        }
      })
      
      const nftRef = collection(db, 'nft_certificates')
      const docRef = await addDoc(nftRef, {
        ...cleanData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      return { id: docRef.id, ...cleanData }
    } catch (error) {
      console.error('Error creating NFT certificate:', error)
      throw error
    }
  },

  async getNFTCertificates() {
    try {
      const nftRef = collection(db, 'nft_certificates')
      const querySnapshot = await getDocs(nftRef)
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
      // Clean data - remove undefined values
      const cleanData = {}
      Object.keys(orgData).forEach(key => {
        if (orgData[key] !== undefined && orgData[key] !== null) {
          cleanData[key] = orgData[key]
        }
      })
      
      const orgsRef = collection(db, 'organizations')
      const docRef = await addDoc(orgsRef, {
        ...cleanData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      return { id: docRef.id, ...cleanData }
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
