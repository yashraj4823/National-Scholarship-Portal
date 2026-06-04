const router = require('express').Router()
const { registerStudent, getProfile, updateProfile } = require('../controllers/student.controller')
const { protect, authorize } = require('../middleware/auth.middleware')

router.post('/register', registerStudent)                         // public
router.get('/profile', protect, authorize('student'), getProfile)
router.put('/profile', protect, authorize('student'), updateProfile)

module.exports = router
