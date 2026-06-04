const Application = require('../models/Application')
const Institute = require('../models/Institute')
const Student = require('../models/Student')
const Scheme = require('../models/Scheme')

/**
 * GET /api/ministry/stats
 * Dashboard summary statistics.
 */
const getStats = async (req, res) => {
  try {
    const [totalApps, granted, pending, institutes, totalStudents] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ status: 'granted' }),
      Application.countDocuments({ status: 'state_forwarded' }),
      Institute.countDocuments({ status: 'approved' }),
      Student.countDocuments(),
    ])

    return res.json({
      totalApplications: totalApps,
      scholarshipsGranted: granted,
      pendingReview: pending,
      institutesRegistered: institutes,
      totalStudents,
    })
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * GET /api/ministry/applications
 * Ministry fetches applications forwarded by State (state_forwarded).
 */
const getStudentApplications = async (req, res) => {
  try {
    const apps = await Application.find({ status: 'state_forwarded' })
      .populate('student', 'name uid mobile state district bankAccount bankName bankIfsc')
      .populate('scheme', 'name schemeId amount')
      .sort({ createdAt: -1 })
    return res.json(apps)
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * PUT /api/ministry/applications/:id
 * Ministry grants or rejects a scholarship application.
 * Body: { action: 'grant' | 'reject', remarks, grantedAmount }
 */
const reviewStudentApplication = async (req, res) => {
  const { action, remarks, grantedAmount } = req.body
  if (!['grant', 'reject'].includes(action)) {
    return res.status(400).json({ message: "Action must be 'grant' or 'reject'" })
  }
  try {
    const app = await Application.findById(req.params.id)
    if (!app) return res.status(404).json({ message: 'Application not found' })
    if (app.status !== 'state_forwarded') {
      return res.status(400).json({ message: 'Application is not in state_forwarded state' })
    }

    app.status = action === 'grant' ? 'granted' : 'ministry_rejected'
    app.ministryRemarks = remarks || ''
    if (action === 'grant' && grantedAmount) app.grantedAmount = grantedAmount
    await app.save()

    return res.json({
      message: action === 'grant'
        ? "Scholarship granted. Amount will be transferred to student's bank account."
        : 'Application rejected',
      status: app.status,
    })
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * GET /api/ministry/institutes
 * Ministry fetches institutes approved by State (approved_by_state).
 */
const getInstituteApplications = async (req, res) => {
  try {
    const institutes = await Institute.find({ status: 'approved_by_state' }).sort({ createdAt: -1 })
    return res.json(institutes)
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * PUT /api/ministry/institutes/:id
 * Ministry approves or rejects an institute registration.
 * Body: { action: 'approve' | 'reject', remarks }
 */
const reviewInstituteApplication = async (req, res) => {
  const { action, remarks } = req.body
  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ message: "Action must be 'approve' or 'reject'" })
  }
  try {
    const institute = await Institute.findById(req.params.id)
    if (!institute) return res.status(404).json({ message: 'Institute not found' })
    if (institute.status !== 'approved_by_state') {
      return res.status(400).json({ message: 'Institute is not in approved_by_state state' })
    }

    institute.status = action === 'approve' ? 'approved' : 'rejected'
    institute.ministryRemarks = remarks || ''
    await institute.save()

    return res.json({
      message: action === 'approve'
        ? `Institute approved. Login credentials are now active.\nLogin UID: ${institute.code}`
        : 'Registration rejected',
      status: institute.status,
      loginId: action === 'approve' ? institute.code : null,
      instituteName: institute.name,
    })
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getStats,
  getStudentApplications,
  reviewStudentApplication,
  getInstituteApplications,
  reviewInstituteApplication,
}
