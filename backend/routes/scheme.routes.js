const router = require('express').Router()
const {
  getAllSchemes,
  getAllSchemesAdmin,
  getSchemeById,
  createScheme,
  updateScheme,
  toggleScheme,
} = require('../controllers/scheme.controller')
const { protect, authorize } = require('../middleware/auth.middleware')

router.get('/', getAllSchemes)                                              // public
router.get('/all', protect, authorize('ministry'), getAllSchemesAdmin)      // ministry only
router.get('/:schemeId', getSchemeById)                                    // public
router.post('/', protect, authorize('ministry'), createScheme)
router.put('/:schemeId', protect, authorize('ministry'), updateScheme)
router.patch('/:schemeId/toggle', protect, authorize('ministry'), toggleScheme)

module.exports = router
