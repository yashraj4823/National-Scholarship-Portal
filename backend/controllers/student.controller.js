const Student = require('../models/Student')

/**
 * POST /api/students/register
 */
const registerStudent = async (req, res) => {
  const {
    name, dob, gender, mobile, email, aadhar,
    state, district, instituteCode,
    bankIfsc, bankAccount, bankName, password,
  } = req.body

  if (!name || !dob || !gender || !mobile || !email || !aadhar || !password) {
    return res.status(400).json({ message: 'All required fields must be provided' })
  }

  try {
    const existing = await Student.findOne({
      $or: [{ email: email.toLowerCase() }, { mobile }, { aadhar }],
    })
    if (existing) {
      const field =
        existing.email === email.toLowerCase() ? 'Email' :
        existing.mobile === mobile ? 'Mobile' : 'Aadhar'
      return res.status(409).json({ message: `${field} is already registered` })
    }

    const student = await Student.create({
      name, dob, gender, mobile,
      email: email.toLowerCase(),
      aadhar, state, district, instituteCode,
      bankIfsc, bankAccount, bankName, password,
    })

    return res.status(201).json({
      message: 'Registration successful',
      uid: student.uid,
      name: student.name,
    })
  } catch (err) {
    console.error('[registerStudent]', err.message, err.errors || '')
    return res.status(500).json({ message: err.message || 'Server error during registration' })
  }
}

const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
    if (!student) return res.status(404).json({ message: 'Student not found' })
    return res.json(student)
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

const updateProfile = async (req, res) => {
  const allowed = ['mobile', 'email', 'bankIfsc', 'bankAccount', 'bankName']
  const updates = {}
  allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key] })
  try {
    const student = await Student.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true })
    if (!student) return res.status(404).json({ message: 'Student not found' })
    return res.json({ message: 'Profile updated', student })
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { registerStudent, getProfile, updateProfile }
