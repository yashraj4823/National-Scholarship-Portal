const mongoose = require('mongoose')

const schemeSchema = new mongoose.Schema(
  {
    schemeId: { type: String, required: true, unique: true }, // e.g. 'pms', 'pragati'
    name: { type: String, required: true },
    description: { type: String, required: true },
    eligibility: { type: String, required: true },
    amount: { type: String, required: true },
    deadline: { type: Date, required: true },
    tag: String,  // e.g. 'SC/ST/OBC/Minority'
    isActive: { type: Boolean, default: true },
    applicantsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Scheme', schemeSchema)
