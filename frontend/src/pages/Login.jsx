import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FieldError from '../components/FieldError'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { useValidation } from '../hooks/useValidation'
import { fieldClass } from '../utils/fieldClass'

const rules = {
  uid: (v) => !v.trim() ? 'UID / Username is required' : '',
  password: (v) => !v ? 'Password is required' : v.length < 6 ? 'Password must be at least 6 characters' : '',
}

export default function Login() {
  const navigate = useNavigate()
  const { saveLogin } = useAuth()
  const [form, setForm] = useState({ uid: '', password: '', type: '' })
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const { errors, touched, validate, touch, touchAll } = useValidation(rules)

  const routes = {
    student: '/dashboard/student',
    institute: '/dashboard/institute',
    state: '/dashboard/state',
    ministry: '/dashboard/ministry',
  }

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    if (touched[field]) validate(field, value)
  }

  const handleBlur = (field) => touch(field, form[field])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const valid = touchAll(form)
    if (!valid) return
    setLoading(true)
    try {
      const { data } = await login(form.uid, form.password, form.type)
      saveLogin(data.token, data.user)
      navigate(routes[form.type])
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="card w-full max-w-md border-t-4 border-primary">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">NSP</span>
            </div>
            <div>
              <h1 className="font-bold text-primary">National Scholarship Portal</h1>
              <p className="text-xs text-gray-500">Government of India</p>
            </div>
          </div>

          {apiError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded p-3">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="form-label">Login As</label>
              <select className="form-select" value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="">--Select Role--</option>
                <option value="student">Student</option>
                <option value="institute">Institute</option>
                <option value="state">State Nodal Officer</option>
                <option value="ministry">Ministry</option>
              </select>
            </div>

            <div>
              <label className="form-label">UID / Username</label>
              <input
                className={fieldClass('form-input', errors.uid, touched.uid)}
                placeholder="Enter UID or Username"
                value={form.uid}
                onChange={e => handleChange('uid', e.target.value)}
                onBlur={() => handleBlur('uid')}
              />
              <FieldError message={touched.uid && errors.uid} />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className={fieldClass('form-input', errors.password, touched.password)}
                placeholder="Enter Password"
                value={form.password}
                onChange={e => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
              />
              <FieldError message={touched.password && errors.password} />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
