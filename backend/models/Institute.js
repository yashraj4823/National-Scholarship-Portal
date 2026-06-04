const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const instituteSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, required: true },
    dise: { type: String, unique: true, required: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Government', 'Government Aided', 'Private Unaided', 'Autonomous'],
      required: true,
    },
    type: {
      type: String,
      enum: ['Engineering', 'Medical', 'Arts & Science', 'Polytechnic', 'Management'],
      required: true,
    },
    location: { type: String, enum: ['Rural', 'Urban'], default: 'Urban' },
    state: { type: String, required: true },
    district: { type: String, required: true },
    uniState: { type: String, required: true },
    uniName: { type: String, required: true },
    admissionYear: { type: Number, required: true },
    address: {
      line1: { type: String, required: true },
      line2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      district: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    contact: {
      principalName: { type: String, required: true },
      mobile: { type: String, required: true },
      telephone: String,
    },
    documents: {
      estCert: String,  // file path
      affCert: String,  // file path
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: 'institute' },
    // Approval flow: pending → approved_by_state → approved (by ministry)
    status: {
      type: String,
      enum: ['pending', 'approved_by_state', 'approved', 'rejected'],
      default: 'pending',
    },
    stateRemarks: String,
    ministryRemarks: String,
  },
  { timestamps: true }
)

instituteSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

instituteSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

instituteSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

module.exports = mongoose.model('Institute', instituteSchema)
