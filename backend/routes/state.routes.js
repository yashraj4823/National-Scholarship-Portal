const router = require('express').Router()
const {
  getStudentApplications,
  reviewStudentApplication,
  getInstituteApplications,
  reviewInstituteApplication,
} = require('../controllers/state.controller')
const { protect, authorize } = require('../middleware/auth.middleware')

router.get('/applications', protect, authorize('state'), getStudentApplications)
router.put('/applications/:id', protect, authorize('state'), reviewStudentApplication)
router.get('/institutes', protect, authorize('state'), getInstituteApplications)
router.put('/institutes/:id', protect, authorize('state'), reviewInstituteApplication)

module.exports = router
