import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FieldError from '../components/FieldError'
import { registerInstitute } from '../api/institutes'
import { useValidation } from '../hooks/useValidation'
import { fieldClass } from '../utils/fieldClass'

const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'Rajasthan']
const districts = ['Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Aurangabad', 'Thane', 'Solapur']
const years = Array.from({ length: 30 }, (_, i) => 2024 - i)

const rules = {
  category:        (v) => !v ? 'Please select institute category' : '',
  name:            (v) => !v.trim() ? 'Institute name is required' : v.trim().length < 3 ? 'Must be at least 3 characters' : '',
  state:           (v) => !v ? 'Please select state' : '',
  district:        (v) => !v ? 'Please select district' : '',
  code:            (v) => !v.trim() ? 'Institute code is required' : '',
  dise:            (v) => !v.trim() ? 'DISE code is required' : '',
  type:            (v) => !v ? 'Please select institute type' : '',
  uniState:        (v) => !v ? 'Please select university state' : '',
  uniName:         (v) => !v.trim() ? 'University / Board name is required' : '',
  admissionYear:   (v) => !v ? 'Please select admission year' : '',
  password:        (v) => !v ? 'Password is required' : v.length < 8 ? 'At least 8 characters' : !/[A-Z]/.test(v) ? 'Include at least one uppercase letter' : !/[0-9]/.test(v) ? 'Include at least one number' : '',
  confirmPassword: (v, all) => !v ? 'Please confirm password' : v !== all.password ? 'Passwords do not match' : '',
  addr1:           (v) => !v.trim() ? 'Address line 1 is required' : '',
  city:            (v) => !v.trim() ? 'City is required' : '',
  addrState:       (v) => !v ? 'Please select state' : '',
  addrDistrict:    (v) => !v ? 'Please select district' : '',
  pincode:         (v) => !v ? 'Pincode is required' : !/^\d{6}$/.test(v) ? 'Pincode must be 6 digits' : '',
  principal:       (v) => !v.trim() ? 'Principal name is required' : '',
  mobile:          (v) => !v ? 'Mobile is required' : !/^\d{10}$/.test(v) ? 'Must be exactly 10 digits' : '',
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

export default function InstituteRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    category: '', name: '', state: '', district: '', code: '', dise: '', location: 'Rural',
    type: '', uniState: '', uniName: '', admissionYear: '', password: '', confirmPassword: '',
    estCert: null, affCert: null,
    addr1: '', addr2: '', city: '', addrState: '', addrDistrict: '', pincode: '',
    principal: '', mobile: '', telephone: '', agree: false,
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
      const fd = new FormData()
      const fields = ['code','dise','name','category','type','location','state','district',
        'uniState','uniName','admissionYear','password','addr1','addr2','city',
        'addrState','addrDistrict','pincode','principal','mobile','telephone']
      fields.forEach(k => fd.append(k, form[k] ?? ''))
      if (form.estCert) fd.append('estCert', form.estCert)
      if (form.affCert) fd.append('affCert', form.affCert)
      await registerInstitute(fd)
      alert('Institute registration submitted! It will be reviewed by the State Nodal Officer.')
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
            Institute Registration Request Form
          </h1>

          {apiError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">{apiError}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>

            {/* BASIC DETAILS */}
            <section>
              <h2 className="section-title">Basic Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="form-label">Institute Category *</label>
                  <select className={fieldClass('form-select', errors.category, touched.category)}
                    value={form.category} onChange={e => set('category', e.target.value)} onBlur={() => handleBlur('category')}>
                    <option value="">-- Select --</option>
                    <option>Government</option><option>Government Aided</option>
                    <option>Private Unaided</option><option>Autonomous</option>
                  </select>
                  <FieldError message={touched.category && errors.category} />
                </div>

                <div>
                  <label className="form-label">Institute Name *</label>
                  <input className={fieldClass('form-input', errors.name, touched.name)}
                    value={form.name} onChange={e => set('name', e.target.value)} onBlur={() => handleBlur('name')} />
                  <FieldError message={touched.name && errors.name} />
                </div>

                <div>
                  <label className="form-label">State *</label>
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
                  <label className="form-label">Institute Code *</label>
                  <input className={fieldClass('form-input', errors.code, touched.code)}
                    value={form.code} onChange={e => set('code', e.target.value)} onBlur={() => handleBlur('code')} />
                  <FieldError message={touched.code && errors.code} />
                </div>

                <div>
                  <label className="form-label">DISE Code *</label>
                  <input className={fieldClass('form-input', errors.dise, touched.dise)}
                    value={form.dise} onChange={e => set('dise', e.target.value)} onBlur={() => handleBlur('dise')} />
                  <FieldError message={touched.dise && errors.dise} />
                </div>

                <div>
                  <label className="form-label">Location *</label>
                  <div className="flex gap-6 mt-2">
                    {['Rural', 'Urban'].map(l => (
                      <label key={l} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="radio" name="location" value={l} checked={form.location === l} onChange={() => set('location', l)} />
                        {l}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="form-label">Institute Type *</label>
                  <select className={fieldClass('form-select', errors.type, touched.type)}
                    value={form.type} onChange={e => set('type', e.target.value)} onBlur={() => handleBlur('type')}>
                    <option value="">-- Select --</option>
                    <option>Engineering</option><option>Medical</option>
                    <option>Arts &amp; Science</option><option>Polytechnic</option><option>Management</option>
                  </select>
                  <FieldError message={touched.type && errors.type} />
                </div>

                <div>
                  <label className="form-label">Affiliated University State *</label>
                  <select className={fieldClass('form-select', errors.uniState, touched.uniState)}
                    value={form.uniState} onChange={e => set('uniState', e.target.value)} onBlur={() => handleBlur('uniState')}>
                    <option value="">-- Select --</option>
                    {states.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <FieldError message={touched.uniState && errors.uniState} />
                </div>

                <div>
                  <label className="form-label">Affiliated University / Board Name *</label>
                  <input className={fieldClass('form-input', errors.uniName, touched.uniName)}
                    value={form.uniName} onChange={e => set('uniName', e.target.value)} onBlur={() => handleBlur('uniName')} />
                  <FieldError message={touched.uniName && errors.uniName} />
                </div>

                <div>
                  <label className="form-label">Year Admission Started *</label>
                  <select className={fieldClass('form-select', errors.admissionYear, touched.admissionYear)}
                    value={form.admissionYear} onChange={e => set('admissionYear', e.target.value)} onBlur={() => handleBlur('admissionYear')}>
                    <option value="">-- Select Year --</option>
                    {years.map(y => <option key={y}>{y}</option>)}
                  </select>
                  <FieldError message={touched.admissionYear && errors.admissionYear} />
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
            </section>

            {/* PROOF OF EXISTENCE */}
            <section>
              <h2 className="section-title">Proof of Existence of Institute</h2>
              <div className="space-y-3">
                {[
                  { key: 'estCert', label: 'Institute Establishment / Registration Certificate ' },
                  { key: 'affCert', label: 'University / Board Affiliation Certificate ' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50 border rounded p-3">
                    <span className="text-xs text-gray-600 uppercase tracking-wide">{label}</span>
                    <label className="cursor-pointer self-start sm:self-auto flex-shrink-0">
                      <input type="file" className="hidden" onChange={e => set(key, e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" />
                      <span className="border border-gray-400 text-xs px-4 py-1.5 rounded hover:bg-gray-100 block text-center">
                        {form[key] ? form[key].name : 'Upload'}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </section>

            {/* ADDRESS */}
            <section>
              <h2 className="section-title">Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="form-label">Line 1 *</label>
                  <input className={fieldClass('form-input', errors.addr1, touched.addr1)}
                    value={form.addr1} onChange={e => set('addr1', e.target.value)} onBlur={() => handleBlur('addr1')} />
                  <FieldError message={touched.addr1 && errors.addr1} />
                </div>

                <div>
                  <label className="form-label">Line 2</label>
                  <input className="form-input" value={form.addr2} onChange={e => set('addr2', e.target.value)} />
                </div>

                <div>
                  <label className="form-label">City *</label>
                  <input className={fieldClass('form-input', errors.city, touched.city)}
                    value={form.city} onChange={e => set('city', e.target.value)} onBlur={() => handleBlur('city')} />
                  <FieldError message={touched.city && errors.city} />
                </div>

                <div>
                  <label className="form-label">State *</label>
                  <select className={fieldClass('form-select', errors.addrState, touched.addrState)}
                    value={form.addrState} onChange={e => set('addrState', e.target.value)} onBlur={() => handleBlur('addrState')}>
                    <option value="">-- Select --</option>
                    {states.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <FieldError message={touched.addrState && errors.addrState} />
                </div>

                <div>
                  <label className="form-label">District *</label>
                  <select className={fieldClass('form-select', errors.addrDistrict, touched.addrDistrict)}
                    value={form.addrDistrict} onChange={e => set('addrDistrict', e.target.value)} onBlur={() => handleBlur('addrDistrict')}>
                    <option value="">-- Select --</option>
                    {districts.map(d => <option key={d}>{d}</option>)}
                  </select>
                  <FieldError message={touched.addrDistrict && errors.addrDistrict} />
                </div>

                <div>
                  <label className="form-label">Pincode *</label>
                  <input className={fieldClass('form-input', errors.pincode, touched.pincode)}
                    maxLength={6} inputMode="numeric" placeholder="6-digit pincode"
                    value={form.pincode}
                    onChange={e => set('pincode', e.target.value.replace(/\D/g, ''))}
                    onBlur={() => handleBlur('pincode')} />
                  <FieldError message={touched.pincode && errors.pincode} />
                </div>

              </div>
            </section>

            {/* CONTACT */}
            <section>
              <h2 className="section-title">Contact Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="form-label">Principal Name *</label>
                  <input className={fieldClass('form-input', errors.principal, touched.principal)}
                    value={form.principal} onChange={e => set('principal', e.target.value)} onBlur={() => handleBlur('principal')} />
                  <FieldError message={touched.principal && errors.principal} />
                </div>

                <div>
                  <label className="form-label">Mobile Number *</label>
                  <input className={fieldClass('form-input', errors.mobile, touched.mobile)}
                    maxLength={10} inputMode="numeric" placeholder="10-digit mobile"
                    value={form.mobile}
                    onChange={e => set('mobile', e.target.value.replace(/\D/g, ''))}
                    onBlur={() => handleBlur('mobile')} />
                  <FieldError message={touched.mobile && errors.mobile} />
                </div>

                <div>
                  <label className="form-label">Telephone</label>
                  <input className="form-input" value={form.telephone} onChange={e => set('telephone', e.target.value)} />
                </div>

              </div>
            </section>

            {/* DECLARATION */}
            <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded p-3">
              <input type="checkbox" id="agree" className="mt-1 flex-shrink-0"
                checked={form.agree} onChange={e => setForm(f => ({ ...f, agree: e.target.checked }))} />
              <label htmlFor="agree" className="text-xs text-gray-600">
                All the details and documents submitted by us are valid and true. If found guilty of submitting invalid documents, we may be held responsible.
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto px-10">
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              <button type="reset" className="btn-secondary w-full sm:w-auto px-10">Reset</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
