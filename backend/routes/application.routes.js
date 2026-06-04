const router = require('express').Router()
const {
  submitApplication,
  getMyApplications,
  getApplicationById,
  getInstituteApplications,
  instituteAction,
} = require('../controllers/application.controller')
const { protect, authorize } = require('../middleware/auth.middleware')
const { applicationUploader } = require('../middleware/upload.middleware')

// Document fields for scholarship application
const uploadDocs = applicationUploader.fields([
  { name: 'domicile', maxCount: 1 },
  { name: 'photograph', maxCount: 1 },
  { name: 'instituteId', maxCount: 1 },
  { name: 'casteCertificate', maxCount: 1 },
  { name: 'prevMarksheet', maxCount: 1 },
  { name: 'feeReceipt', maxCount: 1 },
  { name: 'bankPassbook', maxCount: 1 },
  { name: 'aadharCard', maxCount: 1 },
  { name: 'marksheet10', maxCount: 1 },
  { name: 'marksheet12', maxCount: 1 },
])

// Student routes
router.post('/', protect, authorize('student'), uploadDocs, submitApplication)
router.get('/my', protect, authorize('student'), getMyApplications)

// Institute routes
router.get('/institute', protect, authorize('institute'), getInstituteApplications)
router.put(
  '/:id/institute-action',
  protect,
  authorize('institute'),
  applicationUploader.single('bonafide'),
  instituteAction
)

// Shared (any authenticated user can read a specific application)
router.get('/:id', protect, getApplicationById)

module.exports = router
