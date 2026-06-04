const Application = require('../models/Application')
const Scheme = require('../models/Scheme')
const Institute = require('../models/Institute')

// Helper: convert empty string to undefined so Mongoose skips optional fields
const val = (v) => (v === '' || v === null || v === undefined ? undefined : v)
const num = (v) => (v === '' || v === null || v === undefined ? undefined : Number(v))
const getUploadUrl = (file) => file?.path || file?.secure_url || file?.url

/**
 * POST /api/applications
 * Student submits a scholarship application.
 */
const submitApplication = async (req, res) => {
  const {
    schemeId, aadhar, religion, community, fatherName, motherName, annualIncome,
    instituteName, presentClass, classYear, modeOfStudy, classStartDate, universityBoard,
    prevClass, prevPassYear, prevClassPercent,
    roll10, board10, year10, percent10,
    roll12, board12, year12, percent12,
    admissionFee, tuitionFee, otherFee,
    isDisabled, disabilityType, disabilityPercent, maritalStatus, parentsProfession,
    contactState, contactDistrict, contactBlock, houseNo, streetNo, pincode,
  } = req.body

  if (!schemeId || !aadhar || !religion || !community || !fatherName || !motherName || !annualIncome) {
    return res.status(400).json({ message: 'Required fields are missing' })
  }

  try {
    // Validate scheme exists
    const scheme = await Scheme.findOne({ schemeId, isActive: true })
    if (!scheme) return res.status(404).json({ message: 'Scheme not found or inactive' })

    // Prevent duplicate applications for the same scheme
    const duplicate = await Application.findOne({ student: req.user.id, scheme: scheme._id })
    if (duplicate) {
      return res.status(409).json({ message: 'You have already applied for this scheme' })
    }

    // Resolve institute ObjectId from the student's instituteCode
    const Student = require('../models/Student')
    const studentDoc = await Student.findById(req.user.id)
    let instituteRef = null
    if (studentDoc?.instituteCode) {
      const inst = await Institute.findOne({ code: studentDoc.instituteCode })
      if (inst) instituteRef = inst._id
    }

    // Collect Cloudinary URLs from uploaded files
    const documents = {}
    const docFields = [
      'domicile', 'photograph', 'instituteId', 'casteCertificate',
      'prevMarksheet', 'feeReceipt', 'bankPassbook', 'aadharCard',
      'marksheet10', 'marksheet12',
    ]
    if (req.files) {
      docFields.forEach((field) => {
        if (req.files[field] && req.files[field][0]) {
          documents[field] = getUploadUrl(req.files[field][0])
        }
      })
    }

    const app = await Application.create({
      student: req.user.id,
      scheme: scheme._id,
      institute: instituteRef,   // ← linked by ObjectId, not string
      aadhar,
      religion,
      community,
      fatherName,
      motherName,
      annualIncome: Number(annualIncome),

      instituteName,
      presentClass,
      classYear:      val(classYear),
      // Only set modeOfStudy if it's a valid enum value
      modeOfStudy:    ['Regular', 'Distance', 'Part-Time'].includes(modeOfStudy) ? modeOfStudy : undefined,
      // Only set classStartDate if it's a non-empty string
      classStartDate: val(classStartDate) ? new Date(classStartDate) : undefined,
      universityBoard: val(universityBoard),
      prevClass:       val(prevClass),
      prevPassYear:    val(prevPassYear),
      prevClassPercent: num(prevClassPercent),

      class10: {
        rollNumber: val(roll10),
        board:      val(board10),
        passingYear: val(year10),
        percentage:  num(percent10),
      },
      class12: {
        rollNumber: val(roll12),
        board:      val(board12),
        passingYear: val(year12),
        percentage:  num(percent12),
      },

      fees: {
        admission: num(admissionFee) ?? 0,
        tuition:   num(tuitionFee) ?? 0,
        other:     num(otherFee) ?? 0,
      },

      isDisabled:       isDisabled === 'Yes' || isDisabled === true,
      disabilityType:   val(disabilityType),
      disabilityPercent: num(disabilityPercent),
      maritalStatus:    val(maritalStatus),
      parentsProfession: val(parentsProfession),

      contact: {
        state:    val(contactState),
        district: val(contactDistrict),
        block:    val(contactBlock),
        houseNo:  val(houseNo),
        streetNo: val(streetNo),
        pincode:  val(pincode),
      },

      documents,
    })

    // Increment scheme applicant count
    await Scheme.findByIdAndUpdate(scheme._id, { $inc: { applicantsCount: 1 } })

    return res.status(201).json({
      message: 'Application submitted. It will be forwarded to your institute for verification.',
      applicationId: app.applicationId,
    })
  } catch (err) {
    console.error('submitApplication error:', err.message)
    return res.status(500).json({ message: err.message || 'Server error' })
  }
}

/**
 * GET /api/applications/my
 * Student views their own applications with status.
 */
const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ student: req.user.id })
      .populate('scheme', 'name schemeId amount deadline')
      .sort({ createdAt: -1 })
    return res.json(apps)
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * GET /api/applications/:id
 * Get a single application by _id.
 */
const getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate('student', 'name uid mobile email')
      .populate('scheme', 'name schemeId amount')
    if (!app) return res.status(404).json({ message: 'Application not found' })
    return res.json(app)
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * GET /api/applications/institute
 * Institute fetches applications for students belonging to their institute.
 * Matches by institute ObjectId (set at application submit time via student's instituteCode).
 * Falls back to instituteName string match for older applications.
 */
const getInstituteApplications = async (req, res) => {
  try {
    const institute = await Institute.findById(req.user.id)
    if (!institute) return res.status(404).json({ message: 'Institute not found' })

    // Primary: match by institute ObjectId reference
    const apps = await Application.find({
      $or: [
        { institute: institute._id },
        { instituteName: institute.name },  // fallback for older records
      ],
    })
      .populate('student', 'name uid aadhar mobile state district')
      .populate('scheme', 'name schemeId amount')
      .sort({ createdAt: -1 })

    return res.json(apps)
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * PUT /api/applications/:id/institute-action
 * Institute verifies or rejects an application.
 */
const instituteAction = async (req, res) => {
  const { action, remarks } = req.body
  if (!['verify', 'reject'].includes(action)) {
    return res.status(400).json({ message: "Action must be 'verify' or 'reject'" })
  }

  try {
    const app = await Application.findById(req.params.id)
    if (!app) return res.status(404).json({ message: 'Application not found' })
    if (app.status !== 'pending') {
      return res.status(400).json({ message: 'Application is not in pending state' })
    }

    app.status = action === 'verify' ? 'institute_verified' : 'institute_rejected'
    app.instituteRemarks = remarks || ''

    if (req.file) app.bonafideCert = getUploadUrl(req.file)

    await app.save()
    return res.json({
      message: action === 'verify' ? 'Application forwarded to State' : 'Application rejected',
      status: app.status,
    })
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  submitApplication,
  getMyApplications,
  getApplicationById,
  getInstituteApplications,
  instituteAction,
}
