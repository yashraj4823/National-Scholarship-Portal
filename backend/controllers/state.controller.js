const Application = require('../models/Application')
const Institute = require('../models/Institute')

/**
 * GET /api/state/applications
 * State fetches student applications that have been verified by institutes (institute_verified).
 */
const getStudentApplications = async (req, res) => {
  try {
    const apps = await Application.find({ status: 'institute_verified' })
      .populate('student', 'name uid aadhar mobile state district')
      .populate('scheme', 'name schemeId amount')
      .sort({ createdAt: -1 })
    return res.json(apps)
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * PUT /api/state/applications/:id
 * State forwards or rejects a student application.
 * Body: { action: 'forward' | 'reject', remarks }
 */
const reviewStudentApplication = async (req, res) => {
  const { action, remarks } = req.body
  if (!['forward', 'reject'].includes(action)) {
    return res.status(400).json({ message: "Action must be 'forward' or 'reject'" })
  }
  try {
    const app = await Application.findById(req.params.id)
    if (!app) return res.status(404).json({ message: 'Application not found' })
    if (app.status !== 'institute_verified') {
      return res.status(400).json({ message: 'Application is not in institute_verified state' })
    }

    app.status = action === 'forward' ? 'state_forwarded' : 'state_rejected'
    app.stateRemarks = remarks || ''
    await app.save()

    return res.json({
      message: action === 'forward' ? 'Application forwarded to Ministry' : 'Application rejected',
      status: app.status,
    })
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * GET /api/state/institutes
 * State fetches institute registration applications (status: pending).
 */
const getInstituteApplications = async (req, res) => {
  try {
    const institutes = await Institute.find({ status: 'pending' })
      .sort({ createdAt: -1 })
    return res.json(institutes)
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * PUT /api/state/institutes/:id
 * State forwards or rejects an institute registration.
 * Body: { action: 'forward' | 'reject', remarks }
 */
const reviewInstituteApplication = async (req, res) => {
  const { action, remarks } = req.body
  if (!['forward', 'reject'].includes(action)) {
    return res.status(400).json({ message: "Action must be 'forward' or 'reject'" })
  }
  try {
    const institute = await Institute.findById(req.params.id)
    if (!institute) return res.status(404).json({ message: 'Institute not found' })
    if (institute.status !== 'pending') {
      return res.status(400).json({ message: 'Institute registration is not in pending state' })
    }

    institute.status = action === 'forward' ? 'approved_by_state' : 'rejected'
    institute.stateRemarks = remarks || ''
    await institute.save()

    return res.json({
      message: action === 'forward' ? 'Institute forwarded to Ministry for approval' : 'Registration rejected',
      status: institute.status,
    })
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  getStudentApplications,
  reviewStudentApplication,
  getInstituteApplications,
  reviewInstituteApplication,
}
