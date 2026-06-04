const Scheme = require('../models/Scheme')

/** GET /api/schemes  — list all active schemes (public) */
const getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find({ isActive: true }).sort({ createdAt: -1 })
    return res.json(schemes)
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

/** GET /api/schemes/all  — list all schemes including inactive (ministry only) */
const getAllSchemesAdmin = async (req, res) => {
  try {
    const schemes = await Scheme.find().sort({ createdAt: -1 })
    return res.json(schemes)
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

/** GET /api/schemes/:schemeId  — get a single scheme by schemeId slug */
const getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findOne({ schemeId: req.params.schemeId })
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' })
    return res.json(scheme)
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

/** POST /api/schemes  — ministry creates a new scheme */
const createScheme = async (req, res) => {
  const { schemeId, name, description, eligibility, amount, deadline, tag } = req.body
  if (!schemeId || !name || !description || !eligibility || !amount || !deadline) {
    return res.status(400).json({ message: 'All fields are required' })
  }
  try {
    const scheme = await Scheme.create({ schemeId, name, description, eligibility, amount, deadline, tag })
    return res.status(201).json({ message: 'Scheme created', scheme })
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Scheme ID already exists' })
    return res.status(500).json({ message: 'Server error' })
  }
}

/** PUT /api/schemes/:schemeId  — ministry updates a scheme */
const updateScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findOneAndUpdate(
      { schemeId: req.params.schemeId },
      req.body,
      { new: true, runValidators: true }
    )
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' })
    return res.json({ message: 'Scheme updated', scheme })
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

/** PATCH /api/schemes/:schemeId/toggle  — ministry toggles scheme active/inactive */
const toggleScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findOne({ schemeId: req.params.schemeId })
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' })
    scheme.isActive = !scheme.isActive
    await scheme.save()
    return res.json({ message: `Scheme is now ${scheme.isActive ? 'active' : 'inactive'}`, isActive: scheme.isActive })
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getAllSchemes, getAllSchemesAdmin, getSchemeById, createScheme, updateScheme, toggleScheme }
