
import axios from 'axios'

class PinataService {
  constructor() {
    // Sử dụng environment variables từ Replit Secrets
    this.apiKey = process.env.PINATA_API_KEY
    this.apiSecret = process.env.PINATA_API_SECRET_KEY
    this.jwt = process.env.PINATA_JWT
    
    this.pinataApi = axios.create({
      baseURL: 'https://api.pinata.cloud',
      headers: {
        'pinata_api_key': this.apiKey,
        'pinata_secret_api_key': this.apiSecret,
        'Authorization': `Bearer ${this.jwt}`
      }
    })
  }

  // Tạo metadata cho chứng chỉ
  createCertificateMetadata(certificate) {
    return {
      name: `Certificate: ${certificate.title}`,
      description: `Digital certificate issued to ${certificate.recipientName}`,
      image: this.generateCertificateImageUrl(certificate),
      attributes: [
        {
          trait_type: "Certificate ID",
          value: certificate.id
        },
        {
          trait_type: "Recipient",
          value: certificate.recipientName
        },
        {
          trait_type: "Issuer",
          value: certificate.issuerName
        },
        {
          trait_type: "Course",
          value: certificate.title
        },
        {
          trait_type: "Issue Date",
          value: certificate.issueDate
        },
        {
          trait_type: "Status",
          value: certificate.status
        }
      ],
      certificate_data: {
        id: certificate.id,
        title: certificate.title,
        recipientName: certificate.recipientName,
        recipientWallet: certificate.recipientWallet,
        issuerName: certificate.issuerName,
        issuerWallet: certificate.issuerWallet,
        courseId: certificate.courseId,
        issueDate: certificate.issueDate,
        completionDate: certificate.completionDate,
        grade: certificate.grade,
        skills: certificate.skills,
        status: certificate.status
      }
    }
  }

  // Upload metadata JSON lên Pinata
  async uploadCertificateMetadata(certificate) {
    try {
      const metadata = this.createCertificateMetadata(certificate)
      
      const response = await this.pinataApi.post('/pinning/pinJSONToIPFS', {
        pinataContent: metadata,
        pinataMetadata: {
          name: `Certificate_${certificate.id}_metadata.json`,
          keyvalues: {
            certificateId: certificate.id,
            type: 'certificate_metadata'
          }
        }
      })

      return {
        success: true,
        ipfsHash: response.data.IpfsHash,
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
        metadata: metadata
      }
    } catch (error) {
      console.error('Error uploading to Pinata:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Tạo certificate image/PDF và upload lên Pinata
  async uploadCertificateFile(certificate, fileBlob) {
    try {
      const formData = new FormData()
      formData.append('file', fileBlob, `certificate_${certificate.id}.pdf`)
      
      const metadata = JSON.stringify({
        name: `Certificate_${certificate.id}.pdf`,
        keyvalues: {
          certificateId: certificate.id,
          type: 'certificate_file'
        }
      })
      formData.append('pinataMetadata', metadata)

      const response = await this.pinataApi.post('/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return {
        success: true,
        ipfsHash: response.data.IpfsHash,
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
      }
    } catch (error) {
      console.error('Error uploading file to Pinata:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Lấy thông tin file từ IPFS
  async getCertificateFromIPFS(ipfsHash) {
    try {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error fetching from IPFS:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Tạo URL cho certificate image (placeholder)
  generateCertificateImageUrl(certificate) {
    // Có thể tạo một service để generate certificate image
    return `https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Certificate+${certificate.id}`
  }

  // Generate certificate PDF content
  generateCertificatePDF(certificate) {
    // Tạo nội dung PDF đơn giản (có thể sử dụng jsPDF sau này)
    const pdfContent = `
CERTIFICATE OF COMPLETION

This is to certify that

${certificate.recipientName}

has successfully completed the course

${certificate.title}

Issued by: ${certificate.issuerName}
Issue Date: ${new Date(certificate.issueDate).toLocaleDateString()}
Certificate ID: ${certificate.id}
Grade: ${certificate.grade || 'Pass'}

Skills Acquired: ${certificate.skills?.join(', ') || 'N/A'}
    `
    
    const blob = new Blob([pdfContent], { type: 'text/plain' })
    return blob
  }

  // Mint certificate to IPFS
  async mintCertificateToIPFS(certificate) {
    try {
      // 1. Upload certificate file
      const certificateFile = this.generateCertificatePDF(certificate)
      const fileUpload = await this.uploadCertificateFile(certificate, certificateFile)
      
      if (!fileUpload.success) {
        throw new Error(`File upload failed: ${fileUpload.error}`)
      }

      // 2. Upload metadata with file reference
      const updatedCertificate = {
        ...certificate,
        fileUrl: fileUpload.ipfsUrl,
        fileHash: fileUpload.ipfsHash
      }
      
      const metadataUpload = await this.uploadCertificateMetadata(updatedCertificate)
      
      if (!metadataUpload.success) {
        throw new Error(`Metadata upload failed: ${metadataUpload.error}`)
      }

      return {
        success: true,
        certificate: updatedCertificate,
        metadataHash: metadataUpload.ipfsHash,
        metadataUrl: metadataUpload.ipfsUrl,
        fileHash: fileUpload.ipfsHash,
        fileUrl: fileUpload.ipfsUrl
      }
    } catch (error) {
      console.error('Error minting certificate to IPFS:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

export default new PinataService()
