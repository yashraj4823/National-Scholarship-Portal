import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FieldError from '../components/FieldError'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { useValidation } from '../hooks/useValidation'
import { fieldClass } from '../utils/fieldClass'

const updates = [
  'Last date to apply for Post Matric Scholarship 2024-25: 31st Dec 2024',
  'NTSE applications open for Class IX students',
  'Pragati Scholarship for Girls: Apply before 15th Jan 2025',
  'Merit-cum-Means Scholarship: Results declared for 2023-24',
  'New scheme announced for Minority students',
]

const rules = {
  uid: (v) => !v.trim() ? 'UID is required' : '',
  password: (v) => !v ? 'Password is required' : v.length < 6 ? 'At least 6 characters' : '',
  type: (v) => !v ? 'Please select a role' : '',
}

export default function Home() {
  const navigate = useNavigate()
  const { saveLogin } = useAuth()
  const [uid, setUid] = useState('')
  const [password, setPassword] = useState('')
  const [loginType, setLoginType] = useState('')
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const { errors, touched, validate, touch, touchAll } = useValidation(rules)

  const routes = {
    student: '/dashboard/student',
    institute: '/dashboard/institute',
    state: '/dashboard/state',
    ministry: '/dashboard/ministry',
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setApiError('')
    const valid = touchAll({ uid, password, type: loginType })
    if (!valid) return
    setLoading(true)
    try {
      const { data } = await login(uid, password, loginType)
      saveLogin(data.token, data.user)
      navigate(routes[loginType])
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="bg-gradient-to-r from-primary to-green-700 text-white py-3 px-4 text-center text-xs sm:text-sm font-medium">
        Scholarships for Students | Empowering Education | Government of India Initiative
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left */}
        <div className="flex flex-col gap-4">
          <div className="card border-l-4 border-primary">
            <h2 className="section-title">Latest Updates</h2>
            <ul className="space-y-2">
              {updates.map((u, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-700">
                  <span className="text-secondary font-bold mt-0.5 flex-shrink-0">▶</span>
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card border-l-4 border-secondary">
            <h2 className="section-title" style={{ color: '#f97316', borderColor: '#f97316' }}>Helpdesk</h2>
            <p className="text-xs text-gray-600 mb-2">For technical issues or queries:</p>
            <p className="text-xs font-semibold">📞 Toll Free: 1800-XXX-XXXX</p>
            <p className="text-xs font-semibold">✉ helpdesk@nsp.gov.in</p>
            <p className="text-xs text-gray-500 mt-2">Mon–Fri: 9:00 AM – 6:00 PM</p>
          </div>
        </div>

        {/* Center */}
        <div className="card">
          <h2 className="section-title">About the Portal</h2>
          <p className="text-sm text-gray-600 mb-4">
            The National Scholarship Portal is a one-stop solution for students to apply for various government scholarships.
            It streamlines the process from application to disbursement, ensuring transparency and efficiency.
          </p>
          <h3 className="font-bold text-sm text-primary mb-3">Available Scholarship Schemes</h3>
          <div className="space-y-3">
            {[
              { name: 'Post Matric Scholarship (Merit-cum-Means)', tag: 'SC/ST/OBC/Minority', color: 'bg-green-50 border-green-200' },
              { name: 'Pragati Scholarship for Girls', tag: 'Girls | Income < ₹8L/yr', color: 'bg-blue-50 border-blue-200' },
              { name: 'NTSE – National Talent Search', tag: 'Merit Based | Class IX', color: 'bg-orange-50 border-orange-200' },
              { name: 'National Merit Scholarship', tag: 'Merit Based', color: 'bg-purple-50 border-purple-200' },
              { name: 'Central Scholarship Scheme', tag: 'Central Govt.', color: 'bg-yellow-50 border-yellow-200' },
            ].map((s, i) => (
              <div key={i} className={`border rounded p-3 ${s.color}`}>
                <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                <span className="text-xs text-gray-500">{s.tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Login Panel */}
        <div className="card border-t-4 border-primary">
          <h2 className="section-title">Login</h2>

          {apiError && (
            <div className="mb-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded p-2">
              {apiError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <div>
              <label className="form-label">Login As</label>
              <select
                className={fieldClass('form-select', errors.type, touched.type)}
                value={loginType}
                onChange={e => { setLoginType(e.target.value); if (touched.type) validate('type', e.target.value) }}
                onBlur={() => touch('type', loginType)}
              >
                <option value="">--Select Role--</option>
                <option value="student">Student</option>
                <option value="institute">Institute</option>
                <option value="state">State Nodal Officer</option>
                <option value="ministry">Ministry</option>
              </select>
              <FieldError message={touched.type && errors.type} />
            </div>

            <div>
              <label className="form-label">UID / Username</label>
              <input
                className={fieldClass('form-input', errors.uid, touched.uid)}
                placeholder="Enter your UID"
                value={uid}
                onChange={e => { setUid(e.target.value); if (touched.uid) validate('uid', e.target.value) }}
                onBlur={() => touch('uid', uid)}
              />
              <FieldError message={touched.uid && errors.uid} />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className={fieldClass('form-input', errors.password, touched.password)}
                placeholder="Enter password"
                value={password}
                onChange={e => { setPassword(e.target.value); if (touched.password) validate('password', e.target.value) }}
                onBlur={() => touch('password', password)}
              />
              <FieldError message={touched.password && errors.password} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="text-center">
              <a href="#" className="text-xs text-primary hover:underline">Forgot Password?</a>
            </div>
          </form>
          <hr className="my-4" />
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">New Student?</p>
            <a href="/register/student" className="btn-orange inline-block text-xs">New Registration</a>
          </div>
          <div className="text-center mt-2">
            <a href="/register/institute" className="text-xs text-primary hover:underline">Institute Registration</a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
