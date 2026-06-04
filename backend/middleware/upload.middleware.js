const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../utils/cloudinary')

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB

/**
 * Creates a multer uploader using Cloudinary storage.
 * @param {string} subfolder - e.g. 'applications', 'institutes'
 */
const createUploader = (subfolder) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `nsp/${subfolder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
      resource_type: 'auto',
    },
  })

  const fileFilter = (_req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPEG, PNG, WEBP, and PDF files are allowed'), false)
    }
  }

  return multer({ storage, fileFilter, limits: { fileSize: MAX_FILE_SIZE } })
}

const applicationUploader = createUploader('applications')
const instituteUploader = createUploader('institutes')

module.exports = { applicationUploader, instituteUploader }
