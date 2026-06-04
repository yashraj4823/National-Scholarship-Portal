/**
 * Seed script — run once to populate schemes and admin accounts.
 * Usage:  node seed.js
 */
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const Scheme = require('./models/Scheme')
const User = require('./models/User')

const schemes = [
  {
    schemeId: 'pms',
    name: 'Post Matric Scholarship (Merit-cum-Means)',
    description: 'Provides scholarship to students from backward categories for technical and undergraduate/postgraduate courses.',
    eligibility: 'SC/ST/OBC/Minority | Min 60% in 10th & 12th | Income < ₹2.5L/yr',
    amount: '₹10,000 – ₹20,000 per year',
    deadline: new Date('2024-12-31'),
    tag: 'SC/ST/OBC/Minority',
    isActive: true,
    applicantsCount: 45230,
  },
  {
    schemeId: 'pragati',
    name: 'Pragati Scholarship for Girls',
    description: 'Encourages girl students to pursue technical education by providing financial assistance.',
    eligibility: 'Girl students | Family income < ₹8L/yr | AICTE approved institution',
    amount: 'Tuition Fee up to ₹30,000',
    deadline: new Date('2025-01-15'),
    tag: 'Girls | Income < ₹8L/yr',
    isActive: true,
    applicantsCount: 23100,
  },
  {
    schemeId: 'ntse',
    name: 'NTSE – National Talent Search Examination',
    description: 'Merit-based scholarship for talented students identified through a two-stage selection process.',
    eligibility: 'Indian National | Min 60% in Class IX | Recognized school',
    amount: '₹1,250/month (Class XI-XII) | ₹2,000/month (UG/PG)',
    deadline: new Date('2024-11-30'),
    tag: 'Merit Based | Class IX',
    isActive: true,
    applicantsCount: 18750,
  },
  {
    schemeId: 'nms',
    name: 'National Merit Scholarship',
    description: 'Awarded to meritorious students to encourage academic excellence.',
    eligibility: 'Merit based | Min 60% marks',
    amount: '₹6,000 per year',
    deadline: new Date('2025-01-31'),
    tag: 'Merit Based',
    isActive: false,
    applicantsCount: 12400,
  },
  {
    schemeId: 'css',
    name: 'Central Scholarship Scheme',
    description: 'Scholarship for children of central government employees pursuing higher education.',
    eligibility: "Central Govt. employees' children",
    amount: 'Up to ₹15,000 per year',
    deadline: new Date('2025-02-28'),
    tag: 'Central Govt.',
    isActive: true,
    applicantsCount: 25052,
  },
]

const users = [
  {
    username: 'state_mah',
    password: 'state@123',
    role: 'state',
    stateName: 'Maharashtra',
    displayName: 'State Nodal Officer – Maharashtra',
  },
  {
    username: 'ministry_admin',
    password: 'ministry@123',
    role: 'ministry',
    displayName: 'Ministry of Education – NSP Admin',
  },
]

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  // Seed schemes
  for (const s of schemes) {
    await Scheme.findOneAndUpdate({ schemeId: s.schemeId }, s, { upsert: true, new: true })
  }
  console.log('Schemes seeded')

  // Seed users (state & ministry)
  for (const u of users) {
    const existing = await User.findOne({ username: u.username })
    if (!existing) {
      await User.create(u)
      console.log(`Created user: ${u.username}`)
    } else {
      console.log(`User already exists: ${u.username}`)
    }
  }

  console.log('\nSeed complete!')
  console.log('State login    →  username: state_mah      | password: state@123')
  console.log('Ministry login →  username: ministry_admin | password: ministry@123')
  mongoose.disconnect()
}

seed().catch((err) => { console.error(err); process.exit(1) })
