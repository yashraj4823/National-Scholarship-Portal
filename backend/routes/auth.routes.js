const router = require('express').Router()
const { login, getMe, resetPassword } = require('../controllers/auth.controller')
const { protect } = require('../middleware/auth.middleware')

router.post('/login', login)
router.post('/reset-password', resetPassword)
router.get('/me', protect, getMe)

module.exports = router
