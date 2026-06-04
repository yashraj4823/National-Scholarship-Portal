const Institute = require('../models/Institute')

const getUploadUrl = (file) => file?.path || file?.secure_url || file?.url

/**
 * POST /api/institutes/register
 * Submit an institute registration request. Open route.
 */
const registerInstitute = async (req, res) => {
  const {
    code, dise, name, category, type, location,
    state, district, uniState, uniName, admissionYear,
    password,
    addr1, addr2, city, addrState, addrDistrict, pincode,
    principal, mobile, telephone,
  } = req.body

  if (!code || !dise || !name || !category || !type || !state || !district || !password) {
    return res.status(400).json({ message: 'All required fields must be provided' })
  }

  try {
    const existing = await Institute.findOne({ $or: [{ code }, { dise }] })
    if (existing) {
      const field = existing.code === code ? 'Institute Code' : 'DISE Code'
      return res.status(409).json({ message: `${field} is already registered` })
    }

    const instituteData = {
      code, dise, name, category, type,
      location: location || 'Urban',
      state, district, uniState, uniName,
      admissionYear: Number(admissionYear),
      password,
      address: { line1: addr1, line2: addr2 || '', city, state: addrState, district: addrDistrict, pincode },
      contact: { principalName: principal, mobile, telephone: telephone || '' },
    }

    // Attach uploaded document URLs if files were uploaded
    if (req.files) {
      instituteData.documents = {
        estCert: req.files['estCert']?.[0] ? getUploadUrl(req.files['estCert'][0]) : undefined,
        affCert: req.files['affCert']?.[0] ? getUploadUrl(req.files['affCert'][0]) : undefined,
      }
    }

    const institute = await Institute.create(instituteData)
    return res.status(201).json({
      message: 'Institute registration submitted. Awaiting State Nodal Officer review.',
      instituteId: institute._id,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error during registration' })
  }
}

/**
 * GET /api/institutes/profile
 * Get logged-in institute's profile.
 */
const getProfile = async (req, res) => {
  try {
    const institute = await Institute.findById(req.user.id)
    if (!institute) return res.status(404).json({ message: 'Institute not found' })
    return res.json(institute)
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * GET /api/institutes
 * Get all approved institutes (for student application forms dropdowns).
 */
const getApprovedInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.find({ status: 'approved' }, 'name code state district type')
    return res.json(institutes)
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { registerInstitute, getProfile, getApprovedInstitutes }
