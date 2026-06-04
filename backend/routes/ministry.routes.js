const router = require('express').Router()
const {
  getStats,
  getStudentApplications,
  reviewStudentApplication,
  getInstituteApplications,
  reviewInstituteApplication,
} = require('../controllers/ministry.controller')
const { protect, authorize } = require('../middleware/auth.middleware')

router.get('/stats', protect, authorize('ministry'), getStats)
router.get('/applications', protect, authorize('ministry'), getStudentApplications)
router.put('/applications/:id', protect, authorize('ministry'), reviewStudentApplication)
router.get('/institutes', protect, authorize('ministry'), getInstituteApplications)
router.put('/institutes/:id', protect, authorize('ministry'), reviewInstituteApplication)

module.exports = router
