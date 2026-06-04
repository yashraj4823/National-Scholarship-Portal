const router = require('express').Router()
const { registerInstitute, getProfile, getApprovedInstitutes } = require('../controllers/institute.controller')
const { protect, authorize } = require('../middleware/auth.middleware')
const { instituteUploader } = require('../middleware/upload.middleware')

// Upload up to 2 certificate files on registration
const uploadCerts = instituteUploader.fields([
  { name: 'estCert', maxCount: 1 },
  { name: 'affCert', maxCount: 1 },
])

router.post('/register', uploadCerts, registerInstitute)         // public
router.get('/', getApprovedInstitutes)                           // public — for student form dropdowns
router.get('/profile', protect, authorize('institute'), getProfile)

module.exports = router
