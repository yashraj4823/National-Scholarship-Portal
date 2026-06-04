import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FieldError from '../components/FieldError'
import { submitApplication } from '../api/applications'
import { getStudentProfile } from '../api/students'
import { useAuth } from '../context/AuthContext'
import { useValidation } from '../hooks/useValidation'
import { fieldClass } from '../utils/fieldClass'

const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat']
const districts = ['Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Aurangabad', 'Thane']
const blocks = ['Block A', 'Block B', 'Block C', 'Block D']
const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other']
const currentYear = new Date().getFullYear()

const rules = {
  aadhar:         (v) => !v ? 'Aadhar number is required' : !/^\d{12}$/.test(v) ? 'Must be exactly 12 digits' : '',
  religion:       (v) => !v ? 'Please select religion' : '',
  community:      (v) => !v.trim() ? 'Community / Category is required' : '',
  fatherName:     (v) => !v.trim() ? "Father's name is required" : !/^[a-zA-Z\s]+$/.test(v.trim()) ? 'Letters only' : '',
  motherName:     (v) => !v.trim() ? "Mother's name is required" : !/^[a-zA-Z\s]+$/.test(v.trim()) ? 'Letters only' : '',
  annualIncome:   (v) => !v ? 'Annual income is required' : isNaN(v) || Number(v) < 0 ? 'Enter a valid amount' : '',
  instituteName:  (v) => !v.trim() ? 'Institute name is required' : '',
  presentClass:   (v) => !v.trim() ? 'Present class / course is required' : '',
  classYear:      (v) => !v.trim() ? 'Course year is required' : '',
  modeOfStudy:    (v) => !v ? 'Please select mode of study' : '',
  classStartDate: (v) => !v ? 'Class start date is required' : '',
  universityBoard:(v) => !v.trim() ? 'University / Board name is required' : '',
  roll10:         (v) => !v.trim() ? 'Roll number is required' : '',
  board10:        (v) => !v.trim() ? 'Board name is required' : '',
  year10:         (v) => !v ? 'Passing year is required' : !/^\d{4}$/.test(v) || Number(v) < 1990 || Number(v) > currentYear ? `Enter a valid year (1990–${currentYear})` : '',
  percent10:      (v) => !v ? 'Percentage is required' : isNaN(v) || Number(v) < 0 || Number(v) > 100 ? 'Enter 0–100' : '',
  admissionFee:   (v) => !v ? 'Admission fee is required' : isNaN(v) || Number(v) < 0 ? 'Enter a valid amount' : '',
  tuitionFee:     (v) => !v ? 'Tuition fee is required' : isNaN(v) || Number(v) < 0 ? 'Enter a valid amount' : '',
  contactState:   (v) => !v ? 'Please select state' : '',
  contactDistrict:(v) => !v ? 'Please select district' : '',
  pincode:        (v) => !v ? 'Pincode is required' : !/^\d{6}$/.test(v) ? 'Must be 6 digits' : '',
}

// Defined OUTSIDE the component so React never sees a new component type on re-render
function FileUpload({ label, name, onChange, fileName }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-gray-100">
      <span className="text-xs text-gray-600 uppercase tracking-wide">{label}</span>
      <label className="cursor-pointer self-start sm:self-auto flex-shrink-0">
        <input type="file" name={name} className="hidden" onChange={onChange} accept=".pdf,.jpg,.jpeg,.png" />
        <span className={`border text-xs px-4 py-1 rounded hover:bg-gray-50 transition-colors block ${fileName ? 'border-green-400 text-green-700 bg-green-50' : 'border-gray-400'}`}>
          {fileName ? `✓ ${fileName.length > 20 ? fileName.slice(0, 20) + '…' : fileName}` : 'Upload'}
        </span>
      </label>
    </div>
  )
}

export default function ScholarshipForm() {
  const navigate = useNavigate()
  const { schemeId } = useParams()
  const { logout } = useAuth()

  const [studentProfile, setStudentProfile] = useState(null)

  const [form, setForm] = useState({
    aadhar: '', religion: '', community: '', fatherName: '', motherName: '', annualIncome: '',
    instituteName: '', presentClass: '', classYear: '', modeOfStudy: '', classStartDate: '',
    universityBoard: '', prevClass: '', prevPassYear: '', prevClassPercent: '',
    roll10: '', board10: '', year10: '', percent10: '',
    roll12: '', board12: '', year12: '', percent12: '',
    admissionFee: '', tuitionFee: '', otherFee: '',
    isDisabled: 'No', disabilityType: '', disabilityPercent: '', maritalStatus: '', parentsProfession: '',
    contactState: '', contactDistrict: '', contactBlock: '', houseNo: '', streetNo: '', pincode: '',
    agree: false,
  })
  const [files, setFiles] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const { errors, touched, validate, touch, touchAll } = useValidation(rules)

  // Load student profile to pre-fill aadhar and institute info
  useEffect(() => {
    getStudentProfile()
      .then(({ data }) => {
        setStudentProfile(data)
        setForm(f => ({
          ...f,
          aadhar: data.aadhar || '',
          // instituteName pre-filled from profile; student can still edit if needed
          instituteName: data.instituteCode || '',
        }))
      })
      .catch(() => {})
  }, [])

  const set = (k, v) => {
    setForm(prev => {
      const updated = { ...prev, [k]: v }
      if (touched[k]) validate(k, v, updated)
      return updated
    })
  }
  const handleBlur = (k) => touch(k, form[k], form)
  const setFile = (e) => setFiles(f => ({ ...f, [e.target.name]: e.target.files[0] }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    if (!form.agree) return setApiError('Please accept the declaration')
    if (!touchAll(form)) return
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('schemeId', schemeId)
      Object.entries(form).forEach(([k, v]) => { if (k !== 'agree') fd.append(k, v) })
      Object.entries(files).forEach(([k, v]) => fd.append(k, v))
      const { data } = await submitApplication(fd)
      alert(`Application submitted!\nApplication ID: ${data.applicationId}`)
      navigate('/dashboard/student')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userType="student" onLogout={() => { logout(); navigate('/') }} />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="card">
          <h1 className="text-center font-bold text-primary text-base sm:text-lg mb-1 uppercase tracking-wide">
            Scholarship Application Form
          </h1>
          <p className="text-center text-xs text-gray-500 mb-6">National Scholarship Portal – Government of India</p>

          {apiError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">{apiError}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>

            {/* BASIC DETAILS */}
            <section>
              <h2 className="section-title">Basic Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="form-label">Aadhar Number *</label>
                  <input className={fieldClass('form-input', errors.aadhar, touched.aadhar)}
                    maxLength={12} inputMode="numeric" placeholder="12-digit Aadhar number"
                    value={form.aadhar}
                    onChange={e => set('aadhar', e.target.value.replace(/\D/g, ''))}
                    onBlur={() => handleBlur('aadhar')} />
                  {form.aadhar && <p className="mt-1 text-xs text-gray-400">{form.aadhar.length}/12</p>}
                  <FieldError message={touched.aadhar && errors.aadhar} />
                </div>

                <div>
                  <label className="form-label">Religion *</label>
                  <select className={fieldClass('form-select', errors.religion, touched.religion)}
                    value={form.religion} onChange={e => set('religion', e.target.value)} onBlur={() => handleBlur('religion')}>
                    <option value="">-- Select --</option>
                    {religions.map(r => <option key={r}>{r}</option>)}
                  </select>
                  <FieldError message={touched.religion && errors.religion} />
                </div>

                <div>
                  <label className="form-label">Community / Category *</label>
                  <input className={fieldClass('form-input', errors.community, touched.community)}
                    placeholder="SC / ST / OBC / General"
                    value={form.community} onChange={e => set('community', e.target.value)} onBlur={() => handleBlur('community')} />
                  <FieldError message={touched.community && errors.community} />
                </div>

                <div>
                  <label className="form-label">Father's Name *</label>
                  <input className={fieldClass('form-input', errors.fatherName, touched.fatherName)}
                    value={form.fatherName} onChange={e => set('fatherName', e.target.value)} onBlur={() => handleBlur('fatherName')} />
                  <FieldError message={touched.fatherName && errors.fatherName} />
                </div>

                <div>
                  <label className="form-label">Mother's Name *</label>
                  <input className={fieldClass('form-input', errors.motherName, touched.motherName)}
                    value={form.motherName} onChange={e => set('motherName', e.target.value)} onBlur={() => handleBlur('motherName')} />
                  <FieldError message={touched.motherName && errors.motherName} />
                </div>

                <div>
                  <label className="form-label">Family Annual Income (₹) *</label>
                  <input type="number" min={0}
                    className={fieldClass('form-input', errors.annualIncome, touched.annualIncome)}
                    value={form.annualIncome} onChange={e => set('annualIncome', e.target.value)} onBlur={() => handleBlur('annualIncome')} />
                  <FieldError message={touched.annualIncome && errors.annualIncome} />
                </div>

              </div>
            </section>

            {/* ACADEMIC DETAILS */}
            <section>
              <h2 className="section-title">Academic Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="form-label">Institute Name *</label>
                  <input className={fieldClass('form-input', errors.instituteName, touched.instituteName)}
                    value={form.instituteName} onChange={e => set('instituteName', e.target.value)} onBlur={() => handleBlur('instituteName')} />
                  {studentProfile?.instituteCode && (
                    <p className="mt-1 text-xs text-gray-400">Institute Code: {studentProfile.instituteCode}</p>
                  )}
                  <FieldError message={touched.instituteName && errors.instituteName} />
                </div>

                <div>
                  <label className="form-label">Present Class / Course *</label>
                  <input className={fieldClass('form-input', errors.presentClass, touched.presentClass)}
                    value={form.presentClass} onChange={e => set('presentClass', e.target.value)} onBlur={() => handleBlur('presentClass')} />
                  <FieldError message={touched.presentClass && errors.presentClass} />
                </div>

                <div>
                  <label className="form-label">Course Year *</label>
                  <input className={fieldClass('form-input', errors.classYear, touched.classYear)}
                    placeholder="e.g. 2nd Year"
                    value={form.classYear} onChange={e => set('classYear', e.target.value)} onBlur={() => handleBlur('classYear')} />
                  <FieldError message={touched.classYear && errors.classYear} />
                </div>

                <div>
                  <label className="form-label">Mode of Study *</label>
                  <select className={fieldClass('form-select', errors.modeOfStudy, touched.modeOfStudy)}
                    value={form.modeOfStudy} onChange={e => set('modeOfStudy', e.target.value)} onBlur={() => handleBlur('modeOfStudy')}>
                    <option value="">-- Select --</option>
                    <option>Regular</option><option>Distance</option><option>Part-Time</option>
                  </select>
                  <FieldError message={touched.modeOfStudy && errors.modeOfStudy} />
                </div>

                <div>
                  <label className="form-label">Class Start Date *</label>
                  <input type="date" className={fieldClass('form-input', errors.classStartDate, touched.classStartDate)}
                    value={form.classStartDate} onChange={e => set('classStartDate', e.target.value)} onBlur={() => handleBlur('classStartDate')} />
                  <FieldError message={touched.classStartDate && errors.classStartDate} />
                </div>

                <div>
                  <label className="form-label">University / Board Name *</label>
                  <input className={fieldClass('form-input', errors.universityBoard, touched.universityBoard)}
                    value={form.universityBoard} onChange={e => set('universityBoard', e.target.value)} onBlur={() => handleBlur('universityBoard')} />
                  <FieldError message={touched.universityBoard && errors.universityBoard} />
                </div>

                <div>
                  <label className="form-label">Previous Class</label>
                  <input className="form-input" value={form.prevClass} onChange={e => set('prevClass', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Previous Passing Year</label>
                  <input className="form-input" maxLength={4} placeholder="YYYY" value={form.prevPassYear} onChange={e => set('prevPassYear', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Previous Class %</label>
                  <input type="number" min={0} max={100} className="form-input" value={form.prevClassPercent} onChange={e => set('prevClassPercent', e.target.value)} />
                </div>
              </div>
            </section>

            {/* 10TH */}
            <section>
              <h2 className="section-title">10th Class Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Roll Number *</label>
                  <input className={fieldClass('form-input', errors.roll10, touched.roll10)}
                    value={form.roll10} onChange={e => set('roll10', e.target.value)} onBlur={() => handleBlur('roll10')} />
                  <FieldError message={touched.roll10 && errors.roll10} />
                </div>
                <div>
                  <label className="form-label">Board Name *</label>
                  <input className={fieldClass('form-input', errors.board10, touched.board10)}
                    value={form.board10} onChange={e => set('board10', e.target.value)} onBlur={() => handleBlur('board10')} />
                  <FieldError message={touched.board10 && errors.board10} />
                </div>
                <div>
                  <label className="form-label">Passing Year *</label>
                  <input className={fieldClass('form-input', errors.year10, touched.year10)}
                    maxLength={4} inputMode="numeric" placeholder={`1990–${currentYear}`}
                    value={form.year10} onChange={e => set('year10', e.target.value)} onBlur={() => handleBlur('year10')} />
                  <FieldError message={touched.year10 && errors.year10} />
                </div>
                <div>
                  <label className="form-label">% Obtained *</label>
                  <input type="number" min={0} max={100}
                    className={fieldClass('form-input', errors.percent10, touched.percent10)}
                    value={form.percent10} onChange={e => set('percent10', e.target.value)} onBlur={() => handleBlur('percent10')} />
                  <FieldError message={touched.percent10 && errors.percent10} />
                </div>
              </div>
            </section>

            {/* 12TH */}
            <section>
              <h2 className="section-title">12th Class Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Roll Number</label>
                  <input className="form-input" value={form.roll12} onChange={e => set('roll12', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Board Name</label>
                  <input className="form-input" value={form.board12} onChange={e => set('board12', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Passing Year</label>
                  <input className="form-input" maxLength={4} placeholder="YYYY" value={form.year12} onChange={e => set('year12', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">% Obtained</label>
                  <input type="number" min={0} max={100} className="form-input" value={form.percent12} onChange={e => set('percent12', e.target.value)} />
                </div>
              </div>
            </section>

            {/* FEES */}
            <section>
              <h2 className="section-title">Fee Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Admission Fee (₹) *</label>
                  <input type="number" min={0}
                    className={fieldClass('form-input', errors.admissionFee, touched.admissionFee)}
                    value={form.admissionFee} onChange={e => set('admissionFee', e.target.value)} onBlur={() => handleBlur('admissionFee')} />
                  <FieldError message={touched.admissionFee && errors.admissionFee} />
                </div>
                <div>
                  <label className="form-label">Tuition Fee (₹) *</label>
                  <input type="number" min={0}
                    className={fieldClass('form-input', errors.tuitionFee, touched.tuitionFee)}
                    value={form.tuitionFee} onChange={e => set('tuitionFee', e.target.value)} onBlur={() => handleBlur('tuitionFee')} />
                  <FieldError message={touched.tuitionFee && errors.tuitionFee} />
                </div>
                <div>
                  <label className="form-label">Other Fee (₹)</label>
                  <input type="number" min={0} className="form-input" value={form.otherFee} onChange={e => set('otherFee', e.target.value)} />
                </div>
              </div>
            </section>

            {/* PERSONAL */}
            <section>
              <h2 className="section-title">Other Personal Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Is Disabled?</label>
                  <select className="form-select" value={form.isDisabled} onChange={e => set('isDisabled', e.target.value)}>
                    <option>No</option><option>Yes</option>
                  </select>
                </div>
                {form.isDisabled === 'Yes' && <>
                  <div>
                    <label className="form-label">Type of Disability</label>
                    <input className="form-input" value={form.disabilityType} onChange={e => set('disabilityType', e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">% of Disability</label>
                    <input type="number" min={0} max={100} className="form-input" value={form.disabilityPercent} onChange={e => set('disabilityPercent', e.target.value)} />
                  </div>
                </>}
                <div>
                  <label className="form-label">Marital Status</label>
                  <select className="form-select" value={form.maritalStatus} onChange={e => set('maritalStatus', e.target.value)}>
                    <option value="">-- Select --</option><option>Single</option><option>Married</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Parents' Profession</label>
                  <input className="form-input" value={form.parentsProfession} onChange={e => set('parentsProfession', e.target.value)} />
                </div>
              </div>
            </section>

            {/* CONTACT */}
            <section>
              <h2 className="section-title">Contact Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">State *</label>
                  <select className={fieldClass('form-select', errors.contactState, touched.contactState)}
                    value={form.contactState} onChange={e => set('contactState', e.target.value)} onBlur={() => handleBlur('contactState')}>
                    <option value="">-- Select --</option>
                    {states.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <FieldError message={touched.contactState && errors.contactState} />
                </div>
                <div>
                  <label className="form-label">District *</label>
                  <select className={fieldClass('form-select', errors.contactDistrict, touched.contactDistrict)}
                    value={form.contactDistrict} onChange={e => set('contactDistrict', e.target.value)} onBlur={() => handleBlur('contactDistrict')}>
                    <option value="">-- Select --</option>
                    {districts.map(d => <option key={d}>{d}</option>)}
                  </select>
                  <FieldError message={touched.contactDistrict && errors.contactDistrict} />
                </div>
                <div>
                  <label className="form-label">Block / Taluk</label>
                  <select className="form-select" value={form.contactBlock} onChange={e => set('contactBlock', e.target.value)}>
                    <option value="">-- Select --</option>
                    {blocks.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">House Number</label>
                  <input className="form-input" value={form.houseNo} onChange={e => set('houseNo', e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Street Number</label>
                  <input className="form-input" value={form.streetNo} onChange={e => set('streetNo', e.target.value)} />
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

            {/* DOCUMENTS */}
            <section>
              <h2 className="section-title">Documents Upload Section</h2>
              <div className="bg-gray-50 border rounded p-4 space-y-1">
                {[
                  ['domicile', 'Domicile Certificate'],
                  ['photograph', 'Student Photograph'],
                  ['instituteId', 'Institute ID Card'],
                  ['casteCertificate', 'Caste / Income Certificate'],
                  ['prevMarksheet', 'Previous Year Marksheet'],
                  ['feeReceipt', 'Fee Receipt of Current Year'],
                  ['bankPassbook', 'Bank Passbook (Front Page)'],
                  ['aadharCard', 'Aadhar Card'],
                  ['marksheet10', '10th Class Marksheet'],
                  ['marksheet12', '12th Class Marksheet'],
                ].map(([name, label]) => (
                  <FileUpload key={name} name={name} label={label} onChange={setFile} fileName={files[name]?.name} />
                ))}
              </div>
            </section>

            <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded p-3">
              <input type="checkbox" id="agree" className="mt-1 flex-shrink-0"
                checked={form.agree} onChange={e => setForm(f => ({ ...f, agree: e.target.checked }))} />
              <label htmlFor="agree" className="text-xs text-gray-600">
                All the details furnished by me are true to the best of my knowledge. If any mistakes are found then I may be disqualified from scholarship schemes.
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto px-10">
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              <button type="button" className="btn-secondary w-full sm:w-auto px-10"
                onClick={() => navigate('/dashboard/student')}>Cancel</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
