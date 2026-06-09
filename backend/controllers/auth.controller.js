const jwt = require('jsonwebtoken')
const Student = require('../models/Student')
const Institute = require('../models/Institute')
const User = require('../models/User')

/** Generate a signed JWT */
const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

/**
 * POST /api/auth/login
 * Body: { uid, password, role }  — role: student | institute | state | ministry
 */
const login = async (req, res) => {
  const { uid, password, role } = req.body
  if (!uid || !password || !role) {
    return res.status(400).json({ message: 'UID, password, and role are required' })
  }

  try {
    let user = null
    let tokenPayload = {}

    if (role === 'student') {
      // Students can log in with uid, email, or mobile
      user = await Student.findOne({ $or: [{ uid }, { email: uid }, { mobile: uid }] })
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }
      tokenPayload = { id: user._id, uid: user.uid, role: 'student', name: user.name }

    } else if (role === 'institute') {
      // Institutes log in with their institute code
      user = await Institute.findOne({ code: uid })
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }
      if (user.status !== 'approved') {
        return res.status(403).json({
          message: `Institute account is not yet approved. Current status: ${user.status}`,
        })
      }
      tokenPayload = { id: user._id, code: user.code, role: 'institute', name: user.name }

    } else if (role === 'state' || role === 'ministry') {
      user = await User.findOne({ username: uid, role })
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }
      tokenPayload = { id: user._id, username: user.username, role, name: user.displayName }

    } else {
      return res.status(400).json({ message: 'Invalid role' })
    }

    const token = generateToken(tokenPayload)
    return res.json({ token, user: tokenPayload })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error during login' })
  }
}

/**
 * GET /api/auth/me
 * Returns the currently logged-in user's profile.
 */
const getMe = async (req, res) => {
  try {
    const { id, role } = req.user
    let profile = null

    if (role === 'student') {
      profile = await Student.findById(id)
    } else if (role === 'institute') {
      profile = await Institute.findById(id)
    } else {
      profile = await User.findById(id)
    }

    if (!profile) return res.status(404).json({ message: 'User not found' })
    return res.json(profile)
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

const resetPassword = async (req, res) => {
  const { role, identifier, verification, newPassword } = req.body

  if (!role || !identifier || !newPassword) {
    return res.status(400).json({ message: 'Role, identifier, and new password are required' })
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' })
  }

  try {
    let user = null

    if (role === 'student') {
      const isEmailOrMobile = identifier.includes('@') || /^\d{10}$/.test(identifier)
      const needsVerification = !isEmailOrMobile

      user = await Student.findOne({ $or: [{ uid: identifier }, { email: identifier }, { mobile: identifier }] })
      if (!user) {
        return res.status(404).json({ message: 'Student account not found' })
      }

      if (needsVerification && !verification) {
        return res.status(400).json({ message: 'Please provide your registered email or mobile for verification' })
      }
      if (verification && verification !== user.email && verification !== user.mobile) {
        return res.status(401).json({ message: 'Verification does not match registered contact details' })
      }
    } else if (role === 'institute') {
      if (!verification) {
        return res.status(400).json({ message: 'Please provide the registered institute mobile number for verification' })
      }

      user = await Institute.findOne({ code: identifier, 'contact.mobile': verification })
      if (!user) {
        return res.status(404).json({ message: 'Institute account not found or mobile does not match' })
      }
    } else {
      return res.status(400).json({ message: 'Password reset is only available for students and institutes. Please contact admin for state or ministry accounts.' })
    }

    user.password = newPassword
    await user.save()

    return res.json({ message: 'Password updated successfully. Please log in with your new password.' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error during password reset' })
  }
}

module.exports = { login, getMe, resetPassword }
