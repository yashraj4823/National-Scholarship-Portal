import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FieldError from '../components/FieldError'
import { registerStudent } from '../api/students'
import { useValidation } from '../hooks/useValidation'
import { fieldClass } from '../utils/fieldClass'

const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'Rajasthan', 'West Bengal']
const districts = ['Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Aurangabad', 'Thane', 'Solapur']

const rules = {
  state:           (v) => !v ? 'Please select your state' : '',
  district:        (v) => !v ? 'Please select your district' : '',
  name:            (v) => !v.trim() ? 'Name is required' : v.trim().length < 3 ? 'Name must be at least 3 characters' : !/^[a-zA-Z\s]+$/.test(v.trim()) ? 'Name must contain only letters' : '',
  dob:             (v) => !v ? 'Date of birth is required' : new Date(v) >= new Date() ? 'Date of birth cannot be in the future' : '',
  gender:          (v) => !v ? 'Please select gender' : '',
  mobile:          (v) => !v ? 'Mobile number is required' : !/^\d{10}$/.test(v) ? 'Mobile must be exactly 10 digits' : '',
  email:           (v) => !v ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email address' : '',
  instituteCode:   (v) => !v.trim() ? 'Institute code is required' : '',
  aadhar:          (v) => !v ? 'Aadhar number is required' : !/^\d{12}$/.test(v) ? 'Aadhar must be exactly 12 digits' : '',
  bankIfsc:        (v) => !v.trim() ? 'IFSC code is required' : !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(v.toUpperCase()) ? 'Enter a valid IFSC code (e.g. SBIN0001234)' : '',
  bankAccount:     (v) => !v.trim() ? 'Account number is required' : !/^\d{9,18}$/.test(v) ? 'Account number must be 9–18 digits' : '',
  bankName:        (v) => !v.trim() ? 'Bank name is required' : '',
  password:        (v) => !v ? 'Password is required' : v.length < 8 ? 'At least 8 characters' : !/[A-Z]/.test(v) ? 'Include at least one uppercase letter' : !/[0-9]/.test(v) ? 'Include at least one number' : '',
  confirmPassword: (v, all) => !v ? 'Please confirm your password' : v !== all.password ? 'Passwords do not match' : '',
}

function passwordStrength(p) {
  if (!p) return null
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return {
    score,
    label: ['', 'Weak', 'Fair', 'Good', 'Strong'][score],
    color: ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'][score],
  }
}

export default function StudentRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    state: '', district: '', name: '', dob: '', gender: '', mobile: '',
    email: '', instituteCode: '', aadhar: '', bankIfsc: '', bankAccount: '',
    bankName: '', password: '', confirmPassword: '', agree: false,
  })
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const { errors, touched, validate, touch, touchAll } = useValidation(rules)

  const set = (k, v) => {
    setForm(prev => {
      const updated = { ...prev, [k]: v }
      if (touched[k]) validate(k, v, updated)
      if (k === 'password' && touched.confirmPassword) validate('confirmPassword', updated.confirmPassword, updated)
      return updated
    })
  }

  const handleBlur = (k) => touch(k, form[k], form)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    if (!form.agree) return setApiError('Please accept the declaration')
    if (!touchAll(form)) return
    setLoading(true)
    try {
      const { data } = await registerStudent({
        name: form.name, dob: form.dob, gender: form.gender,
        mobile: form.mobile, email: form.email, aadhar: form.aadhar,
        state: form.state, district: form.district, instituteCode: form.instituteCode,
        bankIfsc: form.bankIfsc.toUpperCase(), bankAccount: form.bankAccount, bankName: form.bankName,
        password: form.password,
      })
      alert(`Registration successful!\nYour UID is: ${data.uid}\nPlease login to continue.`)
      navigate('/')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const strength = passwordStrength(form.password)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="card">
          <h1 className="text-center font-bold text-primary text-base sm:text-lg mb-6 uppercase tracking-wide">
            Fresh Student Registration Form
          </h1>

          {apiError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">{apiError}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="form-label">State of Domicile *</label>
                <select className={fieldClass('form-select', errors.state, touched.state)}
                  value={form.state} onChange={e => set('state', e.target.value)} onBlur={() => handleBlur('state')}>
                  <option value="">-- Select State --</option>
                  {states.map(s => <option key={s}>{s}</option>)}
                </select>
                <FieldError message={touched.state && errors.state} />
              </div>

              <div>
                <label className="form-label">District *</label>
                <select className={fieldClass('form-select', errors.district, touched.district)}
                  value={form.district} onChange={e => set('district', e.target.value)} onBlur={() => handleBlur('district')}>
                  <option value="">-- Select District --</option>
                  {districts.map(d => <option key={d}>{d}</option>)}
                </select>
                <FieldError message={touched.district && errors.district} />
              </div>

              <div>
                <label className="form-label">Name (as in Mark Sheets) *</label>
                <input className={fieldClass('form-input', errors.name, touched.name)}
                  value={form.name} onChange={e => set('name', e.target.value)} onBlur={() => handleBlur('name')} />
                <FieldError message={touched.name && errors.name} />
              </div>

              <div>
                <label className="form-label">Date of Birth *</label>
                <input type="date" className={fieldClass('form-input', errors.dob, touched.dob)}
                  value={form.dob} onChange={e => set('dob', e.target.value)} onBlur={() => handleBlur('dob')} />
                <FieldError message={touched.dob && errors.dob} />
              </div>

              <div>
                <label className="form-label">Gender *</label>
                <select className={fieldClass('form-select', errors.gender, touched.gender)}
                  value={form.gender} onChange={e => set('gender', e.target.value)} onBlur={() => handleBlur('gender')}>
                  <option value="">-- Select --</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
                <FieldError message={touched.gender && errors.gender} />
              </div>

              <div>
                <label className="form-label">Mobile Number *</label>
                <input className={fieldClass('form-input', errors.mobile, touched.mobile)}
                  maxLength={10} inputMode="numeric" placeholder="10-digit mobile number"
                  value={form.mobile}
                  onChange={e => set('mobile', e.target.value.replace(/\D/g, ''))}
                  onBlur={() => handleBlur('mobile')} />
                <FieldError message={touched.mobile && errors.mobile} />
              </div>

              <div>
                <label className="form-label">Email ID *</label>
                <input type="email" className={fieldClass('form-input', errors.email, touched.email)}
                  placeholder="example@email.com"
                  value={form.email} onChange={e => set('email', e.target.value)} onBlur={() => handleBlur('email')} />
                <FieldError message={touched.email && errors.email} />
              </div>

              <div>
                <label className="form-label">Institute Code *</label>
                <input className={fieldClass('form-input', errors.instituteCode, touched.instituteCode)}
                  value={form.instituteCode} onChange={e => set('instituteCode', e.target.value)} onBlur={() => handleBlur('instituteCode')} />
                <FieldError message={touched.instituteCode && errors.instituteCode} />
              </div>

              <div>
                <label className="form-label">Aadhar Number *</label>
                <input className={fieldClass('form-input', errors.aadhar, touched.aadhar)}
                  maxLength={12} inputMode="numeric" placeholder="12-digit Aadhar number"
                  value={form.aadhar}
                  onChange={e => set('aadhar', e.target.value.replace(/\D/g, ''))}
                  onBlur={() => handleBlur('aadhar')} />
                {form.aadhar && <p className="mt-1 text-xs text-gray-400">{form.aadhar.length}/12 digits</p>}
                <FieldError message={touched.aadhar && errors.aadhar} />
              </div>

              <div>
                <label className="form-label">Bank IFSC Code *</label>
                <input className={fieldClass('form-input', errors.bankIfsc, touched.bankIfsc)}
                  placeholder="e.g. SBIN0001234" style={{ textTransform: 'uppercase' }}
                  value={form.bankIfsc}
                  onChange={e => set('bankIfsc', e.target.value.toUpperCase())}
                  onBlur={() => handleBlur('bankIfsc')} />
                <FieldError message={touched.bankIfsc && errors.bankIfsc} />
              </div>

              <div>
                <label className="form-label">Bank Account Number *</label>
                <input className={fieldClass('form-input', errors.bankAccount, touched.bankAccount)}
                  inputMode="numeric" placeholder="9–18 digit account number"
                  value={form.bankAccount}
                  onChange={e => set('bankAccount', e.target.value.replace(/\D/g, ''))}
                  onBlur={() => handleBlur('bankAccount')} />
                <FieldError message={touched.bankAccount && errors.bankAccount} />
              </div>

              <div>
                <label className="form-label">Bank Name *</label>
                <input className={fieldClass('form-input', errors.bankName, touched.bankName)}
                  value={form.bankName} onChange={e => set('bankName', e.target.value)} onBlur={() => handleBlur('bankName')} />
                <FieldError message={touched.bankName && errors.bankName} />
              </div>

              <div>
                <label className="form-label">Set Password *</label>
                <input type="password"
                  className={fieldClass('form-input', errors.password, touched.password)}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  value={form.password} onChange={e => set('password', e.target.value)} onBlur={() => handleBlur('password')} />
                {strength && (
                  <div className="mt-1.5">
                    <div className="flex gap-1 mb-0.5">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded ${i <= strength.score ? strength.color : 'bg-gray-200'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">Strength: <span className="font-medium">{strength.label}</span></p>
                  </div>
                )}
                <FieldError message={touched.password && errors.password} />
              </div>

              <div>
                <label className="form-label">Confirm Password *</label>
                <input type="password"
                  className={fieldClass('form-input', errors.confirmPassword, touched.confirmPassword)}
                  placeholder="Re-enter password"
                  value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} onBlur={() => handleBlur('confirmPassword')} />
                {touched.confirmPassword && !errors.confirmPassword && form.confirmPassword && (
                  <p className="mt-1 text-xs text-green-600">✓ Passwords match</p>
                )}
                <FieldError message={touched.confirmPassword && errors.confirmPassword} />
              </div>

            </div>

            <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded p-3">
              <input type="checkbox" id="agree" className="mt-1 flex-shrink-0"
                checked={form.agree} onChange={e => setForm(f => ({ ...f, agree: e.target.checked }))} />
              <label htmlFor="agree" className="text-xs text-gray-600">
                All the above information furnished by me is true to the best of my knowledge.
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto px-10">
                {loading ? 'Registering...' : 'Register'}
              </button>
              <button type="button" className="btn-secondary w-full sm:w-auto px-10"
                onClick={() => {
                  setForm({ state: '', district: '', name: '', dob: '', gender: '', mobile: '', email: '', instituteCode: '', aadhar: '', bankIfsc: '', bankAccount: '', bankName: '', password: '', confirmPassword: '', agree: false })
                  setApiError('')
                }}>
                Reset
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
