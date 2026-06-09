import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FieldError from '../components/FieldError'
import { resetPassword } from '../api/auth'
import { useValidation } from '../hooks/useValidation'
import { fieldClass } from '../utils/fieldClass'

const rules = {
  role: (v) => !v ? 'Please select your account type' : '',
  identifier: (v) => !v.trim() ? 'This field is required' : '',
  verification: (v, values) => {
    if (values.role === 'institute') {
      if (!v.trim()) return 'Registered institute mobile is required'
      if (!/^\d{10}$/.test(v.trim())) return 'Enter a valid 10-digit mobile number'
    }
    if (values.role === 'student') {
      const isIdentifierEmailOrMobile = values.identifier.includes('@') || /^\d{10}$/.test(values.identifier)
      if (values.identifier && !isIdentifierEmailOrMobile && !v.trim()) {
        return 'Enter your registered email or mobile to verify the UID'
      }
    }
    return ''
  },
  newPassword: (v) => !v ? 'New password is required' : v.length < 6 ? 'At least 6 characters' : '',
  confirmPassword: (v, values) => !v ? 'Please confirm your password' : v !== values.newPassword ? 'Passwords must match' : '',
}

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    role: 'student',
    identifier: '',
    verification: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [apiError, setApiError] = useState('')
  const [apiSuccess, setApiSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const { errors, touched, validate, touch, touchAll } = useValidation(rules)

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      validate(name, value, { ...form, [name]: value })
    }
  }

  const handleBlur = (name) => touch(name, form[name], form)

  const isOrgRole = form.role === 'institute'
  const isUnsupportedRole = form.role === 'state' || form.role === 'ministry'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setApiError('')
    setApiSuccess('')

    if (isUnsupportedRole) {
      setApiError('State and ministry accounts are managed by administrators. Please contact support.')
      return
    }

    const valid = touchAll(form)
    if (!valid) return

    setLoading(true)
    try {
      await resetPassword({
        role: form.role,
        identifier: form.identifier.trim(),
        verification: form.verification.trim(),
        newPassword: form.newPassword,
      })
      setApiSuccess('Your password has been reset successfully. You can now log in with the new password.')
      setForm((prev) => ({ ...prev, newPassword: '', confirmPassword: '' }))
      setTimeout(() => navigate('/login'), 2600)
    } catch (err) {
      setApiError(err.response?.data?.message || 'Unable to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-10">
        <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card card-hover">
            <div className="section-title">Password Recovery</div>
            <h2 className="text-3xl font-bold text-slate-900 mt-3">Reset your NSP password</h2>
            <p className="mt-4 text-sm text-slate-600 leading-7">
              Enter your account details below to reset your password securely. For student accounts you can use your UID,
              registered email or mobile number. Institute users should confirm their registered institute mobile number.
            </p>

            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl bg-primary/5 p-5 border border-primary/10">
                <p className="text-sm font-semibold text-primary">Student users</p>
                <p className="text-xs text-slate-600 mt-2">Use your UID, registered email or mobile. If you enter a UID, also provide the registered email or mobile for verification.</p>
              </div>
              <div className="rounded-3xl bg-secondary/5 p-5 border border-secondary/10">
                <p className="text-sm font-semibold text-secondary">Institute users</p>
                <p className="text-xs text-slate-600 mt-2">Use your institute code and registered institute mobile number to confirm your account before resetting the password.</p>
              </div>
              {isUnsupportedRole && (
                <div className="rounded-3xl bg-red-50 p-5 border border-red-200 text-red-700 text-sm">
                  State and ministry accounts are not supported by self-service password reset. Contact support at helpdesk@nsp.gov.in.
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-6 border-t-4 border-primary shadow-lg shadow-primary/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-primary font-semibold">Need help?</p>
                <h1 className="text-2xl font-bold text-slate-900">Forgot Password</h1>
              </div>
              <span className="badge-pill">Secure reset</span>
            </div>

            {apiSuccess && (
              <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                {apiSuccess}
              </div>
            )}
            {apiError && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="form-label">Account type</label>
                <select
                  className="form-select"
                  value={form.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  onBlur={() => handleBlur('role')}
                >
                  <option value="student">Student</option>
                  <option value="institute">Institute</option>
                  <option value="state">State Nodal Officer</option>
                  <option value="ministry">Ministry</option>
                </select>
                <FieldError message={touched.role && errors.role} />
              </div>

              <div>
                <label className="form-label">{isOrgRole ? 'Institute Code' : form.role === 'student' ? 'UID / Email / Mobile' : 'Username'}</label>
                <input
                  className={fieldClass('form-input', errors.identifier, touched.identifier)}
                  value={form.identifier}
                  onChange={(e) => handleChange('identifier', e.target.value)}
                  onBlur={() => handleBlur('identifier')}
                  placeholder={isOrgRole ? 'Enter institute code' : 'Enter your identifier'}
                />
                <FieldError message={touched.identifier && errors.identifier} />
              </div>

              <div>
                <label className="form-label">{isOrgRole ? 'Registered Institute Mobile' : 'Registered Email / Mobile (optional)'}</label>
                <input
                  className={fieldClass('form-input', errors.verification, touched.verification)}
                  value={form.verification}
                  onChange={(e) => handleChange('verification', e.target.value)}
                  onBlur={() => handleBlur('verification')}
                  placeholder={isOrgRole ? 'Enter your registered institute mobile' : 'Enter registered email or mobile'}
                />
                <FieldError message={touched.verification && errors.verification} />
              </div>

              <div>
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className={fieldClass('form-input', errors.newPassword, touched.newPassword)}
                  value={form.newPassword}
                  onChange={(e) => handleChange('newPassword', e.target.value)}
                  onBlur={() => handleBlur('newPassword')}
                  placeholder="Create a new password"
                />
                <FieldError message={touched.newPassword && errors.newPassword} />
              </div>

              <div>
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className={fieldClass('form-input', errors.confirmPassword, touched.confirmPassword)}
                  value={form.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="Repeat new password"
                />
                <FieldError message={touched.confirmPassword && errors.confirmPassword} />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Resetting password...' : 'Reset Password'}
              </button>
            </form>

            <div className="mt-6 text-xs text-slate-500">
              <p>
                Remembered your password? <Link to="/home" className="text-primary hover:underline">Login here</Link>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
