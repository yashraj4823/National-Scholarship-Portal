const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema(
  {
    applicationId: { type: String, unique: true }, // auto-generated APP######

    // References
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    scheme: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
    institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute' },

    // Basic Details
    aadhar: { type: String, required: true },
    religion: { type: String, required: true },
    community: { type: String, required: true }, // SC/ST/OBC/General
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    annualIncome: { type: Number, required: true },

    // Academic Details
    instituteName: { type: String, required: true },
    presentClass: { type: String, required: true },
    classYear: String,
    modeOfStudy: { type: String, enum: ['Regular', 'Distance', 'Part-Time'] },
    classStartDate: Date,
    universityBoard: String,
    prevClass: String,
    prevPassYear: String,
    prevClassPercent: Number,

    // 10th Details
    class10: {
      rollNumber: String,
      board: String,
      passingYear: String,
      percentage: Number,
    },

    // 12th Details
    class12: {
      rollNumber: String,
      board: String,
      passingYear: String,
      percentage: Number,
    },

    // Fee Details
    fees: {
      admission: Number,
      tuition: Number,
      other: Number,
    },

    // Other Personal Details
    isDisabled: { type: Boolean, default: false },
    disabilityType: String,
    disabilityPercent: Number,
    maritalStatus: String,
    parentsProfession: String,

    // Contact Details
    contact: {
      state: String,
      district: String,
      block: String,
      houseNo: String,
      streetNo: String,
      pincode: String,
    },

    // Uploaded document paths
    documents: {
      domicile: String,
      photograph: String,
      instituteId: String,
      casteCertificate: String,
      prevMarksheet: String,
      feeReceipt: String,
      bankPassbook: String,
      aadharCard: String,
      marksheet10: String,
      marksheet12: String,
    },

    // Approval workflow status
    // pending → institute_verified / institute_rejected
    // institute_verified → state_forwarded / state_rejected
    // state_forwarded → granted / ministry_rejected
    status: {
      type: String,
      enum: [
        'pending',
        'institute_verified',
        'institute_rejected',
        'state_forwarded',
        'state_rejected',
        'granted',
        'ministry_rejected',
      ],
      default: 'pending',
    },

    // Institute review
    instituteRemarks: String,
    bonafideCert: String, // path to uploaded bonafide cert

    // State review
    stateRemarks: String,

    // Ministry review
    ministryRemarks: String,
    grantedAmount: String,
  },
  { timestamps: true }
)

// Auto-generate application ID using timestamp + random — no extra DB call
applicationSchema.pre('save', function (next) {
  if (this.isNew && !this.applicationId) {
    const random = Math.floor(100000 + Math.random() * 900000) // 6-digit random
    this.applicationId = `APP${random}`
  }
  next()
})

module.exports = mongoose.model('Application', applicationSchema)
