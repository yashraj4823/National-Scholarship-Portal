import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FieldError from '../components/FieldError'
import { login } from '../api/auth'
import { getSchemes } from '../api/schemes'
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
  const [schemes, setSchemes] = useState([])
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [loadingSchemes, setLoadingSchemes] = useState(true)

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

  useEffect(() => {
    getSchemes()
      .then(({ data }) => setSchemes(data))
      .catch(() => setSchemes([]))
      .finally(() => setLoadingSchemes(false))
  }, [])

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
            {loadingSchemes ? (
              <p className="text-xs text-gray-400">Loading schemes...</p>
            ) : schemes.length === 0 ? (
              <p className="text-xs text-gray-400">No schemes available right now.</p>
            ) : (
              <div className="space-y-3">
                {schemes.map((s) => (
                  <button
                    key={s._id}
                    type="button"
                    onClick={() => setSelectedScheme(s)}
                    className={`w-full text-left border rounded p-3 transition-all hover:bg-gray-50 ${s.isActive ? 'bg-white' : 'bg-gray-50 cursor-not-allowed opacity-80'}`}
                    disabled={!s.isActive}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{s.tag || 'General'}</p>
                      </div>
                      <span className="text-xs font-semibold text-green-700">{s.amount}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedScheme && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-bold text-lg text-primary">{selectedScheme.name}</h3>
                    <p className="text-xs text-gray-500">{selectedScheme.tag || 'General Eligibility'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedScheme(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <div className="p-6 space-y-4 text-sm text-gray-700">
                  <div>
                    <p className="font-semibold">Description</p>
                    <p className="text-xs text-gray-600 mt-1">{selectedScheme.description}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Eligibility</p>
                      <p className="text-xs text-gray-600 mt-1">{selectedScheme.eligibility}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Amount</p>
                      <p className="text-xs text-gray-600 mt-1">{selectedScheme.amount}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Deadline</p>
                      <p className="text-xs text-gray-600 mt-1">{new Date(selectedScheme.deadline).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Status</p>
                      <p className="text-xs text-gray-600 mt-1">{selectedScheme.isActive ? 'Active' : 'Inactive'}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Applicants</p>
                      <p className="text-xs text-gray-600 mt-1">{selectedScheme.applicantsCount ?? 0}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedScheme(null)}
                      className="btn-secondary text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
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
