
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
      const coursesRef = collection(db, 'courses')
      const docRef = await addDoc(coursesRef, {
        ...courseData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return { id: docRef.id, ...courseData }
    } catch (error) {
      console.error('Error creating course:', error)
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
      const certificatesRef = collection(db, 'certificates')
      const docRef = await addDoc(certificatesRef, {
        ...certificateData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return { id: docRef.id, ...certificateData }
    } catch (error) {
      console.error('Error creating certificate:', error)
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
