const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const studentSchema = new mongoose.Schema(
  {
    uid: { type: String, unique: true },
    name: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    aadhar: { type: String, required: true, unique: true, minlength: 12, maxlength: 12 },
    state: { type: String, required: true },
    district: { type: String, required: true },
    instituteCode: { type: String, required: true },
    bankIfsc: { type: String, required: true },
    bankAccount: { type: String, required: true },
    bankName: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: 'student' },
  },
  { timestamps: true }
)

studentSchema.pre('save', async function (next) {
  // Generate UID using timestamp + random suffix — no extra DB call needed
  if (this.isNew && !this.uid) {
    const year = new Date().getFullYear()
    const random = Math.floor(10000 + Math.random() * 90000) // 5-digit random
    this.uid = `NSP${year}${random}`
  }
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

studentSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

studentSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

module.exports = mongoose.model('Student', studentSchema)
